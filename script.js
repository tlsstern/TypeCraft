class TypingTest {
    constructor() {
        this.words = [
            "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
            "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
            "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
            "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
            "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
            "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
            "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
            "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
            "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
            "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
            "is", "was", "were", "been", "has", "had", "are", "said", "did", "monkey",
            "each", "under", "name", "very", "through", "just", "form", "much", "great", "before",
            "where", "must", "such", "child", "last", "should", "right", "old", "too", "does",
            "tell", "sentence", "set", "three", "want", "air", "play", "small", "end", "put",
            "home", "read", "hand", "port", "large", "spell", "add", "land", "here", "big",
            "high", "such", "follow", "act", "why", "ask", "men", "change", "went", "light",
            "kind", "off", "need", "house", "picture", "try", "again", "animal", "point", "mother",
            "world", "near", "build", "self", "earth", "father", "head", "stand", "own", "page",
            "should", "country", "found", "answer", "school", "grow", "study", "still", "learn", "plant",
            "cover", "food", "sun", "four", "between", "state", "keep", "eye", "never", "let",
            "thought", "city", "tree", "cross", "farm", "hard", "start", "might", "story", "saw",
            "far", "sea", "draw", "left", "late", "run", "dont", "while", "press", "close",
            "night", "real", "life", "few", "north", "book", "carry", "took", "science", "eat",
            "room", "friend", "began", "idea", "fish", "mountain", "stop", "once", "base", "hear",
            "horse", "cut", "sure", "watch", "color", "face", "wood", "main", "open", "seem"
        ];
        
        this.textDisplay = document.getElementById('text-display');
        this.wpmDisplay = document.getElementById('wpm');
        this.accuracyDisplay = document.getElementById('accuracy');
        this.timeDisplay = document.getElementById('time');
        this.restartBtn = document.getElementById('restart');
        this.timeSelect = document.getElementById('timeSelect');
        this.resultsModal = document.getElementById('resultsModal');
        this.wpmResult = document.getElementById('wpmResult');
        this.accuracyResult = document.getElementById('accuracyResult');
        this.totalCharsResult = document.getElementById('totalCharsResult');
        this.correctCharsResult = document.getElementById('correctCharsResult');
        this.incorrectCharsResult = document.getElementById('incorrectCharsResult');
        this.playAgainBtn = document.getElementById('playAgainBtn');

        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.mistakes = new Set();
        this.startTime = null;
        this.timeLimit = parseInt(this.timeSelect.value);
        this.isTestActive = false;
        this.timer = null;

        this.currentText = '';
        this.linesPerView = 5;
        this.charsPerLine = 76;
        this.updateCharsPerLine();
        this.visibleTextStart = 0;
        this.statsTimer = null;
        this.themeSelect = document.getElementById('themeSelect');
        this.themes = {
            dark: {
                '--bg-color': '#1a1a1a',
                '--text-color': '#fff',
                '--header-bg': '#2a2a2a',
                '--typing-area-bg': '#2a2a2a',
                '--char-color': '#666',
                '--correct-color': '#4caf50',
                '--incorrect-color': '#f44336',
                '--cursor-color': '#fff',
                '--button-bg': '#333',
                '--button-hover-bg': '#444'
            },
            synthwave: {
                '--bg-color': '#1a1a2e',
                '--text-color': '#ff2d95',
                '--header-bg': '#16213e',
                '--typing-area-bg': '#16213e',
                '--char-color': '#4d4d8d',
                '--correct-color': '#00fff5',
                '--incorrect-color': '#ff124f',
                '--cursor-color': '#ff2d95',
                '--button-bg': '#16213e',
                '--button-hover-bg': '#1a1a2e'
            },
            matrix: {
                '--bg-color': '#0d0d0d',
                '--text-color': '#00ff41',
                '--header-bg': '#1a1a1a',
                '--typing-area-bg': '#1a1a1a',
                '--char-color': '#005f00',
                '--correct-color': '#00ff41',
                '--incorrect-color': '#ff0000',
                '--cursor-color': '#00ff41',
                '--button-bg': '#1a1a1a',
                '--button-hover-bg': '#2a2a2a'
            },
            sunset: {
                '--bg-color': '#1a1517',
                '--text-color': '#ff7b00',
                '--header-bg': '#2a1f20',
                '--typing-area-bg': '#2a1f20',
                '--char-color': '#664d4d',
                '--correct-color': '#ffd700',
                '--incorrect-color': '#ff3333',
                '--cursor-color': '#ff7b00',
                '--button-bg': '#2a1f20',
                '--button-hover-bg': '#3a2f30'
            },
            ocean: {
                '--bg-color': '#1a1a2e',
                '--text-color': '#00ffff',
                '--header-bg': '#1f2937',
                '--typing-area-bg': '#1f2937',
                '--char-color': '#4d4d8d',
                '--correct-color': '#00ffff',
                '--incorrect-color': '#ff6b6b',
                '--cursor-color': '#00ffff',
                '--button-bg': '#1f2937',
                '--button-hover-bg': '#2d3748'
            },
            coffee: {
                '--bg-color': '#1a1412',
                '--text-color': '#d4b483',
                '--header-bg': '#2a201c',
                '--typing-area-bg': '#2a201c',
                '--char-color': '#665c57',
                '--correct-color': '#d4b483',
                '--incorrect-color': '#854442',
                '--cursor-color': '#d4b483',
                '--button-bg': '#2a201c',
                '--button-hover-bg': '#3a302c'
            },
            terminal: {
                '--bg-color': '#0a0f14',
                '--text-color': '#98d1ce',
                '--header-bg': '#1a1f24',
                '--typing-area-bg': '#1a1f24',
                '--char-color': '#4d5a5e',
                '--correct-color': '#859900',
                '--incorrect-color': '#dc322f',
                '--cursor-color': '#98d1ce',
                '--button-bg': '#1a1f24',
                '--button-hover-bg': '#2a2f34'
            },
            neon: {
                '--bg-color': '#0a0a1f',
                '--text-color': '#00ffff',
                '--header-bg': '#1a1a3c',
                '--typing-area-bg': '#1a1a3c',
                '--char-color': '#4d4d99',
                '--correct-color': '#00ff00',
                '--incorrect-color': '#ff00ff',
                '--cursor-color': '#00ffff',
                '--button-bg': '#1a1a3c',
                '--button-hover-bg': '#2a2a4c'
            },
            forest: {
                '--bg-color': '#1a2213',
                '--text-color': '#90ee90',
                '--header-bg': '#2a321f',
                '--typing-area-bg': '#2a321f',
                '--char-color': '#5c6657',
                '--correct-color': '#90ee90',
                '--incorrect-color': '#ff6b6b',
                '--cursor-color': '#90ee90',
                '--button-bg': '#2a321f',
                '--button-hover-bg': '#3a422f'
            },
            light: {
                '--bg-color': '#f5f5f5',
                '--text-color': '#2a2a2a',
                '--header-bg': '#ffffff',
                '--typing-area-bg': '#ffffff',
                '--char-color': '#999999',
                '--correct-color': '#4caf50',
                '--incorrect-color': '#f44336',
                '--cursor-color': '#2196f3',
                '--button-bg': '#e0e0e0',
                '--button-hover-bg': '#d0d0d0'
            },
            pastel: {
                '--bg-color': '#fce4ec',
                '--text-color': '#4a4a4a',
                '--header-bg': '#fff0f5',
                '--typing-area-bg': '#fff0f5',
                '--char-color': '#b39ddb',
                '--correct-color': '#81c784',
                '--incorrect-color': '#e57373',
                '--cursor-color': '#90caf9',
                '--button-bg': '#f8bbd0',
                '--button-hover-bg': '#f48fb1'
            },
            mint: {
                '--bg-color': '#e0f2f1',
                '--text-color': '#004d40',
                '--header-bg': '#f1f8f7',
                '--typing-area-bg': '#f1f8f7',
                '--char-color': '#80cbc4',
                '--correct-color': '#00897b',
                '--incorrect-color': '#e57373',
                '--cursor-color': '#26a69a',
                '--button-bg': '#b2dfdb',
                '--button-hover-bg': '#80cbc4'
            },
            sunshine: {
                '--bg-color': '#fff8e1',
                '--text-color': '#f57f17',
                '--header-bg': '#fffdf7',
                '--typing-area-bg': '#fffdf7',
                '--char-color': '#ffd54f',
                '--correct-color': '#ffa000',
                '--incorrect-color': '#ff7043',
                '--cursor-color': '#ffc107',
                '--button-bg': '#ffe082',
                '--button-hover-bg': '#ffd54f'
            },
            lavender: {
                '--bg-color': '#f3e5f5',
                '--text-color': '#4a148c',
                '--header-bg': '#f8f0fa',
                '--typing-area-bg': '#f8f0fa',
                '--char-color': '#ce93d8',
                '--correct-color': '#9c27b0',
                '--incorrect-color': '#ec407a',
                '--cursor-color': '#ab47bc',
                '--button-bg': '#e1bee7',
                '--button-hover-bg': '#ce93d8'
            }
        };

        this.typingArea = document.querySelector('.typing-area');

        // Load saved preferences
        const savedTime = localStorage.getItem('selectedTime');
        const savedTheme = localStorage.getItem('selectedTheme');

        if (savedTime) {
            this.timeSelect.value = savedTime;
            this.timeLimit = parseInt(savedTime); // Update timeLimit with saved value
        }

        if (savedTheme) {
            console.log(`Loading saved theme: ${savedTheme}`); // Debugging
            this.themeSelect.value = savedTheme;
            this.applyTheme(savedTheme); // Apply the saved theme
        } else {
            console.log('No saved theme found, applying default theme');
            this.applyTheme('dark'); // Set default theme
        }

        // Update event listeners
        this.timeSelect.addEventListener('change', (e) => {
            const selectedTime = e.target.value;
            this.timeLimit = parseInt(selectedTime);
            localStorage.setItem('selectedTime', selectedTime);
            this.restartTest();
        });

        this.themeSelect.addEventListener('change', (e) => {
            const selectedTheme = e.target.value;
            console.log(`Saving theme: ${selectedTheme}`); // Debugging
            localStorage.setItem('selectedTheme', selectedTheme);
            this.applyTheme(selectedTheme);
        });

        // Initialize the time display with the correct time
        this.timeDisplay.textContent = this.timeLimit + 's';

        this.initializeEventListeners();
        this.generateInitialText();

        this.playAgainBtn.addEventListener('click', () => {
            this.closeResultsModal();
            this.restartTest();
        });

        // Add this new property to store WPM data points
        this.wpmHistory = [];
        this.lastWpmUpdate = null;
        this.lastWord = '';

        // Add after existing constructor properties
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.virtualKeyboard = document.getElementById('virtualKeyboard');
        this.mobileInput = document.getElementById('mobileInput');
        
        if (this.isMobile) {
            this.initializeMobileSupport();
        }

        // Add resize listener
        window.addEventListener('resize', () => {
            this.updateCharsPerLine();
            this.renderText();
        });

        // Add new property
        this.statsContainer = document.querySelector('.stats');
        this.statsContainer.classList.remove('visible'); // Ensure stats start hidden

        this.titleElement = document.querySelector('.title h1');
        this.originalTitle = this.titleElement.textContent;
        
        // Simple caps lock detection and title change
        document.addEventListener('keydown', (e) => {
            if (e.getModifierState('CapsLock')) {
                this.titleElement.textContent = 'CAPSLOCK';
            }
        });

        document.addEventListener('keyup', (e) => {
            if (!e.getModifierState('CapsLock')) {
                this.titleElement.textContent = this.originalTitle;
            }
        });
    }

    initializeEventListeners() {
        document.addEventListener('keydown', (e) => {
            // Handle Tab key
            if (e.key === 'Tab') {
                e.preventDefault(); // Prevent default tab behavior
                this.restartBtn.focus();    
                
                return;
            }

            // Handle Enter key when restart button is focused
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

            if (!this.isTestActive && e.key.length === 1) {
                this.startTest();
            }

            // Prevent focus on other elements during the test
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
        this.timeSelect.addEventListener('change', (e) => {
            this.timeLimit = parseInt(e.target.value);
            this.restartTest();
        });
        this.themeSelect.addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });

        // Prevent focus on select and button elements during the test
        this.restartBtn.addEventListener('mousedown', (e) => {
            if (this.isTestActive) {
                e.preventDefault();
            }
        });

        this.timeSelect.addEventListener('mousedown', (e) => {
            if (this.isTestActive) {
                e.preventDefault();
            }
        });

        this.themeSelect.addEventListener('mousedown', (e) => {
            if (this.isTestActive) {
                e.preventDefault();
            }
        });
    }

    generateInitialText() {
        this.currentText = this.generateWords(100).join(' ');
        this.renderText();
    }

    generateWords(count) {
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

    renderText() {
        const words = this.currentText.split(' ');
        let lines = [];
        let currentLine = '';
        
        // Build lines word by word
        for (let word of words) {
            // Check if adding the word (plus a space) would exceed line length
            if (currentLine.length === 0 || (currentLine + ' ' + word).length <= this.charsPerLine) {
                // Add space only if it's not the start of a line
                currentLine += (currentLine.length > 0 ? ' ' : '') + word;
            } else {
                // Push current line and start new line with current word
                lines.push(currentLine);
                currentLine = word;
                
                // Break if we've reached 5 lines
                if (lines.length >= 5) {
                    break;
                }
            }
        }
        
        // Add the last line if we haven't reached 5 lines yet
        if (currentLine && lines.length < 5) {
            lines.push(currentLine);
        }

        // Join lines with proper spacing and create character spans
        const allChars = lines.join('\n').split('');
        
        // Calculate current line based on character index
        this.currentLine = lines.slice(0, this.visibleTextStart)
            .reduce((count, line) => count + line.length + 1, 0);
        
        // Show appropriate lines
        const visibleChars = allChars;
        
        this.textDisplay.innerHTML = visibleChars.map((char, index) => {
            const globalIndex = index + this.visibleTextStart;
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
            
            // Replace newline characters with <br> tags
            if (char === '\n') {
                return '<br>';
            }
            
            return `<span class="${classes.join(' ')}">${char}</span>`;
        }).join('');
    }

    handleBackspace(isCtrlPressed) {
        if (this.currentIndex > 0) {
            if (isCtrlPressed) {
                // Find the start of the current word
                let newIndex = this.currentIndex;
                
                // Skip any spaces immediately before cursor
                while (newIndex > 0 && this.currentText[newIndex - 1] === ' ') {
                    newIndex--;
                }
                
                // Find the start of the word
                while (newIndex > 0 && this.currentText[newIndex - 1] !== ' ') {
                    newIndex--;
                }
                
                // Delete all characters between newIndex and currentIndex
                while (this.currentIndex > newIndex) {
                    if (this.mistakes.has(this.currentIndex - 1)) {
                        this.mistakes.delete(this.currentIndex - 1);
                    } else {
                        this.correctChars--;
                    }
                    this.currentIndex--;
                    this.totalChars--;
                }
            } else {
                // Original single character backspace logic
                this.currentIndex--;
                
                if (this.mistakes.has(this.currentIndex)) {
                    this.mistakes.delete(this.currentIndex);
                } else {
                    this.correctChars--;
                }
                this.totalChars--;
            }
            
            // Update visibleTextStart when backspacing to previous lines
            const newLine = Math.floor(this.currentIndex / this.charsPerLine);
            if (newLine < this.currentLine && newLine > 0) {
                this.visibleTextStart = (newLine - 1) * this.charsPerLine;
            }
            
            this.renderText();
            this.updateStats();
        }
    }

    checkCharacter(key) {
        if (!this.isTestActive || this.resultsModal.style.display === 'flex') return;

        const currentChar = this.currentText[this.currentIndex];

        // Handle space key
        if (key === ' ') {
            // Only allow space if we've typed at least one character and aren't already at a space
            if (this.currentIndex > 0 && !this.currentText.slice(0, this.currentIndex).endsWith(' ')) {
                if (currentChar === ' ') {
                    // If space is correct, increment correctChars
                    this.correctChars++;
                    this.currentIndex++;
                    this.totalChars++;
                } else {
                    // Skip to next word if space is pressed at wrong time
                    let nextSpaceIndex = this.currentText.indexOf(' ', this.currentIndex);
                    if (nextSpaceIndex === -1) return;
                    
                    // Mark skipped characters as mistakes
                    while (this.currentIndex < nextSpaceIndex) {
                        this.mistakes.add(this.currentIndex);
                        this.currentIndex++;
                        this.totalChars++;
                    }
                    // Move past the space
                    this.currentIndex++;
                    this.totalChars++;
                }
                
                this.renderText();
                this.updateStats();
            }
            return;
        }

        // Handle other characters
        if (key === currentChar) {
            this.correctChars++;
        } else {
            this.mistakes.add(this.currentIndex);
        }

        this.currentIndex++;
        this.totalChars++;

        // Vibrate on mobile for feedback (if available)
        if (this.isMobile && navigator.vibrate) {
            navigator.vibrate(10);
        }

        // Add more text if needed
        if (this.currentIndex >= this.currentText.length - (this.charsPerLine * 2)) {
            this.currentText += ' ' + this.generateWords(20).join(' ');
        }

        this.renderText();
        this.updateStats();
    }

    startTest() {
        if (this.isTestActive) return; // Prevent multiple starts
        
        this.isTestActive = true;
        this.startTime = new Date();
        this.timer = setInterval(() => this.updateTime(), 1000);
        this.statsTimer = setInterval(() => this.updateStats(), 100);
        
        // Show stats immediately when typing starts
        requestAnimationFrame(() => {
            this.statsContainer.classList.add('visible');
        });
        
        // Focus on the typing area
        this.typingArea.focus();
        
        // Make the typing area focusable
        this.typingArea.setAttribute('tabindex', '-1');

        if (this.isMobile) {
            this.mobileInput.focus();
        }
    }

    updateTime() {
        const timeElapsed = Math.floor((new Date() - this.startTime) / 1000);
        const timeLeft = this.timeLimit - timeElapsed;
        
        if (timeLeft <= 0) {
            this.endTest();
        } else {
            this.timeDisplay.textContent = timeLeft + 's';
        }
    }

    updateStats() {
        // Add early return if test is not active or WPM history is null
        if (!this.startTime || !this.isTestActive || this.wpmHistory === null) return;
        
        const now = new Date();
        const timeElapsed = (now - this.startTime) / 1000 / 60;
        const wpm = Math.round((this.correctChars / 5) / timeElapsed) || 0;
        const accuracy = this.totalChars > 0 
            ? Math.round((this.correctChars / this.totalChars) * 100) 
            : 0;

        this.wpmDisplay.textContent = wpm;
        this.accuracyDisplay.textContent = accuracy + '%';

        // Record WPM only if test is still active
        if (this.isTestActive && (!this.lastWpmUpdate || (now - this.lastWpmUpdate) >= 1000)) {
            this.recordWPM();
            this.lastWpmUpdate = now;
        }
    }

    endTest() {
        // Clear all timers immediately
        clearInterval(this.timer);
        clearInterval(this.statsTimer);
        this.isTestActive = false;
        
        // Calculate final stats
        const timeElapsed = this.timeLimit / 60;
        const finalWpm = Math.round((this.correctChars / 5) / timeElapsed);
        const finalAccuracy = this.totalChars > 0 
            ? Math.round((this.correctChars / this.totalChars) * 100) 
            : 0;
        
        // Take final snapshot of WPM history and prevent further updates
        const finalWpmHistory = [...this.wpmHistory];
        this.wpmHistory = null; // Prevent further updates
        
        // Show results with final data
        this.showResultsModal(finalWpm, finalAccuracy, finalWpmHistory);
    }

    showResultsModal(finalWpm, finalAccuracy, finalWpmHistory) {
        // Add hide class to container for smooth transition
        document.querySelector('.container').classList.add('hide');
        
        // Wait for container transition before showing modal
        setTimeout(() => {
            // Update display with final stats
            this.wpmResult.textContent = finalWpm;
            this.accuracyResult.textContent = `${finalAccuracy}%`;
            this.totalCharsResult.textContent = this.totalChars;
            this.correctCharsResult.textContent = this.correctChars;
            this.incorrectCharsResult.textContent = this.totalChars - this.correctChars;

            // Clear any existing chart
            const existingChart = Chart.getChart("accuracyGraph");
            if (existingChart) {
                existingChart.destroy();
            }

            // Prepare data for the graph using final WPM history
            const labels = [];
            const data = [];
            const totalTime = this.timeLimit;

            // Create time points from 10% to 100%
            for (let i = 1; i <= 10; i++) {
                const timePoint = (i / 10) * totalTime;
                labels.push(i * 10 + '%');
                
                // Find the closest WPM data point for this time
                const closestPoint = finalWpmHistory.reduce((closest, point) => {
                    if (Math.abs(point.time - timePoint) < Math.abs(closest.time - timePoint)) {
                        return point;
                    }
                    return closest;
                }, finalWpmHistory[0] || { time: 0, wpm: 0 });
                
                data.push(closestPoint ? closestPoint.wpm : 0);
            }

            // Find the maximum WPM achieved
            const maxWPM = Math.max(...data, 0);  // Use 0 as fallback
            const yAxisMax = Math.ceil(maxWPM / 50) * 50;  // Round up to next 50

            // Create accuracy graph
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
                            max: yAxisMax,  // Use the rounded up value
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement)
                                    .getPropertyValue('--char-color'),
                                stepSize: Math.ceil(yAxisMax / 8),  // Adjust step size based on max value
                                callback: function(value) {
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

            // Show modal with animation
            this.resultsModal.style.display = 'flex';
            void this.resultsModal.offsetWidth;
            this.resultsModal.classList.add('show');
        }, 300);
    }

    closeResultsModal() {
        this.resultsModal.classList.remove('show');
        
        // Wait for modal transition before showing container
        setTimeout(() => {
            this.resultsModal.style.display = 'none';
            document.querySelector('.container').classList.remove('hide');
        }, 400);
    }

    restartTest() {
        this.closeResultsModal();
        clearInterval(this.timer);
        clearInterval(this.statsTimer);
        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.mistakes = new Set();
        this.startTime = null;
        this.isTestActive = false;
        this.wpmHistory = []; // Clear WPM history
        this.lastWpmUpdate = null;
        this.timeDisplay.textContent = this.timeLimit + 's';
        this.wpmDisplay.textContent = '0';
        this.accuracyDisplay.textContent = '0%';
        
        // Ensure stats are hidden on restart
        this.statsContainer.classList.remove('visible');
        
        this.generateInitialText();
    }

    applyTheme(theme) {
        const themeColors = this.themes[theme];
        if (themeColors) {
            Object.entries(themeColors).forEach(([property, value]) => {
                document.documentElement.style.setProperty(property, value);
            });
        }
    }

    // Add this new method to record WPM data points
    recordWPM() {
        const now = new Date();
        const timeElapsed = (now - this.startTime) / 1000 / 60; // in minutes
        const currentWPM = Math.round((this.correctChars / 5) / timeElapsed) || 0;
        this.wpmHistory.push({
            time: timeElapsed * 60, // convert to seconds
            wpm: currentWPM
        });
    }

    initializeMobileSupport() {
        // Handle mobile input
        this.mobileInput.addEventListener('input', (e) => {
            const inputChar = e.data;
            if (inputChar && this.isTestActive) {
                this.checkCharacter(inputChar);
            }
            this.mobileInput.value = ''; // Clear input after each character
        });

        // Handle mobile keyboard show/hide
        this.typingArea.addEventListener('touchstart', () => {
            if (!this.isTestActive) {
                this.mobileInput.focus();
            }
        });

        // Adjust container padding when keyboard shows/hides
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
        const maxChars = 77; // Maximum for large screens
        
        if (window.innerWidth <= 440) {
            // Extra small screens (phones)
            // At 440px it will be 50 chars
            // At 320px it will be about 35 chars
            const minWidth = 320;
            const minChars = 35;
            const maxCharsXSmall = 50;
            
            const widthRange = 440 - minWidth;
            const currentWidth = window.innerWidth - minWidth;
            const percentage = Math.max(0, Math.pow(currentWidth / widthRange, 0.8));
            
            const charRange = maxCharsXSmall - minChars;
            this.charsPerLine = Math.floor(minChars + (charRange * percentage));
        } else if (window.innerWidth <= 770) {
            // Create a smoother decline from 770px down to 440px
            // At 770px it will be 65 chars
            // At 440px it will be 50 chars
            const percentage = (window.innerWidth - 440) / (770 - 440);
            this.charsPerLine = Math.floor(50 + (65 - 50) * percentage);
        } else if (window.innerWidth <= 1024) {
            // Smooth transition between 1024 and 770
            const percentage = (window.innerWidth - 770) / (1024 - 770);
            this.charsPerLine = Math.floor(65 + (maxChars - 65) * percentage);
        } else {
            this.charsPerLine = maxChars;
        }
        
        // Ensure we never go below minimum chars per line
        this.charsPerLine = Math.max(35, this.charsPerLine);
    }
}

// Remove the separate DOM content loaded event listener for preferences
document.addEventListener('DOMContentLoaded', () => {
    new TypingTest();
}); 