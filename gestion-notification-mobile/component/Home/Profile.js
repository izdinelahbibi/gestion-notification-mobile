import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({
    nom: '',
    email: '',
    className: '',
    password: '', // Leave empty if you don't want to update password initially
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // State to track whether we are in edit mode

  // Fetch user profile data after component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken'); // Getting token from AsyncStorage

        if (!token) {
          Alert.alert('Authentication Error', 'Token not found. Please login again.');
          navigation.navigate('Login');
          return;
        }

        // Fetch user profile using axios
        const response = await axios.get('http://192.168.58.73:3000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        });

        // Set user data
        setUser(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'An error occurred while fetching your profile.');
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Authentication Error', 'Token not found. Please login again.');
        navigation.navigate('Login');
        return;
      }

      // Update user profile using axios
      const response = await axios.put(
        'http://192.168.58.73:3000/api/profile',
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        }
      );

      Alert.alert('Success', response.data.message);
      setIsEditing(false); // Exit edit mode after update
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating your profile.');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Display user information in read-only mode or editable mode */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={user.nom}
          onChangeText={(text) => setUser({ ...user, nom: text })}
          editable={isEditing}
        />

        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          editable={isEditing}
        />

        <Text style={styles.label}>Class Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Class Name"
          value={user.className}
          onChangeText={(text) => setUser({ ...user, className: text })}
          editable={isEditing}
        />

        {isEditing && (
          <>
            {/* Input for Password (optional) */}
            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={user.password}
              onChangeText={(text) => setUser({ ...user, password: text })}
            />
          </>
        )}
      </View>

      {/* Toggle between edit mode and view mode */}
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <Button title="Save Changes" onPress={handleUpdateProfile} />
            <Button title="Cancel" onPress={() => setIsEditing(false)} color="red" />
          </>
        ) : (
          <Button title="Edit Profile" onPress={() => setIsEditing(true)} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f7fc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default Profile;
