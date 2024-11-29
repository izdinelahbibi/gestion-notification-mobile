import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Animated,Dimensions,ScrollView,Alert,RefreshControl,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Login = ({ setIsLoggedIn }) => {
    const pulseAnim = new Animated.Value(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedInput, setFocusedInput] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoggedIn, setIsLoggedInState] = useState(false);

    const navigation = useNavigation(); // Access navigation

    useEffect(() => {
        const animationLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.8, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        );
        animationLoop.start();
        return () => animationLoop.stop();
    }, [pulseAnim]);

    useEffect(() => {
        const checkLogin = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setIsLoggedInState(true);
            }
        };
        checkLogin();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        try {
            const response = await fetch('http://192.168.144.231:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Une erreur est survenue lors de la connexion.');
            }

            const data = await response.json();

            if (data.success) {
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('class', data.user.class);

                if (data.user.profile_photo) {
                    await AsyncStorage.setItem('profile_photo', data.user.profile_photo);
                }

                Alert.alert('Succès', 'Connexion réussie!');
                setIsLoggedIn(true);
                setIsLoggedInState(true);
            } else {
                Alert.alert('Erreur', 'Email ou mot de passe incorrect.');
            }
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Une erreur est survenue. Veuillez réessayer plus tard.');
            console.error('Login Error:', error);
        }
    };

    const onRefresh = () => {
        setIsRefreshing(true);
        setEmail('');
        setPassword('');
        setFocusedInput({});
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.form}>
                    <View style={styles.titleContainer}>
                        <View style={styles.dot} />
                        <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
                        <Text style={styles.title}>Login</Text>
                    </View>
                    <Text style={styles.message}>Login to access your account.</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder=" "
                            keyboardType="email-address"
                            onFocus={() => setFocusedInput({ email: true })}
                            onBlur={() => setFocusedInput({ email: false })}
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Animated.Text
                            style={[
                                styles.label,
                                focusedInput.email || email.length > 0 ? styles.labelFocused : {},
                            ]}
                        >
                            Email
                        </Animated.Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder=" "
                            secureTextEntry
                            onFocus={() => setFocusedInput({ password: true })}
                            onBlur={() => setFocusedInput({ password: false })}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Animated.Text
                            style={[
                                styles.label,
                                focusedInput.password || password.length > 0 ? styles.labelFocused : {},
                            ]}
                        >
                            Password
                        </Animated.Text>
                    </View>

                    <TouchableOpacity style={styles.submit} onPress={handleLogin}>
                        <Text style={styles.submitText}>Login</Text>
                    </TouchableOpacity>
                    <Text style={styles.text}>
                        Don’t have an account?{' '}
                        <Text
                            style={styles.link}
                            onPress={() => navigation.navigate('SignupForm')}
                        >
                            Sign Up
                        </Text>
                    </Text>
                </View>

                {isLoggedIn && (
                    <View style={styles.loggedInMessage}>
                        <Text style={styles.loggedInText}>Vous êtes connecté!</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Lighter background
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30, // More padding for better spacing
    },
    form: {
        width: '100%',
        maxWidth: 420, // Adjusted width for better form look on larger screens
        backgroundColor: '#ffffff',
        padding: 30, // More padding to make it look spacious
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    title: {
        fontSize: 32, // Slightly larger font size for a modern look
        color: '#4A90E2', // Adjusted to a calmer blue
        fontWeight: '700',
        letterSpacing: -1.5,
        marginLeft: 10,
    },
  
    message: {
        color: 'rgba(88, 87, 87, 0.7)', // Slightly faded text color for a lighter feel
        fontSize: 15,
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 25, // Increased bottom margin for better spacing
        marginHorizontal: 5,
    },
    input: {
        width: '100%',
        padding: 12, // Increased padding for larger input fields
        paddingTop: 20,
        borderWidth: 1,
        borderColor: '#c5c5c5', // Softer border color
        borderRadius: 12, // Rounded edges for a smoother look
        fontSize: 16,
        color: '#333', // Darker text color for better contrast
    },
    label: {
        position: 'absolute',
        left: 12,
        top: 20,
        color: '#A1A1A1', // Softer label color
        fontSize: 16,
        fontWeight: '400',
        transition: '0.2s',
    },
    labelFocused: {
        top: -5,
        fontSize: 14,
        fontWeight: '600',
        color: '#4A90E2', // Highlighted color for focus state
    },
    submit: {
        backgroundColor: '#4A90E2', // More modern blue
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20, // Increased top margin to give space for the inputs
    },
    submitText: {
        color: '#fff',
        fontSize: 18, // Slightly larger font size for the submit button
        fontWeight: '600', // Bold text for emphasis
    },
    text: {
        color: 'rgba(88, 87, 87, 0.7)',
        textAlign: 'center',
        marginTop: 15,
        fontSize: 16, // Slightly increased font size for readability
    },
    link: {
        color: '#007AFF', // Apple blue color for the link
        fontWeight: '700',
    },
    loggedInMessage: {
        padding: 15,
        backgroundColor: '#E8F9E8', // Greenish background to indicate success
        borderRadius: 12,
        marginTop: 25, // Extra space for clarity
        alignItems: 'center',
    },
    loggedInText: {
        fontSize: 18,
        color: '#27AE60', // Green for a successful login message
        fontWeight: '500',
    },
});

export default Login;
