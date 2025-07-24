import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AboutMe(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Pustakaku</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <Ionicons name="library" size={60} color="#667eea" />
          </View>
          
          <Text style={styles.appTitle}>Pustakaku</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          
          <Text style={styles.description}>
            Pustakaku adalah aplikasi perpustakaan digital modern yang dirancang khusus untuk generasi Z. 
            Aplikasi ini memungkinkan Anda untuk menjelajahi, membaca, dan mengelola koleksi buku digital dengan mudah dan menyenangkan.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Fitur Utama</Text>
          <View style={styles.featureItem}>
            <Ionicons name="search" size={20} color="#667eea" />
            <Text style={styles.featureText}>Pencarian buku yang canggih dan cepat</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="heart" size={20} color="#667eea" />
            <Text style={styles.featureText}>Simpan buku favorit Anda</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="library" size={20} color="#667eea" />
            <Text style={styles.featureText}>Kelola perpustakaan pribadi</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="book" size={20} color="#667eea" />
            <Text style={styles.featureText}>Baca buku dengan reader yang nyaman</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="cloud" size={20} color="#667eea" />
            <Text style={styles.featureText}>Sinkronisasi data di cloud</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Tentang Aplikasi</Text>
          <Text style={styles.aboutText}>
            Dikembangkan dengan teknologi React Native dan Expo, Pustakaku menghadirkan pengalaman membaca yang modern dan intuitif. 
            Aplikasi ini terintegrasi dengan Google Books API untuk memberikan akses ke jutaan buku dari seluruh dunia.
          </Text>
          
          <Text style={styles.aboutText}>
            Dengan desain yang clean dan user-friendly, aplikasi ini cocok untuk para book lovers yang ingin menikmati membaca di era digital.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍💻 Developer</Text>
          <Text style={styles.aboutText}>
            Dibuat dengan ❤️ untuk para pecinta buku di Indonesia
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Dwraputradev. All rights reserved.
          </Text>
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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 12,
    flex: 1,
  },
  aboutText: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    marginBottom: 12,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});