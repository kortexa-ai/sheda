import { Suspense } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFrame } from '@react-three/fiber/native';
import { Environment } from '@react-three/drei/native';
import useOrbitControls from 'r3f-native-orbitcontrols';
import { ShaderBackground } from './components/ShaderBackground';
import { FrostedPanel } from './components/FrostedPanel';
import { SceneCanvas } from './components/SceneCanvas';

import starNest from './components/glsl/starnest.frag.glsl';
import { Panel } from './components/Panel';

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
    const [OrbitControls, events] = useOrbitControls();

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}>
                <ShaderBackground fragmentShader={starNest} />

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
                            alignItems: 'stretch',
                            justifyContent: 'space-evenly',
                            margin: 16,
                            gap: 16,
                        }}
                    >
                        <Panel
                            style={{
                                flexDirection: 'row',
                            }}
                            {...events}
                        >
                            <FrostedPanel
                                intensity={5}
                                tintColor="red"
                                tintOpacity={0.2}
                            >
                                <SceneCanvas>
                                    <Scene />
                                </SceneCanvas>
                            </FrostedPanel>
                            <FrostedPanel
                                intensity={5}
                                tintColor="green"
                                tintOpacity={0.2}
                            >
                                <SceneCanvas>
                                    <Scene />
                                    <OrbitControls />
                                </SceneCanvas>
                            </FrostedPanel>
                        </Panel>

                        <FrostedPanel
                            intensity={5}
                            tintColor="yellow"
                            tintOpacity={0.2}
                        >
                            <SceneCanvas>
                                <Scene />
                            </SceneCanvas>
                        </FrostedPanel>

                    </View>
                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}