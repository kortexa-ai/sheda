import type {ReactNode} from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function App(): ReactNode {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle && { flex: 1}}>
      <Text style={backgroundStyle && {backgroundColor: 'white'}}>Shaderism</Text>
    </SafeAreaView>
  );
}