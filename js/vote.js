class VotePage {
    constructor() {
        this.selectedOption = null;
        this.hasVoted = false;
        this.currentQuestionIndex = 0;
        
        this.init();
    }

    async init() {
        await this.loadQuizState();
        this.renderQuestion();
        this.checkIfVoted();
        this.setupFirebaseListeners();
        
        document.getElementById('submitVoteButton').addEventListener('click', () => this.submitVote());
    }

    setupFirebaseListeners() {
        // Listen for quiz state changes from the presenter
        FirebaseVotes.onQuizStateChange((state) => {
            if (state) {
                const previousQuestionIndex = this.currentQuestionIndex;
                this.currentQuestionIndex = state.currentQuestionIndex || 0;
                
                // If question changed, re-render
                if (previousQuestionIndex !== this.currentQuestionIndex) {
                    this.hasVoted = false;
                    this.selectedOption = null;
                    this.renderQuestion();
                    this.checkIfVoted();
                }
            }
        });
    }

    async loadQuizState() {
        // First try to get state from Firebase
        const firebaseState = await FirebaseVotes.getQuizState();
        if (firebaseState) {
            this.currentQuestionIndex = firebaseState.currentQuestionIndex || 0;
        } else {
            // Fallback to localStorage
            const state = localStorage.getItem('quizState');
            if (state) {
                const parsed = JSON.parse(state);
                this.currentQuestionIndex = parsed.currentQuestionIndex || 0;
            } else {
                this.currentQuestionIndex = 0;
            }
        }
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

    renderQuestion() {
        const question = this.getCurrentQuestion();
        
        document.getElementById('voteQuestionText').textContent = question.question;
        
        const container = document.getElementById('voteOptionsSection');
        container.innerHTML = '';
        
        question.options.forEach(option => {
            const optionText = this.getOptionText(option);
            const optionImage = this.getOptionImage(option);
            
            const optionDiv = document.createElement('div');
            optionDiv.className = 'vote-option';
            optionDiv.dataset.option = optionText;
            
            if (optionImage) {
                const img = document.createElement('img');
                img.src = optionImage;
                img.alt = optionText;
                img.className = 'vote-option-image';
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
            this.showMessage('You have already voted in this award!', 'info');
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
            this.showMessage('✅ Vote registered successfully!', 'success');
            this.disableVoting();
        } else {
            this.showMessage('❌ Error submitting vote. Please try again.', 'error');
        }
    }

    disableVoting() {
        document.querySelectorAll('.vote-option').forEach(el => {
            el.style.cursor = 'not-allowed';
            el.style.opacity = '0.6';
            el.onclick = null;
        });
        
        document.getElementById('submitVoteButton').disabled = true;
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
}

document.addEventListener('DOMContentLoaded', () => {
    new VotePage();
});
