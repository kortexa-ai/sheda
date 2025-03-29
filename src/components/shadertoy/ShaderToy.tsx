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
import { ShaderMaterial, Color } from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber/native';
import { OrthographicCamera } from '@react-three/drei/native';

// Import texture types but not the implementation
import type { TextureProps } from './textures';

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

// Fragment shader wrapper to make ShaderToy shaders compatible with Three.js
const FS_MAIN_SHADER = `\nvoid main(void) {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
}`;

// Default ShaderToy vertex shader
const BASIC_VS = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Default ShaderToy fragment shader (colorful gradient)
const BASIC_FS = `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord/iResolution.xy;
    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    fragColor = vec4(col,1.0);
}`;

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
  
  // TODO: For texture support, we would need to add state for loaded textures here:
  // const [loadedTextures, setLoadedTextures] = useState<(Texture | null)[]>([]);
  // But texture loading is currently disabled due to React Native compatibility issues
  
  /**
   * Process shader code for compatibility with Three.js
   */
  const processShader = (shaderCode: string): string => {
    // Add precision definition
    const isValidPrecision = PRECISIONS.includes(precision);
    const precisionString = `precision ${
      isValidPrecision ? precision : "highp"
    } float;\n`;
    
    // Add device pixel ratio definition
    const dprString = `#define DPR ${devicePixelRatio.toFixed(1)}\n`;
    
    // Process shader code
    let processedCode = precisionString + dprString + shaderCode;
    
    // Replace texture() calls with texture2D() for compatibility
    processedCode = processedCode.replace(/texture\(/g, "texture2D(");
    
    // Add uniform declarations
    const uniformsToAdd = [];
    
    // Add standard ShaderToy uniforms if they're used
    if (processedCode.includes(UNIFORM_TIME)) 
      uniformsToAdd.push(`uniform float ${UNIFORM_TIME};`);
    if (processedCode.includes(UNIFORM_TIMEDELTA)) 
      uniformsToAdd.push(`uniform float ${UNIFORM_TIMEDELTA};`);
    if (processedCode.includes(UNIFORM_FRAME)) 
      uniformsToAdd.push(`uniform int ${UNIFORM_FRAME};`);
    if (processedCode.includes(UNIFORM_RESOLUTION)) 
      uniformsToAdd.push(`uniform vec2 ${UNIFORM_RESOLUTION};`);
    if (processedCode.includes(UNIFORM_MOUSE)) 
      uniformsToAdd.push(`uniform vec4 ${UNIFORM_MOUSE};`);
    if (processedCode.includes(UNIFORM_DATE)) 
      uniformsToAdd.push(`uniform vec4 ${UNIFORM_DATE};`);
    if (processedCode.includes(UNIFORM_DEVICEORIENTATION)) 
      uniformsToAdd.push(`uniform vec4 ${UNIFORM_DEVICEORIENTATION};`);
    
    // Add texture uniforms if needed
    // Declare the necessary texture uniforms for each channel
    for (let i = 0; i < textures.length; i++) {
      if (processedCode.includes(`${UNIFORM_CHANNEL}${i}`))
        uniformsToAdd.push(`uniform sampler2D ${UNIFORM_CHANNEL}${i};`);
    }
    
    if (processedCode.includes(UNIFORM_CHANNELRESOLUTION) && textures.length > 0) {
      uniformsToAdd.push(`uniform vec3 ${UNIFORM_CHANNELRESOLUTION}[${textures.length}];`);
    }
    
    // Insert all uniform declarations after precision statement
    if (uniformsToAdd.length > 0) {
      const uniformsText = uniformsToAdd.join('\n') + '\n\n';
      const indexAfterPrecision = precisionString.length + dprString.length;
      processedCode = processedCode.substring(0, indexAfterPrecision) + 
                      uniformsText + 
                      processedCode.substring(indexAfterPrecision);
    }
    
    // Add main function for ShaderToy compatibility if needed
    if (processedCode.includes("mainImage(")) {
      processedCode += FS_MAIN_SHADER;
    }
    
    return processedCode;
  };

  /**
   * Create uniforms object for the shader
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
    
    // TODO: For texture support, we would need to add texture uniforms here using:
    // import { createTextureUniforms } from './textures';
    // 
    // const textureUniforms = createTextureUniforms(loadedTextures, fs, UNIFORM_CHANNEL, UNIFORM_CHANNELRESOLUTION);
    // Object.assign(uniformsObj, textureUniforms);
    //
    // But texture loading is currently disabled due to React Native compatibility issues
    
    // Custom uniforms
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