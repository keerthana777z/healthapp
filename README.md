# AI Health Coach Mobile App

A React Native mobile app built with Expo that provides personalized health coaching with AI-powered recommendations, risk assessments, and goal tracking.

## Features

- **Authentication**: Secure login/signup with Supabase
- **Dashboard**: Real-time health metrics, risk cards, and AI recommendations
- **Profile Management**: Edit personal and health information
- **Micro-Goals Tracking**: Set and track daily health goals
- **Risk Assessment**: SHAP-based explanations for health risks
- **Settings**: App preferences and account management

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd health-coach-mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── RiskCard.js
│   ├── MicroGoalsPanel.js
│   ├── ShapExplanation.js
│   └── AIRecommendations.js
├── contexts/           # React contexts
│   └── AuthContext.js
├── navigation/         # Navigation configuration
│   ├── AppNavigator.js
│   ├── AuthNavigator.js
│   └── MainNavigator.js
├── screens/           # Screen components
│   ├── auth/
│   │   ├── LoginScreen.js
│   │   └── SignupScreen.js
│   ├── main/
│   │   ├── DashboardScreen.js
│   │   ├── ProfileScreen.js
│   │   └── SettingsScreen.js
│   └── LoadingScreen.js
└── config/
    └── supabase.js    # Supabase configuration
```

## Supabase Integration

The app is fully integrated with Supabase for:
- User authentication
- Patient data storage
- Real-time updates
- Health metrics tracking

Make sure your Supabase project has the following tables:
- `users` - User profiles and health information
- `patient_logs` - Health metrics and micro-goals
- `ai_queries` - AI recommendation history

## Key Features

### Authentication
- Email/password login and signup
- Secure session management
- Profile creation with health information

### Dashboard
- Risk assessment cards for diabetes and hypertension
- Micro-goals tracking with real-time updates
- SHAP explanations for risk factors
- AI-powered health recommendations

### Profile Management
- Edit personal information
- Manage health conditions, medications, and allergies
- Real-time sync with Supabase

### Settings
- App preferences
- Privacy and data management
- Account settings

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add new screens in `src/screens/`
3. Update navigation in `src/navigation/`
4. Integrate with Supabase in component logic

### Styling

The app uses a consistent design system with:
- Medical-themed colors (blues, greens, reds)
- Mobile-optimized spacing and typography
- Shadow effects for depth
- Responsive design for different screen sizes

## Deployment

### Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### Publishing to App Stores

Follow Expo's documentation for publishing to:
- Apple App Store
- Google Play Store

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.