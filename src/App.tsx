import { Suspense } from 'react';
import { Appearance, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Canvas } from '@react-three/fiber/native';
// Don't use the hooks from @react-three/fiber/native !!!
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei/native';
import useOrbitControls from 'r3f-native-orbitcontrols';
import { ShaderBackground } from './components/ShaderBackground';
import { FrostedPanel } from './components/FrostedPanel';

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

/*
Important! Do not remove these from the Canvas element,
or the underlying GLView will not render
    backgroundColor: 'black',
    shadowColor: 'black',
*/
export default function App() {
    const colorScheme = Appearance.getColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const [OrbitControls, events] = useOrbitControls();

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{
                flex: 1,
                position: 'relative',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{
                    flex: 1,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                }}>
                    <Canvas
                        orthographic={true}
                        style={{
                            backgroundColor: 'black',
                            shadowColor: 'black',
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
                        <ShaderBackground />
                    </Canvas>
                </View>

                <SafeAreaView
                    style={{
                        height: '100%',
                        width: '100%',
                        zIndex: 1,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            position: 'relative',
                            margin: 16,
                            alignItems: 'center'
                        }}
                        {...events}
                    >
                        <View style={{
                            backgroundColor: 'transparent',
                            width: '100%',
                            height: '50%',
                        }}>
                            <Canvas
                                style={{
                                    backgroundColor: 'transparent',
                                    borderWidth: 0,
                                    borderColor: 'black',
                                    shadowColor: 'white',
                                    shadowOffset: { width: 4, height: 4 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 10,
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

                        <FrostedPanel>
                            <Canvas
                                style={{
                                    backgroundColor: 'transparent',
                                    borderWidth: 0,
                                    borderColor: 'black',
                                    shadowColor: 'white',
                                    shadowOffset: { width: 4, height: 4 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: 10,
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
                        </FrostedPanel>

                    </View>
                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}