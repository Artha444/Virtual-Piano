import React, { useState, useEffect } from 'react';
import './Key.css';

const Key = ({ note, type, keyboardKey, isPressed, onPlay }) => {
  return (
    <div 
      className={`piano-key ${type === 'black' ? 'key-black' : 'key-white'} ${isPressed ? 'pressed' : ''}`}
      onMouseDown={() => onPlay(note)}
      onTouchStart={(e) => {
        e.preventDefault();
        onPlay(note);
      }}
    >
      <div className="key-label">
        <span className="note-name">{note.name}</span>
        <span className="keyboard-key">{keyboardKey}</span>
      </div>
    </div>
  );
};

export default Key;
