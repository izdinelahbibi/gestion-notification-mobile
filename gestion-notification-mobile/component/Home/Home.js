import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Or another icon set

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Factor for scaling elements depending on the screen size
const scale = width / 375; // Use 375 as a base (e.g., iPhone 6)

// Menu items array with titles, icon names, and actions for navigation
const menuItems = [
  { title: 'Accueil', icon: 'home', action: 'home' },
  { title: 'Profil', icon: 'user', action: 'Profile' },
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
    case 'Profile': // Corrigé pour naviguer vers la page Profil
      navigation.navigate('Profile'); 
      break;
    case 'courses':
      navigation.navigate('CourseScreen');
      break;
    case 'notes':
      navigation.navigate('NotesScreen');
      break;
    case 'announcements':
      navigation.navigate('Annonce');
      break;
    case 'logout':
      navigation.navigate('Login');
      break;
    default:
      console.warn(`Action "${action}" non reconnue !`);
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
    justifyContent: 'flex-start', // Align items to the top
    paddingTop: 50, // Push the content down (increase value to move more)
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#004085',
    paddingHorizontal: 15 * scale, // Adjust padding based on scale
    paddingVertical: 12 * scale,
    
  },
  hamburgerButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30 * scale, // Adjust button size based on screen scale
    height: 30 * scale,
  },
  line: {
    width: 25 * scale,
    height: 3 * scale,
    backgroundColor: '#ffffff',
    marginVertical: 2 * scale,
    borderRadius: 2,
    
  },
  navTitle: {
    fontSize: width * 0.05, // Adjust font size based on screen width
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  title: {
    fontSize: width * 0.07, // Adjust title size based on screen width
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#003057',
    marginVertical: 20 * scale,
  },
  section: {
    marginVertical: 15 * scale, // Adjust margin based on screen scale
    padding: 20 * scale, // Adjust padding based on scale
    borderRadius: 10 * scale, // Adjust border radius for responsiveness
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    
  },
  sectionTitle: {
    fontSize: 20 * scale, // Adjust title size for responsiveness
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 10 * scale,
  },
  text: {
    fontSize: 16 * scale, // Adjust text size for better readability
    color: '#495057',
    
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%', // Sidebar width responsive to screen size
    height: '150%',
    heightTop: '150%',
    backgroundColor: '#002855',
    paddingTop: 10 * scale,
    zIndex: 10,
    justifyContent: 'flex-start', // Align items to the top
    paddingTop: 50,
    marginTop: 50,
  },
  sidebarHeader: {
    alignItems: 'flex-start',
    paddingVertical: 15 * scale,
    paddingHorizontal: 15 * scale,
    backgroundColor: 'transparent',
    marginTop: -49,

    
  },
  menuItem: {
    paddingVertical: 15 * scale,
    paddingHorizontal: 20 * scale,
    marginVertical: 5 * scale,
    flexDirection: 'row',
    alignItems: 'center',
    
    
  },
  menuItemText: {
    fontSize: 18 * scale, // Adjust menu item text size
    color: '#e2e8f0',
    textAlign: 'left',
    marginLeft: 10 * scale,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20 * scale, // Adjust content padding
    paddingTop: 20 * scale,
    
  },
});

export default HomeScreen;
