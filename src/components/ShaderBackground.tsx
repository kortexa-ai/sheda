import { ShaderMaterial } from 'three';
import { extend, useFrame, useThree } from '@react-three/fiber/native';
import { OrthographicCamera } from '@react-three/drei/native';
import { useRef } from 'react';

import defaultVertexShader from './glsl/default.vert.glsl';
import defaultFragmentShader from './glsl/default.frag.glsl';
import { SceneCanvas } from './SceneCanvas';

// Register ShaderMaterial with react-three-fiber
extend({ ShaderMaterial });

type ShaderBackgroundProps = {
    width?: number;
    height?: number;
    vertexShader?: string;
    fragmentShader?: string;
};

function ShaderScene({
    width,
    height,
    vertexShader = defaultVertexShader,
    fragmentShader = defaultFragmentShader,
}: ShaderBackgroundProps) {
    const { size: { width: useWidth, height: useHeight } } = useThree();
    if (!width) {
        width = useWidth;
    }
    if (!height) {
        height = useHeight;
    }
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
}

export function ShaderBackground({
    width,
    height,
    vertexShader,
    fragmentShader,
}: ShaderBackgroundProps) {
    return (
        <SceneCanvas
            orthographic={true}
            style={{
                // Important! Do not remove, or the canvas will not render
                position: 'absolute',
                zIndex: 0,
            }}
        >
            <ShaderScene
                width={width}
                height={height}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
            />
        </SceneCanvas>
    );
}