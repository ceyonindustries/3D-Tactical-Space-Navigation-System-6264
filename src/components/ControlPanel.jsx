import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { coordinateSystem } from '../utils/coordinateSystem';

const { 
  FiMap, 
  FiBookmark, 
  FiTarget, 
  FiUsers, 
  FiCopy, 
  FiSave, 
  FiTrash2, 
  FiPlus,
  FiNavigation,
  FiGrid,
  FiInfo,
  FiEdit3,
  FiLayers
} = FiIcons;

const ControlPanel = ({
  currentCoordinate,
  selectedObject,
  savedLocations,
  spaceObjects,
  onSaveLocation,
  onDeleteLocation,
  onCreateObject,
  onUpdateObject,
  onDeleteObject,
  onNavigateTo,
  zoomLevel
}) => {
  const [activeTab, setActiveTab] = useState('navigation');
  const [newLocation, setNewLocation] = useState({
    name: '',
    description: '',
    color: '#00ff88'
  });
  
  const [newObject, setNewObject] = useState({
    name: '',
    object_type: 'planet',
    description: '',
    color: '#00ff88',
    size: 1.0
  });
  
  const [editMode, setEditMode] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSaveLocation = () => {
    if (!currentCoordinate || !newLocation.name) return;
    
    const position = coordinateSystem.coordinateToPosition(currentCoordinate);
    
    onSaveLocation({
      ...newLocation,
      coordinate_code: currentCoordinate,
      position_x: position.x,
      position_y: position.y,
      position_z: position.z
    });
    
    setNewLocation({
      name: '',
      description: '',
      color: '#00ff88'
    });
  };

  const handleCreateObject = () => {
    if (!currentCoordinate || !newObject.name) return;
    
    const position = coordinateSystem.coordinateToPosition(currentCoordinate);
    
    onCreateObject({
      ...newObject,
      coordinate_code: currentCoordinate,
      position_x: position.x,
      position_y: position.y,
      position_z: position.z
    });
    
    setNewObject({
      name: '',
      object_type: 'planet',
      description: '',
      color: '#00ff88',
      size: 1.0
    });
  };

  const handleUpdateObject = () => {
    if (!selectedObject) return;
    
    onUpdateObject(selectedObject.id, selectedObject);
    setEditMode(false);
  };

  const tabs = [
    { id: 'navigation', label: 'Navigation', icon: FiNavigation },
    { id: 'locations', label: 'Locations', icon: FiBookmark },
    { id: 'objects', label: 'Objects', icon: FiLayers },
    { id: 'details', label: 'Details', icon: FiInfo }
  ];

  return (
    <div className="bg-gray-900 border-l border-cyan-500/30 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/30">
        <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
          <SafeIcon icon={FiMap} />
          Space Navigator
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-cyan-500/30">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 p-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-cyan-300'
            }`}
          >
            <SafeIcon icon={tab.icon} className="w-4 h-4 mx-auto mb-1" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'navigation' && (
          <NavigationTab
            currentCoordinate={currentCoordinate}
            copyToClipboard={copyToClipboard}
            zoomLevel={zoomLevel}
          />
        )}

        {activeTab === 'locations' && (
          <LocationsTab
            currentCoordinate={currentCoordinate}
            savedLocations={savedLocations}
            newLocation={newLocation}
            setNewLocation={setNewLocation}
            onSaveLocation={handleSaveLocation}
            onDeleteLocation={onDeleteLocation}
            onNavigateTo={onNavigateTo}
            copyToClipboard={copyToClipboard}
          />
        )}

        {activeTab === 'objects' && (
          <ObjectsTab
            currentCoordinate={currentCoordinate}
            spaceObjects={spaceObjects}
            newObject={newObject}
            setNewObject={setNewObject}
            onCreateObject={handleCreateObject}
            onDeleteObject={onDeleteObject}
            onNavigateTo={onNavigateTo}
            copyToClipboard={copyToClipboard}
          />
        )}

        {activeTab === 'details' && (
          <DetailsTab
            selectedObject={selectedObject}
            editMode={editMode}
            setEditMode={setEditMode}
            setSelectedObject={obj => onUpdateObject(obj.id, obj)}
            onUpdateObject={handleUpdateObject}
            spaceObjects={spaceObjects}
          />
        )}
      </div>
    </div>
  );
};

const NavigationTab = ({ currentCoordinate, copyToClipboard, zoomLevel }) => {
  const coordInfo = currentCoordinate
    ? coordinateSystem.getDescription(currentCoordinate)
    : { code: 'None', level: 0, description: 'Universe' };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Current Location</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Coordinate:</span>
            <div className="flex items-center gap-2">
              <span className="text-cyan-300 font-mono">
                {currentCoordinate || 'Universe'}
              </span>
              {currentCoordinate && (
                <button
                  onClick={() => copyToClipboard(currentCoordinate)}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <SafeIcon icon={FiCopy} className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Zoom Level:</span>
            <span className="text-cyan-300">{zoomLevel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Description:</span>
            <span className="text-cyan-300">{coordInfo.description}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Navigation Controls</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <div className="flex justify-between">
            <span><kbd className="bg-gray-700 px-2 py-1 rounded">←</kbd> <kbd className="bg-gray-700 px-2 py-1 rounded">→</kbd> <kbd className="bg-gray-700 px-2 py-1 rounded">↑</kbd> <kbd className="bg-gray-700 px-2 py-1 rounded">↓</kbd></span>
            <span>Navigate grid (X-Z)</span>
          </div>
          <div className="flex justify-between">
            <span><kbd className="bg-gray-700 px-2 py-1 rounded">PgUp</kbd> <kbd className="bg-gray-700 px-2 py-1 rounded">PgDn</kbd></span>
            <span>Change level (Y)</span>
          </div>
          <div className="flex justify-between">
            <span><kbd className="bg-gray-700 px-2 py-1 rounded">W</kbd> <kbd className="bg-gray-700 px-2 py-1 rounded">S</kbd></span>
            <span>Change level (Y)</span>
          </div>
          <div className="flex justify-between">
            <span><kbd className="bg-gray-700 px-2 py-1 rounded">Enter</kbd></span>
            <span>Zoom in</span>
          </div>
          <div className="flex justify-between">
            <span><kbd className="bg-gray-700 px-2 py-1 rounded">Backspace</kbd></span>
            <span>Zoom out</span>
          </div>
          <div className="flex justify-between">
            <span><kbd className="bg-gray-700 px-2 py-1 rounded">Mouse Drag</kbd></span>
            <span>Rotate view</span>
          </div>
          <div className="flex justify-between">
            <span><kbd className="bg-gray-700 px-2 py-1 rounded">Click</kbd></span>
            <span>Select object/cube</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Coordinate System</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>The space is divided into a 3x3x3 grid of cubes (27 total), labeled A through Z and 0.</p>
          <p>Each cube can be zoomed into, revealing another 3x3x3 grid.</p>
          <p>This creates hierarchical coordinates like A-F-E-N.</p>
          <div className="mt-4 grid grid-cols-3 gap-1 text-center">
            <div className="bg-gray-700 p-2 rounded">A-C</div>
            <div className="bg-gray-700 p-2 rounded">D-F</div>
            <div className="bg-gray-700 p-2 rounded">G-I</div>
            <div className="bg-gray-700 p-2 rounded">J-L</div>
            <div className="bg-gray-700 p-2 rounded">M-O</div>
            <div className="bg-gray-700 p-2 rounded">P-R</div>
            <div className="bg-gray-700 p-2 rounded">S-U</div>
            <div className="bg-gray-700 p-2 rounded">V-X</div>
            <div className="bg-gray-700 p-2 rounded">Y-0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LocationsTab = ({
  currentCoordinate,
  savedLocations,
  newLocation,
  setNewLocation,
  onSaveLocation,
  onDeleteLocation,
  onNavigateTo,
  copyToClipboard
}) => {
  return (
    <div className="space-y-4">
      {currentCoordinate && (
        <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500/30">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Save Location</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Location name"
              value={newLocation.name}
              onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 bg-gray-700 border border-cyan-500/30 rounded text-cyan-300 placeholder-gray-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={newLocation.description}
              onChange={(e) => setNewLocation(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 bg-gray-700 border border-cyan-500/30 rounded text-cyan-300 placeholder-gray-500 h-20"
            />
            <div className="flex items-center gap-2">
              <label className="text-gray-400">Color:</label>
              <input
                type="color"
                value={newLocation.color}
                onChange={(e) => setNewLocation(prev => ({ ...prev, color: e.target.value }))}
                className="w-8 h-8 rounded border border-cyan-500/30"
              />
            </div>
            <button
              onClick={onSaveLocation}
              disabled={!newLocation.name}
              className="w-full p-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white font-medium flex items-center justify-center gap-2"
            >
              <SafeIcon icon={FiSave} />
              Save Location
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">
          Saved Locations ({savedLocations.length})
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {savedLocations.map(location => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-700 p-3 rounded border border-cyan-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: location.color }}
                  />
                  <span className="text-cyan-300 font-medium">{location.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onNavigateTo(location.coordinate_code)}
                    className="text-cyan-400 hover:text-cyan-300 p-1"
                  >
                    <SafeIcon icon={FiNavigation} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(location.coordinate_code)}
                    className="text-cyan-400 hover:text-cyan-300 p-1"
                  >
                    <SafeIcon icon={FiCopy} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteLocation(location.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Coordinate: {location.coordinate_code}</div>
                {location.description && <div>Desc: {location.description}</div>}
              </div>
            </motion.div>
          ))}
          
          {savedLocations.length === 0 && (
            <div className="text-gray-500 text-center py-4">
              No saved locations yet. Save a location to see it here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ObjectsTab = ({
  currentCoordinate,
  spaceObjects,
  newObject,
  setNewObject,
  onCreateObject,
  onDeleteObject,
  onNavigateTo,
  copyToClipboard
}) => {
  // Filter objects for current view
  const visibleObjects = spaceObjects.filter(obj => 
    obj.coordinate_code.startsWith(currentCoordinate) ||
    (currentCoordinate === '' && obj.coordinate_code.length === 1)
  );

  return (
    <div className="space-y-4">
      {currentCoordinate && (
        <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500/30">
          <h3 className="text-lg font-semibold text-cyan-400 mb-3">Create Object</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Object name"
              value={newObject.name}
              onChange={(e) => setNewObject(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 bg-gray-700 border border-cyan-500/30 rounded text-cyan-300 placeholder-gray-500"
            />
            
            <select
              value={newObject.object_type}
              onChange={(e) => setNewObject(prev => ({ ...prev, object_type: e.target.value }))}
              className="w-full p-2 bg-gray-700 border border-cyan-500/30 rounded text-cyan-300"
            >
              <option value="planet">Planet</option>
              <option value="star">Star</option>
              <option value="station">Station</option>
              <option value="base">Base</option>
              <option value="city">City</option>
              <option value="settlement">Settlement</option>
            </select>
            
            <textarea
              placeholder="Description"
              value={newObject.description}
              onChange={(e) => setNewObject(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 bg-gray-700 border border-cyan-500/30 rounded text-cyan-300 placeholder-gray-500 h-20"
            />
            
            <div className="flex items-center gap-2">
              <label className="text-gray-400">Color:</label>
              <input
                type="color"
                value={newObject.color}
                onChange={(e) => setNewObject(prev => ({ ...prev, color: e.target.value }))}
                className="w-8 h-8 rounded border border-cyan-500/30"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-gray-400">Size:</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={newObject.size}
                onChange={(e) => setNewObject(prev => ({ ...prev, size: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <span className="text-cyan-300">{newObject.size}</span>
            </div>
            
            <button
              onClick={handleCreateObject}
              disabled={!newObject.name}
              className="w-full p-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white font-medium flex items-center justify-center gap-2"
            >
              <SafeIcon icon={FiPlus} />
              Create Object
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500/30">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">
          Objects ({visibleObjects.length})
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {visibleObjects.map(object => (
            <motion.div
              key={object.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-700 p-3 rounded border border-cyan-500/20"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: object.color }}
                  />
                  <span className="text-cyan-300 font-medium">{object.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onNavigateTo(object.coordinate_code)}
                    className="text-cyan-400 hover:text-cyan-300 p-1"
                  >
                    <SafeIcon icon={FiNavigation} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(object.coordinate_code)}
                    className="text-cyan-400 hover:text-cyan-300 p-1"
                  >
                    <SafeIcon icon={FiCopy} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteObject(object.id)}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Type: {object.object_type}</div>
                <div>Coordinate: {object.coordinate_code}</div>
                {object.size && <div>Size: {object.size}</div>}
              </div>
            </motion.div>
          ))}
          
          {visibleObjects.length === 0 && (
            <div className="text-gray-500 text-center py-4">
              No objects in this region. Create an object to see it here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailsTab = ({
  selectedObject,
  editMode,
  setEditMode,
  setSelectedObject,
  onUpdateObject,
  spaceObjects
}) => {
  if (!selectedObject) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500/30">
        <div className="text-gray-400 text-center py-4">
          Select an object to view details.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-lg border border-cyan-500/30">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-cyan-400">Object Details</h3>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-cyan-400 hover:text-cyan-300 p-1"
          >
            <SafeIcon icon={editMode ? FiSave : FiEdit3} className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {editMode ? (
            <>
              <div className="space-y-1">
                <label className="text-gray-400 text-sm">Name:</label>
                <input
                  type="text"
                  value={selectedObject.name}
                  onChange={(e) => setSelectedObject({ ...selectedObject, name: e.target.value })}
                  className="w-full p-2 bg-gray-700 border border-cyan-500/30 rounded text-cyan-300"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-gray-400 text-sm">Type:</label>
                <select
                  value={selectedObject.object_type}
                  onChange={(e) => setSelectedObject({ ...selectedObject, object_type: e.target.value })}
                  className="w-full p-2 bg-gray-700 border border-cyan-500/30 rounded text-cyan-300"
                >
                  <option value="planet">Planet</option>
                  <option value="star">Star</option>
                  <option value="station">Station</option>
                  <option value="base">Base</option>
                  <option value="city">City</option>
                  <option value="settlement">Settlement</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label className="text-gray-400 text-sm">Description:</label>
                <textarea
                  value={selectedObject.description || ''}
                  onChange={(e) => setSelectedObject({ ...selectedObject, description: e.target.value })}
                  className="w-full p-2 bg-gray-700 border border-cyan-500/30 rounded text-cyan-300 h-20"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-gray-400 text-sm">Color:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={selectedObject.color}
                    onChange={(e) => setSelectedObject({ ...selectedObject, color: e.target.value })}
                    className="w-8 h-8 rounded border border-cyan-500/30"
                  />
                  <span className="text-cyan-300">{selectedObject.color}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-gray-400 text-sm">Size:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={selectedObject.size || 1.0}
                    onChange={(e) => setSelectedObject({ ...selectedObject, size: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-cyan-300">{selectedObject.size || 1.0}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-gray-400 text-sm">Orbits:</label>
                <select
                  value={selectedObject.orbits_id || ''}
                  onChange={(e) => setSelectedObject({ ...selectedObject, orbits_id: e.target.value || null })}
                  className="w-full p-2 bg-gray-700 border border-cyan-500/30 rounded text-cyan-300"
                >
                  <option value="">None</option>
                  {spaceObjects
                    .filter(obj => obj.id !== selectedObject.id && obj.object_type === 'star')
                    .map(obj => (
                      <option key={obj.id} value={obj.id}>
                        {obj.name}
                      </option>
                    ))}
                </select>
              </div>
              
              {selectedObject.orbits_id && (
                <>
                  <div className="space-y-1">
                    <label className="text-gray-400 text-sm">Orbit Distance:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="1"
                        value={selectedObject.orbit_distance || 50}
                        onChange={(e) => setSelectedObject({ ...selectedObject, orbit_distance: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <span className="text-cyan-300">{selectedObject.orbit_distance || 50}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-gray-400 text-sm">Orbit Speed:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={selectedObject.orbit_speed || 1.0}
                        onChange={(e) => setSelectedObject({ ...selectedObject, orbit_speed: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                      <span className="text-cyan-300">{selectedObject.orbit_speed || 1.0}</span>
                    </div>
                  </div>
                </>
              )}
              
              <button
                onClick={onUpdateObject}
                className="w-full p-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white font-medium mt-4"
              >
                Save Changes
              </button>
            </>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-cyan-300">{selectedObject.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-cyan-300">{selectedObject.object_type}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Coordinate:</span>
                <span className="text-cyan-300">{selectedObject.coordinate_code}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Size:</span>
                <span className="text-cyan-300">{selectedObject.size || 1.0}</span>
              </div>
              
              {selectedObject.orbits_id && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orbits:</span>
                    <span className="text-cyan-300">
                      {spaceObjects.find(obj => obj.id === selectedObject.orbits_id)?.name || 'Unknown'}
                    </span>
                  </div>
                  
                  {selectedObject.orbit_distance && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Orbit Distance:</span>
                      <span className="text-cyan-300">{selectedObject.orbit_distance}</span>
                    </div>
                  )}
                  
                  {selectedObject.orbit_speed && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Orbit Speed:</span>
                      <span className="text-cyan-300">{selectedObject.orbit_speed}</span>
                    </div>
                  )}
                </>
              )}
              
              <div>
                <span className="text-gray-400">Description:</span>
                <p className="text-cyan-300 mt-1">{selectedObject.description || 'No description available.'}</p>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gray-400">Color:</span>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedObject.color }}
                />
                <span className="text-cyan-300">{selectedObject.color}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;