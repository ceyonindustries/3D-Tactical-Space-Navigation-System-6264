import React, { forwardRef, useRef, useEffect, useState, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { coordinateSystem } from '../utils/coordinateSystem';
import { calculateRelativeDirection, resetCameraOrientation } from '../utils/navigationHelpers';

const ThreeNavigationScene = forwardRef(({
  currentCoordinate,
  setCurrentCoordinate,
  selectedObject,
  setSelectedObject,
  spaceObjects,
  zoomLevel,
  setZoomLevel,
  onNavigate,
  setShowConsole
}, ref) => {
  // ... Rest of the component code ...

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    resetCamera: (maintainDistance = true) => {
      if (!cameraRef.current) return;
      
      const position = coordinateSystem.coordinateToPosition(currentCoordinate);
      const { position: newPos, lookAt } = resetCameraOrientation(
        cameraRef.current,
        new THREE.Vector3(position.x, position.y, position.z),
        maintainDistance
      );
      
      targetCameraPositionRef.current = {
        x: newPos.x,
        y: newPos.y,
        z: newPos.z,
        lookAt: lookAt
      };
    }
  }));

  // ... Rest of the component code ...
});

export default ThreeNavigationScene;