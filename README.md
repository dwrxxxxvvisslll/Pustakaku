# 📚 Pustakaku - Digital Book Library App

**Pustakaku** adalah aplikasi perpustakaan digital modern yang dibangun dengan React Native dan Expo. Aplikasi ini memungkinkan pengguna untuk mencari, membaca, dan mengelola koleksi buku digital mereka dengan antarmuka yang elegan dan user-friendly.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#️-teknologi-yang-digunakan)
- [Tutorial Instalasi React Native](#-tutorial-instalasi-react-native)
- [Instalasi & Setup Project](#-instalasi--setup-project)
- [Struktur Aplikasi](#-struktur-aplikasi)
- [Konfigurasi](#-konfigurasi)
- [Fitur yang Akan Datang](#-fitur-yang-akan-datang)
- [Kontribusi](#-kontribusi)

## ✨ Fitur Utama

### 🔍 **Pencarian Buku Canggih**
- Pencarian real-time menggunakan Google Books API
- Filter berdasarkan genre (Fiksi, Non Fiksi, Majalah, Jurnal)
- Tampilan hasil pencarian yang informatif dengan cover, rating, dan deskripsi

### 📖 **Pembaca Buku Terintegrasi**
- WebView reader untuk membaca buku langsung dalam aplikasi
- Antarmuka pembacaan yang nyaman dan responsif
- Loading state yang informatif untuk pengalaman pengguna yang optimal

### 📚 **Manajemen Perpustakaan Personal**
- Tambahkan buku ke perpustakaan pribadi
- Sistem favorit untuk buku yang disukai
- Sinkronisasi data menggunakan Supabase
- Penyimpanan lokal dengan AsyncStorage

### 👤 **Sistem Autentikasi & Profil**
- Login/register dengan Supabase Auth
- Profil pengguna yang dapat dikustomisasi
- Halaman "About Me" dengan informasi personal
- Session management otomatis

### 🎨 **Desain Modern & Responsif**
- UI/UX yang elegan dengan gradient dan animasi
- Komponen dari React Native Elements (RNE UI)
- Dark/Light theme support
- Navigasi tab yang intuitif

## 🛠️ Teknologi yang Digunakan

### **Frontend**
- **React Native** (0.79.5) - Framework mobile cross-platform
- **Expo** (~53.0.20) - Platform pengembangan React Native
- **Expo Router** - Navigasi berbasis file system
- **TypeScript** - Type safety dan developer experience

### **UI/UX**
- **React Native Elements** - Komponen UI yang konsisten
- **Expo Linear Gradient** - Efek gradient yang menarik
- **Expo Vector Icons** - Icon set yang lengkap
- **React Native WebView** - Untuk fitur pembaca buku

### **Backend & Database**
- **Supabase** - Backend-as-a-Service untuk autentikasi dan database
- **Google Books API** - Sumber data buku yang komprehensif
- **AsyncStorage** - Penyimpanan lokal untuk cache dan preferensi

### **State Management & Storage**
- **React Hooks** - State management modern
- **Expo Secure Store** - Penyimpanan data sensitif
- **React Native URL Polyfill** - Kompatibilitas URL

## 🚀 Tutorial Instalasi React Native

### Pilihan 1: Expo CLI (Recommended untuk Pemula)

#### Prasyarat
- Node.js versi 16 atau lebih baru
- npm atau yarn
- Git

#### Langkah 1: Install Node.js

**Windows:**
1. Download Node.js dari [nodejs.org](https://nodejs.org/)
2. Jalankan installer dan ikuti petunjuk
3. Verifikasi instalasi:
   ```bash
   node --version
   npm --version
   ```

**macOS:**
```bash
# Menggunakan Homebrew (recommended)
brew install node

# Atau download dari nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt update

# Install Node.js
sudo apt install nodejs npm

# Verifikasi instalasi
node --version
npm --version
```

#### Langkah 2: Install Expo CLI
```bash
npm install -g @expo/cli
```

#### Langkah 3: Install Expo Go App
- **Android**: Download dari [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: Download dari [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Pilihan 2: React Native CLI (Untuk Development Native)

#### Prasyarat Tambahan

**Untuk Android Development:**
1. **Install Java Development Kit (JDK)**
   ```bash
   # Windows (menggunakan Chocolatey)
   choco install openjdk11
   
   # macOS (menggunakan Homebrew)
   brew install openjdk@11
   
   # Linux
   sudo apt install openjdk-11-jdk
   ```

2. **Install Android Studio**
   - Download dari [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK, Android SDK Platform, dan Android Virtual Device
   
3. **Setup Environment Variables**
   
   **Windows:**
   ```bash
   # Tambahkan ke System Environment Variables
   ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
   Path += %ANDROID_HOME%\platform-tools
   Path += %ANDROID_HOME%\tools
   ```
   
   **macOS/Linux:**
   ```bash
   # Tambahkan ke ~/.bashrc atau ~/.zshrc
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

**Untuk iOS Development (macOS only):**
1. **Install Xcode**
   - Download dari Mac App Store
   - Install Xcode Command Line Tools:
     ```bash
     xcode-select --install
     ```

2. **Install CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

#### Install React Native CLI
```bash
npm install -g react-native-cli
```

### Verifikasi Instalasi

#### Test Expo Setup
```bash
# Buat project baru untuk testing
npx create-expo-app TestApp
cd TestApp
npx expo start
```

#### Test React Native CLI Setup
```bash
# Buat project baru untuk testing
npx react-native init TestApp
cd TestApp

# Untuk Android
npx react-native run-android

# Untuk iOS (macOS only)
npx react-native run-ios
```

### Troubleshooting Common Issues

#### Issue 1: Metro bundler tidak bisa start
```bash
# Clear cache
npx expo start --clear
# atau untuk React Native CLI
npx react-native start --reset-cache
```

#### Issue 2: Android emulator tidak terdeteksi
```bash
# List available devices
adb devices

# Start emulator manually
emulator -avd YourAVDName
```

#### Issue 3: iOS simulator issues
```bash
# Reset iOS simulator
xcrun simctl erase all

# List available simulators
xcrun simctl list devices
```

#### Issue 4: Permission denied (macOS/Linux)
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Development Tools (Optional)

#### Code Editor
- **Visual Studio Code** (Recommended)
  - Install React Native Tools extension
  - Install ES7+ React/Redux/React-Native snippets
  - Install Prettier extension

#### Debugging Tools
- **Flipper** - Desktop debugging platform
- **React Native Debugger** - Standalone debugger
- **Chrome DevTools** - Browser-based debugging

## 🚀 Instalasi & Setup Project

### Langkah Instalasi Project Pustakaku

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd BookApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   - Konfigurasi Supabase URL dan API key di `app/lib/supabase.ts`
   - Pastikan Google Books API dapat diakses

4. **Jalankan aplikasi**
   ```bash
   # Development server
   npm start
   
   # Android
   npm run android
   
   # iOS
   npm run ios
   
   # Web
   npm run web
   ```

## 📱 Struktur Aplikasi
app/
├── (auth)/          # Halaman autentikasi
│   ├── login.tsx    # Halaman login
│   └── _layout.tsx  # Layout auth
├── (tabs)/          # Navigasi tab utama
│   ├── home.tsx     # Beranda dengan trending & recommended
│   ├── search.tsx   # Pencarian buku
│   ├── favorites.tsx # Buku favorit
│   ├── profile.tsx  # Profil pengguna
│   └── aboutme.tsx  # Halaman about me
├── book/
│   └── [id].tsx     # Detail buku dinamis
├── reader/
│   └── [id].tsx     # Pembaca buku
├── lib/             # Utilities & services
│   ├── supabase.ts  # Konfigurasi Supabase
│   ├── bookService.ts # Service untuk manajemen buku
│   └── profileService.ts # Service untuk profil
└── my-books.tsx     # Perpustakaan personal 