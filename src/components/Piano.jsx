import React, { useState, useEffect, useCallback } from 'react';
import Key from './Key';
import { playNote } from '../utils/audio';
import './Piano.css';

const generatePianoKeys = () => {
  const keys = [];
  const NOTE_NAMES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
  
  // Keyboard mapping for a portion of the piano (C4 to E5)
  const keyMap = {
    'C4': 'a', 'C#4': 'w', 'D4': 's', 'D#4': 'e', 'E4': 'd', 'F4': 'f', 'F#4': 't', 
    'G4': 'g', 'G#4': 'y', 'A4': 'h', 'A#4': 'u', 'B4': 'j', 'C5': 'k', 'C#5': 'o', 
    'D5': 'l', 'D#5': 'p', 'E5': ';'
  };

  for (let n = 1; n <= 88; n++) {
    const noteIndex = (n - 1) % 12;
    const noteName = NOTE_NAMES[noteIndex];
    const octave = Math.floor((n + 8) / 12);
    
    const isBlack = noteName.includes('#');
    const frequency = Math.pow(2, (n - 49) / 12) * 440;
    const fullName = `${noteName}${octave}`;
    
    keys.push({
      name: fullName,
      key: keyMap[fullName] || '',
      frequency: frequency,
      type: isBlack ? 'black' : 'white'
    });
  }
  return keys;
};

const PIANO_KEYS = generatePianoKeys();

const Piano = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  const handlePlay = useCallback((note) => {
    playNote(note.frequency);
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(note.key);
      setTimeout(() => {
        setPressedKeys(current => {
          const updatedSet = new Set(current);
          updatedSet.delete(note.key);
          return updatedSet;
        });
      }, 200); // UI visual pressed effect duration
      return newSet;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return; // Prevent continuous firing if key is held down
      const key = e.key; // Removed toLowerCase() to support Shift + Key
      const note = PIANO_KEYS.find(k => k.key === key);
      
      if (note) {
        handlePlay(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePlay]);

  return (
    <div className="piano-container">
      <div className="piano-brand">VIRTUAL PIANO</div>
      <div className="piano-keyboard-wrapper">
        <div className="piano-keyboard">
          {PIANO_KEYS.map((note) => (
            <Key
              key={note.name}
              note={note}
              type={note.type}
              keyboardKey={note.key || ''}
              isPressed={note.key ? pressedKeys.has(note.key) : false}
              onPlay={handlePlay}
            />
          ))}
        </div>
      </div>
      <div className="piano-instructions">
        Use your computer keyboard or click the keys to play
      </div>
    </div>
  );
};

export default Piano;
