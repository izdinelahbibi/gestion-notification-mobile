import { Link } from '@react-navigation/native'; // Assurez-vous que vous importez Link si nécessaire.
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const menuItems = [
  { title: 'Profil', icon: '👤', action: 'profile' },
  { title: 'Cours', icon: '📚' },
  { title: 'Notes', icon: '📝' },
  { title: 'Classe', icon: '🏫' },
  { title: 'Emploi', icon: '📅' },
  { title: 'Nouveau', icon: '➕' },
  { title: 'Déconnexion', icon: '🚪', action: 'logout' },
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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Espace Étudiant</Text>
      </View>

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
            onPress={() => {
              if (item.action === 'logout') {
                navigation.navigate('Login');
              } else if (item.action === 'profile') {
                navigation.navigate('Profile'); // Remplacez par la navigation vers le profil
              } else {
                alert(`${item.title} clicked!`);
              }
              toggleMenu();
            }}
          >
            <Text style={styles.menuItemText}>
              {item.icon} {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <ScrollView style={styles.container}>
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#35475e',
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
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 2,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f0f4f8',
    letterSpacing: 1,
    textShadowColor: '#2d3748',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2d3748',
    marginBottom: 20,
  },
  section: {
    marginVertical: 15,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a5568',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#718096',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 180,
    height: '100%',
    backgroundColor: '#2c5282',
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
});

export default HomeScreen;
