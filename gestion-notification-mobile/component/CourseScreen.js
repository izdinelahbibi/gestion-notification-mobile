// CourseScreen.js (frontend)
import React, { useState, useEffect } from 'react';
import { View, Text, Table, TableWrapper, Row, Cell } from 'react-native';  // Importation de View, Text et autres composants de React Native

const CourseScreen = () => {
  const [courses, setCourses] = useState([]);

  // Charger les fichiers téléchargés depuis le serveur
  useEffect(() => {
    fetch('http://192.168.37.231:3000/api/courses')
      .then((response) => response.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error('Erreur de chargement des fichiers:', error));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Liste des Cours Téléchargés</Text>

      {courses.length === 0 ? (
        <Text>Aucun cours téléchargé pour le moment.</Text>
      ) : (
        <View style={{ marginTop: 20 }}>
          <Text>ID</Text>
          <Text>Nom du Fichier</Text>
          <Text>Chemin du Fichier</Text>
          <Text>Date de Téléchargement</Text>
          {courses.map((course) => (
            <View key={course.id} style={{ marginVertical: 10 }}>
              <Text>{course.id}</Text>
              <Text>{course.filename}</Text>
              <Text>{course.filepath}</Text>
              <Text>{new Date(course.uploaded_at).toLocaleString()}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default CourseScreen;
