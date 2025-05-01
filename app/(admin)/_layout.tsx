import { Tabs } from 'expo-router';
import { KeyRound, Users, LogOut } from 'lucide-react-native';
import { TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';

export default function AdminTabLayout() {
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => router.replace('/auth/login'),
      },
    ]);
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4c669f',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: '#4c669f',
        },
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize: 18,
          color: '#fff',
        },
        headerTintColor: '#fff',
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
            <LogOut size={24} color="#fff" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Generate Passwords',
          tabBarIcon: ({ color, size }) => (
            <KeyRound size={size} color={color} />
          ),
          headerTitle: 'Password Generator',
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Manage Clients',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
          headerTitle: 'Client Management',
        }}
      />
    </Tabs>
  );
}
