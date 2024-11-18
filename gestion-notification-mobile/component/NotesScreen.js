import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const NotesScreen = () => {
  const [notes, setNotes] = useState([]); // Etat pour stocker les notes
  const [loading, setLoading] = useState(true); // Etat pour gérer le chargement
  const [error, setError] = useState(null); // Etat pour gérer les erreurs

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://192.168.45.231:3000/api/notes'); // Remplacez par l'URL de votre API
        setNotes(response.data); // Enregistrez les notes dans l'état
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des notes');
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchNotes();
  }, []);

  // Fonction pour afficher chaque élément de la liste
  const renderItem = ({ item }) => (
    <View style={styles.noteContainer}>
      <Text style={styles.text}>ID: {item.id}</Text>
      <Text style={styles.text}>Utilisateur ID: {item.user_id}</Text>
      <Text style={styles.text}>Note: {item.note}</Text>
      <Text style={styles.text}>Matière: {item.subject}</Text>
      <Text style={styles.text}>Type d'évaluation: {item.assessment_type}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noteContainer: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default NotesScreen;
