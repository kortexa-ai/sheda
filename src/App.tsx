import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import useOrbitControls from 'r3f-native-orbitcontrols';

import { parse, useLinkingURL } from 'expo-linking';

import './styles/App.css';

import { Panel } from './components/Panel';
import { FrostedPanel } from './components/FrostedPanel';
import { ShaderBackground } from './components/ShaderBackground';
import { ShaderToyCanvas, ShaderToy } from './components/shadertoy';
import { SceneCanvas } from './components/SceneCanvas';
// import { TestScene } from './TestScene';

// Original versions - commented out in favor of mirror versions
// import gradientwave from './components/glsl/gradientwave.frag.glsl';
// import textureTest from './components/glsl/texture-test.frag.glsl';

// import gradientToy from './components/glsl/gradient.toy.glsl';
// import singularityShortToy from './components/glsl/singularity-short.toy.glsl';
// import calibrationToy from './components/glsl/calibration.toy.glsl';
// import viewportCalibrationToy from './components/glsl/viewport-calibration.toy.glsl';
// import codegolfTest1Toy from './components/glsl/codegolf-test1.toy.glsl';
// import codegolfTest2Toy from './components/glsl/codegolf-test2.toy.glsl';

// import starNest from './components/glsl/starnest.frag.glsl';
// import fire from './components/glsl/fire.frag.glsl';
import blackhole from './components/glsl/blackhole.frag.glsl';

import blackholeToy from './components/glsl/blackhole.toy.glsl';
import skyToy from './components/glsl/sky.toy.glsl';
import mountainsToy from './components/glsl/mountains.toy.glsl';
import singularityToy from './components/glsl/singularity.toy.glsl';
import mimasToy from './components/glsl/mimas.toy.glsl';

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
                            <FrostedPanel
                                intensity={5}
                                tintColor="red"
                                tintOpacity={0.2}
                            >
                                {/* Using the new ShaderToyBackground component with ShaderToy code */}
                                {/* <ShaderToyCanvas fs={blackholeToy} /> */}
                                <SceneCanvas>
                                    <ShaderToy fs={skyToy} />
                                </SceneCanvas>
                            </FrostedPanel>
                        </Panel>

                        <FrostedPanel
                            intensity={5}
                            tintColor="yellow"
                            tintOpacity={0.2}
                        >
                            {/* Example of texture shader test */}
                            <SceneCanvas>
                                <ShaderToy fs={mountainsToy} />
                            </SceneCanvas>
                        </FrostedPanel>

                        <FrostedPanel
                            intensity={5}
                            tintColor="blue"
                            tintOpacity={0.2}
                        >
                            {/* Sky shader with fixed coordinates */}
                            <SceneCanvas>
                                <ShaderToy fs={blackholeToy} />
                            </SceneCanvas>
                        </FrostedPanel>

                        <FrostedPanel
                            intensity={5}
                            tintColor="green"
                            tintOpacity={0.2}
                        >
                            {/* Blackhole shader with fixed coordinates */}
                            <ShaderToyCanvas fs={mimasToy} />
                        </FrostedPanel>

                    </View>
                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}