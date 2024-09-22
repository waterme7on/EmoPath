import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Example, Startup } from '@/screens';
import { useTheme } from '@/theme';
import type { RootStackParamList } from '@/types/navigation';
import defaultConfig from '@tamagui/config/v3'
import { TamaguiProvider } from 'tamagui'
import { createTamagui } from 'tamagui'; // Ensure this is correct
import TabNavigator from './TabNavigator';

const config = createTamagui(defaultConfig)

const Stack = createStackNavigator<RootStackParamList>();

function ApplicationNavigator() {
	const { variant, navigationTheme } = useTheme();

	return (
		<SafeAreaProvider>
			<TamaguiProvider config={config}>
				<NavigationContainer>
					<Stack.Navigator screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Startup" component={Startup} />
						<Stack.Screen name="Example" component={Example} />
						<Stack.Screen name="MainTabs" component={TabNavigator} />
					</Stack.Navigator>
				</NavigationContainer>
			</TamaguiProvider>
		</SafeAreaProvider>
	);
}

export default ApplicationNavigator;
