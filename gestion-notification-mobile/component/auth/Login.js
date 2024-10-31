import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Button, TextInput, Title, useTheme } from 'react-native-paper';
import axios from 'axios';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(1); // État pour l'échelle
  const theme = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez entrer votre e-mail et mot de passe.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.98.73:3000/login', { email, password });

      if (response.data.success) {
        navigation.navigate('Home');  // Navigation directe vers la page Home
      } else {
        Alert.alert('Erreur', response.data.error || 'Email ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error); 
      Alert.alert('Erreur', error.response?.data?.error || 'Une erreur est survenue. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        
        <View style={styles.formContainer}>
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

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPressIn={() => setScale(0.95)} // Réduire la taille lors de l'appui
              onPressOut={() => setScale(1)} // Rétablir la taille
              onPress={handleLogin}
              disabled={loading}
              style={[styles.button, { transform: [{ scale }] }]} // Appliquer l'échelle
              contentStyle={{ paddingVertical: 8 }}>
              {loading ? <ActivityIndicator color="#fff" /> : "Se connecter"}
            </Button>
          </View>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Register')}
            style={styles.link}>
            Pas de compte ? Inscrivez-vous
          </Button>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e0f7fa',  // Arrière-plan général
  },
  formContainer: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#ffffff', // Fond opaque
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,  // Pour Android
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
    backgroundColor: '#f9fbe7', // Fond des champs
  },
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#00796b', // Couleur du bouton
    borderRadius: 12,
  },
  link: {
    marginTop: 10,
    alignSelf: 'center',
    color: '#00796b',
  },
});

export default Login;
