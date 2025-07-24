import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUserBooks, toggleFavorite } from '../lib/bookService';

interface Book {
  id: number;
  book_id: string;
  title: string;
  author: string;
  cover_url: string;
  status: string;
  is_favorite: boolean;
}

export default function Favorites() {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFavoriteBooks();
  }, []);

  async function loadFavoriteBooks() {
    try {
      const { data, error } = await getUserBooks();
      if (error) throw error;
      
      // Filter hanya buku yang difavoritkan
      const favorites = data?.filter((book: Book) => book.is_favorite === true) || [];
      setFavoriteBooks(favorites);
    } catch (error) {
      console.error('Error loading favorite books:', error);
      Alert.alert('Error', 'Failed to load favorite books');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  async function handleRemoveFromFavorites(bookId: string, bookDbId: number) {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this book from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await toggleFavorite(bookId, false);
              if (error) throw error;
              
              // Update local state
              setFavoriteBooks(prev => prev.filter(book => book.book_id !== bookId));
              Alert.alert('Success', 'Book removed from favorites');
            } catch (error) {
              console.error('Error removing from favorites:', error);
              Alert.alert('Error', 'Failed to remove from favorites');
            }
          },
        },
      ]
    );
  }

  function handleBookPress(bookId: string) {
    router.push(`/book/${bookId}`);
  }

  function handleReadBook(bookId: string) {
    router.push(`/reader/${bookId}`);
  }

  function onRefresh() {
    setRefreshing(true);
    loadFavoriteBooks();
  }

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleBookPress(item.book_id)}
    >
      <Image
        source={{ uri: item.cover_url || 'https://via.placeholder.com/80x120' }}
        style={styles.bookCover}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={styles.bookStatus}>
          Status: {item.status.replace('_', ' ')}
        </Text>
        
        <View style={styles.bookActions}>
          <TouchableOpacity
            style={styles.readButton}
            onPress={() => handleReadBook(item.book_id)}
          >
            <Ionicons name="book-outline" size={16} color="white" />
            <Text style={styles.readButtonText}>Read</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleRemoveFromFavorites(item.book_id, item.id)}
          >
            <Ionicons name="heart" size={16} color="#ff4757" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading favorite books...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Books</Text>
        <Text style={styles.headerSubtitle}>
          {favoriteBooks.length} book{favoriteBooks.length !== 1 ? 's' : ''} in favorites
        </Text>
      </View>

      {favoriteBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Favorite Books</Text>
          <Text style={styles.emptySubtitle}>
            Start adding books to your favorites by tapping the heart icon on book details
          </Text>
          <Button
            title="Browse Books"
            onPress={() => router.push('/(tabs)/search')}
            buttonStyle={styles.browseButton}
          />
        </View>
      ) : (
        <FlatList
          data={favoriteBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookCover: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookStatus: {
    fontSize: 12,
    color: '#888',
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  bookActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#46AA71',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  readButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fff0f0',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});