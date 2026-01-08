// Firebase Configuration
// Automatically detects environment and uses appropriate config
// - Production (GitHub Pages): Uses values injected by GitHub Actions
// - Local development: Uses values from firebase-credentials.local.js (gitignored)

// Check if we're in local development
const isLocalDev = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.protocol === 'file:';

// Production config (values replaced by GitHub Actions)
const productionConfig = {
    apiKey: "FIREBASE_API_KEY",
    authDomain: "FIREBASE_AUTH_DOMAIN",
    databaseURL: "FIREBASE_DATABASE_URL",
    projectId: "FIREBASE_PROJECT_ID",
    storageBucket: "FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
    appId: "FIREBASE_APP_ID"
};

// Select config based on environment
// Local credentials should be defined in firebase-credentials.local.js (gitignored)
let firebaseConfig;
if (isLocalDev && typeof localFirebaseCredentials !== 'undefined') {
    firebaseConfig = localFirebaseCredentials;
    console.log('🔥 Firebase: Using LOCAL credentials');
} else if (isLocalDev) {
    console.error('❌ Firebase: Local credentials not found! Create js/firebase-credentials.local.js');
    console.log('See js/firebase-credentials.template.js for the format');
    firebaseConfig = productionConfig; // Will fail but shows the error
} else {
    firebaseConfig = productionConfig;
    console.log('🔥 Firebase: Using PRODUCTION config');
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Database helper functions
const FirebaseVotes = {
    // Reference to votes in the database
    getVotesRef() {
        return database.ref('votes');
    },

    getQuizStateRef() {
        return database.ref('quizState');
    },

    // Save quiz state (current question, time remaining)
    async saveQuizState(state) {
        try {
            await this.getQuizStateRef().set(state);
        } catch (error) {
            console.error('Error saving quiz state:', error);
        }
    },

    // Get quiz state
    async getQuizState() {
        try {
            const snapshot = await this.getQuizStateRef().once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error getting quiz state:', error);
            return null;
        }
    },

    // Listen for quiz state changes
    onQuizStateChange(callback) {
        this.getQuizStateRef().on('value', (snapshot) => {
            callback(snapshot.val());
        });
    },

    // Submit a vote
    async submitVote(questionId, option) {
        try {
            const voteRef = database.ref(`votes/${questionId}/${option}`);
            await voteRef.transaction((currentValue) => {
                return (currentValue || 0) + 1;
            });
            return true;
        } catch (error) {
            console.error('Error submitting vote:', error);
            return false;
        }
    },

    // Get all votes for a question
    async getVotes(questionId) {
        try {
            const snapshot = await database.ref(`votes/${questionId}`).once('value');
            return snapshot.val() || {};
        } catch (error) {
            console.error('Error getting votes:', error);
            return {};
        }
    },

    // Get all votes
    async getAllVotes() {
        try {
            const snapshot = await this.getVotesRef().once('value');
            return snapshot.val() || {};
        } catch (error) {
            console.error('Error getting all votes:', error);
            return {};
        }
    },

    // Listen for vote changes on a specific question
    onVotesChange(questionId, callback) {
        database.ref(`votes/${questionId}`).on('value', (snapshot) => {
            callback(snapshot.val() || {});
        });
    },

    // Listen for all vote changes
    onAllVotesChange(callback) {
        this.getVotesRef().on('value', (snapshot) => {
            callback(snapshot.val() || {});
        });
    },

    // Initialize votes for a question (if not exists)
    async initializeQuestionVotes(questionId, options) {
        try {
            const snapshot = await database.ref(`votes/${questionId}`).once('value');
            if (!snapshot.exists()) {
                const initialVotes = {};
                options.forEach(option => {
                    const optionText = typeof option === 'string' ? option : option.text;
                    initialVotes[optionText] = 0;
                });
                await database.ref(`votes/${questionId}`).set(initialVotes);
            }
        } catch (error) {
            console.error('Error initializing votes:', error);
        }
    },

    // Reset all votes (admin function)
    async resetAllVotes() {
        try {
            await this.getVotesRef().remove();
            // Generate new session ID to invalidate all previous votes on all devices
            const newSessionId = Date.now().toString();
            await database.ref('sessionId').set(newSessionId);
            console.log('All votes reset, new session:', newSessionId);
            return newSessionId;
        } catch (error) {
            console.error('Error resetting votes:', error);
            return null;
        }
    },

    // Get current session ID
    async getSessionId() {
        try {
            const snapshot = await database.ref('sessionId').once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error getting session ID:', error);
            return null;
        }
    },

    // Listen for session ID changes
    onSessionIdChange(callback) {
        database.ref('sessionId').on('value', (snapshot) => {
            callback(snapshot.val());
        });
    },

    // Stop listening to changes
    offVotesChange(questionId) {
        if (questionId) {
            database.ref(`votes/${questionId}`).off();
        } else {
            this.getVotesRef().off();
        }
    },

    offQuizStateChange() {
        this.getQuizStateRef().off();
    },

    // Save candidates revealed state
    async saveCandidatesRevealed(questionIndex, revealed) {
        try {
            await database.ref('candidatesRevealed').set({
                questionIndex: questionIndex,
                revealed: revealed
            });
        } catch (error) {
            console.error('Error saving candidates revealed state:', error);
        }
    },

    // Get candidates revealed state
    async getCandidatesRevealed() {
        try {
            const snapshot = await database.ref('candidatesRevealed').once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error getting candidates revealed state:', error);
            return null;
        }
    },

    // Listen for candidates revealed changes
    onCandidatesRevealedChange(callback) {
        database.ref('candidatesRevealed').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                callback(data.revealed, data.questionIndex);
            } else {
                callback(false, 0);
            }
        });
    }
};
