import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getProfile } from './services/api';
import { AuthContext } from './contexts/AuthContext';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminScreen from './screens/AdminScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import AddPostScreen from './screens/AddPostScreen';
import EditPostScreen from './screens/EditPostScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const PostsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen} 
        options={{ title: 'Post details' }} 
      />
      <Stack.Screen 
        name="AddPost" 
        component={AddPostScreen} 
        options={{ title: 'New post' }} 
      />
      <Stack.Screen 
        name="EditPost" 
        component={EditPostScreen} 
        options={{ title: 'Edit post' }} 
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }} 
      />
    </Stack.Navigator>
  );
};

const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AdminMain" 
        component={AdminScreen} 
        options={{ title: 'Admin' }} 
      />
    </Stack.Navigator>
  );
};

const MainTabNavigator = () => {
  const { isAdmin } = React.useContext(AuthContext);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Posts') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Posts" component={PostsStack} options={{ headerShown: false, title: 'Posts' }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false, title: 'My account' }} />
      {isAdmin && (
        <Tab.Screen name="Admin" component={AdminStack} options={{ headerShown: false, title: 'Admin' }} />
      )}
    </Tab.Navigator>
  );
};

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    token: null,
    isAdmin: false,
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let userIsAdmin;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        userIsAdmin = await AsyncStorage.getItem('userIsAdmin') === 'true';
      } catch (e) {
        console.log('Failed to load token', e);
      }

      setState({
        isLoading: false,
        token: userToken,
        isAdmin: userIsAdmin,
      });
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (data) => {
    try {
      await AsyncStorage.setItem('userToken', data.token);

      const userData = await getProfile();
      const isAdmin = userData?.data?.data?.isAdmin ?? false;

      await AsyncStorage.setItem('userIsAdmin', String(isAdmin));

      setState((prevState) => ({
        ...prevState,
        token: data.token,
        isAdmin: isAdmin,
      }));
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userIsAdmin');
        
        setState({
          ...state,
          token: null,
          isAdmin: false,
        });
      } catch (e) {
        console.log('Signout error', e);
      }
    },
  };

  if (state.isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ ...authContext, token: state.token, isAdmin: state.isAdmin }}>
      <NavigationContainer>
        {state.token == null ? (
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        ) : (
          <MainTabNavigator />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}