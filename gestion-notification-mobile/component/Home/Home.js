import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const menuItems = [
  { title: 'Cours', icon: '📚' },
  { title: 'Notes', icon: '📝' },
  { title: 'Classe', icon: '🏫' },
  { title: 'Emploi', icon: '📅' },
  { title: 'Nouveau', icon: '➕' },
];

const HomeScreen = () => {
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
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
          <View style={styles.line} />
          <View style={styles.line} />
          <View style={styles.line} />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Espace Étudiant</Text>

        <TouchableOpacity>
          <Text style={styles.profileButton}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX }] }]}>
        {/* Hamburger icon in the sidebar aligned to the left */}
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
              alert(`${item.title} clicked!`);
              toggleMenu(); // Close sidebar when an item is clicked
            }}
          >
            <Text style={styles.menuItemText}>
              {item.icon} {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Main content */}
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
    backgroundColor: '#f3e5f5',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7b1fa2',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileButton: {
    fontSize: 24,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4a148c',
    marginBottom: 20,
  },
  section: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a1b9a',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#666',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 220, // Set a fixed width for the sidebar
    height: '100%',
    backgroundColor: '#8e24aa',
    paddingTop: 10, // Space for the hamburger icon
    zIndex: 10,
  },
  sidebarHeader: {
    alignItems: 'flex-start', // Align the hamburger icon to the left
    paddingVertical: 15, // Match padding with navbar
    paddingHorizontal: 15, // Add horizontal padding
    backgroundColor: 'transparent', // No background color
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center', // Center icon and text vertically
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left', // Align text to the left
    marginLeft: 10, // Space between icon and text
  },
});

export default HomeScreen;
