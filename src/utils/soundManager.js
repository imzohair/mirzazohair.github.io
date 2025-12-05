// Simple sound effects using Web Audio API
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3;
        this.droneHumOscillator = null;
        this.droneHumGain = null;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Helper to create oscillator-based sounds
    playTone(frequency, duration, type = 'sine', volumeMultiplier = 1) {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.volume * volumeMultiplier, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Start continuous drone hum (while flying)
    startDroneHum() {
        if (!this.enabled || this.droneHumOscillator) return;

        this.init();

        // Create two oscillators for richer sound
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        this.droneHumGain = this.audioContext.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.value = 80; // Low hum
        osc2.frequency.value = 120; // Slightly higher

        osc1.connect(this.droneHumGain);
        osc2.connect(this.droneHumGain);
        this.droneHumGain.connect(this.audioContext.destination);

        // Very quiet
        this.droneHumGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.droneHumGain.gain.linearRampToValueAtTime(
            this.volume * 0.08,
            this.audioContext.currentTime + 0.3
        );

        osc1.start();
        osc2.start();

        this.droneHumOscillator = { osc1, osc2 };
    }

    // Stop continuous drone hum
    stopDroneHum() {
        if (!this.droneHumOscillator || !this.droneHumGain) return;

        const now = this.audioContext.currentTime;
        this.droneHumGain.gain.linearRampToValueAtTime(0, now + 0.3);

        setTimeout(() => {
            if (this.droneHumOscillator) {
                this.droneHumOscillator.osc1.stop();
                this.droneHumOscillator.osc2.stop();
                this.droneHumOscillator = null;
                this.droneHumGain = null;
            }
        }, 350);
    }

    // Fragment collection sound (bright, uplifting)
    collectFragment() {
        this.init();
        const now = this.audioContext?.currentTime || 0;

        // Ascending notes
        this.playTone(523, 0.1, 'sine', 0.5); // C
        setTimeout(() => this.playTone(659, 0.1, 'sine', 0.5), 80); // E
        setTimeout(() => this.playTone(784, 0.15, 'sine', 0.6), 160); // G
    }

    // Building proximity sound (soft, welcoming)
    buildingProximity() {
        this.init();
        this.playTone(440, 0.2, 'sine', 0.3); // A
        setTimeout(() => this.playTone(554, 0.25, 'sine', 0.3), 100); // C#
    }

    // Panel open sound (smooth, digital)
    panelOpen() {
        this.init();
        this.playTone(880, 0.15, 'sine', 0.4); // High A
        setTimeout(() => this.playTone(660, 0.2, 'sine', 0.3), 100); // E
    }

    // Panel close sound (quick, subtle)
    panelClose() {
        this.init();
        this.playTone(660, 0.1, 'sine', 0.3); // E
        setTimeout(() => this.playTone(440, 0.15, 'sine', 0.2), 80); // A
    }

    // Level up sound (celebratory)
    levelUp() {
        this.init();
        const notes = [523, 659, 784, 1047]; // C E G C
        notes.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.5), i * 100);
        });
    }

    // Error/boundary hit sound (warning)
    error() {
        this.init();
        this.playTone(200, 0.1, 'square', 0.4);
        setTimeout(() => this.playTone(150, 0.15, 'square', 0.3), 100);
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled && this.droneHumOscillator) {
            this.stopDroneHum();
        }
    }
}

// Export singleton instance
const soundManager = new SoundManager();
export default soundManager;
