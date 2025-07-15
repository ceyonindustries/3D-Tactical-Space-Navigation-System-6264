import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CommandConsole = ({ isOpen, onClose, onCommand }) => {
  const [command, setCommand] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Focus input when console opens
      document.getElementById('commandInput')?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    const parts = command.toLowerCase().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case 'zero':
        onCommand({ type: 'zero' });
        break;
      case 'moveto':
        if (args.length > 0) {
          onCommand({ type: 'moveto', coordinate: args[0] });
        }
        break;
      default:
        console.log('Unknown command:', cmd);
    }

    setCommand('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-96 bg-gray-900 border border-cyan-500/30 rounded-lg shadow-lg"
    >
      <form onSubmit={handleSubmit} className="p-4">
        <input
          id="commandInput"
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="w-full bg-gray-800 text-cyan-300 border border-cyan-500/30 rounded px-3 py-2 focus:outline-none focus:border-cyan-500"
          placeholder="Enter command (zero, moveto [coordinate])"
          autoComplete="off"
        />
      </form>
    </motion.div>
  );
};

export default CommandConsole;