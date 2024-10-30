import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, HelperText, Title, useTheme } from 'react-native-paper';
import axios from 'axios';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [error, setError] = useState('');
  const theme = useTheme();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!username) {
      setError('Le nom d’utilisateur est requis.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Adresse e-mail invalide.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
  
    setError('');
    setLoading(true);
  
    try {
      const response = await axios.post('http://192.168.98.73:3000/register', {
        username,
        email,
        password,
      });
  
      if (response.data.message) {
        Alert.alert('Succès', response.data.message);
        navigation.navigate('Login');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Title style={styles.title}>Créer un compte</Title>

        <TextInput
          label="Nom d'utilisateur"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
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
        />
        <HelperText type="error" visible={!validateEmail(email) && error.includes('e-mail')}>
          {error.includes('e-mail') ? error : ''}
        </HelperText>

        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />
        <HelperText type="error" visible={password.length < 6 && error.includes('caractères')}>
          {error.includes('caractères') ? error : ''}
        </HelperText>

        <TextInput
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />
        <HelperText type="error" visible={password !== confirmPassword && error.includes('correspondent')}>
          {error.includes('correspondent') ? error : ''}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleRegister}
          disabled={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}>
          {loading ? <ActivityIndicator color="#fff" /> : "S'inscrire"}
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Login')}
          style={styles.link}>
          Déjà un compte ? Connectez-vous
        </Button>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f2f5',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  link: {
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default Register;
