class VotePage {
    constructor() {
        this.selectedOption = null;
        this.hasVoted = false;
        this.currentQuestionIndex = 0;
        this.currentSessionId = null;
        
        this.init();
    }

    async init() {
        await this.checkSession();
        await this.loadQuizState();
        this.renderQuestion();
        this.checkIfVoted();
        this.setupFirebaseListeners();
        await this.checkInitialRevealState();
        
        document.getElementById('submitVoteButton').addEventListener('click', () => this.submitVote());
    }

    async checkSession() {
        // Get session ID from Firebase
        const firebaseSessionId = await FirebaseVotes.getSessionId();
        const localSessionId = localStorage.getItem('voteSessionId');
        
        if (firebaseSessionId && firebaseSessionId !== localSessionId) {
            // Session changed - clear all local vote history
            console.log('New session detected, clearing local vote history');
            this.clearLocalVoteHistory();
            localStorage.setItem('voteSessionId', firebaseSessionId);
        }
        
        this.currentSessionId = firebaseSessionId;
    }

    clearLocalVoteHistory() {
        // Clear all voted_* keys from localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('voted_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log('Cleared', keysToRemove.length, 'vote records');
    }

    setupFirebaseListeners() {
        // Listen for session ID changes (reset detection)
        FirebaseVotes.onSessionIdChange((sessionId) => {
            if (sessionId && sessionId !== this.currentSessionId) {
                console.log('Session reset detected!');
                this.currentSessionId = sessionId;
                localStorage.setItem('voteSessionId', sessionId);
                this.clearLocalVoteHistory();
                this.hasVoted = false;
                this.selectedOption = null;
                this.renderQuestion();
                this.enableVoting();
                this.showMessage('🔄 Nova sessão! Podes votar novamente.', 'info');
            }
        });

        // Listen for candidates revealed state
        FirebaseVotes.onCandidatesRevealedChange((revealed, questionIndex) => {
            if (revealed && questionIndex === this.currentQuestionIndex) {
                this.showCandidates();
            } else if (questionIndex === this.currentQuestionIndex) {
                this.hideCandidates();
            }
        });
        
        // Listen for quiz state changes from the presenter
        FirebaseVotes.onQuizStateChange((state) => {
            if (state && typeof state.currentQuestionIndex === 'number') {
                const previousQuestionIndex = this.currentQuestionIndex;
                this.currentQuestionIndex = state.currentQuestionIndex;
                
                // If question changed, re-render
                if (previousQuestionIndex !== this.currentQuestionIndex) {
                    this.hasVoted = false;
                    this.selectedOption = null;
                    this.renderQuestion();
                    this.checkIfVoted();
                }
            }
            // If state is null/undefined, keep the current question - don't reset
        });
    }

    async loadQuizState() {
        // First try to get state from Firebase
        try {
            const firebaseState = await FirebaseVotes.getQuizState();
            if (firebaseState && typeof firebaseState.currentQuestionIndex === 'number') {
                this.currentQuestionIndex = firebaseState.currentQuestionIndex;
                console.log('Loaded question index from Firebase:', this.currentQuestionIndex);
                return;
            }
        } catch (error) {
            console.error('Error loading from Firebase:', error);
        }
        
        // Fallback to localStorage
        try {
            const state = localStorage.getItem('quizState');
            if (state) {
                const parsed = JSON.parse(state);
                if (typeof parsed.currentQuestionIndex === 'number') {
                    this.currentQuestionIndex = parsed.currentQuestionIndex;
                    console.log('Loaded question index from localStorage:', this.currentQuestionIndex);
                    return;
                }
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
        
        // Default to 0 only if nothing else works
        this.currentQuestionIndex = 0;
        console.log('Using default question index: 0');
    }

    getCurrentQuestion() {
        return questions[this.currentQuestionIndex];
    }

    getOptionText(option) {
        return typeof option === 'string' ? option : option.text;
    }

    getOptionImage(option) {
        return typeof option === 'string' ? null : option.image;
    }

    getOptionImagePosition(option) {
        return typeof option === 'string' ? 'top' : (option.imagePosition || 'top');
    }

    renderQuestion() {
        const question = this.getCurrentQuestion();
        
        document.getElementById('voteQuestionText').textContent = question.question;
        
        const container = document.getElementById('voteOptionsSection');
        container.innerHTML = '';
        
        question.options.forEach(option => {
            const optionText = this.getOptionText(option);
            const optionImage = this.getOptionImage(option);
            const optionImagePosition = this.getOptionImagePosition(option);
            
            const optionDiv = document.createElement('div');
            optionDiv.className = 'vote-option';
            optionDiv.dataset.option = optionText;
            
            if (optionImage) {
                const img = document.createElement('img');
                img.src = optionImage;
                img.alt = optionText;
                img.className = 'vote-option-image';
                img.style.objectPosition = optionImagePosition;
                img.onerror = function() { this.style.display = 'none'; };
                optionDiv.appendChild(img);
            }
            
            const textSpan = document.createElement('span');
            textSpan.className = 'vote-option-text';
            textSpan.textContent = optionText;
            optionDiv.appendChild(textSpan);
            
            optionDiv.addEventListener('click', () => this.selectOption(optionText));
            
            container.appendChild(optionDiv);
        });
    }

    selectOption(option) {
        if (this.hasVoted) {
            return;
        }
        
        document.querySelectorAll('.vote-option').forEach(el => {
            el.classList.remove('selected');
        });
        
        const optionElement = document.querySelector(`[data-option="${option}"]`);
        optionElement.classList.add('selected');
        
        this.selectedOption = option;
        
        document.getElementById('submitVoteButton').disabled = false;
    }

    checkIfVoted() {
        const question = this.getCurrentQuestion();
        const voteKey = `voted_${question.id}`;
        const hasVoted = localStorage.getItem(voteKey);
        
        if (hasVoted) {
            this.hasVoted = true;
            this.showMessage('Já votaste nesta categoria!', 'info');
            this.disableVoting();
        }
    }

    async submitVote() {
        if (!this.selectedOption || this.hasVoted) {
            return;
        }
        
        const question = this.getCurrentQuestion();
        
        // Submit vote to Firebase
        const success = await FirebaseVotes.submitVote(question.id, this.selectedOption);
        
        if (success) {
            // Mark as voted in localStorage (to prevent duplicate votes on same device)
            const voteKey = `voted_${question.id}`;
            localStorage.setItem(voteKey, 'true');
            
            this.hasVoted = true;
            this.showMessage('✅ Voto registado com sucesso!', 'success');
            this.disableVoting();
        } else {
            this.showMessage('❌ Erro ao submeter voto. Tenta novamente.', 'error');
        }
    }

    disableVoting() {
        document.querySelectorAll('.vote-option').forEach(el => {
            el.style.cursor = 'not-allowed';
            el.style.opacity = '0.6';
        });
        
        document.getElementById('submitVoteButton').disabled = true;
    }

    enableVoting() {
        document.querySelectorAll('.vote-option').forEach(el => {
            el.style.cursor = 'pointer';
            el.style.opacity = '1';
        });
        
        document.getElementById('submitVoteButton').disabled = true; // Still disabled until selection
    }

    showMessage(text, type = 'info') {
        const container = document.getElementById('messageContainer');
        container.innerHTML = `
            <div class="message ${type}">
                ${text}
            </div>
        `;
        
        if (type === 'success') {
            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }
    }

    showCandidates() {
        document.getElementById('waitingMessage').classList.add('hidden');
        document.getElementById('voteOptionsSection').classList.remove('hidden');
        document.getElementById('submitVoteButton').classList.remove('hidden');
    }

    hideCandidates() {
        document.getElementById('waitingMessage').classList.remove('hidden');
        document.getElementById('voteOptionsSection').classList.add('hidden');
        document.getElementById('submitVoteButton').classList.add('hidden');
    }

    async checkInitialRevealState() {
        const state = await FirebaseVotes.getCandidatesRevealed();
        if (state && state.revealed && state.questionIndex === this.currentQuestionIndex) {
            this.showCandidates();
        } else {
            this.hideCandidates();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VotePage();
});
