import type {ReactNode} from 'react';
import { Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App(): ReactNode {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={{ backgroundColor: isDarkMode ? 'black' : 'white', flex: 1}}>
      <Text style={{ color: isDarkMode ? 'white' : 'black', textAlign: 'center'}}>Shaderism</Text>
    </SafeAreaView>
  );
}