const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export const playNote = (frequency) => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const now = audioContext.currentTime;
  
  // Create nodes
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  
  // 3 Oscillators for a richer, fatter sound
  const osc1 = audioContext.createOscillator(); // Fundamental
  const osc2 = audioContext.createOscillator(); // 1st harmonic
  const osc3 = audioContext.createOscillator(); // 2nd harmonic (slightly detuned)

  osc1.type = 'triangle';
  osc2.type = 'sine';
  osc3.type = 'triangle';

  osc1.frequency.setValueAtTime(frequency, now);
  osc2.frequency.setValueAtTime(frequency * 2, now);
  osc3.frequency.setValueAtTime(frequency * 3.01, now); // Slight detune for warmth

  // Gain staging for oscillators
  const gain1 = audioContext.createGain();
  const gain2 = audioContext.createGain();
  const gain3 = audioContext.createGain();

  gain1.gain.value = 1.0;
  gain2.gain.value = 0.3;
  gain3.gain.value = 0.1;

  osc1.connect(gain1);
  osc2.connect(gain2);
  osc3.connect(gain3);

  gain1.connect(filter);
  gain2.connect(filter);
  gain3.connect(filter);

  // Filter Envelope (make it brighter at the start, then mellow out)
  filter.type = 'lowpass';
  filter.Q.value = 0.5;
  filter.frequency.setValueAtTime(4000, now); // Bright attack
  filter.frequency.exponentialRampToValueAtTime(800, now + 0.3); // Mellows out quickly

  // Amp Envelope (ADSR)
  const attackTime = 0.01;
  const decayTime = 0.4;
  const sustainLevel = 0.15;
  const releaseTime = 1.5;

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.7, now + attackTime);
  gainNode.gain.exponentialRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + attackTime + decayTime + releaseTime);

  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Start & Stop
  osc1.start(now);
  osc2.start(now);
  osc3.start(now);
  
  osc1.stop(now + attackTime + decayTime + releaseTime);
  osc2.stop(now + attackTime + decayTime + releaseTime);
  osc3.stop(now + attackTime + decayTime + releaseTime);
};
