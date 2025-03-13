// Import Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCBzHK6AqZ7qb9Fvxc4pfkVbFs4-1Mps-o",
    authDomain: "feedbackanalyzer-7faf0.firebaseapp.com",
    projectId: "feedbackanalyzer-7faf0",
    storageBucket: "feedbackanalyzer-7faf0.firebasestorage.app",
    messagingSenderId: "584681672965",
    appId: "1:584681672965:web:76875d16b932e112dc276c",
    measurementId: "G-TN5K377CSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time.
            console.log('Persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            // The current browser doesn't support persistence
            console.log('Persistence not available');
        }
    });

// Initialize Analytics conditionally
let analytics = null;
if (typeof window !== 'undefined') {
    isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

// Hugging Face API configuration
const HUGGING_FACE_API_KEY = "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";
const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";

// Export instances for use in other files
export { auth, db, analytics, HUGGING_FACE_API_KEY, HUGGING_FACE_API_URL }; 