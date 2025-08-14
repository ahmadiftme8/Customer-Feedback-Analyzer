// Local storage replacement for Firebase
class LocalAuth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.authCallbacks = [];
    }

    async signInWithEmailAndPassword(email, password) {
        // Simple validation for demo
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user || (email === 'test@example.com' && password === 'test123')) {
            this.currentUser = { uid: 'user123', email: email };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.notifyAuthStateChanged();
            return this.currentUser;
        } else {
            throw new Error('Invalid email or password');
        }
    }

    async createUserWithEmailAndPassword(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            throw new Error('User already exists');
        }

        const newUser = { email, password, uid: Date.now().toString() };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        this.currentUser = { uid: newUser.uid, email: email };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.notifyAuthStateChanged();
        return this.currentUser;
    }

    async signOut() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.notifyAuthStateChanged();
    }

    onAuthStateChanged(callback) {
        this.authCallbacks.push(callback);
        // Call immediately with current state
        callback(this.currentUser);
    }

    notifyAuthStateChanged() {
        this.authCallbacks.forEach(callback => callback(this.currentUser));
    }
}

class LocalFirestore {
    collection(name) {
        return new LocalCollection(name);
    }
}

class LocalCollection {
    constructor(name) {
        this.name = name;
    }

    async addDoc(data) {
        const docs = JSON.parse(localStorage.getItem(this.name) || '[]');
        const newDoc = {
            id: Date.now().toString(),
            ...data,
            createdAt: new Date().toISOString()
        };
        docs.push(newDoc);
        localStorage.setItem(this.name, JSON.stringify(docs));
        return { id: newDoc.id };
    }

    async getDocs() {
        const docs = JSON.parse(localStorage.getItem(this.name) || '[]');
        return {
            docs: docs.map(doc => ({
                id: doc.id,
                data: () => doc
            }))
        };
    }

    onSnapshot(callback) {
        // Simple polling for real-time updates
        const checkForUpdates = () => {
            const docs = JSON.parse(localStorage.getItem(this.name) || '[]');
            const snapshot = {
                docs: docs.map(doc => ({
                    id: doc.id,
                    data: () => doc
                }))
            };
            callback(snapshot);
        };

        checkForUpdates();
        // Check for updates every 5 seconds
        const interval = setInterval(checkForUpdates, 5000);
        
        // Return unsubscribe function
        return () => clearInterval(interval);
    }
}

// Initialize local storage services
const auth = new LocalAuth();
const db = new LocalFirestore();

// Helper functions to match Firebase API
const collection = (db, name) => db.collection(name);
const addDoc = (collectionRef, data) => collectionRef.addDoc(data);
const getDocs = (collectionRef) => collectionRef.getDocs();
const onSnapshot = (collectionRef, callback) => collectionRef.onSnapshot(callback);
const query = (collectionRef) => collectionRef;
const orderBy = () => ({});
const limit = () => ({});

// Export for compatibility
export { 
    auth, 
    db, 
    collection, 
    addDoc, 
    getDocs, 
    onSnapshot,
    query,
    orderBy,
    limit
};