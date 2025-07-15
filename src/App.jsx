import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ThreeNavigationScene from './components/ThreeNavigationScene';
import ControlPanel from './components/ControlPanel';
import StatusBar from './components/StatusBar';
import CommandConsole from './components/CommandConsole';
import { coordinateSystem } from './utils/coordinateSystem';
import { spaceObjectsAPI, savedLocationsAPI, subscribeToUpdates } from './services/spaceObjectsService';
import './App.css';

const App = () => {
  // State for navigation
  const [currentCoordinate, setCurrentCoordinate] = useState('N');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedObject, setSelectedObject] = useState(null);
  const [showConsole, setShowConsole] = useState(false);
  
  // Scene reference
  const sceneRef = useRef(null);
  
  // Data state
  const [spaceObjects, setSpaceObjects] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  
  // UI state
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [objectsData, locationsData] = await Promise.all([
          spaceObjectsAPI.getAll(),
          savedLocationsAPI.getAll()
        ]);
        
        setSpaceObjects(objectsData);
        setSavedLocations(locationsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Set up real-time subscriptions
    const unsubscribe = subscribeToUpdates(
      (payload) => {
        // Handle space objects updates
        if (payload.eventType === 'INSERT') {
          setSpaceObjects(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setSpaceObjects(prev => prev.map(item => 
            item.id === payload.new.id ? payload.new : item
          ));
        } else if (payload.eventType === 'DELETE') {
          setSpaceObjects(prev => prev.filter(item => 
            item.id !== payload.old.id
          ));
        }
      },
      (payload) => {
        // Handle saved locations updates
        if (payload.eventType === 'INSERT') {
          setSavedLocations(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setSavedLocations(prev => prev.map(item => 
            item.id === payload.new.id ? payload.new : item
          ));
        } else if (payload.eventType === 'DELETE') {
          setSavedLocations(prev => prev.filter(item => 
            item.id !== payload.old.id
          ));
        }
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, []);

  const isValidCoordinate = (coord) => {
    // Simple validation - check if it matches the pattern (A-Z|-|0-9)+
    return /^[A-Z0-9-]+$/.test(coord);
  };

  const handleCommand = (command) => {
    switch (command.type) {
      case 'zero':
        if (sceneRef.current) {
          sceneRef.current.resetCamera(false);
        }
        break;
      case 'moveto':
        if (isValidCoordinate(command.coordinate)) {
          handleNavigateTo(command.coordinate);
        }
        break;
    }
  };

  const handleSaveLocation = async (location) => {
    try {
      const savedLocation = await savedLocationsAPI.create(location);
      setSavedLocations(prev => [savedLocation, ...prev]);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      await savedLocationsAPI.delete(id);
      setSavedLocations(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleCreateObject = async (object) => {
    try {
      const createdObject = await spaceObjectsAPI.create(object);
      setSpaceObjects(prev => [createdObject, ...prev]);
    } catch (error) {
      console.error('Error creating object:', error);
    }
  };

  const handleUpdateObject = async (id, updates) => {
    try {
      const updatedObject = await spaceObjectsAPI.update(id, updates);
      setSpaceObjects(prev => prev.map(item => 
        item.id === id ? updatedObject : item
      ));
      
      if (selectedObject && selectedObject.id === id) {
        setSelectedObject(updatedObject);
      }
    } catch (error) {
      console.error('Error updating object:', error);
    }
  };

  const handleDeleteObject = async (id) => {
    try {
      await spaceObjectsAPI.delete(id);
      setSpaceObjects(prev => prev.filter(item => item.id !== id));
      
      if (selectedObject && selectedObject.id === id) {
        setSelectedObject(null);
      }
    } catch (error) {
      console.error('Error deleting object:', error);
    }
  };

  const handleNavigateTo = (coordinate) => {
    setCurrentCoordinate(coordinate);
    const level = coordinate.split('-').length;
    setZoomLevel(level);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 flex overflow-hidden">
        {/* Main 3D View */}
        <div className="flex-1 relative">
          <ThreeNavigationScene
            ref={sceneRef}
            currentCoordinate={currentCoordinate}
            setCurrentCoordinate={setCurrentCoordinate}
            selectedObject={selectedObject}
            setSelectedObject={setSelectedObject}
            spaceObjects={spaceObjects}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            onNavigate={handleNavigateTo}
            setShowConsole={setShowConsole}
          />
          
          {/* Toggle Controls Button */}
          <button
            onClick={() => setShowControlPanel(!showControlPanel)}
            className="absolute top-4 right-4 z-10 bg-gray-800 text-cyan-400 p-2 rounded-full hover:bg-gray-700"
          >
            {showControlPanel ? '❮' : '❯'}
          </button>
        </div>
        
        {/* Control Panel */}
        {showControlPanel && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80"
          >
            <ControlPanel
              currentCoordinate={currentCoordinate}
              selectedObject={selectedObject}
              savedLocations={savedLocations}
              spaceObjects={spaceObjects}
              onSaveLocation={handleSaveLocation}
              onDeleteLocation={handleDeleteLocation}
              onCreateObject={handleCreateObject}
              onUpdateObject={handleUpdateObject}
              onDeleteObject={handleDeleteObject}
              onNavigateTo={handleNavigateTo}
              zoomLevel={zoomLevel}
            />
          </motion.div>
        )}
      </div>
      
      {/* Status Bar */}
      <StatusBar
        savedLocations={savedLocations}
        spaceObjects={spaceObjects}
        currentCoordinate={currentCoordinate}
        zoomLevel={zoomLevel}
      />

      {/* Command Console */}
      <CommandConsole
        isOpen={showConsole}
        onClose={() => setShowConsole(false)}
        onCommand={handleCommand}
      />
    </div>
  );
};

export default App;