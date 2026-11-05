import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#f2f2f7',
        },
        headerTintColor: '#007aff',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen
        name="register"
        options={{
          headerShown: true,
          headerTitle: '',
          headerBackTitle: 'Voltar',
        }}
      />
    </Stack>
  );
}
