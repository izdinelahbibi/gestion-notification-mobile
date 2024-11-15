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
import { Button, TextInput, Title } from 'react-native-paper';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [scale, setScale] = useState(1);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez entrer votre e-mail et mot de passe.');
      return;
    }

    setLoading(true);
    console.log('Tentative de connexion avec:', { email, password });
    try {
      const response = await fetch('http://192.168.37.231:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Erreur', data.error || 'Email ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion.');
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
              onPressIn={() => setScale(0.95)}
              onPressOut={() => setScale(1)}
              onPress={handleLogin}
              disabled={loading}
              style={[styles.button, { transform: [{ scale }] }]}
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
    backgroundColor: '#e0f7fa',
  },
  formContainer: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#ffffff',
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
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#00796b',
    borderRadius: 12,
  },
  link: {
    marginTop: 10,
    alignSelf: 'center',
    color: '#00796b',
  },
});

export default Login;
