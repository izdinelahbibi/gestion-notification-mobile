import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState({
    nom: '',
    email: '',
    className: '', // Vérifiez que ce champ est bien présent dans la réponse API
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Erreur d\'authentification', 'Token introuvable. Veuillez vous reconnecter.');
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get('http://192.168.58.73:3000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Assurez-vous que la réponse contient un champ 'className'
        setUser({
          nom: response.data.nom || '',
          email: response.data.email || '',
          className: response.data.className || 'Aucune classe', // Valeur par défaut si 'className' est manquant
        });

        setIsLoading(false);
      } catch (error) {
        handleError(error);
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert('Erreur d\'authentification', 'Session expirée. Veuillez vous reconnecter.');
      AsyncStorage.removeItem('authToken');
      navigation.navigate('Login');
    } else {
      console.error('Erreur Axios :', error.message);
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de la récupération de votre profil.');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erreur d\'authentification', 'Token introuvable. Veuillez vous reconnecter.');
        navigation.navigate('Login');
        return;
      }

      // Validation des champs avant la mise à jour
      if (!user.nom || !user.email || !user.className) {
        Alert.alert('Erreur', 'Tous les champs doivent être remplis.');
        return;
      }

      const response = await axios.put(
        'http://192.168.58.73:3000/api/profile',
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Succès', 'Profil mis à jour avec succès.');
      setIsEditing(false);
    } catch (error) {
      handleError(error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Nom :</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={user.nom}
            onChangeText={(text) => setUser({ ...user, nom: text })}
          />
        ) : (
          <Text>{user.nom}</Text>
        )}

        <Text style={styles.label}>Email :</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
          />
        ) : (
          <Text>{user.email}</Text>
        )}

        <Text style={styles.label}>Nom de la classe :</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            placeholder="Nom de la classe"
            value={user.className}
            onChangeText={(text) => setUser({ ...user, className: text })}
          />
        ) : (
          <Text>{user.className}</Text> // Affichage du nom de la classe
        )}
      </View>

      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <Button title="Sauvegarder les modifications" onPress={handleUpdateProfile} />
            <Button title="Annuler" onPress={() => setIsEditing(false)} color="red" />
          </>
        ) : (
          <Button title="Modifier le profil" onPress={() => setIsEditing(true)} />
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
