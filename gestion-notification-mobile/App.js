import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './component/auth/Login';
import Register from './component/auth/Register';
import Home from './component/Home/Home';
import Profile from './component/dashbar/Profile';
import CourseScreen from './component/CourseScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="CourseScreen" component={CourseScreen} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
