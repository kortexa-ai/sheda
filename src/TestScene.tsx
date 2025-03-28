import { Environment } from '@react-three/drei/native';
import { useFrame } from '@react-three/fiber/native';
import { Suspense } from 'react';

const Box = () => {
    useFrame(({ scene }) => {
        const box = scene.getObjectByName('box');
        if (box) {
            box.rotation.x += 0.01;
            box.rotation.y += 0.01;
        }
    });

    return (
        <mesh name='box'>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial color='blue' />
        </mesh>
    );
};

export function TestScene() {
    // If you need to useThree, you can do so here
    return (
        <>
            <ambientLight intensity={Math.PI / 2} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Suspense fallback={null}>
                {/*
                Environment presets work partially
                The environment pngs are not loading
                but the lights are working
            */}
                <Environment preset="dawn" />
                <Box />
            </Suspense>
        </>
    );
};
