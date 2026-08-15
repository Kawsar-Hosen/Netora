import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from '@/context/AppContext';
import { colorsFor } from '@/theme/theme';

function Navigation() {
  const { dark } = useApp(); const C = colorsFor(dark);
  return <><StatusBar style={dark ? 'light' : 'dark'} /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.background }, animation: 'slide_from_right' }} /></>;
}
export default function RootLayout() { return <SafeAreaProvider><AppProvider><Navigation /></AppProvider></SafeAreaProvider>; }
