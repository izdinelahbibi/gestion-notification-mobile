import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput, Button, Snackbar, HelperText, Title, useTheme } from 'react-native-paper';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const onDismissSnackBar = () => setVisible(false);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    setError('');
    alert('Compte créé avec succès!');
    navigation.navigate('Login'); // Redirection vers la page de connexion
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Title style={styles.title}>Inscription</Title>

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

        <TextInput
          label="Confirmer le mot de passe"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          mode="outlined"
          style={styles.input}
        />

        <HelperText type="error" visible={!!error}>
          {error}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}>
          S'inscrire
        </Button>

        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          duration={3000}
          action={{
            label: 'Fermer',
            onPress: () => {},
          }}>
          Inscription réussie!
        </Snackbar>

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
