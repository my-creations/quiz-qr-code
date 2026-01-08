class RaffleWheel {
    constructor(container) {
        this.container = container;
        this.participants = this.getAllParticipants();
        this.isSpinning = false;
        this.winner = null;
        this.rotation = 0;
        this.animationId = null;
        this.faceInterval = null;
        
        // Sound effects
        this.sounds = {
            tick: null,
            drumroll: null,
            winner: null
        };
        this.loadSounds();
        
        this.init();
    }

    loadSounds() {
        // Load sounds - will fail silently if files don't exist
        try {
            this.sounds.tick = new Audio('sounds/tick.mp3');
            this.sounds.tick.volume = 0.3;
            this.sounds.winner = new Audio('sounds/winner.mp3');
            this.sounds.winner.volume = 0.7;
        } catch (e) {
            console.log('Sound files not found, continuing without sound');
        }
    }

    getAllParticipants() {
        const participantsMap = new Map();
        
        questions.forEach(q => {
            q.options.forEach(opt => {
                const name = typeof opt === 'string' ? opt : opt.text;
                const image = typeof opt === 'string' ? null : opt.image;
                const imagePosition = typeof opt === 'string' ? 'center' : (opt.imagePosition || 'center');
                if (image && !participantsMap.has(name)) {
                    participantsMap.set(name, { image, imagePosition });
                }
            });
        });
        
        return Array.from(participantsMap, ([name, data]) => ({ 
            name, 
            image: data.image, 
            imagePosition: data.imagePosition 
        }));
    }

    init() {
        this.createElements();
        this.drawWheel();
    }

    createElements() {
        // Adjust size for 720p compatibility
        const canvasSize = window.innerHeight <= 720 ? 320 : 450;
        
        this.container.innerHTML = `
            <div class="raffle-title">
                <h2>🎰 SORTEIO ESPECIAL</h2>
            </div>
            
            <div class="raffle-wheel-wrapper">
                <div class="raffle-wheel-container">
                    <div class="raffle-pointer">▼</div>
                    <canvas id="raffleCanvas" width="${canvasSize}" height="${canvasSize}"></canvas>
                    <div class="raffle-center-circle">
                        <img id="raffleCenterFace" src="" alt="Participante">
                    </div>
                </div>
            </div>
            
            <div class="raffle-winner-display hidden" id="raffleWinnerDisplay">
                <div class="raffle-winner-content">
                    <h3>🏆 O Vencedor do Sorteio é</h3>
                    <div class="raffle-winner-photo">
                        <img id="raffleWinnerImage" src="" alt="Vencedor">
                    </div>
                    <p class="raffle-winner-name" id="raffleWinnerName"></p>
                </div>
            </div>
            
            <div class="raffle-controls">
                <button class="raffle-button" id="startRaffleButton">
                    🎰 Iniciar Sorteio
                </button>
                <button class="raffle-button secondary hidden" id="spinAgainButton">
                    🔄 Sortear Novamente
                </button>
            </div>
        `;

        this.canvas = document.getElementById('raffleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.centerFace = document.getElementById('raffleCenterFace');
        this.winnerDisplay = document.getElementById('raffleWinnerDisplay');
        this.winnerImage = document.getElementById('raffleWinnerImage');
        this.winnerName = document.getElementById('raffleWinnerName');
        this.startButton = document.getElementById('startRaffleButton');
        this.spinAgainButton = document.getElementById('spinAgainButton');

        this.startButton.addEventListener('click', () => this.spin());
        this.spinAgainButton.addEventListener('click', () => this.resetAndSpin());
        
        // Show random initial face
        this.showRandomFace();
    }

    showRandomFace() {
        const randomParticipant = this.participants[Math.floor(Math.random() * this.participants.length)];
        this.centerFace.src = randomParticipant.image;
        this.centerFace.style.objectPosition = randomParticipant.imagePosition;
    }

    drawWheel() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        const numParticipants = this.participants.length;
        const anglePerSlice = (2 * Math.PI) / numParticipants;
        
        // Colors alternating gold and dark red (Oscar theme)
        const colors = ['#d4af37', '#8b0000', '#ffd700', '#a52a2a'];
        
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save current state and apply rotation
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.rotation);
        ctx.translate(-centerX, -centerY);
        
        // Draw wheel slices
        this.participants.forEach((participant, i) => {
            const startAngle = i * anglePerSlice;
            const endAngle = (i + 1) * anglePerSlice;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw profile image in slice
            const midAngle = startAngle + anglePerSlice / 2;
            const imgRadius = radius * 0.7;
            const imgX = centerX + imgRadius * Math.cos(midAngle);
            const imgY = centerY + imgRadius * Math.sin(midAngle);
            const imgSize = Math.min(50, (radius * anglePerSlice) / 2);
            
            // Draw circular image placeholder
            ctx.save();
            ctx.beginPath();
            ctx.arc(imgX, imgY, imgSize / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();
            
            // Try to draw image if loaded
            const img = this.loadedImages?.[i];
            if (img && img.complete) {
                ctx.drawImage(img, imgX - imgSize / 2, imgY - imgSize / 2, imgSize, imgSize);
            } else {
                // Placeholder circle
                ctx.fillStyle = '#333';
                ctx.fill();
            }
            ctx.restore();
        });
        
        // Draw outer ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 8;
        ctx.stroke();
        
        // Draw inner circle (will be covered by center face)
        ctx.beginPath();
        ctx.arc(centerX, centerY, 70, 0, 2 * Math.PI);
        ctx.fillStyle = '#1a1a2e';
        ctx.fill();
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        ctx.restore();
    }

    preloadImages() {
        return new Promise((resolve) => {
            this.loadedImages = [];
            let loadedCount = 0;
            
            this.participants.forEach((participant, i) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === this.participants.length) {
                        this.drawWheel();
                        resolve();
                    }
                };
                img.src = participant.image;
                this.loadedImages[i] = img;
            });
        });
    }

    async spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.startButton.disabled = true;
        this.winnerDisplay.classList.add('hidden');
        this.spinAgainButton.classList.add('hidden');
        
        // Preload images first
        await this.preloadImages();
        
        // Play tick sound during spin (loop it)
        this.playSound('tick', true);
        
        // Random winner
        const winnerIndex = Math.floor(Math.random() * this.participants.length);
        this.winner = this.participants[winnerIndex];
        
        // Calculate final rotation
        // We want the winner slice to be at the top (pointer position)
        const anglePerSlice = (2 * Math.PI) / this.participants.length;
        const winnerAngle = winnerIndex * anglePerSlice + anglePerSlice / 2;
        // We need to rotate so winner is at top (-PI/2 position)
        // Add multiple full rotations for effect
        const extraRotations = 6 + Math.random() * 3; // 6-9 full rotations
        const targetRotation = (extraRotations * 2 * Math.PI) + (2 * Math.PI - winnerAngle) - Math.PI / 2;
        
        const duration = 6000; // 6 seconds
        const startTime = Date.now();
        const startRotation = this.rotation;
        
        // Start face cycling
        this.startFaceCycling(duration);
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function - slow down at the end
            const easeOut = 1 - Math.pow(1 - progress, 4);
            
            this.rotation = startRotation + (targetRotation * easeOut);
            this.drawWheel();
            
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.spinComplete();
            }
        };
        
        this.animationId = requestAnimationFrame(animate);
    }

    startFaceCycling(duration) {
        let index = 0;
        let interval = 50; // Start fast
        
        const cycle = () => {
            if (!this.isSpinning) return;
            
            const participant = this.participants[index % this.participants.length];
            this.centerFace.src = participant.image;
            this.centerFace.style.objectPosition = participant.imagePosition;
            index++;
            
            // Slow down the cycling as time progresses
            const elapsed = Date.now() - this.cycleStartTime;
            const progress = elapsed / duration;
            interval = 50 + (progress * 400); // Slow from 50ms to 450ms
            
            if (elapsed < duration - 500) {
                this.faceInterval = setTimeout(cycle, interval);
            }
        };
        
        this.cycleStartTime = Date.now();
        cycle();
    }

    spinComplete() {
        this.isSpinning = false;
        this.startButton.disabled = false;
        
        // Stop tick sound
        this.stopSound('tick');
        
        // Show winner face in center
        this.centerFace.src = this.winner.image;
        this.centerFace.style.objectPosition = this.winner.imagePosition;
        
        // Play winner sound
        setTimeout(() => {
            this.playSound('winner');
            this.showWinner();
        }, 500);
    }

    showWinner() {
        this.winnerImage.src = this.winner.image;
        this.winnerImage.style.objectPosition = this.winner.imagePosition;
        this.winnerName.textContent = this.winner.name;
        this.winnerDisplay.classList.remove('hidden');
        this.spinAgainButton.classList.remove('hidden');
        this.startButton.classList.add('hidden');
        
        // Add celebration animation
        this.winnerDisplay.classList.add('celebrate');
        setTimeout(() => {
            this.winnerDisplay.classList.remove('celebrate');
        }, 2000);
    }

    resetAndSpin() {
        this.winnerDisplay.classList.add('hidden');
        this.spinAgainButton.classList.add('hidden');
        this.startButton.classList.remove('hidden');
        this.winner = null;
        this.showRandomFace();
        
        // Small delay then spin
        setTimeout(() => this.spin(), 300);
    }

    reset() {
        // Cancel any ongoing animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.faceInterval) {
            clearTimeout(this.faceInterval);
            this.faceInterval = null;
        }
        
        // Stop all sounds
        this.stopSound('drumroll');
        this.stopSound('tick');
        this.stopSound('winner');
        
        // Reset state
        this.isSpinning = false;
        this.winner = null;
        this.rotation = 0;
        
        // Reset UI
        this.startButton.disabled = false;
        this.startButton.classList.remove('hidden');
        this.spinAgainButton.classList.add('hidden');
        this.winnerDisplay.classList.add('hidden');
        
        // Redraw wheel and show random face
        this.drawWheel();
        this.showRandomFace();
    }

    playSound(soundName, loop = false) {
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                sound.currentTime = 0;
                sound.loop = loop;
                sound.play().catch(() => {});
            }
        } catch (e) {
            // Ignore sound errors
        }
    }

    stopSound(soundName) {
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                sound.loop = false;
                sound.pause();
                sound.currentTime = 0;
            }
        } catch (e) {
            // Ignore sound errors
        }
    }

    hide() {
        this.container.classList.add('hidden');
    }

    show() {
        this.container.classList.remove('hidden');
    }
}
