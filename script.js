class TypingTest {
    constructor() {
        // ... (existing property definitions remain the same) ...
        this.words = []; // Initialize as empty, will be populated by fetchSourceText

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
        this.charsPerLine = 76;
        this.updateCharsPerLine();
        this.statsTimer = null;
        this.themeSelect = document.getElementById('themeSelect');

        this.typingArea = document.querySelector('.typing-area');

        const savedTime = localStorage.getItem('selectedTime');
        const savedTheme = localStorage.getItem('selectedTheme');

        if (savedTime) {
            this.timeSelect.value = savedTime;
            this.timeLimit = parseInt(savedTime);
        }

        if (savedTheme) {
            this.themeSelect.value = savedTheme;
        }
        this.applyMinecraftTheme();

        this.timeSelect.addEventListener('change', (e) => {
            const selectedTime = e.target.value;
            this.timeLimit = parseInt(selectedTime);
            localStorage.setItem('selectedTime', selectedTime);
            this.restartTest();
        });

        this.themeSelect.addEventListener('change', (e) => {
            const selectedTheme = e.target.value;
            localStorage.setItem('selectedTheme', selectedTheme);
        });

        this.timeDisplay.textContent = this.timeLimit + 's';

        this.initializeEventListeners();
        
        // --- KEY CHANGE: Start the data loading and then initialize text ---
        this.initializeTest();
        // -------------------------------------------------------------------

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

        this.statsContainer = document.querySelector('.stats');
        this.statsContainer.classList.remove('visible');

        this.titleElement = document.querySelector('.title h1');
        this.originalTitle = this.titleElement.textContent;
        
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

    // --- NEW ASYNCHRONOUS INITIALIZATION METHOD ---
    async initializeTest() {
        // Show a loading message while fetching data
        this.textDisplay.innerHTML = '<span class="loading-text">Loading text...</span>';
        
        // Wait for the source text to be fetched and parsed
        await this.fetchSourceText();

        // Only generate text once 'this.words' is populated
        this.generateInitialText();
    }
    
    // --- NEW METHOD TO FETCH TEXT FILE ---
    async fetchSourceText() {
        try {
            const response = await fetch('mcitems.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            
            // Split the content by newline, filter out empty lines,
            // and then split each sentence into words.
            // Note: Since 'mcitems.txt' is guaranteed to have complete sentences on each line,
            // we will use the lines themselves as the full text source for generation.
            
            // To get a list of all words, we join all lines and split by space, 
            // cleaning up any extra whitespace from the split and filter.
            this.sentences = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
            
            // For word-based random generation (used in generateWords), 
            // we populate 'this.words' with all individual words from the file.
            this.words = this.sentences.join(' ').split(/\s+/).filter(w => w.length > 0);

        } catch (error) {
            console.error('Could not load mcitems.txt:', error);
            this.textDisplay.innerHTML = '<span class="error-text">Error loading text source. Check console for details.</span>';
            // Fallback to a placeholder word list if fetching fails
            this.words = ["Error", "loading", "text", "source", "please", "check", "mcitems.txt", "file", "and", "path"];
            this.sentences = [this.words.join(' ')];
        }
    }

    // ... (initializeEventListeners remains the same) ...
    initializeEventListeners() {
        document.addEventListener('keydown', (e) => {
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

            // --- IMPORTANT: Only start test if source text is loaded ---
            if (!this.isTestActive && e.key.length === 1 && this.words.length > 0) {
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


    // --- MODIFIED generateInitialText to use sentences or words if sentences fail ---
    generateInitialText() {
        if (this.sentences && this.sentences.length > 0) {
            // Select a random set of sentences to form the initial text
            let initialSentences = [];
            // Use 5 random sentences to ensure enough starting text
            for (let i = 0; i < 5; i++) {
                initialSentences.push(this.sentences[Math.floor(Math.random() * this.sentences.length)]);
            }
            // Join them with a space
            this.currentText = initialSentences.join(' ');
        } else {
            // Fallback to random word generation if sentences list is empty
            this.currentText = this.generateWords(100).join(' ');
        }
        
        this.renderText();
    }
    
    // --- MODIFIED generateWords to fetch new sentences instead of random words ---
    generateWords(count) {
        if (this.sentences && this.sentences.length > 0) {
            // If using the sentence structure, generate the next segment by picking a random sentence
            // The argument 'count' is ignored in this implementation since we fetch a full sentence
            return [this.sentences[Math.floor(Math.random() * this.sentences.length)]];
        } else {
            // Original logic for random word generation (only used as a fallback)
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
    
    // ... (The rest of the class methods remain the same) ...

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
                    if (nextSpaceIndex === -1) {
                         // If no more spaces, mark remaining chars as mistakes and end of current text reached
                         nextSpaceIndex = this.currentText.length;
                    }
                    
                    // Mark skipped characters as mistakes
                    while (this.currentIndex < nextSpaceIndex) {
                        this.mistakes.add(this.currentIndex);
                        this.currentIndex++;
                        this.totalChars++;
                    }

                    // Only move past the space if it exists in the current text
                    if (nextSpaceIndex < this.currentText.length) {
                       this.currentIndex++;
                       this.totalChars++;
                    }
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
        // Using 'generateWords' here will fetch a new random sentence
        if (this.currentIndex >= this.currentText.length - (this.charsPerLine * 2)) {
            // Generate a single new sentence and append it with a leading space
            this.currentText += ' ' + this.generateWords(1)[0]; 
        }

        this.renderText();
        this.updateStats();
    }
    
    // ... (renderText, handleBackspace, startTest, updateTime, updateStats, endTest, showResultsModal, closeResultsModal, restartTest, applyMinecraftTheme, recordWPM, initializeMobileSupport, updateCharsPerLine remain the same) ...
    
    renderText() {
        // ... (The rest of this method remains the same) ...
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
        
        // Show appropriate lines
        const visibleChars = allChars;
        
        this.textDisplay.innerHTML = visibleChars.map((char, index) => {
            const globalIndex = index;
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
        // ... (The rest of this method remains the same) ...
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
                    this.currentIndex--;
                    if (this.mistakes.has(this.currentIndex)) {
                        this.mistakes.delete(this.currentIndex);
                    } else {
                        this.correctChars--;
                    }
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
            
            this.renderText();
            this.updateStats();
        }
    }

    startTest() {
        // ... (The rest of this method remains the same) ...
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
        // ... (The rest of this method remains the same) ...
        const timeElapsed = Math.floor((new Date() - this.startTime) / 1000);
        const timeLeft = this.timeLimit - timeElapsed;
        
        if (timeLeft <= 0) {
            this.endTest();
        } else {
            this.timeDisplay.textContent = timeLeft + 's';
        }
    }

    updateStats() {
        // ... (The rest of this method remains the same) ...
        if (!this.startTime || !this.isTestActive) return;
        
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
        // ... (The rest of this method remains the same) ...
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
        
        // Show results with final data
        this.showResultsModal(finalWpm, finalAccuracy, this.wpmHistory);
    }

    showResultsModal(finalWpm, finalAccuracy, finalWpmHistory) {
        // ... (The rest of this method remains the same) ...
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
        // ... (The rest of this method remains the same) ...
        this.resultsModal.classList.remove('show');
        
        // Wait for modal transition before showing container
        setTimeout(() => {
            this.resultsModal.style.display = 'none';
            document.querySelector('.container').classList.remove('hide');
        }, 400);
    }

    async restartTest() {
        this.closeResultsModal();
        clearInterval(this.timer);
        clearInterval(this.statsTimer);
        this.currentIndex = 0;
        this.correctChars = 0;
        this.totalChars = 0;
        this.mistakes = new Set();
        this.startTime = null;
        this.isTestActive = false;
        this.wpmHistory = [];
        this.lastWpmUpdate = null;
        this.timeDisplay.textContent = this.timeLimit + 's';
        this.wpmDisplay.textContent = '0';
        this.accuracyDisplay.textContent = '0%';
        
        // Ensure stats are hidden on restart
        this.statsContainer.classList.remove('visible');
        
        // Re-generate initial text, which uses the already loaded source
        this.generateInitialText();
    }

    applyMinecraftTheme() {
        // ... (The rest of this method remains the same) ...
        // Apply Minecraft theme colors
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

        // Minecraft specific styles
        document.body.style.backgroundImage = 'url("background/1.png")';
        document.body.style.fontFamily = '"Minecraft", Arial, sans-serif';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';

        // Add text shadow to title
        const title = document.querySelector('.title h1');
        if (title) title.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    }

    // Add this new method to record WPM data points
    recordWPM() {
        // ... (The rest of this method remains the same) ...
        const now = new Date();
        const timeElapsed = (now - this.startTime) / 1000 / 60; // in minutes
        const currentWPM = Math.round((this.correctChars / 5) / timeElapsed) || 0;
        this.wpmHistory.push({
            time: timeElapsed * 60, // convert to seconds
            wpm: currentWPM
        });
    }

    initializeMobileSupport() {
        // ... (The rest of this method remains the same) ...
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
        // ... (The rest of this method remains the same) ...
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