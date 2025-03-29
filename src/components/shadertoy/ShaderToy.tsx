/**
 * ShaderToy Component
 *
 * Core component that renders ShaderToy shaders.
 * This component requires a React Three Fiber Canvas parent to work.
 *
 * === Implementation Notes ===
 *
 * This component is a work in progress with several features that still need implementation:
 *
 * 1. Touch/Mouse Interaction: Need to implement handlers to update the iMouse uniform
 * 2. Texture Support: The logic is in textures.ts but disabled due to React Native compatibility issues
 * 3. Device Orientation: Need to connect to device sensors
 * 4. Video/Webcam Textures: Need to handle animated texture sources
 *
 * See TODO comments throughout the code for more specific details on each item.
 */

import React, { useRef, useState, useEffect } from 'react';
import { ShaderMaterial, Color, Texture } from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber/native';
import { OrthographicCamera } from '@react-three/drei/native';

// Import texture definitions and utilities
import type { TextureProps } from './textures';
import { createTextureUniforms } from './textures';

// Register ShaderMaterial with React Three Fiber
extend({ ShaderMaterial });

/**
 * ShaderToy Built-in Uniforms
 */
// iTime: float - Total elapsed time in seconds
const UNIFORM_TIME = "iTime";
// iTimeDelta: float - Time since last frame in seconds
const UNIFORM_TIMEDELTA = "iTimeDelta";
// iDate: vec4 - Current date as (year, month, day, seconds)
const UNIFORM_DATE = "iDate";
// iFrame: int - Current frame number
const UNIFORM_FRAME = "iFrame";
// iMouse: vec4 - Mouse/touch position and click info
const UNIFORM_MOUSE = "iMouse";
// iResolution: vec2 - Viewport resolution in pixels
const UNIFORM_RESOLUTION = "iResolution";
// iChannel0..3: sampler2D - Input textures/channels
const UNIFORM_CHANNEL = "iChannel";
// iChannelResolution: vec3[4] - Resolution of each input channel
const UNIFORM_CHANNELRESOLUTION = "iChannelResolution";
// iDeviceOrientation: vec4 - Device orientation data
const UNIFORM_DEVICEORIENTATION = "iDeviceOrientation";

// Precision values for GLSL
const PRECISIONS = ["lowp", "mediump", "highp"];

// Fragment shader wrappers to make different ShaderToy formats compatible with Three.js

// Common ShaderToy utilities used by many shaders
const SHADERTOY_COMMON_FUNCTIONS = `
// HSV to RGB conversion
vec3 hsv(float h, float s, float v) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(vec3(h) + K.xyz) * 6.0 - K.www);
  return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
}
`;

// For standard ShaderToy shaders with mainImage function
const FS_MAIN_IMAGE_WRAPPER = `
void main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
}
`;

// For direct ShaderToy format (no main, no mainImage, uses FC, r, t, o variables)
const FS_DIRECT_WRAPPER = `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  // Setup variables expected in direct ShaderToy format
  vec2 FC = fragCoord;
  vec2 r = iResolution.xy;
  float t = iTime;
  vec4 o = vec4(0.0, 0.0, 0.0, 1.0);
  
  // Original shader code
  %SHADER_CODE%
  
  // Return the result
  fragColor = o;
}`;

// Default ShaderToy vertex shader
const BASIC_VS = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Default ShaderToy fragment shader (colorful gradient)
const BASIC_FS = `
void mainImage(out vec4 o, in vec2 FC) {
    vec2 uv = FC/iResolution.xy;
    vec3 col = vec3(1,1,1);//0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    o = vec4(col,1.0);
}
`;

// Type definitions are imported from textures.ts

interface Uniform {
  type: string;                 // Uniform type as defined in WebGL ('1f', '3fv', etc.)
  value: number | number[];     // Uniform value (number for scalars, array for vectors/matrices)
}

export interface ShaderToyProps {
  fs?: string;                  // Fragment shader code - ShaderToy format
  vs?: string;                  // Vertex shader code (usually not needed for ShaderToy shaders)
  textures?: TextureProps[];    // Array of texture objects to use as iChannelX
  uniforms?: Record<string, Uniform>; // Custom uniforms to pass to the shader
  clearColor?: [number, number, number, number] | null; // Clear color [r,g,b,a] or null for transparent
  precision?: string;           // GLSL precision (lowp, mediump, highp)
  width?: number;               // Width override
  height?: number;              // Height override
  devicePixelRatio?: number;    // Device pixel ratio override
}

/**
 * ShaderToy Component
 *
 * Renders ShaderToy shaders within an existing React Three Fiber Canvas.
 */
export function ShaderToy({
  fs = BASIC_FS,
  vs = BASIC_VS,
  textures = [],
  uniforms = {},
  // Background color for the scene, null for transparent
  clearColor = null,
  precision = "highp",
  width,
  height,
  devicePixelRatio = 1,
}: ShaderToyProps) {
  // Get Three.js context
  const { size: { width: useWidth, height: useHeight }, scene, gl } = useThree();
  const actualWidth = width || useWidth;
  const actualHeight = height || useHeight;
  const shaderRef = useRef<ShaderMaterial>(null);

  // State for tracking frame count
  const [frameCount, setFrameCount] = useState(0);
  const [startTime] = useState(Date.now() / 1000);
  const lastFrameTimeRef = useRef(0);

  // Touch/Mouse states - will require adaptation for React Native touch events
  // TODO: This state is currently not updated - need to implement touch/mouse event handlers
  // The mousePosition should be updated when touch events occur to map to the iMouse uniform
  // In the original ShaderToy, iMouse.xy contains current position and iMouse.zw contains click position
  const [mousePosition, setMousePosition] = useState([0, 0, 0, 0]);

  // Create a test texture for shaders that need texture uniforms
  // This creates a checker pattern texture that can be used as iChannel0
  const [loadedTextures, setLoadedTextures] = useState<(Texture | null)[]>([]);

  // Initialize the test texture on component mount
  useEffect(() => {
    import('./textures').then(({ createCheckerTexture }) => {
      const checkerTexture = createCheckerTexture(
        256,       // size
        8,         // gridSize
        [255, 0, 0, 255],  // red
        [0, 255, 255, 255] // cyan
      );
      setLoadedTextures([checkerTexture]);
    });

    // Clean up texture on unmount
    return () => {
      loadedTextures.forEach(texture => {
        if (texture) texture.dispose();
      });
    };
  }, []);

  /**
   * Process shader code for compatibility with Three.js
   * 
   * This function prepares the shader code for use with WebGL/Three.js by:
   * 1. Setting the GLSL precision
   * 2. Detecting the shader format (with main, with mainImage, or direct format)
   * 3. Adding necessary wrappers around the code
   * 4. Adding uniform declarations
   */
  const processShader = (shaderCode: string): string => {
    // Start with standard header
    const isValidPrecision = PRECISIONS.includes(precision);
    const precisionString = `precision ${
      isValidPrecision ? precision : "highp"
    } float;\n`;

    const dprString = `#define DPR ${devicePixelRatio.toFixed(1)}\n`;

    // Check if this is the singularity-short shader that needs special handling
    const isSingularityShort = shaderCode.includes("v*=mat2(cos(log(length(v))+iTime*.2+vec4(0,33,11,0)))*5.");
    let preProcessedCode = shaderCode;
    
    // Apply specific fix for the singularity-short shader
    if (isSingularityShort) {
      // The problematic line in singularity-short shader contains a complex matrix construction:
      // v*=mat2(cos(log(length(v))+iTime*.2+vec4(0,33,11,0)))*5.;
      //
      // The issue: In WebGL/Three.js, constructing a matrix from vec4 values in this way
      // doesn't consistently produce a proper rotation matrix. In the original ShaderToy,
      // the implementation handles this differently.
      //
      // Our fix: Replace this with an explicit 2D rotation matrix construction where:
      // 1. We extract the angle calculation (log(length(v))+iTime*.2)
      // 2. We create a rotation matrix using standard cos/sin pattern: [cos,sin,-sin,cos]
      // 3. We maintain the same scaling factor (5)
      preProcessedCode = preProcessedCode.replace(
        "v*=mat2(cos(log(length(v))+iTime*.2+vec4(0,33,11,0)))*5.;",
        "float angle = log(length(v))+iTime*.2; v *= mat2(cos(angle), sin(angle), -sin(angle), cos(angle))*5.;"
      );
      
      // Fix another issue with uninitialized counter in for loop
      // In ShaderToy, implicit initialization to 0 may be allowed, but in WebGL/Three.js
      // we need to explicitly initialize the counter variable
      preProcessedCode = preProcessedCode.replace(
        "for(float i;i++<9.;",
        "for(float i=0.;i++<9.;"
      );
    }
    
    // Detect shader format
    const hasMain = preProcessedCode.includes("void main(");
    const hasMainImage = preProcessedCode.includes("void mainImage(");
    
    // Direct format often uses FC, r, t and o variables together in a specific pattern
    const hasFCVariable = /\bFC\b/.test(preProcessedCode);
    const hasRVariable = /\br\b/.test(preProcessedCode);
    const hasTVariable = /\bt\b/.test(preProcessedCode);
    const hasOVariable = /\bo\b/.test(preProcessedCode);
    
    // Check for common direct format patterns
    const hasVec2Pattern = /vec2\s+\w+\s*=\s*\(FC/i.test(preProcessedCode);
    const hasOutputAssignment = /o\s*=\s*[^;]+;/i.test(preProcessedCode);
    const isLikelyDirectFormat = (hasVec2Pattern || (hasFCVariable && hasOutputAssignment));

    // Determine shader type and create the processed code with the necessary wrappers
    let processedCode = "";

    // Complete shader with its own main function
    if (hasMain) {
      processedCode = precisionString + dprString + SHADERTOY_COMMON_FUNCTIONS + preProcessedCode;
    }
    // Standard ShaderToy with mainImage function
    else if (hasMainImage) {
      processedCode = precisionString + dprString + SHADERTOY_COMMON_FUNCTIONS + preProcessedCode + FS_MAIN_IMAGE_WRAPPER;
    }
    // Direct ShaderToy format with FC, r, t, o variables
    else if (isLikelyDirectFormat && !hasMain && !hasMainImage) {
      // Use the direct wrapper template
      const directShader = FS_DIRECT_WRAPPER.replace('%SHADER_CODE%', preProcessedCode);
      // Add the common functions and main wrapper
      processedCode = precisionString + dprString + SHADERTOY_COMMON_FUNCTIONS + directShader + FS_MAIN_IMAGE_WRAPPER;
    }
    // Fallback to treating as a standard ShaderToy shader
    else {
      processedCode = precisionString + dprString + SHADERTOY_COMMON_FUNCTIONS + preProcessedCode + FS_MAIN_IMAGE_WRAPPER;
    }
    
    // Replace texture() calls with texture2D() for compatibility with WebGL 1.0
    // ShaderToy uses WebGL 2.0 where texture() is valid, but we need texture2D() for wider compatibility
    processedCode = processedCode.replace(/texture\(/g, "texture2D(");
    
    // Only apply basic compatibility fixes that won't break working shaders
    
    // Fix uninitialized variables in for loops that cause issues in some GLSL implementations
    // This is particularly important for the singularity short shader
    if (!isSingularityShort) { // Skip if we already fixed it
      processedCode = processedCode.replace(/for\s*\(\s*float\s+(\w+)\s*;/g, 'for(float $1=0.0;');
    }
    
    // Add uniform declarations needed by the shader
    const uniformsToAdd = [];

    // Always add iTime and iResolution - these are fundamental to ShaderToy functionality
    uniformsToAdd.push(`uniform float ${UNIFORM_TIME};`);
    uniformsToAdd.push(`uniform vec2 ${UNIFORM_RESOLUTION};`);

    // Add other standard ShaderToy uniforms only if they're referenced in the shader
    // This avoids cluttering the shader with unused uniforms
    if (preProcessedCode.includes(UNIFORM_TIMEDELTA) || processedCode.includes(UNIFORM_TIMEDELTA))
      uniformsToAdd.push(`uniform float ${UNIFORM_TIMEDELTA};`);
    if (preProcessedCode.includes(UNIFORM_FRAME) || processedCode.includes(UNIFORM_FRAME))
      uniformsToAdd.push(`uniform int ${UNIFORM_FRAME};`);
    if (preProcessedCode.includes(UNIFORM_MOUSE) || processedCode.includes(UNIFORM_MOUSE))
      uniformsToAdd.push(`uniform vec4 ${UNIFORM_MOUSE};`);
    if (preProcessedCode.includes(UNIFORM_DATE) || processedCode.includes(UNIFORM_DATE))
      uniformsToAdd.push(`uniform vec4 ${UNIFORM_DATE};`);
    if (preProcessedCode.includes(UNIFORM_DEVICEORIENTATION) || processedCode.includes(UNIFORM_DEVICEORIENTATION))
      uniformsToAdd.push(`uniform vec4 ${UNIFORM_DEVICEORIENTATION};`);

    // Add texture uniforms for each texture channel referenced in the shader
    for (let i = 0; i < textures.length; i++) {
      if (preProcessedCode.includes(`${UNIFORM_CHANNEL}${i}`) || processedCode.includes(`${UNIFORM_CHANNEL}${i}`))
        uniformsToAdd.push(`uniform sampler2D ${UNIFORM_CHANNEL}${i};`);
    }

    // Add channel resolution information if needed
    if ((preProcessedCode.includes(UNIFORM_CHANNELRESOLUTION) || processedCode.includes(UNIFORM_CHANNELRESOLUTION)) && textures.length > 0) {
      uniformsToAdd.push(`uniform vec3 ${UNIFORM_CHANNELRESOLUTION}[${textures.length}];`);
    }

    // Insert all uniform declarations after the precision statement
    // This ensures they're properly scoped for the entire shader
    if (uniformsToAdd.length > 0) {
      const uniformsText = uniformsToAdd.join('\n') + '\n\n';
      const indexAfterPrecision = precisionString.length + dprString.length;
      processedCode = processedCode.substring(0, indexAfterPrecision) +
                      uniformsText +
                      processedCode.substring(indexAfterPrecision);
    }

    return processedCode;
  };

  /**
   * Create uniforms object for the shader
   * 
   * This creates all the uniform values needed by ShaderToy shaders, with
   * special handling for time, resolution, mouse position, etc.
   */
  const createUniforms = () => {    
    const uniformsObj: Record<string, any> = {
      // Add standard ShaderToy uniforms that are always needed
      [UNIFORM_TIME]: { value: 0.0 },
      [UNIFORM_RESOLUTION]: { value: [actualWidth * devicePixelRatio, actualHeight * devicePixelRatio] },
    };

    // Add other uniforms only if they're used in the shader
    if (fs.includes(UNIFORM_TIMEDELTA))
      uniformsObj[UNIFORM_TIMEDELTA] = { value: 0.0 };

    if (fs.includes(UNIFORM_DATE))
      uniformsObj[UNIFORM_DATE] = { value: [0, 0, 0, 0] };

    if (fs.includes(UNIFORM_FRAME))
      uniformsObj[UNIFORM_FRAME] = { value: 0 };

    if (fs.includes(UNIFORM_MOUSE))
      uniformsObj[UNIFORM_MOUSE] = { value: [0, 0, 0, 0] };

    // TODO: Device orientation support is incomplete
    // Need to add event listeners for device orientation and update this uniform
    // with actual values from device sensors (alpha, beta, gamma, orientation)
    // This could use Expo's DeviceMotion, react-native-sensors, or similar API
    if (fs.includes(UNIFORM_DEVICEORIENTATION))
      uniformsObj[UNIFORM_DEVICEORIENTATION] = { value: [0, 0, 0, 0] };

    // Add texture uniforms support
    // This provides sampler2D uniforms for each texture channel referenced in the shader
    const textureUniforms = createTextureUniforms(loadedTextures, fs, UNIFORM_CHANNEL, UNIFORM_CHANNELRESOLUTION);
    Object.assign(uniformsObj, textureUniforms);

    // Add custom uniforms provided by the consumer of this component
    if (uniforms) {
      Object.keys(uniforms).forEach(name => {
        if (fs.includes(name)) {
          uniformsObj[name] = { value: uniforms[name].value };
        }
      });
    }

    return uniformsObj;
  };

  // Calculate the plane size to fill the viewport
  const aspect = actualWidth / actualHeight;
  const planeWidth = aspect > 1 ? 2 * aspect : 2;
  const planeHeight = aspect > 1 ? 2 : 2 / aspect;

  /**
   * Update shader uniforms on each frame
   */
  useFrame(({ clock }) => {
    if (!shaderRef.current) return;

    const currentTime = Date.now() / 1000 - startTime;
    const delta = lastFrameTimeRef.current ? currentTime - lastFrameTimeRef.current : 0;
    lastFrameTimeRef.current = currentTime;

    const material = shaderRef.current;
    const uniforms = material.uniforms;

    // Get current date components
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const seconds = d.getHours() * 60 * 60 +
                d.getMinutes() * 60 +
                d.getSeconds() +
                d.getMilliseconds() * 0.001;

    // Update standard ShaderToy uniforms
    if (uniforms[UNIFORM_TIME])
      uniforms[UNIFORM_TIME].value = currentTime;

    if (uniforms[UNIFORM_TIMEDELTA])
      uniforms[UNIFORM_TIMEDELTA].value = delta;

    if (uniforms[UNIFORM_DATE])
      uniforms[UNIFORM_DATE].value = [year, month, day, seconds];

    if (uniforms[UNIFORM_FRAME]) {
      uniforms[UNIFORM_FRAME].value = frameCount;
      setFrameCount(prev => prev + 1);
    }

    if (uniforms[UNIFORM_RESOLUTION])
      uniforms[UNIFORM_RESOLUTION].value = [
        actualWidth * devicePixelRatio,
        actualHeight * devicePixelRatio
      ];

    if (uniforms[UNIFORM_MOUSE])
      uniforms[UNIFORM_MOUSE].value = mousePosition;

    // TODO: Need implementation for texture updates if videos/webcams are used
    // In the original ShaderToy, animated textures (videos, webcams, or outputs from other shaders)
    // would need to be updated every frame
  });

  // Apply scene background color or transparent
  useEffect(() => {
    if (!scene || !gl) return;

    if (clearColor) {
      // When clearColor is provided, use it for the scene clear color
      scene.background = new Color(clearColor[0], clearColor[1], clearColor[2]);

      // Set the renderer's clear alpha
      gl.setClearAlpha(clearColor[3]);
    } else {
      // For full transparency, set background to null
      scene.background = null;

      // Set renderer's clear alpha to 0
      gl.setClearAlpha(0);
    }

    return () => {
      // Reset scene background when component unmounts
      if (scene) {
        scene.background = null;
      }
      if (gl) {
        gl.setClearAlpha(1); // Reset to default
      }
    };
  }, [scene, gl, clearColor]);

  // TODO: For texture support, we would need to load textures here using:
  // import { loadTextures, disposeTextures } from './textures';
  //
  // useEffect(() => {
  //   if (!textures || textures.length === 0) {
  //     setLoadedTextures([]);
  //     return;
  //   }
  //
  //   // Load textures
  //   loadTextures(textures).then(loadedTextures => {
  //     setLoadedTextures(loadedTextures);
  //   });
  //
  //   // Cleanup function to dispose textures
  //   return () => {
  //     disposeTextures(loadedTextures);
  //   };
  // }, [textures]);
  //
  // But texture loading is currently disabled due to React Native compatibility issues

  // Process shaders on first render or when they change
  useEffect(() => {
    if (!shaderRef.current) return;

    // Process the shader and update the material
    const processedFS = processShader(fs);

    shaderRef.current.fragmentShader = processedFS;
    shaderRef.current.vertexShader = vs;
    shaderRef.current.needsUpdate = true;
  }, [fs, vs, precision, devicePixelRatio, textures.length]);

  return (
    <>
      {/* Orthographic camera to ensure full-screen coverage */}
      <OrthographicCamera
        makeDefault
        position={[0, 0, 5]}
        near={0.1}
        far={1000}
        left={-planeWidth / 2}
        right={planeWidth / 2}
        top={planeHeight / 2}
        bottom={-planeHeight / 2}
      />

      {/* Full-screen plane with shader */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={vs}
          fragmentShader={fs}
          uniforms={createUniforms()}
        />
      </mesh>
    </>
  );
}

// Export filtering and wrapping constants
export const NearestFilter = 9728;
export const LinearFilter = 9729;
export const NearestMipMapNearestFilter = 9984;
export const LinearMipMapNearestFilter = 9985;
export const NearestMipMapLinearFilter = 9986;
export const LinearMipMapLinearFilter = 9987;
export const ClampToEdgeWrapping = 33071;
export const MirroredRepeatWrapping = 33648;
export const RepeatWrapping = 10497;

export default ShaderToy;