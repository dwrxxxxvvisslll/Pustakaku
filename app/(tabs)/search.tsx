import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface GoogleBooksResponse {
  items?: GoogleBook[];
}

export default function Search() {
  const [search, setSearch] = useState<string>('');
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const searchBooks = async (query: string): Promise<void> => {
    if (!query.trim()) {
      setBooks([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`
      );
      const data: GoogleBooksResponse = await response.json();
      setBooks(data.items || []);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string): void => {
    setSearch(text);
    if (text.length > 2) {
      searchBooks(text);
    }
  };

  const renderBookItem = ({ item }: { item: GoogleBook }) => {
    const book = item.volumeInfo;
    const thumbnail = book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192';

    return (
      <TouchableOpacity 
        style={styles.bookItem}
        onPress={() => router.push(`/book/${item.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.bookCoverContainer}>
          <Image source={{ uri: thumbnail }} style={styles.bookCover} />
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {book.authors ? book.authors.join(', ') : 'Unknown Author'}
          </Text>
          <Text style={styles.bookDescription} numberOfLines={3}>
            {book.description || 'No description available'}
          </Text>
          <View style={styles.bookMeta}>
            <Ionicons name="book-outline" size={14} color="#667eea" />
            <Text style={styles.metaText}>Available to read</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color="#bdc3c7" />
      <Text style={styles.emptyTitle}>
        {search.length > 0 ? 'No books found' : 'Discover Amazing Books'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {search.length > 0 
          ? 'Try searching with different keywords' 
          : 'Search for your favorite books and authors'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Books</Text>
        <SearchBar
          placeholder="Search for books, authors..."
          onChangeText={handleSearch}
          value={search}
          platform="default"
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
          searchIcon={{ color: '#667eea' }}
          clearIcon={{ color: '#667eea' }}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Searching books...</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={books.length === 0 ? styles.emptyList : styles.booksList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 0,
  },
  searchInputContainer: {
    backgroundColor: '#f1f3f4',
    borderRadius: 25,
    height: 50,
  },
  searchInput: {
    fontSize: 16,
    color: '#2c3e50',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyList: {
    flex: 1,
  },
  booksList: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookCoverContainer: {
    marginRight: 16,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 6,
    lineHeight: 22,
  },
  bookAuthor: {
    fontSize: 15,
    color: '#667eea',
    marginBottom: 8,
    fontWeight: '600',
  },
  bookDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 12,
  },
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#667eea',
    marginLeft: 6,
    fontWeight: '500',
  },
});