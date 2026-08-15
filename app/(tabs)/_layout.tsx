import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { colorsFor } from '@/theme/theme';

const icons = { index: ['speedometer', 'speedometer-outline'], analytics: ['analytics', 'analytics-outline'], history: ['time', 'time-outline'], network: ['git-network', 'git-network-outline'], settings: ['options', 'options-outline'] } as const;
export default function TabLayout() { const { dark } = useApp(); const C = colorsFor(dark); const insets = useSafeAreaInsets(); return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: C.accent, tabBarInactiveTintColor: C.subtext, tabBarStyle: { backgroundColor: C.background, borderTopColor: C.line, height: 58 + insets.bottom, paddingTop: 7, paddingBottom: Math.max(insets.bottom, 6) }, tabBarLabelStyle: { fontSize: 10, fontWeight: '600' }, tabBarIcon: ({ focused, color, size }) => { const pair = icons[route.name as keyof typeof icons] ?? icons.index; return <Ionicons name={pair[focused ? 0 : 1]} size={size} color={color} />; } })}><Tabs.Screen name="index" options={{ title: 'Home' }} /><Tabs.Screen name="analytics" options={{ title: 'Analytics' }} /><Tabs.Screen name="history" options={{ title: 'History' }} /><Tabs.Screen name="network" options={{ title: 'Network' }} /><Tabs.Screen name="settings" options={{ title: 'Settings' }} /></Tabs>; }
