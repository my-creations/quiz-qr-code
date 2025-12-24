# 🎯 Real-Time Voting Quiz

Interactive voting system with QR Code, timer, and real-time results. Hostable on GitHub Pages with Firebase for real-time vote synchronization!

## ✨ Features

- ✅ Automatic QR Code generation for voting
- ✅ Configurable timer per question (default: 1 minute)
- ✅ Navigation controls (previous/next question)
- ✅ Pause/resume timer
- ✅ Fullscreen mode for presentations
- ✅ Real-time results with graphics
- ✅ Results page with winning option
- ✅ Support for images in options
- ✅ Multiple configurable questions
- ✅ Responsive and modern design
- ✅ **Real-time vote sync across devices via Firebase**

## 📁 Project Structure

```
quiz-qr-code/
├── index.html              # Main panel (display results)
├── vote.html               # Voting page
├── css/
│   └── styles.css          # Application styles
├── js/
│   ├── questions.js        # Questions configuration
│   ├── firebase-config.js  # Firebase configuration
│   ├── app.js              # Main panel logic
│   └── vote.js             # Voting page logic
├── images/                 # Images for options
│   ├── IMG_4039.jpeg
│   ├── IMG_4045.jpeg
│   ├── IMG_4135.jpeg
│   └── IMG_4136.jpeg
├── docs/
│   ├── README.md           # Detailed documentation
│   └── PLANO.md            # Development plan
└── .gitignore
```

## 🔥 Firebase Setup (Required for GitHub Pages)

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

### Step 4: Update firebase-config.js

Open `js/firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

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
3. Open `index.html` in a browser (control panel)
4. Scan the QR Code or open `vote.html` on other devices to vote

### On GitHub Pages

1. Create a repository on GitHub
2. Upload all files
3. Go to Settings > Pages
4. Select the `main` branch and `/root` folder
5. Wait a few minutes
6. Access: `https://your-username.github.io/repo-name/`

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
            { text: "Option 2", image: "images/photo2.jpg" },
            // up to 5 options
        ],
        duration: 60000 // 1 minute in milliseconds
    },
    // Add more questions...
];
```

### Options Format

**With image:**
```javascript
{ text: "Name", image: "images/photo.jpg" }
```

**Without image (simple text):**
```javascript
"Option Name"
```

**With external URL image:**
```javascript
{ text: "Name", image: "https://example.com/image.png" }
```

## 🎮 Panel Controls

- **⏸️ Pause/Resume** - Controls the timer
- **← Previous** - Go back to previous question
- **→ Next** - Advance to next question
- **🖥️ Fullscreen** - Activate fullscreen mode (ideal for presentations)

## 🎨 Adding Images

1. Place your images in the `images/` folder
2. Supported formats: JPG, PNG, SVG, GIF
3. Recommended: square images (1:1 ratio)
4. Suggested size: 200x200px to 500x500px

## 💾 How Storage Works

Votes are stored in the browser's **LocalStorage**:
- Works perfectly for demos and presentations
- Automatic synchronization between tabs of the same browser
- Each device can vote once per question
- To reset: clear LocalStorage or restart quiz

**Limitation:** Votes are local to the browser/device. For production use with multiple devices, consider integrating Firebase Realtime Database (free).

## 🌐 Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS/Android)

## 📱 Event Usage

### Ideal Scenario
1. Projector/TV shows `index.html` (main panel)
2. Audience scans QR Code
3. Votes on mobile via `vote.html`
4. Results appear in real-time on projector

## 🎨 Customization

### Change Colors
Edit `css/styles.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Adjust Timer
Edit `js/questions.js`:
```javascript
duration: 120000 // 2 minutes
```

### Image Sizes
Edit `css/styles.css`:
```css
.option-image {
    width: 60px;  /* adjust as needed */
    height: 60px;
}
```

## 🔧 Possible Future Improvements

- [ ] Firebase Realtime Database integration
- [ ] Authentication system with unique code
- [ ] Export results to CSV/PDF
- [ ] Animated charts with Chart.js
- [ ] Notification sounds
- [ ] Dark mode
- [ ] Historical results analysis

## 📄 Licença

Este projeto é de código aberto e livre para uso pessoal e comercial.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Criado com ❤️ para tornar apresentações mais interativas!
