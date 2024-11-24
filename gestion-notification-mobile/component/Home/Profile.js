import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { TextInput, Button, Title, useTheme, HelperText } from 'react-native-paper';
import axios from 'axios';

const Profile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const theme = useTheme();

  // Mock token for authentication. Replace with your auth mechanism.
  const token = 'your-auth-token';

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://192.168.58.73:3000/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { username, email } = response.data;
        setUserInfo(response.data);
        setUsername(username);
        setEmail(email);
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
    if (!username) {
      setError('Le nom d’utilisateur est requis.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Adresse e-mail invalide.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.put(
        'http://192.168.58.73:3000/profile',
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message) {
        Alert.alert('Succès', 'Profil mis à jour avec succès.');
        setUserInfo({ username, email });
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
      <View style={styles.formContainer}>
        <Title style={styles.title}>Mon Profil</Title>

        <TextInput
          label="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
          editable={isEditing}
        />
        <HelperText type="error" visible={!username && error.includes('utilisateur')}>
          {error.includes('utilisateur') ? error : ''}
        </HelperText>

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
        <HelperText type="error" visible={!validateEmail(email) && error.includes('e-mail')}>
          {error.includes('e-mail') ? error : ''}
        </HelperText>

        <Button
          mode="contained"
          onPress={isEditing ? handleUpdate : () => setIsEditing(true)}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
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
            }}
            style={styles.cancelButton}
          >
            Annuler
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#e0f7fa',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#00796b',
    fontSize: 26,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#f9fbe7',
  },
  button: {
    backgroundColor: '#00796b',
    borderRadius: 12,
  },
  cancelButton: {
    marginTop: 10,
    alignSelf: 'center',
    color: '#00796b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
  },
});

export default Profile;
