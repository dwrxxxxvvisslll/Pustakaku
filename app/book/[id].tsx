import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { addBook, getUserBooks, toggleFavorite, checkIfFavorite } from '../lib/bookService';
import { LinearGradient } from 'expo-linear-gradient';

interface GoogleBookDetail {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
    industryIdentifiers?: {
      type: string;
      identifier: string;
    }[];
    averageRating?: number;
    ratingsCount?: number;
  };
}

export default function BookDetail() {
  const { id } = useLocalSearchParams() as { id: string };
  const [book, setBook] = useState<GoogleBookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToLibrary, setAddingToLibrary] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [togglingFavorite, setTogglingFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
      checkIfInLibrary();
      checkFavoriteStatus();
    }
  }, [id]);

  async function fetchBookDetails() {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
      const data = await response.json();
      setBook(data);
    } catch (error) {
      console.error('Error fetching book details:', error);
      Alert.alert('Error', 'Failed to load book details');
    } finally {
      setLoading(false);
    }
  }

  async function checkIfInLibrary() {
    try {
      const { data, error } = await getUserBooks();
      if (error || !data) return;
      
      const exists = data.some((item: any) => item.book_id === id);
      setIsInLibrary(exists);
    } catch (error) {
      console.error('Error checking library status:', error);
    }
  }

  async function checkFavoriteStatus() {
    if (!id) return;
    try {
      const { data, error } = await checkIfFavorite(id);
      if (!error) {
        setIsFavorite(data || false);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }

  async function handleAddToLibrary() {
    if (isInLibrary) {
      router.push('/my-books');
      return;
    }

    if (!book) return;

    setAddingToLibrary(true);
    try {
      const bookInfo = book.volumeInfo;
      const { error } = await addBook({
        id: book.id,
        title: bookInfo.title,
        author: bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown',
        coverUrl: bookInfo.imageLinks?.thumbnail || '',
      });

      if (error) throw error;
      Alert.alert('Success', 'Book added to your library');
      setIsInLibrary(true);
    } catch (error) {
      console.error('Error adding book:', error);
      Alert.alert('Error', 'Failed to add book to library');
    } finally {
      setAddingToLibrary(false);
    }
  }

  async function handleToggleFavorite() {
    if (!isInLibrary) {
      Alert.alert('Info', 'Please add this book to your library first');
      return;
    }

    if (!id) return;

    setTogglingFavorite(true);
    try {
      const newFavoriteStatus = !isFavorite;
      const { error } = await toggleFavorite(id, newFavoriteStatus);
      
      if (error) throw error;
      
      setIsFavorite(newFavoriteStatus);
      
      if (newFavoriteStatus) {
        Alert.alert(
          'Added to Favorites',
          'Book has been added to your favorites!',
          [
            { text: 'OK', style: 'default' },
            { 
              text: 'View Favorites', 
              onPress: () => router.push('/(tabs)/favorites')
            }
          ]
        );
      } else {
        Alert.alert('Success', 'Removed from favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    } finally {
      setTogglingFavorite(false);
    }
  }

  function handleReadBook() {
    router.push(`/reader/${id}`);
  }

  function handleGoBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/search');
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <Text>Book not found</Text>
      </View>
    );
  }

  const bookInfo = book.volumeInfo;
  const thumbnail = bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header dengan gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="white" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          
          {isInLibrary && (
            <TouchableOpacity 
              style={styles.favoriteButton} 
              onPress={handleToggleFavorite}
              disabled={togglingFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#ff6b6b" : "white"} 
              />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
      
      {/* Book Info Card */}
      <View style={styles.bookCard}>
        <View style={styles.header}>
          <View style={styles.coverContainer}>
            <Image source={{ uri: thumbnail }} style={styles.cover} />
            <View style={styles.coverShadow} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{bookInfo.title}</Text>
            <Text style={styles.author}>
              {bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author'}
            </Text>
            <Text style={styles.publisher}>
              {bookInfo.publisher} • {bookInfo.publishedDate}
            </Text>
            
            {/* Rating dari API */}
            <View style={styles.ratingContainer}>
              {bookInfo.averageRating && bookInfo.averageRating > 0 ? (
                <>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons 
                      key={star} 
                      name={
                        star <= Math.floor(bookInfo.averageRating!) 
                          ? "star" 
                          : star <= bookInfo.averageRating! 
                          ? "star-half" 
                          : "star-outline"
                      } 
                      size={16} 
                      color="#f39c12" 
                    />
                  ))}
                  <Text style={styles.ratingText}>
                    {bookInfo.averageRating.toFixed(1)} 
                    {bookInfo.ratingsCount && bookInfo.ratingsCount > 0 
                      ? ` (${bookInfo.ratingsCount} reviews)` 
                      : ' (No reviews)'
                    }
                  </Text>
                </>
              ) : (
                <Text style={styles.noRatingText}>No rating available</Text>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleAddToLibrary}
            disabled={addingToLibrary}
          >
            <Ionicons 
              name={isInLibrary ? "library" : "add-circle"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.primaryButtonText}>
              {isInLibrary ? "In Library" : "Add to Library"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleReadBook}
          >
            <Ionicons name="book" size={20} color="#667eea" />
            <Text style={styles.secondaryButtonText}>Read Book</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About this book</Text>
        <View style={styles.descriptionCard}>
          <Text style={styles.description}>
            {bookInfo.description || 'No description available'}
          </Text>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Book Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons name="document-text-outline" size={20} color="#667eea" />
            <Text style={styles.detailLabel}>Pages</Text>
            <Text style={styles.detailValue}>{bookInfo.pageCount || 'Unknown'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="pricetag-outline" size={20} color="#667eea" />
            <Text style={styles.detailLabel}>Categories</Text>
            <Text style={styles.detailValue}>{bookInfo.categories?.join(', ') || 'Unknown'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="barcode-outline" size={20} color="#667eea" />
            <Text style={styles.detailLabel}>ISBN</Text>
            <Text style={styles.detailValue}>{bookInfo.industryIdentifiers?.[0]?.identifier || 'Unknown'}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bookCard: {
    backgroundColor: 'white',
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  coverContainer: {
    position: 'relative',
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 12,
  },
  coverShadow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: -8,
    bottom: -8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    zIndex: -1,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 28,
  },
  author: {
    fontSize: 16,
    color: '#667eea',
    marginBottom: 6,
    fontWeight: '600',
  },
  publisher: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  noRatingText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  descriptionCard: {
    backgroundColor: 'white',
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
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#2c3e50',
  },
  detailsCard: {
    backgroundColor: 'white',
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  detailLabel: {
    flex: 1,
    fontSize: 15,
    color: '#2c3e50',
    marginLeft: 12,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'right',
    flex: 1,
  },
});