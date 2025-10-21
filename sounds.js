class TypeCraftSounds {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.7;
        this.sfxVolume = 0.5;
        this.enabled = true;

        this.initialized = false;

        this.loadSettings();
    }

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

    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('typeCraftSettings')) || {};
            this.masterVolume = (settings.masterVolume !== undefined) ? settings.masterVolume / 100 : 0.7;
            this.sfxVolume = (settings.sfxVolume !== undefined) ? settings.sfxVolume / 100 : 0.5;
        } catch (e) {
            console.error('Failed to load sound settings:', e);
        }
    }

    getVolume() {
        return this.masterVolume * this.sfxVolume;
    }

    playClick() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02);

        gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    }

    playCorrect() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

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

    playIncorrect() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.12);
    }

    playType() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

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

        gainNode.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

        noise.start(ctx.currentTime);
        noise.stop(ctx.currentTime + 0.05);
    }

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

        gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.06);
    }

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

        gainNode.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.08);
    }

    playComplete() {
        if (!this.initialized || !this.enabled) return;
        this.loadSettings();

        const ctx = this.audioContext;
        const volume = this.getVolume();

        const notes = [523.25, 659.25, 783.99, 1046.50];

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

window.typeCraftSounds = new TypeCraftSounds();

document.addEventListener('keydown', function initSounds() {
    console.log('Initializing TypeCraft sounds via keydown');
    window.typeCraftSounds.init();
}, { once: true });

document.addEventListener('click', function initSoundsClick() {
    console.log('Initializing TypeCraft sounds via click');
    window.typeCraftSounds.init();
}, { once: true });

document.addEventListener('mousedown', function initSoundsMousedown() {
    console.log('Initializing TypeCraft sounds via mousedown');
    window.typeCraftSounds.init();
}, { once: true });
