// Sound utility using Web Audio API
class SoundPlayer {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Play a pleasant "correct" sound (ascending notes)
  playCorrect() {
    if (typeof window === 'undefined') return;

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // First note (C5 - 523.25 Hz)
      this.playNote(ctx, 523.25, now, 0.1);

      // Second note (E5 - 659.25 Hz)
      this.playNote(ctx, 659.25, now + 0.08, 0.15);
    } catch (error) {
      console.error('Error playing correct sound:', error);
    }
  }

  // Play a gentle "incorrect" sound (descending notes)
  playIncorrect() {
    if (typeof window === 'undefined') return;

    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // First note (E4 - 329.63 Hz)
      this.playNote(ctx, 329.63, now, 0.12);

      // Second note (C4 - 261.63 Hz)
      this.playNote(ctx, 261.63, now + 0.1, 0.2);
    } catch (error) {
      console.error('Error playing incorrect sound:', error);
    }
  }

  private playNote(ctx: AudioContext, frequency: number, startTime: number, duration: number) {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration); // Gradual decay

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }
}

// Export singleton instance
export const soundPlayer = new SoundPlayer();
