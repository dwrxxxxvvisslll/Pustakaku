import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Platform, TouchableOpacity, SafeAreaView } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BookMessage {
  type: 'BOOK_LOADED' | 'BOOK_ERROR';
}

export default function BookReader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);

  // HTML untuk WebView yang memuat Google Books Viewer
  const viewerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Book Reader</title>
      <link rel="preload" href="https://www.google.com/books/jsapi.js" as="script">
      <script type="text/javascript" src="https://www.google.com/books/jsapi.js"></script>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #f5f5f5; }
        #viewerCanvas { width: 100%; height: 100%; }
        .loading { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%);
          font-family: Arial, sans-serif;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div id="loadingIndicator" class="loading">Loading book content...</div>
      <div id="viewerCanvas" style="display: none;"></div>
      <script>
        google.books.load();
        function initialize() {
          var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
          viewer.load('${id}', function() {
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('viewerCanvas').style.display = 'block';
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'BOOK_LOADED' }));
          }, function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'BOOK_ERROR' }));
          });
        }
        google.books.setOnLoadCallback(initialize);
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: WebViewMessageEvent): void => {
    try {
      const data: BookMessage = JSON.parse(event.nativeEvent.data);
      if (data.type === 'BOOK_LOADED') {
        setLoading(false);
      } else if (data.type === 'BOOK_ERROR') {
        setError('This book is not available for reading');
        setLoading(false);
      }
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };

  function handleGoBack(): void {
    console.log('Back button pressed');
    console.log('Can go back:', router.canGoBack());
    
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/search');
    }
  }

  const handleWebViewError = (): void => {
    setError('Failed to load book reader');
    setLoading(false);
  };

  useEffect(() => {
    // Set timeout untuk loading
    const timeout = setTimeout(() => {
      if (loading) {
        setError('Loading timeout. Please check your internet connection.');
        setLoading(false);
      }
    }, 30000); // 30 detik timeout
  
    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading book...</Text>
          <Text style={styles.loadingSubtext}>This may take a few moments</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>• Connecting to Google Books</Text>
            <Text style={styles.progressText}>• Loading book content</Text>
            <Text style={styles.progressText}>• Preparing reader</Text>
          </View>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubtext}>The book might not be available for preview or requires purchase.</Text>
        </View>
      )}
      
      <WebView
        ref={webViewRef}
        source={{ html: viewerHtml }}
        style={[styles.webView, loading || error ? styles.hidden : null]}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={handleMessage}
        onError={handleWebViewError}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    marginVertical: 2,
    paddingLeft: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
});