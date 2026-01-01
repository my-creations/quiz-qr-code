class QuizApp {
    constructor() {
        this.currentQuestionIndex = 0;
        this.qrCodeInstance = null;
        this.votes = {};
        this.isShowingResults = false;
        
        this.init();
    }

    async init() {
        await this.loadState();
        this.saveState(); // Ensure state is saved to Firebase on init
        this.renderQuestion();
        this.generateQRCode();
        this.setupFirebaseListeners();
        

        document.getElementById('finishButton').addEventListener('click', () => this.handleFinishButton());
        document.getElementById('prevButton').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextButton').addEventListener('click', () => this.skipToNextQuestion());
        document.getElementById('resetButton').addEventListener('click', () => this.confirmReset());
        
        this.updateNavigationButtons();
    }

    setupFirebaseListeners() {
        // Listen for real-time vote updates from Firebase
        FirebaseVotes.onAllVotesChange((votes) => {
            this.votes = votes;
            this.updateResults();
        });
    }

    toggleFullscreen() {
        const elem = document.documentElement;
        
        if (!document.fullscreenElement && !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && !document.msFullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    updateFullscreenButton() {
        const button = document.getElementById('fullscreenButton');
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || 
                           document.mozFullScreenElement || document.msFullscreenElement;
        
        if (isFullscreen) {
            button.textContent = 'Exit Fullscreen';
        } else {
            button.textContent = 'Fullscreen';
        }
    }

    loadState() {
        const state = localStorage.getItem('quizState');
        if (state) {
            const parsed = JSON.parse(state);
            this.currentQuestionIndex = parsed.currentQuestionIndex || 0;
        } else {
            this.resetQuiz();
        }
    }

    saveState() {
        const state = {
            currentQuestionIndex: this.currentQuestionIndex
        };
        localStorage.setItem('quizState', JSON.stringify(state));
        
        // Also save to Firebase for vote page sync
        FirebaseVotes.saveQuizState(state);
    }

    handleFinishButton() {
        if (this.isShowingResults) {
            // Already showing results, go to next question
            this.nextQuestion();
        } else {
            // Show results
            this.showFinalResults();
        }
    }

    updateFinishButton() {
        const finishButton = document.getElementById('finishButton');
        if (this.isShowingResults) {
            if (this.currentQuestionIndex >= questions.length - 1) {
                finishButton.innerHTML = '🔄 Recomeçar';
            } else {
                finishButton.innerHTML = 'Continuar ➡️';
            }
            finishButton.classList.remove('finish-button');
            finishButton.classList.add('continue-mode');
        } else {
            finishButton.innerHTML = '🏆 Concluir';
            finishButton.classList.add('finish-button');
            finishButton.classList.remove('continue-mode');
        }
    }

    updateNavigationButtons() {
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        
        prevButton.disabled = this.currentQuestionIndex === 0;
        nextButton.disabled = this.currentQuestionIndex >= questions.length - 1;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.changeQuestion();
        }
    }

    skipToNextQuestion() {
        if (this.currentQuestionIndex < questions.length - 1) {
            this.currentQuestionIndex++;
            this.changeQuestion();
        }
    }

    changeQuestion() {
        this.saveState();
        this.renderQuestion();
        // QR code não precisa ser regenerado - URL é sempre o mesmo
        
        this.updateNavigationButtons();
    }

    resetQuiz() {
        this.currentQuestionIndex = 0;
        localStorage.removeItem('quizState');
        // Reset Firebase votes
        FirebaseVotes.resetAllVotes();
        this.saveState();
    }

    confirmReset() {
        if (confirm('⚠️ Tens a certeza que queres fazer reset a TUDO?\n\nIsto vai:\n- Apagar todos os votos\n- Voltar à primeira pergunta\n- Permitir que todos votem novamente')) {
            this.fullReset();
        }
    }

    async fullReset() {
        // Reset Firebase votes and state
        await FirebaseVotes.resetAllVotes();
        
        // Clear all localStorage
        localStorage.clear();
        
        // Reset local state
        this.currentQuestionIndex = 0;
        this.isShowingResults = false;
        
        // Save clean state to Firebase
        this.saveState();
        
        // Re-render
        this.renderQuestion();
        this.generateQRCode();
        this.updateNavigationButtons();
        
        alert('✅ Reset completo! Todos os votos foram apagados.');
        
        // Redirect to landing page
        window.location.href = 'index.html';
    }

    getCurrentQuestion() {
        return questions[this.currentQuestionIndex];
    }

    renderQuestion() {
        const question = this.getCurrentQuestion();
        
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('awardDescription').textContent = question.description || '';
        
        document.getElementById('qrSection').classList.remove('hidden');
        document.getElementById('winnerSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('finalResultsSection').classList.add('hidden');
        
        // Show navigation controls again
        document.querySelector('.navigation-controls').classList.remove('hidden');
        
        // Reset results state and update button
        this.isShowingResults = false;
        this.updateFinishButton();
        
        // Initialize votes for this question in Firebase
        FirebaseVotes.initializeQuestionVotes(question.id, question.options);
        
        this.updateResults();
        
        this.updateNavigationButtons();
    }

    generateQRCode() {
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        
        // Build vote URL properly for GitHub Pages
        const baseUrl = window.location.href.split('/').slice(0, -1).join('/');
        const voteUrl = baseUrl + '/vote.html';
        
        // Adjust QR size based on screen height for 720p compatibility
        const qrSize = window.innerHeight <= 720 ? 150 : 230;
        
        this.qrCodeInstance = new QRCode(qrContainer, {
            text: voteUrl,
            width: qrSize,
            height: qrSize,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        document.getElementById('voteUrl').textContent = voteUrl;
    }

    // Votes are now handled by Firebase real-time listeners
    // No need for polling anymore

    getVotes() {
        const question = this.getCurrentQuestion();
        
        // Return votes from Firebase (cached in this.votes)
        if (!this.votes[question.id]) {
            const initialVotes = {};
            question.options.forEach(option => {
                const optionText = this.getOptionText(option);
                initialVotes[optionText] = 0;
            });
            return { [question.id]: initialVotes };
        }
        
        return this.votes;
    }

    initializeVotes() {
        // This is now handled by Firebase
        return {};
    }

    getOptionText(option) {
        return typeof option === 'string' ? option : option.text;
    }

    getOptionImage(option) {
        return typeof option === 'string' ? null : option.image;
    }

    getOptionImagePosition(option) {
        // Returns custom position or default 'top'
        // Options: 'top', 'center', 'bottom', '20%', etc.
        return typeof option === 'string' ? 'top' : (option.imagePosition || 'top');
    }

    updateResults() {
        const question = this.getCurrentQuestion();
        const votes = this.getVotes();
        const questionVotes = votes[question.id];
        
        const totalVotes = Object.values(questionVotes).reduce((sum, count) => sum + count, 0);
        
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';
        
        if (question.options.length > 2) {
            container.className = 'options-container-grid';
        } else {
            container.className = '';
        }
        
        question.options.forEach(option => {
            const optionText = this.getOptionText(option);
            const optionImage = this.getOptionImage(option);
            const optionImagePosition = this.getOptionImagePosition(option);
            const voteCount = questionVotes[optionText] || 0;
            const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;
            
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            
            let imageHtml = '';
            if (optionImage) {
                imageHtml = `<img src="${optionImage}" alt="${optionText}" class="option-image" style="object-position: ${optionImagePosition};" onerror="this.style.display='none'">`;
            }
            
            // Only show stats after voting is concluded (isShowingResults = true)
            let statsHtml = '';
            let progressHtml = '';
            if (this.isShowingResults) {
                statsHtml = `
                    <div class="option-stats">
                        <span class="option-percentage">${percentage}%</span>
                        <span class="option-votes">${voteCount} votes</span>
                    </div>
                `;
                progressHtml = `
                    <div class="option-progress">
                        <div class="option-progress-fill" style="width: ${percentage}%"></div>
                    </div>
                `;
            }
            
            optionDiv.innerHTML = `
                <div class="option-content">
                    ${imageHtml}
                    <span class="option-text">${optionText}</span>
                    ${statsHtml}
                </div>
                ${progressHtml}
            `;
            
            container.appendChild(optionDiv);
        });
    }

    showFinalResults() {
        const question = this.getCurrentQuestion();
        const votes = this.getVotes();
        const questionVotes = votes[question.id];
        
        let maxVotes = 0;
        let winner = '';
        let winnerImage = null;
        
        question.options.forEach(option => {
            const optionText = this.getOptionText(option);
            const voteCount = questionVotes[optionText] || 0;
            if (voteCount > maxVotes) {
                maxVotes = voteCount;
                winner = optionText;
                winnerImage = this.getOptionImage(option);
            }
        });
        
        const totalVotes = Object.values(questionVotes).reduce((sum, count) => sum + count, 0);
        const winnerPercentage = totalVotes > 0 ? ((maxVotes / totalVotes) * 100).toFixed(1) : 0;
        
        document.getElementById('winnerOption').textContent = winner || 'No votes';
        document.getElementById('winnerVotes').textContent = maxVotes;
        document.getElementById('winnerPercentage').textContent = winnerPercentage;
        
        const winnerAnnouncement = document.querySelector('.winner-announcement');
        const existingImage = winnerAnnouncement.querySelector('.winner-image');
        if (existingImage) {
            existingImage.remove();
        }
        
        if (winnerImage) {
            const winnerImg = document.createElement('img');
            winnerImg.src = winnerImage;
            winnerImg.alt = winner;
            winnerImg.className = 'winner-image';
            winnerImg.onerror = function() { this.style.display = 'none'; };
            
            const winnerOptionElement = document.getElementById('winnerOption');
            winnerAnnouncement.insertBefore(winnerImg, winnerOptionElement);
        }
        
        // Sort options by votes
        const sortedOptions = [...question.options].sort((a, b) => {
            const votesA = questionVotes[this.getOptionText(a)] || 0;
            const votesB = questionVotes[this.getOptionText(b)] || 0;
            return votesB - votesA;
        });
        
        const container = document.getElementById('finalOptionsContainer');
        container.innerHTML = '';
        
        if (sortedOptions.length > 2) {
            container.className = 'options-container-grid';
        } else {
            container.className = '';
        }
        
        sortedOptions.forEach(option => {
            const optionText = this.getOptionText(option);
            const optionImage = this.getOptionImage(option);
            const optionImagePosition = this.getOptionImagePosition(option);
            const voteCount = questionVotes[optionText] || 0;
            const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;
            const isWinner = optionText === winner;
            
            const optionDiv = document.createElement('div');
            optionDiv.className = isWinner ? 'option-item winner-highlight' : 'option-item';
            
            let imageHtml = '';
            if (optionImage) {
                imageHtml = `<img src="${optionImage}" alt="${optionText}" class="option-image" style="object-position: ${optionImagePosition};" onerror="this.style.display='none'">`;
            }
            
            optionDiv.innerHTML = `
                <div class="option-content">
                    ${imageHtml}
                    <span class="option-text">${isWinner ? '🏆 ' : ''}${optionText}</span>
                    <div class="option-stats">
                        <span class="option-percentage">${percentage}%</span>
                        <span class="option-votes">${voteCount} votos</span>
                    </div>
                </div>
                <div class="option-progress">
                    <div class="option-progress-fill ${isWinner ? 'winner' : ''}" style="width: ${percentage}%"></div>
                </div>
            `;
            
            container.appendChild(optionDiv);
        });
        
        // Hide QR section and show winner section in its place
        document.getElementById('qrSection').classList.add('hidden');
        document.getElementById('winnerSection').classList.remove('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('finalResultsSection').classList.remove('hidden');
        
        // Update state and button
        this.isShowingResults = true;
        this.updateFinishButton();
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= questions.length) {
            this.resetQuiz();
            this.currentQuestionIndex = 0;
        }
        
        this.changeQuestion();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
