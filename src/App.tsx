import { Suspense } from 'react';
import { Appearance, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Canvas } from '@react-three/fiber/native';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei/native';
import useOrbitControls from 'r3f-native-orbitcontrols';

const Box = () => {
    useFrame(({ scene }) => {
        const box = scene.getObjectByName('box')
        if (box) {
            box.rotation.x += 0.01
            box.rotation.y += 0.01
        }
    });

    return (
        <mesh name='box'>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial color='blue' />
        </mesh>
    )
}

const Scene = () => {
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

export default function App() {
    const colorScheme = Appearance.getColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const [OrbitControls, events] = useOrbitControls();

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView>
                <SafeAreaView
                    style={{ backgroundColor: isDarkMode ? 'black' : 'white', height: '100%', width: '100%' }}
                >
                    <View style={{ flex: 1, position: 'relative', margin: 16 }} {...events}>
                        <Canvas
                            style={{
                                backgroundColor: isDarkMode ? 'black' : 'white',
                                borderWidth: 1,
                                borderColor: isDarkMode ? 'white' : 'black',
                                shadowColor: isDarkMode ? 'white' : 'black',
                                shadowOffset: { width: 4, height: 4 },
                                shadowOpacity: 0.4,
                                shadowRadius: 6,
                                width: '100%',
                                height: '100%',
                            }}
                            gl={{
                                debug: {
                                    checkShaderErrors: false,
                                    onShaderError: null,
                                },
                            }}
                        >
                            <Scene />
                            <OrbitControls />
                        </Canvas>
                    </View>
                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}