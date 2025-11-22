class VotePage {
    constructor() {
        this.selectedOption = null;
        this.hasVoted = false;
        this.timer = null;
        
        this.init();
    }

    init() {
        this.loadQuizState();
        this.renderQuestion();
        this.checkIfVoted();
        this.startTimer();
        
        document.getElementById('submitVoteButton').addEventListener('click', () => this.submitVote());
    }

    loadQuizState() {
        const state = localStorage.getItem('quizState');
        if (state) {
            const parsed = JSON.parse(state);
            this.currentQuestionIndex = parsed.currentQuestionIndex || 0;
            this.timeRemaining = parsed.timeRemaining || questions[this.currentQuestionIndex].duration;
        } else {
            this.currentQuestionIndex = 0;
            this.timeRemaining = questions[0].duration;
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
        if (this.hasVoted || this.timeRemaining <= 0) {
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

    submitVote() {
        if (!this.selectedOption || this.hasVoted || this.timeRemaining <= 0) {
            return;
        }
        
        const question = this.getCurrentQuestion();
        
        const votesData = localStorage.getItem('quizVotes');
        let votes = votesData ? JSON.parse(votesData) : {};
        
        if (!votes[question.id]) {
            votes[question.id] = {};
            question.options.forEach(option => {
                const optionText = this.getOptionText(option);
                votes[question.id][optionText] = 0;
            });
        }
        
        votes[question.id][this.selectedOption] = (votes[question.id][this.selectedOption] || 0) + 1;
        localStorage.setItem('quizVotes', JSON.stringify(votes));
        
        const voteKey = `voted_${question.id}`;
        localStorage.setItem(voteKey, 'true');
        
        this.hasVoted = true;
        this.showMessage('✅ Vote registered successfully!', 'success');
        this.disableVoting();
        
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'quizVotes',
            newValue: JSON.stringify(votes)
        }));
    }

    disableVoting() {
        document.querySelectorAll('.vote-option').forEach(el => {
            el.style.cursor = 'not-allowed';
            el.style.opacity = '0.6';
            el.onclick = null;
        });
        
        document.getElementById('submitVoteButton').disabled = true;
    }

    startTimer() {
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.loadQuizState();
            
            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                this.endVoting();
            }

            this.updateTimerDisplay();
        }, 100);
    }

    updateTimerDisplay() {
        const seconds = Math.ceil(this.timeRemaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        const display = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        const timerElement = document.getElementById('voteTimerDisplay');
        timerElement.textContent = display;
        
        timerElement.classList.remove('warning', 'danger');
        if (seconds <= 10) {
            timerElement.classList.add('danger');
        } else if (seconds <= 30) {
            timerElement.classList.add('warning');
        }
    }

    endVoting() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        if (!this.hasVoted) {
            this.showMessage('⏰ Time expired! Voting has been closed.', 'error');
        }
        
        this.disableVoting();
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
