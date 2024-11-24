import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

const NotesScreen = () => {
  const [notes, setNotes] = useState([]);  // Stocker les notes
  const [loading, setLoading] = useState(true);  // Gérer l'état de chargement
  const [error, setError] = useState(null);  // Gérer les erreurs

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://192.168.58.73:3000/api/notes'); // Changez l'URL si nécessaire
        setNotes(response.data);  // Enregistrez les notes dans le state
      } catch (err) {
        setError('Erreur lors du chargement des notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);  // Le tableau vide signifie que cette fonction se lance uniquement une fois après le premier rendu

  // Fonction de rendu pour chaque élément de la liste
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.noteContainer} onPress={() => alert('Élément sélectionné')}>
      <View>
        <Text style={styles.text}>Nom Etudiant: {item.username}</Text>
        <Text style={styles.text}>Note: {item.note}</Text>
        <Text style={styles.text}>Matière: {item.subject}</Text>
        <Text style={styles.text}>Type d'évaluation: {item.assessment_type}</Text>
      </View>
    </TouchableOpacity>
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
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default NotesScreen;
