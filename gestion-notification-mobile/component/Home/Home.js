// HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Titre de la page */}
      <Text style={styles.title}>Bienvenue, étudiant !</Text>

      {/* Section Annonces */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Annonces</Text>
        <Text style={styles.text}>- Nouvelle mise à jour du programme...</Text>
        <Text style={styles.text}>- Prochaine réunion le 10 novembre...</Text>
      </View>

      {/* Section Cours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes Cours</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cours')}>
          <Text style={styles.buttonText}>Voir mes cours</Text>
        </TouchableOpacity>
      </View>

      {/* Section Agenda */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agenda</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Agenda')}>
          <Text style={styles.buttonText}>Accéder à l’agenda</Text>
        </TouchableOpacity>
      </View>

      {/* Section Profil */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profil</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profil')}>
          <Text style={styles.buttonText}>Voir mon profil</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
