# Customer Feedback Analyzer

A beginner-friendly web application that collects customer feedback, analyzes it using Google Cloud Natural Language API, and displays results on a dashboard.

## Features

- User authentication with Firebase
- Customer feedback submission form
- Sentiment analysis using Google Cloud Natural Language API
- Interactive dashboard with charts
- Secure API key handling

## Prerequisites

1. Node.js installed on your computer
2. Firebase account
3. Google Cloud account with Natural Language API enabled
4. Modern web browser

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Go to Project Settings > Your Apps > Web
6. Register your app and copy the Firebase configuration

### 2. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your Firebase project
3. Enable the Cloud Natural Language API
4. Create API credentials (API key)
5. Restrict the API key to only Natural Language API

### 3. Environment Setup

1. Create a file named `.env` in the root directory
2. Add your Firebase and Google Cloud configurations:

```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
```

### 4. Running the Application

1. Open `index.html` in your web browser
2. Sign in with your email and password
3. Start submitting feedback and view the dashboard

## Security Notes

- Never commit your `.env` file to version control
- Always restrict API keys to specific services and domains
- Use Firebase Security Rules to protect your data

## File Structure

```
customer-feedback-analyzer/
├── css/
│   └── styles.css
├── js/
│   ├── auth.js
│   ├── feedback.js
│   ├── dashboard.js
│   └── config.js
├── pages/
│   ├── dashboard.html
│   └── feedback.html
├── index.html
└── README.md
```

## Technologies Used

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript
- Firebase (Authentication & Firestore)
- Google Cloud Natural Language API
- Chart.js (via CDN) 