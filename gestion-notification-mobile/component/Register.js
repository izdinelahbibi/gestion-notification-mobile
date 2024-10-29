import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, HelperText, Title, useTheme } from 'react-native-paper';

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

  const handleRegister = () => {
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

    // Réinitialisation de l'erreur et activation du chargement
    setError('');
    setLoading(true);

    // Simuler une requête réseau
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Succès', 'Compte créé avec succès!');
      navigation.navigate('Login');
    }, 2000);
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
          {error}
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
          {error}
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
          {error}
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
          {error}
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
