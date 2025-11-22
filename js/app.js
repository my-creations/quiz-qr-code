// Aplicação Principal - Painel de Controle e Resultados

class QuizApp {
    constructor() {
        this.currentQuestionIndex = 0;
        this.timer = null;
        this.timeRemaining = 0;
        this.qrCodeInstance = null;
        this.isPaused = false;
        this.lastUpdateTime = Date.now();
        
        this.init();
    }

    init() {
        // Inicializar estado
        this.loadState();
        
        // Renderizar pergunta atual
        this.renderQuestion();
        
        // Gerar QR Code
        this.generateQRCode();
        
        // Iniciar timer
        this.startTimer();
        
        // Iniciar polling de votos
        this.startVotePolling();
        
        // Event listeners
        document.getElementById('continueButton').addEventListener('click', () => this.nextQuestion());
        document.getElementById('pauseButton').addEventListener('click', () => this.togglePause());
        document.getElementById('prevButton').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextButton').addEventListener('click', () => this.skipToNextQuestion());
        document.getElementById('fullscreenButton').addEventListener('click', () => this.toggleFullscreen());
        
        // Escutar mudanças no storage (de outras abas)
        window.addEventListener('storage', (e) => {
            if (e.key === 'quizVotes') {
                this.updateResults();
            }
        });
        
        // Escutar mudanças no estado fullscreen
        document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('mozfullscreenchange', () => this.updateFullscreenButton());
        document.addEventListener('MSFullscreenChange', () => this.updateFullscreenButton());
        
        // Atualizar botões de navegação
        this.updateNavigationButtons();
    }

    toggleFullscreen() {
        const elem = document.documentElement;
        
        if (!document.fullscreenElement && !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && !document.msFullscreenElement) {
            // Entrar em fullscreen
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
            // Sair do fullscreen
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
            button.textContent = 'Sair Fullscreen';
        } else {
            button.textContent = 'Fullscreen';
        }
    }

    loadState() {
        const state = localStorage.getItem('quizState');
        if (state) {
            const parsed = JSON.parse(state);
            this.currentQuestionIndex = parsed.currentQuestionIndex || 0;
            this.timeRemaining = parsed.timeRemaining || questions[this.currentQuestionIndex].duration;
            this.isPaused = parsed.isPaused || false;
        } else {
            this.resetQuiz();
        }
    }

    saveState() {
        const state = {
            currentQuestionIndex: this.currentQuestionIndex,
            timeRemaining: this.timeRemaining,
            isPaused: this.isPaused
        };
        localStorage.setItem('quizState', JSON.stringify(state));
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.saveState();
        this.updatePauseButton();
    }

    updatePauseButton() {
        const pauseButton = document.getElementById('pauseButton');
        if (this.isPaused) {
            pauseButton.textContent = 'Retomar';
            pauseButton.classList.add('paused');
        } else {
            pauseButton.textContent = 'Pausar';
            pauseButton.classList.remove('paused');
        }
    }

    updateNavigationButtons() {
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        
        // Desabilitar botão anterior se for a primeira pergunta
        prevButton.disabled = this.currentQuestionIndex === 0;
        
        // Desabilitar botão próxima se for a última pergunta
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
        // Parar timer atual
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Resetar estado
        this.timeRemaining = questions[this.currentQuestionIndex].duration;
        this.isPaused = false;
        
        // Salvar estado
        this.saveState();
        
        // Renderizar nova pergunta
        this.renderQuestion();
        
        // Gerar novo QR Code
        this.generateQRCode();
        
        // Iniciar timer
        this.startTimer();
        
        // Atualizar botões
        this.updateNavigationButtons();
        this.updatePauseButton();
    }

    resetQuiz() {
        this.currentQuestionIndex = 0;
        this.timeRemaining = questions[0].duration;
        localStorage.removeItem('quizVotes');
        localStorage.removeItem('quizState');
        this.saveState();
    }

    getCurrentQuestion() {
        return questions[this.currentQuestionIndex];
    }

    renderQuestion() {
        const question = this.getCurrentQuestion();
        
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('awardDescription').textContent = question.description || '';
        
        // Mostrar seção de pergunta e esconder resultados finais
        document.getElementById('timerSection').classList.remove('hidden');
        document.getElementById('qrSection').classList.remove('hidden');
        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('finalResultsSection').classList.add('hidden');
        
        // Renderizar opções
        this.updateResults();
        
        // Atualizar botões
        this.updateNavigationButtons();
        this.updatePauseButton();
    }

    generateQRCode() {
        // Limpar QR Code anterior
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        
        // URL de votação (ajustar para o GitHub Pages depois do deploy)
        const voteUrl = window.location.href.replace('index.html', 'vote.html').replace(/\/$/, '') + '/vote.html';
        
        // Gerar QR Code
        this.qrCodeInstance = new QRCode(qrContainer, {
            text: voteUrl,
            width: 230,
            height: 230,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Mostrar URL
        document.getElementById('voteUrl').textContent = voteUrl;
    }

    startTimer() {
        // Limpar timer anterior se existir
        if (this.timer) {
            clearInterval(this.timer);
        }

        // Atualizar display imediatamente
        this.updateTimerDisplay();
        
        // Guardar tempo da última atualização
        this.lastUpdateTime = Date.now();

        // Iniciar contagem regressiva
        this.timer = setInterval(() => {
            // Só decrementar tempo se não estiver pausado
            if (!this.isPaused) {
                const now = Date.now();
                const elapsed = now - this.lastUpdateTime;
                this.lastUpdateTime = now;
                
                this.timeRemaining -= elapsed;

                if (this.timeRemaining <= 0) {
                    this.timeRemaining = 0;
                    this.endVoting();
                }
            } else {
                // Atualizar tempo da última atualização mesmo quando pausado
                this.lastUpdateTime = Date.now();
            }

            this.updateTimerDisplay();
            this.saveState();
        }, 100);
    }

    updateTimerDisplay() {
        const seconds = Math.ceil(this.timeRemaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        const display = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        const timerElement = document.getElementById('timerDisplay');
        timerElement.textContent = display;
        
        // Mudar cor baseado no tempo
        timerElement.classList.remove('warning', 'danger');
        if (seconds <= 10) {
            timerElement.classList.add('danger');
        } else if (seconds <= 30) {
            timerElement.classList.add('warning');
        }
        
    }

    startVotePolling() {
        // Atualizar resultados a cada 500ms
        setInterval(() => {
            this.updateResults();
        }, 500);
    }

    getVotes() {
        const votesData = localStorage.getItem('quizVotes');
        if (!votesData) {
            return this.initializeVotes();
        }
        
        const votes = JSON.parse(votesData);
        const question = this.getCurrentQuestion();
        
        // Verificar se já existem votos para esta pergunta
        if (!votes[question.id]) {
            votes[question.id] = {};
            question.options.forEach(option => {
                const optionText = this.getOptionText(option);
                votes[question.id][optionText] = 0;
            });
            localStorage.setItem('quizVotes', JSON.stringify(votes));
        }
        
        return votes;
    }

    initializeVotes() {
        const votes = {};
        questions.forEach(question => {
            votes[question.id] = {};
            question.options.forEach(option => {
                const optionText = typeof option === 'string' ? option : option.text;
                votes[question.id][optionText] = 0;
            });
        });
        localStorage.setItem('quizVotes', JSON.stringify(votes));
        return votes;
    }

    getOptionText(option) {
        return typeof option === 'string' ? option : option.text;
    }

    getOptionImage(option) {
        return typeof option === 'string' ? null : option.image;
    }

    updateResults() {
        const question = this.getCurrentQuestion();
        const votes = this.getVotes();
        const questionVotes = votes[question.id];
        
        // Calcular total de votos
        const totalVotes = Object.values(questionVotes).reduce((sum, count) => sum + count, 0);
        
        // Renderizar opções
        const container = document.getElementById('optionsContainer');
        container.innerHTML = '';
        
        // Adicionar classe de grid se houver mais de 2 opções
        if (question.options.length > 2) {
            container.className = 'options-container-grid';
        } else {
            container.className = '';
        }
        
        question.options.forEach(option => {
            const optionText = this.getOptionText(option);
            const optionImage = this.getOptionImage(option);
            const voteCount = questionVotes[optionText] || 0;
            const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;
            
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            
            let imageHtml = '';
            if (optionImage) {
                imageHtml = `<img src="${optionImage}" alt="${optionText}" class="option-image" onerror="this.style.display='none'">`;
            }
            
            optionDiv.innerHTML = `
                <div class="option-content">
                    ${imageHtml}
                    <span class="option-text">${optionText}</span>
                    <div class="option-stats">
                        <span class="option-percentage">${percentage}%</span>
                        <span class="option-votes">${voteCount} votos</span>
                    </div>
                </div>
                <div class="option-progress">
                    <div class="option-progress-fill" style="width: ${percentage}%"></div>
                </div>
            `;
            
            container.appendChild(optionDiv);
        });
    }

    endVoting() {
        // Parar timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Mostrar resultados finais
        this.showFinalResults();
    }

    showFinalResults() {
        const question = this.getCurrentQuestion();
        const votes = this.getVotes();
        const questionVotes = votes[question.id];
        
        // Calcular vencedor
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
        
        // Atualizar UI
        document.getElementById('winnerOption').textContent = winner || 'Nenhum voto';
        document.getElementById('winnerVotes').textContent = maxVotes;
        document.getElementById('winnerPercentage').textContent = winnerPercentage;
        
        // Adicionar imagem do vencedor se existir
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
        
        // Renderizar todos os resultados
        const container = document.getElementById('finalOptionsContainer');
        container.innerHTML = '';
        
        // Adicionar classe de grid
        if (sortedOptions.length > 2) {
            container.className = 'options-container-grid';
        } else {
            container.className = '';
        }
        
        sortedOptions.forEach(option => {
            const optionText = this.getOptionText(option);
            const optionImage = this.getOptionImage(option);
            const voteCount = questionVotes[optionText] || 0;
            const percentage = totalVotes > 0 ? ((voteCount / totalVotes) * 100).toFixed(1) : 0;
            
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            
            let imageHtml = '';
            if (optionImage) {
                imageHtml = `<img src="${optionImage}" alt="${optionText}" class="option-image" onerror="this.style.display='none'">`;
            }
            
            optionDiv.innerHTML = `
                <div class="option-content">
                    ${imageHtml}
                    <span class="option-text">${optionText}</span>
                    <div class="option-stats">
                        <span class="option-percentage">${percentage}%</span>
                        <span class="option-votes">${voteCount} votos</span>
                    </div>
                </div>
                <div class="option-progress">
                    <div class="option-progress-fill" style="width: ${percentage}%"></div>
                </div>
            `;
            
            container.appendChild(optionDiv);
        });
        
        // Esconder seções e mostrar resultados
        document.getElementById('questionSection').classList.add('hidden');
        document.getElementById('timerSection').classList.add('hidden');
        document.getElementById('qrSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('finalResultsSection').classList.remove('hidden');
        
        // Atualizar botão de continuar
        const continueButton = document.getElementById('continueButton');
        if (this.currentQuestionIndex >= questions.length - 1) {
            continueButton.textContent = '🔄 Reiniciar Quiz';
        } else {
            continueButton.textContent = 'Continuar para Próxima Pergunta →';
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        // Se chegou ao fim, reiniciar
        if (this.currentQuestionIndex >= questions.length) {
            this.resetQuiz();
            this.currentQuestionIndex = 0;
        }
        
        // Usar método comum de mudança de pergunta
        this.changeQuestion();
    }
}

// Inicializar app quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
