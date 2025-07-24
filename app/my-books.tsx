import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Button } from '@rneui/themed';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUserBooks, deleteBook, updateBook } from './lib/bookService';

interface Book {
  id: number;
  book_id: string;
  title: string;
  author: string;
  cover_url: string;
  status: string;
  is_favorite: boolean;
}

export default function MyBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBooks();
  }, []);

  async function fetchUserBooks() {
    setLoading(true);
    try {
      const { data, error } = await getUserBooks();
      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      Alert.alert('Error', 'Failed to load your books');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteBook(id: number) {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to remove this book from your library?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await deleteBook(id);
              if (error) throw error;
              setBooks(books.filter(book => book.id !== id));
            } catch (error) {
              console.error('Error deleting book:', error);
              Alert.alert('Error', 'Failed to delete book');
            }
          },
        },
      ]
    );
  }

  async function handleUpdateStatus(id: number, status: string) {
    try {
      const { error } = await updateBook(id, { status });
      if (error) throw error;
      setBooks(books.map(book => book.id === id ? { ...book, status } : book));
    } catch (error) {
      console.error('Error updating book status:', error);
      Alert.alert('Error', 'Failed to update book status');
    }
  }

  function renderBookItem({ item }: { item: Book }) {
    return (
      <TouchableOpacity 
        style={styles.bookItem}
        onPress={() => router.push(`/book/${item.book_id}`)}
      >
        <Image source={{ uri: item.cover_url || 'https://via.placeholder.com/128x192' }} style={styles.bookCover} />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>Status: </Text>
            <TouchableOpacity 
              onPress={() => {
                Alert.alert(
                  'Update Status',
                  'Select a new status for this book',
                  [
                    { text: 'Want to Read', onPress: () => handleUpdateStatus(item.id, 'want_to_read') },
                    { text: 'Reading', onPress: () => handleUpdateStatus(item.id, 'reading') },
                    { text: 'Completed', onPress: () => handleUpdateStatus(item.id, 'completed') },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              <Text style={styles.statusValue}>
                {item.status === 'want_to_read' ? 'Want to Read' : 
                 item.status === 'reading' ? 'Reading' : 
                 item.status === 'completed' ? 'Completed' : item.status}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actions}>
            <Button
              title="Read"
              onPress={() => router.push(`/reader/${item.book_id}`)}
              buttonStyle={styles.actionButton}
              size="sm"
            />
            <Button
              title="Delete"
              onPress={() => handleDeleteBook(item.id)}
              buttonStyle={[styles.actionButton, styles.deleteButton]}
              size="sm"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function handleGoBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/home');
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <Text style={styles.backText}>Kembali</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>My Books</Text>
      
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't added any books yet</Text>
          <Button
            title="Find Books"
            onPress={() => router.push('/(tabs)/search')}
            buttonStyle={styles.findBooksButton}
          />
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loader: {
    marginTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  findBooksButton: {
    width: 150,
  },
  listContent: {
    paddingBottom: 20,
  },
  bookItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    color: '#46AA71',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 8,
    paddingHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
});