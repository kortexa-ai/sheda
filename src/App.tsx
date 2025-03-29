import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import useOrbitControls from 'r3f-native-orbitcontrols';

import { parse, useLinkingURL } from 'expo-linking';

import './styles/App.css';

import { Panel } from './components/Panel';
import { FrostedPanel } from './components/FrostedPanel';
import { ShaderBackground } from './components/ShaderBackground';
// import { SceneCanvas } from './components/SceneCanvas';
// import { TestScene } from './TestScene';

// import starNest from './components/glsl/starnest.frag.glsl';
// import fire from './components/glsl/fire.frag.glsl';
import blackhole from './components/glsl/blackhole.frag.glsl';
// import mountains from './components/glsl/mountains.frag.glsl';

export default function App() {
    // const [OrbitControls, events] = useOrbitControls();
    const url = useLinkingURL();
    if (url) {
        const { hostname, path, queryParams } = parse(url);

        console.log(
            `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
                queryParams
            )}`
        );
    }

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
            }}>
                <ShaderBackground fragmentShader={blackhole} />

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
                            // {...events}
                        >
                            {/* <FrostedPanel
                                intensity={5}
                                tintColor="red"
                                tintOpacity={0.2}
                            >
                                <SceneCanvas>
                                    <TestScene />
                                </SceneCanvas>
                            </FrostedPanel>
                            <FrostedPanel
                                intensity={5}
                                tintColor="green"
                                tintOpacity={0.2}
                            > */}
                                {/* <SceneCanvas>
                                    <TestScene />
                                    <OrbitControls />
                                </SceneCanvas> */}
                            {/* </FrostedPanel> */}
                        </Panel>

                        <FrostedPanel
                            intensity={5}
                            tintColor="yellow"
                            tintOpacity={0.2}
                        >
                            <ShaderBackground fragmentShader={blackhole} />
                            {/* <SceneCanvas>
                                <TestScene />
                            </SceneCanvas> */}
                        </FrostedPanel>

                    </View>
                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}