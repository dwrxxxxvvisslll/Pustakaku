import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SearchBar } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { getUserProfile } from '../lib/profileService';
import { router, useFocusEffect } from 'expo-router';
import { User } from '@supabase/supabase-js';
import { Ionicons } from '@expo/vector-icons';

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail?: string;
    };
    averageRating?: number;
    ratingsCount?: number;
  };
}

interface GoogleBooksResponse {
  items?: GoogleBook[];
}

interface Profile {
  id: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trendingBooks, setTrendingBooks] = useState<GoogleBook[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const genres = ['Fiksi', 'Non Fiksi', 'Majalah', 'Jurnal'];

  useEffect(() => {
    getUser();
    fetchBooks();
  }, []);

  // Refresh profile setiap kali halaman difokuskan
  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [])
  );

  async function getUser(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function getProfile(): Promise<void> {
    const { data, error } = await getUserProfile();
    if (data) {
      setProfile(data);
    }
  }

  async function fetchBooks(): Promise<void> {
    try {
      // Fetch trending books
      const trendingResponse = await fetch(
        'https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=relevance&maxResults=5'
      );
      const trendingData: GoogleBooksResponse = await trendingResponse.json();
      setTrendingBooks(trendingData.items || []);

      // Fetch recommended books
      const recommendedResponse = await fetch(
        'https://www.googleapis.com/books/v1/volumes?q=subject:literature&orderBy=newest&maxResults=10'
      );
      const recommendedData: GoogleBooksResponse = await recommendedResponse.json();
      setRecommendedBooks(recommendedData.items || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (text: string): void => {
    setSearch(text);
    if (text.length > 2) {
      router.push(`/search?q=${encodeURIComponent(text)}`);
    }
  };

  const renderGenreButton = (genre: string, index: number) => (
    <TouchableOpacity key={index} style={styles.genreButton}>
      <Text style={styles.genreText}>{genre}</Text>
    </TouchableOpacity>
  );

  const renderTrendingBook = ({ item }: { item: GoogleBook }) => {
    const book = item.volumeInfo;
    const thumbnail = book.imageLinks?.thumbnail || 'https://via.placeholder.com/300x400';

    return (
      <TouchableOpacity 
        style={styles.trendingBookItem}
        onPress={() => router.push(`/book/${item.id}`)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: thumbnail }} style={styles.trendingBookCover} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.trendingBookOverlay}
        >
          <Text style={styles.trendingBookTitle} numberOfLines={2}>
            {book.title}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderRecommendedBook = ({ item }: { item: GoogleBook }) => {
    const book = item.volumeInfo;
    const thumbnail = book.imageLinks?.thumbnail || 'https://via.placeholder.com/80x120';
    const rating = book.averageRating || 0;
    const ratingsCount = book.ratingsCount || 0;

    return (
      <TouchableOpacity 
        style={styles.recommendedBookItem}
        onPress={() => router.push(`/book/${item.id}`)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: thumbnail }} style={styles.recommendedBookCover} />
        <View style={styles.recommendedBookInfo}>
          <Text style={styles.recommendedBookTitle} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.recommendedBookAuthor} numberOfLines={1}>
            {book.authors ? book.authors[0] : 'Unknown Author'}
          </Text>
          {rating > 0 ? (
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.floor(rating) ? 'star' : star <= rating ? 'star-half' : 'star-outline'}
                  size={12}
                  color="#FFD700"
                />
              ))}
              <Text style={styles.ratingText}>
                {rating.toFixed(1)} ({ratingsCount > 0 ? `${ratingsCount} reviews` : 'No reviews'})
              </Text>
            </View>
          ) : (
            <View style={styles.ratingContainer}>
              <Text style={styles.noRatingText}>No rating available</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header dengan Welcome dan Info Icon */}
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.userEmail}>
              {profile?.full_name || user?.email || 'Reader'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/aboutme')}
          >
            <Ionicons name="information-circle-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            placeholder="Pencarian..."
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

        {/* Genre Buku Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genre Buku</Text>
          <View style={styles.genreContainer}>
            {genres.map((genre, index) => renderGenreButton(genre, index))}
          </View>
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#667eea" />
            </View>
          ) : (
            <FlatList
              data={trendingBooks}
              renderItem={renderTrendingBook}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingList}
            />
          )}
        </View>

        {/* Rekomendasi Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rekomendasi</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#667eea" />
            </View>
          ) : (
            <View style={styles.recommendedContainer}>
              {recommendedBooks.slice(0, 3).map((book) => (
                <View key={book.id}>
                  {renderRecommendedBook({ item: book })}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  profileButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 0,
  },
  searchInputContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    fontSize: 16,
    color: '#2c3e50',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  genreContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    flexWrap: 'wrap',
  },
  genreButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  genreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingList: {
    paddingHorizontal: 20,
  },
  trendingBookItem: {
    width: 250,
    height: 150,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  trendingBookCover: {
    width: '100%',
    height: '100%',
  },
  trendingBookOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 15,
  },
  trendingBookTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendedContainer: {
    paddingHorizontal: 20,
  },
  recommendedBookItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendedBookCover: {
    width: 60,
    height: 90,
    borderRadius: 8,
    marginRight: 15,
  },
  recommendedBookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  recommendedBookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  recommendedBookAuthor: {
    fontSize: 14,
    color: '#667eea',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  noRatingText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});