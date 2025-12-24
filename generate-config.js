const fs = require('fs');
const path = require('path');

// Read .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse env variables
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim();
    }
});

// Generate firebase-config.local.js
const configContent = `// Firebase Configuration - LOCAL DEVELOPMENT ONLY
// Auto-generated from .env.local - Do not commit this file

const firebaseConfig = {
    apiKey: "${env.FIREBASE_API_KEY}",
    authDomain: "${env.FIREBASE_AUTH_DOMAIN}",
    databaseURL: "${env.FIREBASE_DATABASE_URL}",
    projectId: "${env.FIREBASE_PROJECT_ID}",
    storageBucket: "${env.FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${env.FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${env.FIREBASE_APP_ID}"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Database helper functions
const FirebaseVotes = {
    getVotesRef() {
        return database.ref('votes');
    },

    getQuizStateRef() {
        return database.ref('quizState');
    },

    async saveQuizState(state) {
        try {
            await this.getQuizStateRef().set(state);
        } catch (error) {
            console.error('Error saving quiz state:', error);
        }
    },

    async getQuizState() {
        try {
            const snapshot = await this.getQuizStateRef().once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error getting quiz state:', error);
            return null;
        }
    },

    onQuizStateChange(callback) {
        this.getQuizStateRef().on('value', (snapshot) => {
            callback(snapshot.val());
        });
    },

    async submitVote(questionId, option) {
        try {
            const voteRef = database.ref(\`votes/\${questionId}/\${option}\`);
            await voteRef.transaction((currentValue) => {
                return (currentValue || 0) + 1;
            });
            return true;
        } catch (error) {
            console.error('Error submitting vote:', error);
            return false;
        }
    },

    async getVotes(questionId) {
        try {
            const snapshot = await database.ref(\`votes/\${questionId}\`).once('value');
            return snapshot.val() || {};
        } catch (error) {
            console.error('Error getting votes:', error);
            return {};
        }
    },

    async getAllVotes() {
        try {
            const snapshot = await this.getVotesRef().once('value');
            return snapshot.val() || {};
        } catch (error) {
            console.error('Error getting all votes:', error);
            return {};
        }
    },

    onVotesChange(questionId, callback) {
        database.ref(\`votes/\${questionId}\`).on('value', (snapshot) => {
            callback(snapshot.val() || {});
        });
    },

    onAllVotesChange(callback) {
        this.getVotesRef().on('value', (snapshot) => {
            callback(snapshot.val() || {});
        });
    },

    async initializeQuestionVotes(questionId, options) {
        try {
            const snapshot = await database.ref(\`votes/\${questionId}\`).once('value');
            if (!snapshot.exists()) {
                const initialVotes = {};
                options.forEach(option => {
                    const optionText = typeof option === 'string' ? option : option.text;
                    initialVotes[optionText] = 0;
                });
                await database.ref(\`votes/\${questionId}\`).set(initialVotes);
            }
        } catch (error) {
            console.error('Error initializing votes:', error);
        }
    },

    async resetAllVotes() {
        try {
            await this.getVotesRef().remove();
            console.log('All votes reset');
        } catch (error) {
            console.error('Error resetting votes:', error);
        }
    },

    offVotesChange(questionId) {
        if (questionId) {
            database.ref(\`votes/\${questionId}\`).off();
        } else {
            this.getVotesRef().off();
        }
    },

    offQuizStateChange() {
        this.getQuizStateRef().off();
    }
};
`;

const outputPath = path.join(__dirname, 'js', 'firebase-config.local.js');
fs.writeFileSync(outputPath, configContent);

console.log('✅ firebase-config.local.js generated from .env.local');
