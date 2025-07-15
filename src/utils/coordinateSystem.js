// Update the existing coordinateSystem.js

// Add these new methods to the CoordinateSystem class:

/**
 * Get all visible cubes for the current view
 * @param {string} currentCode - Current coordinate code
 * @param {number} visibility - How many levels up/down to show
 * @returns {Array} - Array of cube objects with positions and opacity
 */
getVisibleCubes(currentCode, visibility = 1) {
  const cubes = [];
  const parts = currentCode.split('-');
  
  // Add current level
  const currentLevelCubes = this.getCubesForLevel(currentCode);
  currentLevelCubes.forEach(cube => {
    cube.opacity = 1.0;
    cube.isCurrentLevel = true;
    cubes.push(cube);
  });
  
  // Add parent levels
  for (let i = 1; i <= visibility; i++) {
    if (parts.length - i >= 0) {
      const parentCode = parts.slice(0, parts.length - i).join('-');
      const parentCubes = this.getCubesForLevel(parentCode);
      parentCubes.forEach(cube => {
        cube.opacity = 0.3 / i; // Fade out higher levels
        cube.isParentLevel = true;
        cubes.push(cube);
      });
    }
  }
  
  // Add child level preview for current cube
  if (currentCode) {
    const previewCubes = this.getCubesForLevel(`${currentCode}-N`);
    previewCubes.forEach(cube => {
      cube.opacity = 0.2;
      cube.isChildLevel = true;
      cubes.push(cube);
    });
  }
  
  return cubes;
}

/**
 * Navigate relative to camera view
 * @param {string} currentCode - Current coordinate code
 * @param {THREE.Camera} camera - Current camera
 * @param {string} direction - Desired movement direction
 * @returns {string} - New coordinate code
 */
navigateRelative(currentCode, camera, direction) {
  return getRelativeCoordinate(currentCode, camera, direction);
}

/**
 * Get the maximum allowed zoom level
 * @returns {number} - Maximum zoom level
 */
getMaxZoomLevel() {
  return 10; // Allow deep nesting, can be adjusted
}