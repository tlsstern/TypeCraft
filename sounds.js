// TypeCraft Sound System - Minecraft-style typing sounds

class TypeCraftSounds {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.7;
        this.sfxVolume = 0.5;
        this.enabled = true;

        // Initialize audio context on first user interaction
        this.initialized = false;

        // Load settings from localStorage
        this.loadSettings();
    }

    // Initialize AudioContext (must be called after user interaction)
    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            console.log('TypeCraft Sound System initialized');
        } catch (e) {
            console.error('Web Audio API not supported:', e);
        }
    }

    // Load volume settings from localStorage
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('typeCraftSettings')) || {};
            this.masterVolume = (settings.masterVolume !== undefined) ? settings.masterVolume / 100 : 0.7;
            this.sfxVolume = (settings.sfxVolume !== undefined) ? settings.sfxVolume / 100 : 0.5;
        } catch (e) {
            console.error('Failed to load sound settings:', e);
        }
    }

    // Calculate final volume
    getVolume() {
        return this.masterVolume * this.sfxVolume;
    }

    // Play a "click" sound (Minecraft stone button sound-alike)
    playClick() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings(); // Reload settings each time

        const ctx = this.audioContext;
        const volume = this.getVolume();

        // Create oscillator for the click
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Minecraft-like click sound
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02);

        gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    }

    // Play a "correct" sound (higher pitched, pleasant)
    playCorrect() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        // Create a pleasant "ding" sound
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.15);
    }

    // Play an "incorrect" sound (lower, harsh)
    playIncorrect() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        // Create a "thud" or error sound
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime); // Increased from 0.25 to 0.5
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.12);
    }

    // Play typing sound (Minecraft wood/stone block sound-alike)
    playType() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        // Create noise-based typing sound
        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate noise burst
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = ctx.createBufferSource();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        noise.buffer = buffer;

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
        filter.Q.setValueAtTime(5, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.setValueAtTime(volume * 0.6, ctx.currentTime); // Increased from 0.2 to 0.6
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

        noise.start(ctx.currentTime);
        noise.stop(ctx.currentTime + 0.05);
    }

    // Play backspace sound
    playBackspace() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);

        gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime); // Increased from 0.2 to 0.5
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.06);
    }

    // Play space bar sound (deeper, more resonant)
    playSpace() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(volume * 0.6, ctx.currentTime); // Increased from 0.25 to 0.6
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
    }

    // Play completion sound (level up sound)
    playComplete() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        // Play a series of ascending notes
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, index) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

            const startTime = ctx.currentTime + (index * 0.1);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume * 0.3, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    // Play start/restart sound
    playStart() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
    }
}

// Create global sound instance
window.typeCraftSounds = new TypeCraftSounds();

// Initialize on first user interaction
document.addEventListener('keydown', function initSounds() {
    console.log('Initializing TypeCraft sounds via keydown');
    window.typeCraftSounds.init();
}, { once: true });

document.addEventListener('click', function initSoundsClick() {
    console.log('Initializing TypeCraft sounds via click');
    window.typeCraftSounds.init();
}, { once: true });

// Also initialize on any interaction with the page
document.addEventListener('mousedown', function initSoundsMousedown() {
    console.log('Initializing TypeCraft sounds via mousedown');
    window.typeCraftSounds.init();
}, { once: true });
