# 🏆 ESPECIAIS DE OURO - Real-Time Voting Quiz

Interactive voting system with QR Code and real-time results. Hostable on GitHub Pages with Firebase for real-time vote synchronization!

## ✨ Features

- ✅ Automatic QR Code generation for voting
- ✅ Navigation controls (previous/next question)
- ✅ **"Nomeados" button** to reveal candidates (synced with voters)
- ✅ **"Concluir" button** to reveal winner
- ✅ Fullscreen mode for presentations
- ✅ Real-time results with graphics
- ✅ Winner announcement with highlight effects
- ✅ Support for images in options with custom positioning
- ✅ Multiple configurable questions
- ✅ Responsive design (720p compatible)
- ✅ **Real-time vote sync across devices via Firebase**
- ✅ **Reset button** to clear all votes on all devices
- ✅ **Automatic environment detection** (local vs production)
- ✅ **🎰 Raffle wheel** at the end with all participants
- ✅ **Sound effects** for raffle spinning and winner announcement

## 📁 Project Structure

```
quiz-qr-code/
├── index.html                          # Landing page
├── quiz.html                           # Main panel (display results)
├── vote.html                           # Voting page (QR code access)
├── css/
│   └── styles.css                      # Application styles
├── js/
│   ├── questions.js                    # Questions configuration
│   ├── firebase-config.js              # Firebase configuration (auto-detects environment)
│   ├── firebase-credentials.local.js   # Local Firebase credentials (gitignored)
│   ├── firebase-credentials.template.js # Template for local credentials
│   ├── app.js                          # Main panel logic
│   ├── vote.js                         # Voting page logic
│   └── raffle.js                       # Raffle wheel logic
├── images/                             # Images for options/participants
├── music/                              # Sound effects for raffle
│   ├── tick.mp3                        # Wheel spinning sound
│   └── winner.mp3                      # Winner announcement sound
└── .gitignore
```

## 🔥 Firebase Setup (Required)

To enable real-time voting across devices, you need to set up a free Firebase project:

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps
3. Give your project a name (e.g., "quiz-voting")

### Step 2: Create a Realtime Database

1. In your Firebase project, go to "Build" → "Realtime Database"
2. Click "Create Database"
3. Choose a location close to your users
4. Start in **Test Mode** (for development) or set up security rules

### Step 3: Get Your Configuration

1. Go to Project Settings (gear icon) → "General"
2. Scroll down to "Your apps" and click the web icon (`</>`)
3. Register your app with a nickname
4. Copy the `firebaseConfig` object

### Step 4: Set Up Local Credentials

For local development, create your credentials file:

```bash
cp js/firebase-credentials.template.js js/firebase-credentials.local.js
```

Then edit `js/firebase-credentials.local.js` with your Firebase values:

```javascript
const localFirebaseCredentials = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

> 💡 This file is gitignored and won't be committed to the repository.

### Step 5: Set Database Rules (Important!)

In Firebase Console → Realtime Database → Rules, set:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> ⚠️ **Note:** These rules allow anyone to read/write. For production, consider adding authentication or more restrictive rules.

## 🚀 How to Use

### Locally

1. Clone or download this repository
2. Configure Firebase (see above)
3. Create `js/firebase-credentials.local.js` with your credentials
4. Open `index.html` in a browser (control panel)
5. Scan the QR Code or open `vote.html` on other devices to vote

### On GitHub Pages

1. Create a repository on GitHub
2. Upload all files
3. Add repository secrets (Settings → Secrets → Actions):
   - `FIREBASE_API_KEY`
   - `FIREBASE_AUTH_DOMAIN`
   - `FIREBASE_DATABASE_URL`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`
4. Go to Settings → Pages → Source → Select **"GitHub Actions"**
5. Push changes and wait for deployment
6. Access: `https://your-username.github.io/repo-name/`

## 🧹 Reset Votes & Database

There's a **Reset button** (🗑️ Reset) in the top-right corner of the main panel that:

- Clears all votes from Firebase
- Resets to the first question
- **Automatically allows all devices to vote again** (even mobile phones that already voted)

This works across all devices in real-time - no need to clear cookies manually!

## ⚙️ Questions Configuration

Edit the `js/questions.js` file to add/modify questions:

```javascript
const questions = [
    {
        id: 1,
        question: "Your question here?",
        description: "Optional question description",
        options: [
            { text: "Option 1", image: "images/photo1.jpg" },
            { text: "Option 2", image: "images/photo2.jpg", imagePosition: "center 20%" },
            // up to 5 options
        ]
    },
    // Add more questions...
];
```

### Options Format

**With image:**
```javascript
{ text: "Name", image: "images/photo.jpg" }
```

**With image and custom position (for cropping faces):**
```javascript
{ text: "Name", image: "images/photo.jpg", imagePosition: "center 20%" }
```

**Without image (simple text):**
```javascript
"Option Name"
```

**With external URL image:**
```javascript
{ text: "Name", image: "https://example.com/image.png" }
```

## 🎰 Raffle Wheel

At the end of all questions, a raffle wheel appears with all unique participants:

- **All participants** from all questions are included (no duplicates)
- **Profile images** appear in the wheel slices and center
- **Sound effects**: tick sound during spin, winner fanfare
- **6-second spin** with smooth easing animation
- **Winner display** with photo and name
- **"Sortear Novamente"** button to re-spin

### Sound Files

Place these files in `music/` folder:
- `tick.mp3` - Plays during wheel spin (loops)
- `winner.mp3` - Plays when winner is revealed

The raffle works without sounds - they're optional enhancements.

## 🎮 Panel Controls

- **📋 Nomeados** - Reveal candidates (syncs with voter devices)
- **🏆 Concluir** - Finish voting and reveal the winner
- **➡️ Continuar** - After revealing winner, continue to next question
- **← Anterior** - Go back to previous question
- **→ Próxima** - Skip to next question (goes to raffle on last question)
- **🗑️ Reset** - Clear all votes, reset raffle, and start fresh

## 🎨 Adding Images

1. Place your images in the `images/` folder
2. Supported formats: JPG, PNG, SVG, GIF
3. Recommended: square images (1:1 ratio)
4. Suggested size: 200x200px to 500x500px

## 💾 How Storage Works

- **Votes** are stored in Firebase Realtime Database for real-time sync
- **Vote history** is stored locally to prevent duplicate votes from the same device
- **Session system** allows resetting vote history on all devices simultaneously
- Each device can vote once per question per session

## 🌐 Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS/Android)

## 📱 Event Usage

### Ideal Scenario
1. Projector/TV shows `quiz.html` (main panel)
2. Audience scans QR Code with their phones
3. Voters see "Aguarde pela revelação dos nomeados..."
4. Host clicks **"📋 Nomeados"** to reveal candidates on all devices
5. Audience votes on mobile via `vote.html`
6. Results appear in real-time on projector
7. Host clicks **"🏆 Concluir"** to reveal winner
8. Click **"Continuar"** to move to next category
9. After last category, **🎰 Raffle Wheel** appears automatically
10. Click **"Iniciar Sorteio"** to spin the wheel!

## 🎨 Customization

### Change Colors
Edit `css/styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Image Sizes
Edit `css/styles.css`:
```css
.option-image {
    width: 60px;  /* adjust as needed */
    height: 60px;
}
```

## 📄 License

This project is open source and free for personal and commercial use.

## 🤝 Contributions

Contributions are welcome! Feel free to open issues or pull requests.

---

Created with ❤️ to make presentations more interactive!
