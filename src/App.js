import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import api from './services/api';

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then((response) => {
      setRepositories(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    try {
      const response = await api.post(`/repositories/${id}/like`);
      const likedRepository = response.data;
      const repositoriesChanged = repositories.map((repository) => {
        if (repository.id === id) {
          return likedRepository;
        }
        return repository;
      });

      setRepositories(repositoriesChanged);
    } catch (error) {
      console.log(error);
    }
  }

  function renderItem({ item: repository }) {
    const { techs = [] } = repository;
    return (
      <View style={styles.repositoryContainer}>
        <Text style={styles.repository}>{repository.title}</Text>
        <View style={styles.techsContainer}>
          {techs.map((tech) => (
            <Text key={tech} style={styles.tech}>
              {tech}
            </Text>
          ))}
        </View>
        <View style={styles.likesContainer}>
          <Text
            style={styles.likeText}
            testID={`repository-likes-${repository.id}`}>
            {`${repository.likes} curtidas`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={() => handleLikeRepository(repository.id)}
          testID={`like-button-${repository.id}`}>
          <Text style={styles.buttonText}>Curtir</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.container}
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  techsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#04d361',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    color: '#fff',
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#7159c1',
    padding: 15,
    borderRadius: 50,
  },
});
