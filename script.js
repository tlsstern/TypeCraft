class TypingTest {
    constructor() {
        this.words = [];
        this.textDisplay = document.getElementById('text-display');

        // XP Bar elements
        this.xpBarFill = document.getElementById('xpBarFill');
        this.accuracyDisplay = document.getElementById('accuracy');

        // Handle missing display elements gracefully
        if (!this.xpBarFill) {
            console.warn('XP bar element not found');
        }
        if (!this.accuracyDisplay) {
            console.warn('Accuracy display element not found');
        }

        this.restartBtn = document.getElementById('restart');
        this.resultsModal = document.getElementById('resultsModal');
        this.wpmResult = document.getElementById('wpmResult');
        this.accuracyResult = document.getElementById('accuracyResult');
        this.totalCharsResult = document.getElementById('totalCharsResult');
        this.correctCharsResult = document.getElementById('correctCharsResult');
        this.incorrectCharsResult = document.getElementById('incorrectCharsResult');
        this.playAgainBtn = document.getElementById('playAgainBtn');

        // Get time limit from localStorage or default to 60 seconds
        const savedTime = localStorage.getItem('selectedTime');
        this.timeLimit = savedTime ? parseInt(savedTime) : 60;

        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.mistakes = new Set();
        this.permanentErrors = 0; // Count of all mistakes made (never decreases)
        this.startTime = null;
        this.isTestActive = false;
        this.timer = null;

        this.currentText = '';
        this.charsPerLine = 70;
        this.updateCharsPerLine();
        this.statsTimer = null;
        this.themeSelect = document.getElementById('themeSelect');

        this.typingArea = document.querySelector('.typing-area');

        this.applyMinecraftTheme();

        this.initializeEventListeners();

        this.initializeTest();

        this.applyMinecraftTheme();

        this.playAgainBtn.addEventListener('click', () => {
            this.closeResultsModal();
            this.restartTest();
        });

        const backToMenuBtn = document.getElementById('backToMenu');
        const backToMenuFromResultsBtn = document.getElementById('backToMenuBtn');
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
        if (backToMenuFromResultsBtn) {
            backToMenuFromResultsBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        this.wpmHistory = [];
        this.lastWpmUpdate = null;
        this.lastWord = '';

        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.virtualKeyboard = document.getElementById('virtualKeyboard');
        this.mobileInput = document.getElementById('mobileInput');

        if (this.isMobile) {
            this.initializeMobileSupport();
        }

        window.addEventListener('resize', () => {
            this.updateCharsPerLine();
            this.renderText();
        });

        this.titleElement = document.querySelector('.title h1');
        this.originalTitle = this.titleElement.textContent;
    }

    async initializeTest() {
        this.textDisplay.innerHTML = '<span class="loading-text">Loading text...</span>';

        await this.fetchSourceText();

        this.generateInitialText();
    }

    async fetchSourceText() {
        try {
            const response = await fetch('mcitems.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();

            this.sentences = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);

            this.words = this.sentences.join(' ').split(/\s+/).filter(w => w.length > 0);

        } catch (error) {
            console.error('Could not load mcitems.txt:', error);
            this.textDisplay.innerHTML = '<span class="error-text">Error loading text source. Check console for details.</span>';
            this.words = ["Error", "loading", "text", "source", "please", "check", "mcitems.txt", "file", "and", "path"];
            this.sentences = [this.words.join(' ')];
        }
    }

    initializeEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.restartBtn.focus();

                return;
            }

            if (e.key === 'Enter' && document.activeElement === this.restartBtn) {
                e.preventDefault();
                this.restartTest();
                return;
            }

            if (this.resultsModal.style.display === 'flex') {
                if (e.key === 'Escape') {
                    this.closeResultsModal();
                    this.restartTest();
                }
                return;
            }

            if (e.key === 'Backspace') {
                e.preventDefault();
                if (this.isTestActive && this.currentIndex > 0) {
                    this.handleBackspace(e.ctrlKey);
                }
                return;
            }

            if (!this.isTestActive && e.key.length === 1 && this.words.length > 0) {
                this.startTest();
            }

            if (this.isTestActive && !this.typingArea.contains(document.activeElement)) {
                e.preventDefault();
                this.typingArea.focus();
            }
        });

        document.addEventListener('keypress', (e) => {
            if (this.resultsModal.style.display === 'flex') return;

            if (!this.isTestActive) return;

            if (e.key.length === 1) {
                this.checkCharacter(e.key);
            }
        });

        this.restartBtn.addEventListener('click', () => this.restartTest());

        this.restartBtn.addEventListener('mousedown', (e) => {
            if (this.isTestActive) {
                e.preventDefault();
            }
        });

        if (this.themeSelect) {
            this.themeSelect.addEventListener('mousedown', (e) => {
                if (this.isTestActive) {
                    e.preventDefault();
                }
            });
        }
    }


    generateInitialText() {
        if (this.sentences && this.sentences.length > 0) {
            let initialSentences = [];
            for (let i = 0; i < 10; i++) {
                initialSentences.push(this.sentences[Math.floor(Math.random() * this.sentences.length)]);
            }
            this.currentText = initialSentences.join(' ');
        } else {
            this.currentText = this.generateWords(200).join(' ');
        }

        this.renderText();
    }

    generateWords(count) {
        if (this.sentences && this.sentences.length > 0) {
            return [this.sentences[Math.floor(Math.random() * this.sentences.length)]];
        } else {
            const words = [];
            for (let i = 0; i < count; i++) {
                let newWord;
                do {
                    newWord = this.words[Math.floor(Math.random() * this.words.length)];
                } while (newWord === this.lastWord);

                words.push(newWord);
                this.lastWord = newWord;
            }
            return words;
        }
    }


    checkCharacter(key) {
        if (!this.isTestActive || this.resultsModal.style.display === 'flex') return;

        const currentChar = this.currentText[this.currentIndex];

        if (key === ' ') {
            // Only allow space when expected
            if (currentChar === ' ') {
                this.correctChars++;
                this.currentIndex++;
                this.totalChars++;
                if (window.typeCraftSounds) {
                    window.typeCraftSounds.playCorrect();
                }
            } else {
                // Pressing space at wrong time counts as mistake
                this.mistakes.add(this.currentIndex);
                this.permanentErrors++; // Track permanent error
                this.currentIndex++;
                this.totalChars++;
                if (window.typeCraftSounds) {
                    window.typeCraftSounds.playIncorrect();
                }
            }

            this.renderText();
            this.updateStats();
            return;
        }

        if (key.toLowerCase() === currentChar.toLowerCase()) {
            this.correctChars++;
            if (window.typeCraftSounds) {
                window.typeCraftSounds.playCorrect();
            }
        } else {
            this.mistakes.add(this.currentIndex);
            this.permanentErrors++; // Track permanent error
            if (window.typeCraftSounds) {
                window.typeCraftSounds.playIncorrect();
            }
        }

        this.currentIndex++;
        this.totalChars++;

        if (this.isMobile && navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Add more text when getting close to the end (within 3 lines)
        if (this.currentIndex >= this.currentText.length - (this.charsPerLine * 3)) {
            if (this.sentences && this.sentences.length > 0) {
                // Add 2 more sentences
                for (let i = 0; i < 2; i++) {
                    this.currentText += ' ' + this.sentences[Math.floor(Math.random() * this.sentences.length)];
                }
            } else {
                this.currentText += ' ' + this.generateWords(20).join(' ');
            }
        }

        this.renderText();
        this.updateStats();
    }


    renderText() {
        const words = this.currentText.split(' ');
        let lines = [];
        let currentLine = '';
        let charCount = 0;
        let startCharIndex = 0;

        // Build all lines with character tracking
        for (let word of words) {
            if (currentLine.length == 0 || (currentLine + ' ' + word).length <= this.charsPerLine) {
                currentLine += (currentLine.length > 0 ? ' ' : '') + word;
            } else {
                lines.push({ text: currentLine, startIndex: charCount });
                charCount += currentLine.length + 1; // +1 for newline
                currentLine = word;
            }
        }

        if (currentLine) {
            lines.push({ text: currentLine, startIndex: charCount });
        }

        // Determine which lines to show (scroll effect)
        let startLine = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startIndex <= this.currentIndex &&
                (i === lines.length - 1 || lines[i + 1].startIndex > this.currentIndex)) {
                startLine = Math.max(0, i - 1); // Show current line and one line before
                break;
            }
        }

        // Get up to 4 visible lines starting from startLine
        const visibleLines = lines.slice(startLine, startLine + 4);
        startCharIndex = visibleLines.length > 0 ? visibleLines[0].startIndex : 0;

        // Join visible lines and render
        const visibleText = visibleLines.map(line => line.text).join('\n');
        const visibleChars = visibleText.split('');

        this.textDisplay.innerHTML = visibleChars.map((char, index) => {
            const globalIndex = startCharIndex + index;
            let classes = ['char'];

            if (globalIndex < this.currentIndex) {
                if (this.mistakes.has(globalIndex)) {
                    classes.push('incorrect');
                } else {
                    classes.push('correct');
                }
            } else if (globalIndex === this.currentIndex) {
                classes.push('active');
            }

            if (char === '\n') {
                return '<br>';
            }

            return `<span class="${classes.join(' ')}">${char}</span>`;
        }).join('');
    }

    handleBackspace(isCtrlPressed) {
        if (this.currentIndex > 0) {
            // No sound for backspace

            if (isCtrlPressed) {
                let newIndex = this.currentIndex;

                while (newIndex > 0 && this.currentText[newIndex - 1] === ' ') {
                    newIndex--;
                }

                while (newIndex > 0 && this.currentText[newIndex - 1] !== ' ') {
                    newIndex--;
                }

                while (this.currentIndex > newIndex) {
                    this.currentIndex--;
                    // Remove visual mistake indicator but don't decrease error count
                    if (this.mistakes.has(this.currentIndex)) {
                        this.mistakes.delete(this.currentIndex);
                    } else {
                        this.correctChars--;
                    }
                    // Don't decrease totalChars - keep permanent record
                }
            } else {
                this.currentIndex--;

                // Remove visual mistake indicator but don't decrease error count
                if (this.mistakes.has(this.currentIndex)) {
                    this.mistakes.delete(this.currentIndex);
                } else {
                    this.correctChars--;
                }
                // Don't decrease totalChars - keep permanent record
            }

            this.renderText();
            this.updateStats();
        }
    }

    startTest() {
        if (this.isTestActive) return;
        this.isTestActive = true;
        this.startTime = new Date();
        this.timer = setInterval(() => this.updateTime(), 1000);
        this.statsTimer = setInterval(() => this.updateStats(), 100);

        if (window.typeCraftSounds) {
            window.typeCraftSounds.playStart();
        }

        this.typingArea.focus();

        this.typingArea.setAttribute('tabindex', '-1');

        if (this.isMobile) {
            this.mobileInput.focus();
        }
    }

    updateTime() {
        const timeElapsed = Math.floor((new Date() - this.startTime) / 1000);
        const timeLeft = this.timeLimit - timeElapsed;

        // Update XP bar fill based on time progress
        const progress = (timeElapsed / this.timeLimit) * 100;
        if (this.xpBarFill) {
            this.xpBarFill.style.width = Math.min(progress, 100) + '%';
        }

        if (timeLeft <= 0) {
            this.endTest();
        }
    }

    updateStats() {
        if (!this.startTime || !this.isTestActive) return;

        const now = new Date();
        const timeElapsed = (now - this.startTime) / 1000 / 60;
        const wpm = Math.round((this.correctChars / 5) / timeElapsed) || 0;

        if (this.isTestActive && (!this.lastWpmUpdate || (now - this.lastWpmUpdate) >= 1000)) {
            this.recordWPM();
            this.lastWpmUpdate = now;
        }
    }

    async endTest() {
        // Prevent double execution
        if (!this.isTestActive) return;

        clearInterval(this.timer);
        clearInterval(this.statsTimer);
        this.isTestActive = false;

        if (window.typeCraftSounds) {
            window.typeCraftSounds.playComplete();
        }

        // Calculate actual time elapsed in minutes
        const actualTimeElapsed = this.startTime ?
            (new Date() - this.startTime) / 1000 / 60 :
            this.timeLimit / 60;

        const finalWpm = Math.round((this.correctChars / 5) / actualTimeElapsed) || 0;
        // Use permanent errors for final accuracy
        const finalAccuracy = this.totalChars > 0
            ? Math.round(((this.totalChars - this.permanentErrors) / this.totalChars) * 100)
            : 100;

        const sessionData = {
            wpm: finalWpm,
            accuracy: finalAccuracy,
            rawWpm: finalWpm,
            duration: this.timeLimit,
            charactersTyped: this.totalChars,
            errors: this.permanentErrors, // Use permanent error count
            testType: this.timeLimit + 's',
            language: 'en'
        };

        if (window.supabaseData && !window.authCheck.isGuest()) {
            try {
                const saveResult = await window.supabaseData.saveTypingSession(sessionData);
                if (saveResult.error) {
                    console.error('Error saving session:', saveResult.error);
                } else {
                    console.log('Session saved successfully');
                }
            } catch (error) {
                console.error('Error saving to database:', error);
            }
        }

        this.showResultsModal(finalWpm, finalAccuracy, this.wpmHistory);
    }

    async showResultsModal(finalWpm, finalAccuracy, finalWpmHistory) {
        document.querySelector('.container').classList.add('hide');

        let userStats = null;
        if (window.supabaseData && !window.authCheck.isGuest()) {
            try {
                const statsResult = await window.supabaseData.getUserStats();
                if (!statsResult.error && statsResult.data) {
                    userStats = statsResult.data;
                }
            } catch (error) {
                console.error('Error loading user stats:', error);
            }
        }

        setTimeout(() => {
            this.wpmResult.textContent = finalWpm;
            this.accuracyResult.textContent = `${finalAccuracy}%`;
            this.totalCharsResult.textContent = this.totalChars;
            this.correctCharsResult.textContent = this.totalChars - this.permanentErrors;
            this.incorrectCharsResult.textContent = this.permanentErrors;

            const userStatsSection = document.getElementById('userStatsSection');
            if (userStats && userStatsSection) {
                userStatsSection.style.display = 'block';
                this.updateUserStatsDisplay(userStats, finalWpm, finalAccuracy);
            }

            const existingChart = Chart.getChart("accuracyGraph");
            if (existingChart) {
                existingChart.destroy();
            }

            const labels = [];
            const data = [];
            const totalTime = this.timeLimit;

            for (let i = 1; i <= 10; i++) {
                const timePoint = (i / 10) * totalTime;
                labels.push(i * 10 + '%');

                const closestPoint = finalWpmHistory.reduce((closest, point) => {
                    if (Math.abs(point.time - timePoint) < Math.abs(closest.time - timePoint)) {
                        return point;
                    }
                    return closest;
                }, finalWpmHistory[0] || { time: 0, wpm: 0 });

                data.push(closestPoint ? closestPoint.wpm : 0);
            }

            const maxWPM = Math.max(...data, 0);
            const yAxisMax = Math.ceil(maxWPM / 50) * 50;

            const ctx = document.getElementById('accuracyGraph').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'WPM',
                        data: data,
                        borderColor: getComputedStyle(document.documentElement)
                            .getPropertyValue('--correct-color'),
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: getComputedStyle(document.documentElement)
                            .getPropertyValue('--correct-color'),
                        pointBorderColor: 'transparent',
                        pointHoverRadius: 6,
                        pointRadius: 4,
                        borderWidth: 3,
                        pointHitRadius: 20
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'WPM',
                            color: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-color'),
                            font: {
                                size: 16,
                                family: 'Arial, sans-serif',
                                weight: '500'
                            },
                            padding: {
                                top: 10,
                                bottom: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: getComputedStyle(document.documentElement)
                                .getPropertyValue('--header-bg'),
                            titleColor: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-color'),
                            bodyColor: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-color'),
                            padding: 12,
                            cornerRadius: 8
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement)
                                    .getPropertyValue('--char-color')
                            }
                        },
                        y: {
                            min: 0,
                            max: yAxisMax,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement)
                                    .getPropertyValue('--char-color'),
                                stepSize: Math.ceil(yAxisMax / 8),
                                callback: function (value) {
                                    return value + ' WPM';
                                }
                            }
                        }
                    },
                    elements: {
                        point: {
                            hoverRadius: 6,
                            radius: 4
                        }
                    }
                }
            });

            this.resultsModal.style.display = 'flex';
            void this.resultsModal.offsetWidth;
            this.resultsModal.classList.add('show');
        }, 300);
    }

    closeResultsModal() {
        this.resultsModal.classList.remove('show');

        setTimeout(() => {
            this.resultsModal.style.display = 'none';
            document.querySelector('.container').classList.remove('hide');
        }, 400);
    }

    updateUserStatsDisplay(userStats, currentWpm, currentAccuracy) {
        const pbElement = document.getElementById('personalBest');
        if (pbElement) {
            pbElement.textContent = userStats.top_speed || 0;
        }

        const avgWpmElement = document.getElementById('averageWpm');
        if (avgWpmElement) {
            avgWpmElement.textContent = Math.round(userStats.average_wpm) || 0;
        }

        const avgAccElement = document.getElementById('averageAccuracy');
        if (avgAccElement) {
            avgAccElement.textContent = Math.round(userStats.average_accuracy) || 0;
        }

        const totalRunsElement = document.getElementById('totalRuns');
        if (totalRunsElement) {
            totalRunsElement.textContent = userStats.total_runs || 0;
        }

        const rankElement = document.getElementById('userRank');
        if (rankElement) {
            rankElement.textContent = userStats.rank ? `#${userStats.rank}` : 'Unranked';
        }

        this.showImprovementIndicators(userStats, currentWpm, currentAccuracy);
    }

    showImprovementIndicators(userStats, currentWpm, currentAccuracy) {
        const pbIndicator = document.getElementById('pbIndicator');
        if (pbIndicator && userStats.top_speed) {
            if (currentWpm > userStats.top_speed) {
                pbIndicator.style.display = 'block';
                pbIndicator.textContent = '🎉 New Personal Best!';
            } else {
                pbIndicator.style.display = 'none';
            }
        }

        const aboveAvgIndicator = document.getElementById('aboveAvgIndicator');
        if (aboveAvgIndicator && userStats.average_wpm) {
            if (currentWpm > userStats.average_wpm) {
                aboveAvgIndicator.style.display = 'block';
                aboveAvgIndicator.textContent = '📈 Above Average!';
            } else {
                aboveAvgIndicator.style.display = 'none';
            }
        }
    }

    async restartTest() {
        if (window.typeCraftSounds) {
            window.typeCraftSounds.playClick();
        }

        // Immediately hide modal and show container (no delay)
        this.resultsModal.classList.remove('show');
        this.resultsModal.style.display = 'none';
        document.querySelector('.container').classList.remove('hide');

        clearInterval(this.timer);
        clearInterval(this.statsTimer);
        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.mistakes = new Set();
        this.permanentErrors = 0; // Reset permanent error count
        this.startTime = null;
        this.isTestActive = false;
        this.wpmHistory = [];
        this.lastWpmUpdate = null;

        // Reset XP bar
        if (this.xpBarFill) {
            this.xpBarFill.style.width = '0%';
        }

        // Generate and render new text immediately
        this.generateInitialText();

        // Focus typing area
        this.typingArea.focus();
    }

    applyMinecraftTheme() {
        document.documentElement.style.setProperty('--bg-color', 'transparent');
        document.documentElement.style.setProperty('--text-color', '#fff');
        document.documentElement.style.setProperty('--header-bg', 'rgba(0, 0, 0, 0.3)');
        document.documentElement.style.setProperty('--typing-area-bg', 'rgba(0, 0, 0, 0.3)');
        document.documentElement.style.setProperty('--char-color', '#0b0b0bff');
        document.documentElement.style.setProperty('--correct-color', '#00ff00');
        document.documentElement.style.setProperty('--incorrect-color', '#ff4444');
        document.documentElement.style.setProperty('--cursor-color', '#fff');
        document.documentElement.style.setProperty('--button-bg', 'rgba(0, 0, 0, 0.5)');
        document.documentElement.style.setProperty('--button-hover-bg', 'rgba(0, 0, 0, 0.7)');

        document.body.style.backgroundImage = 'url("background/1.png")';
        document.body.style.fontFamily = '"Minecraft", Arial, sans-serif';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';

        const title = document.querySelector('.title h1');
        if (title) title.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';

        // Detect theme brightness for adaptive styling
        const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
        const brightThemes = ['light', 'pastel', 'mint', 'sunshine', 'lavender'];
        const isBright = brightThemes.includes(savedTheme);
        document.body.setAttribute('data-theme-type', isBright ? 'bright' : 'dark');
        document.body.setAttribute('data-theme', savedTheme);
    }

    recordWPM() {
        const now = new Date();
        const timeElapsed = (now - this.startTime) / 1000 / 60;
        const currentWPM = Math.round((this.correctChars / 5) / timeElapsed) || 0;
        this.wpmHistory.push({
            time: timeElapsed * 60,
            wpm: currentWPM
        });
    }

    initializeMobileSupport() {
        this.mobileInput.addEventListener('input', (e) => {
            const inputChar = e.data;
            if (inputChar && this.isTestActive) {
                this.checkCharacter(inputChar);
            }
            this.mobileInput.value = '';
        });

        this.typingArea.addEventListener('touchstart', () => {
            if (!this.isTestActive) {
                this.mobileInput.focus();
            }
        });

        window.visualViewport.addEventListener('resize', () => {
            const container = document.querySelector('.container');
            if (window.visualViewport.height < window.innerHeight) {
                container.classList.add('keyboard-visible');
            } else {
                container.classList.remove('keyboard-visible');
            }
        });
    }

    updateCharsPerLine() {
        const container = document.querySelector('.typing-area');
        const containerWidth = container.clientWidth;
        const maxChars = 70;

        if (window.innerWidth <= 440) {
            const minWidth = 320;
            const minChars = 35;
            const maxCharsXSmall = 50;

            const widthRange = 440 - minWidth;
            const currentWidth = window.innerWidth - minWidth;
            const percentage = Math.max(0, Math.pow(currentWidth / widthRange, 0.8));

            const charRange = maxCharsXSmall - minChars;
            this.charsPerLine = Math.floor(minChars + (charRange * percentage));
        } else if (window.innerWidth <= 770) {
            const percentage = (window.innerWidth - 440) / (770 - 440);
            this.charsPerLine = Math.floor(50 + (65 - 50) * percentage);
        } else if (window.innerWidth <= 1024) {
            const percentage = (window.innerWidth - 770) / (1024 - 770);
            this.charsPerLine = Math.floor(65 + (maxChars - 65) * percentage);
        } else {
            this.charsPerLine = maxChars;
        }

        this.charsPerLine = Math.max(35, this.charsPerLine);
    }

}

document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
});