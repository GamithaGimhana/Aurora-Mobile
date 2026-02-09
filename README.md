# Aurora 🌅

A modern mobile application built with React Native and Expo, featuring note-taking and flashcard functionality with Firebase integration.

## 📺 Demo

> [![Aurora Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

## 📥 Download

Download the latest Android APK:

[![Download APK](https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android)](https://expo.dev/artifacts/eas/oLsRKqYBcibBeZwqefCvKR.apk)

**Direct Link**: [https://expo.dev/artifacts/eas/oLsRKqYBcibBeZwqefCvKR.apk](https://expo.dev/artifacts/eas/oLsRKqYBcibBeZwqefCvKR.apk)

## 📸 Screenshots

<div align="center">

### 🎨 Welcome & Authentication

| Welcome Screen | Login Screen |
|:---:|:---:|
| <img src="https://res.cloudinary.com/dg11uvapu/image/upload/v1770680515/welcome_k1kho6.jpg" width="300" alt="Welcome Screen"/> | <img src="https://res.cloudinary.com/dg11uvapu/image/upload/v1770680515/login_jgvwoi.jpg" width="300" alt="Login Screen"/> |

### 📱 Main Features

| Home | Notes | Flashcards |
|:---:|:---:|:---:|
| <img src="https://res.cloudinary.com/dg11uvapu/image/upload/v1770680515/home_zthmir.jpg" width="250" alt="Home Screen"/> | <img src="https://res.cloudinary.com/dg11uvapu/image/upload/v1770680514/notes_zqrwwh.jpg" width="250" alt="Notes Screen"/> | <img src="https://res.cloudinary.com/dg11uvapu/image/upload/v1770680514/flashcards_i5i9ro.jpg" width="250" alt="Flashcards Screen"/> |

### 🎯 Study Mode & Themes

| Study Mode | Profile (Light) | Profile (Dark) |
|:---:|:---:|:---:|
| <img src="https://res.cloudinary.com/dg11uvapu/image/upload/v1770680514/studymode_qe656k.jpg" width="250" alt="Study Mode"/> | <img src="https://res.cloudinary.com/dg11uvapu/image/upload/v1770680514/profilelight_b3ty3c.jpg" width="250" alt="Profile Light Theme"/> | <img src="https://res.cloudinary.com/dg11uvapu/image/upload/v1770680514/profiledark_x94f90.jpg" width="250" alt="Profile Dark Theme"/> |

</div>

## ✨ Features

- 📝 **Notes Management** - Create, edit, and organize your notes
- 🎴 **Flashcards** - Study with interactive flashcard system
- 🔐 **Authentication** - Secure user authentication with Firebase
- 🎨 **Modern UI** - Beautiful interface built with NativeWind (Tailwind CSS for React Native)
- 📱 **Cross-Platform** - Works on iOS, Android, and Web
- 🔄 **State Management** - Redux Toolkit for efficient state handling

## 🚀 Tech Stack

- **Framework**: [Expo](https://expo.dev/) ~54.0
- **Language**: TypeScript
- **UI Library**: React Native 0.81
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Expo Router ~6.0
- **State Management**: Redux Toolkit
- **Backend**: Firebase
- **Icons**: Lucide React Native

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your mobile device (for testing)
- [Android Studio](https://developer.android.com/studio) (for Android development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd aurora
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore Database
4. Copy your Firebase configuration
5. Update the Firebase configuration in `src/services/firebase.ts`

```typescript
// src/services/firebase.ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### 4. Environment Setup (Optional)

For production builds, consider using environment variables:

1. Create a `.env` file in the root directory
2. Add your Firebase credentials
3. Update the configuration to use environment variables

## 🏃 Running the Application

### Development Mode

Start the Expo development server:

```bash
npm start
```

This will open the Expo Developer Tools in your browser.

### Run on Specific Platforms

#### Android

```bash
npm run android
```

#### iOS (macOS only)

```bash
npm run ios
```

#### Web

```bash
npm run web
```

### Using Expo Go

1. Start the development server: `npm start`
2. Open Expo Go app on your mobile device
3. Scan the QR code displayed in the terminal or browser
4. The app will load on your device

## 📦 Building for Production

### Android (APK/AAB)

```bash
eas build -p android --profile preview
```

For production build:

```bash
eas build -p android --profile production
```

### iOS (IPA)

```bash
eas build -p ios --profile production
```

> **Note**: You need to configure EAS Build. Run `eas build:configure` if you haven't already.

## 📁 Project Structure

```
aurora/
├── app/                      # App screens and navigation
│   ├── (auth)/              # Authentication screens
│   ├── (dashboard)/         # Main app screens
│   │   ├── flashcards/     # Flashcard management
│   │   └── notes/          # Note management
│   └── _layout.tsx         # Root layout
├── src/
│   ├── components/         # Reusable components
│   ├── hooks/             # Custom React hooks
│   ├── redux/             # Redux store and slices
│   ├── services/          # Firebase and API services
│   └── types/             # TypeScript type definitions
├── assets/                # Images and static assets
├── components/            # UI components
└── constants/             # App constants and themes
```

## 🧪 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm run reset-project` - Reset project to initial state

## 🔧 Configuration Files

- `app.json` - Expo app configuration
- `eas.json` - EAS Build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `babel.config.js` - Babel configuration
- `metro.config.js` - Metro bundler configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing framework
- [Firebase](https://firebase.google.com/) for backend services
- [NativeWind](https://www.nativewind.dev/) for styling
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management

## 📞 Support

For support, email gamitha.gimhana99@gmail.com or create an issue in the repository.

---

Made with ❤️ using Expo and React Native
