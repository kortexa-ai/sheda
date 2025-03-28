import { ShaderMaterial } from 'three';
// Don't use the hooks from @react-three/fiber/native !!!
import { extend, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { useRef } from 'react';

import starNest from './glsl/starnest.glsl';

// Register ShaderMaterial with react-three-fiber
extend({ ShaderMaterial });

// Default vertex shader (simple pass-through)
const defaultVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Default fragment shader
const defaultFragmentShader = starNest;

type BackgroundSceneProps = {
    width: number;
    height: number;
    vertexShader?: string;
    fragmentShader?: string;
};

const BackgroundScene = ({
    width,
    height,
    vertexShader = defaultVertexShader,
    fragmentShader = defaultFragmentShader,
}: BackgroundSceneProps) => {
    const shaderRef = useRef<ShaderMaterial>(null);

    // Update shader uniforms on each frame
    useFrame(({ clock }) => {
        if (shaderRef.current) {
            shaderRef.current.uniforms.time.value = clock.getElapsedTime();
        }
    });

    // Calculate the plane size to fill the viewport
    const aspect = width / height;
    const planeWidth = aspect > 1 ? 2 * aspect : 2;
    const planeHeight = aspect > 1 ? 2 : 2 / aspect;

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
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={{
                        time: { value: 0.0 },
                        resolution: { value: [width, height] },
                    }}
                />
            </mesh>
        </>
    );
};

export function ShaderBackground() {
    const { size: { width, height } } = useThree();
    return (
        <BackgroundScene
            width={width}
            height={height}
        />
    );
}