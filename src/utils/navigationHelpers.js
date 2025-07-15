import * as THREE from 'three';

export const calculateRelativeDirection = (camera, currentPosition) => {
  // Get camera direction vector
  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);
  
  // Calculate camera's right vector
  const cameraRight = new THREE.Vector3();
  cameraRight.crossVectors(camera.up, cameraDirection).normalize();
  
  return {
    forward: cameraDirection.clone().multiplyScalar(-1), // Inverted for intuitive forward
    backward: cameraDirection.clone(),
    right: cameraRight,
    left: cameraRight.clone().multiplyScalar(-1),
    up: new THREE.Vector3(0, 1, 0),
    down: new THREE.Vector3(0, -1, 0)
  };
};

export const getRelativeCoordinate = (currentCode, camera, direction) => {
  const directions = calculateRelativeDirection(camera);
  
  // Convert direction string to vector
  let moveVector;
  switch (direction) {
    case 'forward':
      moveVector = directions.forward;
      break;
    case 'backward':
      moveVector = directions.backward;
      break;
    case 'right':
      moveVector = directions.right;
      break;
    case 'left':
      moveVector = directions.left;
      break;
    case 'up':
      moveVector = directions.up;
      break;
    case 'down':
      moveVector = directions.down;
      break;
    default:
      return currentCode;
  }
  
  // Determine the dominant axis of movement
  const absX = Math.abs(moveVector.x);
  const absY = Math.abs(moveVector.y);
  const absZ = Math.abs(moveVector.z);
  
  let primaryAxis;
  if (absX > absY && absX > absZ) {
    primaryAxis = moveVector.x > 0 ? 'right' : 'left';
  } else if (absY > absX && absY > absZ) {
    primaryAxis = moveVector.y > 0 ? 'up' : 'down';
  } else {
    primaryAxis = moveVector.z > 0 ? 'backward' : 'forward';
  }
  
  // Convert to coordinate system direction
  return coordinateSystem.navigateGrid(currentCode, primaryAxis);
};

export const resetCameraOrientation = (camera, target, maintainDistance = true) => {
  const currentDistance = camera.position.distanceTo(target);
  
  // Calculate new camera position
  const newPosition = new THREE.Vector3();
  newPosition.copy(target);
  newPosition.y += currentDistance * 0.7; // Slightly above
  newPosition.z += currentDistance * 0.7; // Slightly behind
  
  return {
    position: newPosition,
    lookAt: target
  };
};