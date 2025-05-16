import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { parse, useLinkingURL } from 'expo-linking';
// import { AuthProvider } from './auth/AuthProvider';

// import useOrbitControls from 'r3f-native-orbitcontrols';

// import { Shadertoy } from "@kortexa-ai/react-shadertoy"

import { Panel } from './components/Panel';
// import { FrostedPanel } from './components/FrostedPanel';
import { ShaderBackground } from './components/ShaderBackground';
// import { SceneCanvas } from './components/SceneCanvas';
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
// import blackhole from './components/glsl/blackhole.frag.glsl';

// import blackholeToy from './components/glsl/blackhole.toy.glsl';
// import skyToy from './components/glsl/sky.toy.glsl';
// import mountainsToy from './components/glsl/mountains.toy.glsl';
// import singularityToy from './components/glsl/singularity.toy.glsl';
// import mimasToy from './components/glsl/mimas.toy.glsl';
// import seascapeToy from './components/glsl/seascape.toy.glsl';
// import cloudsToy from './components/glsl/clouds.toy.glsl';

import atlanticToy from './components/glsl/atlantic.toy.glsl';
// import skyToy from './components/glsl/sky.toy.glsl';
// import fogToy from './components/glsl/fog.toy.glsl';
// import simplexToy from './components/glsl/simplex.toy.glsl';

export default function App() {
    // const loginUrl = 'https://kortexa.ai';
    // const auth = getAuth();

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

                <SafeAreaView
                    style={{
                        height: '100%',
                        width: '100%',
                        zIndex: 1,
                    }}
                >
                    {/* <ShaderBackground fragmentShader={atlanticToy} /> */}
                    {/* <AuthProvider>
                        <AuthProvider.Login title="sheda"> */}
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
                        {/* <AuthProvider auth={auth} loginRedirect={loginUrl}>
                            <AuthProvider.Login title="sheda"> */}
                        <ShaderBackground fragmentShader={atlanticToy} />
                        <Panel
                            style={{
                                flexDirection: 'row',
                            }}
                        // {...events}
                        >
                            {/* <FrostedPanel
                                intensity={5}
                                tintColor="white"
                                tintOpacity={0.2}
                            > */}
                                {/* <SceneCanvas>
                                    <Shadertoy fs={atlanticToy} />
                                </SceneCanvas> */}
                            {/* </FrostedPanel> */}
                        </Panel>

                        {/* <FrostedPanel
                            intensity={5}
                            tintColor="yellow"
                            tintOpacity={0.2}
                        >
                            <SceneCanvas>
                                <Shadertoy fs={fogToy} />
                            </SceneCanvas>
                        </FrostedPanel>

                        <FrostedPanel
                            intensity={5}
                            tintColor="blue"
                            tintOpacity={0.2}
                        >
                            <SceneCanvas>
                                <Shadertoy fs={singularityToy} />
                            </SceneCanvas>
                        </FrostedPanel>

                        <FrostedPanel
                            intensity={5}
                            tintColor="green"
                            tintOpacity={0.2}
                        >
                            <ShaderBackground fragmentShader={blackhole} />
                        </FrostedPanel> */}

                        {/* </AuthProvider.Login>
                        </AuthProvider> */}
                    </View>
                    {/* </AuthProvider.Login>
                    </AuthProvider> */}
                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider >
    );
}