import React, { useState, useEffect } from 'react';
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
import { TextInput, Button, HelperText, Title } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [classSelection, setClassSelection] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Récupérer les classes depuis le backend
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://192.168.58.73:3000/classes');
        setClasses(response.data.classes);
      } catch (error) {
        console.error('Erreur lors de la récupération des classes :', error);
      }
    };
    fetchClasses();
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  

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
    if (!classSelection) {
      setError('Veuillez sélectionner une classe.');
      return;
    }
  
    setError(''); // Clear previous error messages
    setLoading(true);
  
    try {
      const response = await axios.post('http://192.168.58.73:3000/register', {
        username,
        email,
        password,
        class: classSelection, // Correspond au champ `nom_classe` dans la table `classes`
      });
  
      if (response.data.message) {
        Alert.alert('Succès', 'Compte créé avec succès');
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
        
        <View style={styles.formContainer}>
          <Title style={styles.title}>Créer un compte</Title>

          <TextInput
            label="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
          />

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

          {/* Picker pour la classe */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={classSelection}
              onValueChange={(itemValue) => setClassSelection(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Sélectionner une classe" value="" />
              {classes.map((cls) => (
                <Picker.Item key={cls.id_classe} label={cls.nom_classe} value={cls.nom_classe} />
              ))}
            </Picker>
          </View>

          <Button
            mode="contained"
            onPress={handleRegister}
            disabled={loading}
            style={styles.button}
            contentStyle={{ paddingVertical: 8 }}>
            {loading ? <ActivityIndicator color="#fff" /> : "S'inscrire"}
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
  pickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00796b',
    borderRadius: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#00796b',
    borderRadius: 12,
  },
});

export default Register;
