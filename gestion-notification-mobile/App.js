import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './component/auth/Login';
import Register from './component/auth/Register';
import Home from './component/Home/Home';
import CourseScreen from './component/CourseScreen';
import Annonce from './component/Annonce';
import NotesScreen from './component/NotesScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{
            headerShown: false, // Cache la barre de navigation (texte et flèche)
            gestureEnabled: false // Empêche la possibilité de revenir en arrière avec le geste
          }} 
        />
        <Stack.Screen name="CourseScreen" component={CourseScreen} />
        <Stack.Screen name="Annonce" component={Annonce} />
        <Stack.Screen name="NotesScreen" component={NotesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
