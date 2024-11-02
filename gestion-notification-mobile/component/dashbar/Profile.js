// Profile.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Profile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil de l'étudiant</Text>
      <Text style={styles.text}>Bienvenue sur votre page de profil.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#718096',
  },
});

export default Profile;
