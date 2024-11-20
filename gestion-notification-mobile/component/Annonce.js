import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const AnnonceScreen = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to track any errors

  // Fetch announcements from backend
  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const response = await fetch('http://192.168.45.231:3000/api/annonces');

        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          // Parse as JSON if the response is of type JSON
          const data = await response.json();
          setAnnonces(data);
        } else {
          // If not JSON, log the response as text to help debug
          const text = await response.text();
          console.error('Expected JSON but received:', text);
          setError('Failed to load data. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching annonces:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonces();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Annonces</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {annonces.length > 0 ? (
        annonces.map((annonce, index) => (
          <View key={index} style={styles.annonceCard}>
            <Text style={styles.annonceTitle}>{annonce.title}</Text>
            <Text style={styles.annonceDate}>{annonce.date}</Text>
            <Text style={styles.annonceDescription}>{annonce.description}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>Aucune annonce disponible</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  annonceCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  annonceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  annonceDate: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  annonceDescription: {
    fontSize: 16,
    color: '#333',
  },
  noData: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginVertical: 10,
  },
});

export default AnnonceScreen;
