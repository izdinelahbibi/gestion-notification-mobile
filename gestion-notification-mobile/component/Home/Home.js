import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Or another icon set

const { width } = Dimensions.get('window');

// Menu items array with titles, icon names, and actions for navigation
const menuItems = [
  { title: 'Accueil', icon: 'home', action: 'home' },
  { title: 'Profil', icon: 'user', action: 'profile' },
  { title: 'Cours', icon: 'book', action: 'courses' },
  { title: 'Notes', icon: 'pencil', action: 'notes' },
  { title: 'Classe', icon: 'building', action: 'class' },
  { title: 'Emploi', icon: 'calendar', action: 'schedule' },
  { title: 'Nouveau', icon: 'plus', action: 'new' },
  { title: 'Annonces', icon: 'bullhorn', action: 'announcements' },
  { title: 'Déconnexion', icon: 'sign-out', action: 'logout' },
];

const HomeScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [translateX] = useState(new Animated.Value(-width));

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
    Animated.timing(translateX, {
      toValue: isMenuVisible ? -width : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleMenuItemPress = (action) => {
    switch (action) {
      case 'home':
        navigation.navigate('Home');
        break;
      case 'profile':
        navigation.navigate('Profile');
        break;
      case 'courses':
        navigation.navigate('CourseScreen');
        break;
      case 'notes':
        navigation.navigate('NotesScreen');
        break;
      case 'announcements':
        navigation.navigate('Annonce'); // Navigate to AnnonceScreen
        break;
      case 'logout':
        navigation.navigate('Login'); // Navigate to Login
        break;
      default:
        alert(`${action} clicked!`);
        break;
    }
    toggleMenu();
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Espace Étudiant</Text>
      </View>

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        <TouchableOpacity onPress={toggleMenu} style={styles.sidebarHeader}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </TouchableOpacity>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuItemPress(item.action)}
          >
            <Icon name={item.icon} size={24} color="#e2e8f0" />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>Bienvenue, étudiant !</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Annonces</Text>
          <Text style={styles.text}>- Nouvelle mise à jour du programme...</Text>
          <Text style={styles.text}>- Prochaine réunion le 10 novembre...</Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#004085',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  hamburgerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  line: {
    width: 25,
    height: 3,
    backgroundColor: '#ffffff',
    marginVertical: 2,
    borderRadius: 2,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003057',
    marginVertical: 20,
  },
  section: {
    marginVertical: 15,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#495057',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 180,
    height: '100%',
    backgroundColor: '#002855',
    paddingTop: 10,
    zIndex: 10,
  },
  sidebarHeader: {
    alignItems: 'flex-start',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 18,
    color: '#e2e8f0',
    textAlign: 'left',
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});

export default HomeScreen;
