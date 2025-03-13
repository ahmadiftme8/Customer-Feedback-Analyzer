import { auth } from './config.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "firebase/auth";

// Handle login functionality
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    try {
        // Try to create a test user first
        try {
            await createUserWithEmailAndPassword(auth, 'test@example.com', 'test123');
            console.log('Test user created successfully');
        } catch (regError) {
            // User might already exist, which is fine
            console.log('Test user might already exist:', regError.message);
        }

        // Now try to sign in
        await signInWithEmailAndPassword(auth, email, password);
        // Redirect to feedback page on successful login
        window.location.href = 'pages/feedback.html';
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    }
}

// Check authentication state
onAuthStateChanged(auth, (user) => {
    // If user is already logged in and we're on the login page, redirect to feedback page
    if (user && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'pages/feedback.html';
    }
    // If user is not logged in and we're not on the login page, redirect to login page
    else if (!user && !window.location.pathname.endsWith('index.html')) {
        window.location.href = '../index.html';
    }
});

// Handle logout
async function logout() {
    try {
        await signOut(auth);
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// Export functions for use in HTML
window.login = login;
window.logout = logout; 