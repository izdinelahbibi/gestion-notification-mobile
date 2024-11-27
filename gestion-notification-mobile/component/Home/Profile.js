import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { TextInput, Button, Title, useTheme } from 'react-native-paper';
import axios from 'axios';

const Profile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  const token = 'your-auth-token'; // Replace with the actual token from login

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://192.168.58.73:3000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { username, email, class: userClass } = response.data;
        setUserInfo(response.data);
        setUsername(username);
        setEmail(email);
        setClassName(userClass);
      } catch (err) {
        Alert.alert('Erreur', 'Impossible de charger les informations utilisateur.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleUpdate = async () => {
    if (!username || !email || !className || (password && password.length < 6)) {
      setError('Tous les champs sont requis et le mot de passe doit avoir au moins 6 caractères.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Adresse e-mail invalide.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const updateData = { username, email, class: className };
      if (password) {
        updateData.password = password; // Only send password if it's filled
      }

      const response = await axios.put(
        'http://192.168.58.73:3000/api/profile',
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message) {
        Alert.alert('Succès', 'Profil mis à jour avec succès.');
        setUserInfo({ username, email, class: className });
        setIsEditing(false);
      }
    } catch (err) {
      Alert.alert('Erreur', 'Échec de la mise à jour du profil.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.coverPhoto}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Title style={styles.title}>{username}</Title>
          <TextInput
            label="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            editable={isEditing}
          />
          <TextInput
            label="Adresse e-mail"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            editable={isEditing}
          />
          <TextInput
            label="Mot de passe"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
            editable={isEditing}
          />
          <TextInput
            label="Classe"
            value={className}
            onChangeText={setClassName}
            mode="outlined"
            style={styles.input}
            editable={isEditing}
          />

          <Button
            mode="contained"
            onPress={isEditing ? handleUpdate : () => setIsEditing(true)}
            style={styles.button}
          >
            {isEditing ? 'Enregistrer les modifications' : 'Modifier'}
          </Button>

          {isEditing && (
            <Button
              mode="text"
              onPress={() => {
                setIsEditing(false);
                setUsername(userInfo?.username || '');
                setEmail(userInfo?.email || '');
                setClassName(userInfo?.class || '');
                setPassword('');
              }}
              style={styles.cancelButton}
            >
              Annuler
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F2F5',
  },
  profileContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  coverPhoto: {
    backgroundColor: '#3b5998',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  avatarContainer: {
    position: 'absolute',
    top: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  infoContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#3b5998',
    borderRadius: 5,
    marginTop: 15,
  },
  cancelButton: {
    marginTop: 10,
    color: '#3b5998',
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
});

export default Profile;
