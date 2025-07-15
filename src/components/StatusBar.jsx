import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { 
  FiActivity, 
  FiWifi, 
  FiClock, 
  FiUsers, 
  FiTarget, 
  FiBookmark,
  FiGrid,
  FiMap
} = FiIcons;

const StatusBar = ({ 
  savedLocations, 
  spaceObjects, 
  currentCoordinate,
  zoomLevel
}) => {
  const currentTime = new Date().toLocaleTimeString();
  const objectsCount = spaceObjects.length;
  
  return (
    <div className="bg-gray-900 border-t border-cyan-500/30 px-4 py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2 text-green-400">
            <SafeIcon icon={FiActivity} className="w-4 h-4" />
            <span>SYSTEM ONLINE</span>
          </div>
          
          <div className="flex items-center gap-2 text-cyan-400">
            <SafeIcon icon={FiWifi} className="w-4 h-4" />
            <span>CONNECTED</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            <SafeIcon icon={FiClock} className="w-4 h-4" />
            <span>{currentTime}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2 text-cyan-400">
            <SafeIcon icon={FiBookmark} className="w-4 h-4" />
            <span>{savedLocations.length} Locations</span>
          </div>
          
          <div className="flex items-center gap-2 text-yellow-400">
            <SafeIcon icon={FiTarget} className="w-4 h-4" />
            <span>{objectsCount} Objects</span>
          </div>
          
          <div className="flex items-center gap-2 text-blue-400">
            <SafeIcon icon={FiGrid} className="w-4 h-4" />
            <span>Zoom Level: {zoomLevel}</span>
          </div>
          
          {currentCoordinate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-cyan-300 bg-cyan-500/20 px-2 py-1 rounded"
            >
              <SafeIcon icon={FiMap} className="w-3 h-3" />
              <span className="font-mono text-xs">{currentCoordinate}</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;