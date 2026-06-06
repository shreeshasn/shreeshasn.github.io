// Web Audio API Sound Synthesizer for Terminal Aesthetic
let audioCtx: AudioContext | null = null;
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

const initAudio = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playSynthSound = (type: 'click' | 'tick' | 'whoosh' | 'tap', enabled: boolean) => {
  if (!enabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    switch (type) {
      case 'click': {
        // Fast mechanical keyboard click
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1500, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.04);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'tick': {
        // Micro terminal-cursor tick
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2500, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

        osc.start(now);
        osc.stop(now + 0.02);
        break;
      }
      case 'tap': {
        // Soft digital bell/resonance for node hovers
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.13);
        break;
      }
      case 'whoosh': {
        // Hologram sweep/whoosh
        const osc = audioCtx.createOscillator();
        const filter = audioCtx.createBiquadFilter();
        const gain = audioCtx.createGain();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.4);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(1200, now + 0.4);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.45);
        break;
      }
    }
  } catch (error) {
    console.warn('Audio synthesis failed:', error);
  }
};

export const startAmbientHum = (enabled: boolean) => {
  if (!enabled) {
    stopAmbientHum();
    return;
  }
  try {
    initAudio();
    if (!audioCtx) return;

    if (ambientOsc1) return; // already running

    const now = audioCtx.currentTime;

    ambientOsc1 = audioCtx.createOscillator();
    ambientOsc2 = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();

    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(100, now);

    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(55, now); // A1 note

    ambientOsc2.type = 'sine';
    ambientOsc2.frequency.setValueAtTime(110, now); // A2 octave

    ambientOsc1.connect(lowpass);
    ambientOsc2.connect(lowpass);
    lowpass.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);

    // Subtle volume modulation (60Hz hum simulator)
    ambientGain.gain.setValueAtTime(0, now);
    ambientGain.gain.linearRampToValueAtTime(0.03, now + 2.0); // Slow fade-in

    ambientOsc1.start(now);
    ambientOsc2.start(now);
  } catch (error) {
    console.warn('Ambient hum start failed:', error);
  }
};

export const stopAmbientHum = () => {
  try {
    if (ambientOsc1 && ambientGain && audioCtx) {
      const now = audioCtx.currentTime;
      ambientGain.gain.cancelScheduledValues(now);
      ambientGain.gain.setValueAtTime(ambientGain.gain.value, now);
      ambientGain.gain.linearRampToValueAtTime(0, now + 0.5); // Fade out over 0.5s
      
      const osc1 = ambientOsc1;
      const osc2 = ambientOsc2;
      
      setTimeout(() => {
        try {
          osc1.stop();
          osc2?.stop();
        } catch {
          // Ignore errors during cleanup
        }
      }, 600);

      ambientOsc1 = null;
      ambientOsc2 = null;
      ambientGain = null;
    }
  } catch (error) {
    console.warn('Ambient hum stop failed:', error);
  }
};
