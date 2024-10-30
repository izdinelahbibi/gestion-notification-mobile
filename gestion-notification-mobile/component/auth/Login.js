import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { Button, TextInput, Title, useTheme } from 'react-native-paper';
import axios from 'axios';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez entrer votre e-mail et mot de passe.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.209.231:3000/login', {
        email,
        password,
      });

      if (response.data.success) {
        Alert.alert(
          'Connexion réussie',
          'Vous êtes connecté avec succès!',
          [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
        );
      } else {
        Alert.alert('Erreur', response.data.error || 'Email ou mot de passe incorrect.');
      }
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.error || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Title style={styles.title}>Connexion</Title>

        <TextInput
          label="Adresse e-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          disabled={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}>
          {loading ? <ActivityIndicator color="#fff" /> : "Se connecter"}
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Register')}
          style={styles.link}>
          Pas de compte ? Inscrivez-vous
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

export default Login;
