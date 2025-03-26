import { Suspense } from 'react';
import { Appearance, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Canvas } from '@react-three/fiber/native';

export default function App() {
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        pointerEvents="none"
        style={{ backgroundColor: isDarkMode ? 'black' : 'white', flex: 1 }}
      >
        <Text style={{ color: isDarkMode ? 'white' : 'black', textAlign: 'center' }}>Shaderism</Text>
        {/* <Canvas
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'cyan',
            height: '100%',
            width: '100%',
          }}
          shouldRasterizeIOS
          gl={{
            antialias: true
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color='red' />
          </Suspense>
        </Canvas> */}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}