import { Suspense, useEffect, useRef } from 'react';
import { Appearance, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Canvas } from '@react-three/fiber/native';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// import "fast-text-encoding";
window.parent = window;

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
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 5, 5);
  }, [camera]);
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box />
    </>
  );
};



export default function App() {
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const canvasRef = useRef<View>(null);

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        style={{ backgroundColor: isDarkMode ? 'yellow' : 'cyan' }}
      >
        <Text style={{ color: isDarkMode ? 'white' : 'black', textAlign: 'center' }}>Shaderism</Text>
        <Canvas
          ref={canvasRef}

          camera={{
            position: [0, 5, 5]
          }}

          style={{
            height: 300,
            width: 300,
          }}

          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            premultipliedAlpha: false,
            debug: {
              checkShaderErrors: true,
              onShaderError: null
            }
          }}
        >
          <Suspense fallback={null}>
            <Scene />
            <OrbitControls />
          </Suspense>
        </Canvas>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}