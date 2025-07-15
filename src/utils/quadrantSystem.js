export class QuadrantSystem {
  constructor() {
    this.GRID_SIZE = 1000;
    this.QUADRANT_LEVELS = 4;
    this.QUADRANT_SUBDIVISIONS = 8;
  }

  // Convert 3D position to quadrant code
  positionToQuadrant(x, y, z, level = this.QUADRANT_LEVELS) {
    const code = [];
    let currentSize = this.GRID_SIZE;
    let currentX = x + this.GRID_SIZE / 2;
    let currentY = y + this.GRID_SIZE / 2;
    let currentZ = z + this.GRID_SIZE / 2;

    for (let i = 0; i < level; i++) {
      const subdivisionSize = currentSize / this.QUADRANT_SUBDIVISIONS;
      
      const xIndex = Math.min(
        Math.max(Math.floor(currentX / subdivisionSize), 0),
        this.QUADRANT_SUBDIVISIONS - 1
      );
      
      const yIndex = Math.min(
        Math.max(Math.floor(currentY / subdivisionSize), 0),
        this.QUADRANT_SUBDIVISIONS - 1
      );
      
      const zIndex = Math.min(
        Math.max(Math.floor(currentZ / subdivisionSize), 0),
        this.QUADRANT_SUBDIVISIONS - 1
      );

      // Use a simpler indexing scheme for better reliability
      // A-1-3 format (level-x-y-z)
      code.push(String.fromCharCode(65 + i) + '-' + xIndex + '-' + zIndex);
      
      currentX = currentX % subdivisionSize;
      currentY = currentY % subdivisionSize;
      currentZ = currentZ % subdivisionSize;
      currentSize = subdivisionSize;
    }

    // Return only the first 2 elements to keep it simpler
    return code.slice(0, 2).join('-');
  }

  // Convert quadrant code to 3D position
  quadrantToPosition(quadrantCode) {
    const parts = quadrantCode.split('-');
    
    // For simplicity, we'll use a fixed position for each quadrant
    // This is a simplified approach that doesn't match the exact conversion
    // but will work for visual representation
    
    // Extract the level and indices
    const level = parts[0].charCodeAt(0) - 65; // A=0, B=1, etc.
    const xIndex = parseInt(parts[1]);
    const zIndex = parseInt(parts[2]);
    
    // Calculate position based on grid size and subdivision
    const subdivisionSize = this.GRID_SIZE / Math.pow(this.QUADRANT_SUBDIVISIONS, level + 1);
    const x = (xIndex * subdivisionSize) - (this.GRID_SIZE / 2) + (subdivisionSize / 2);
    const z = (zIndex * subdivisionSize) - (this.GRID_SIZE / 2) + (subdivisionSize / 2);
    
    // Y is arbitrary for this simple implementation
    const y = 0;
    
    return { x, y, z };
  }

  // Get quadrant bounds for a given code
  getQuadrantBounds(quadrantCode) {
    const position = this.quadrantToPosition(quadrantCode);
    const parts = quadrantCode.split('-');
    const level = parts[0].charCodeAt(0) - 65; // A=0, B=1, etc.
    
    const size = this.GRID_SIZE / Math.pow(this.QUADRANT_SUBDIVISIONS, level + 1);
    
    return {
      min: {
        x: position.x - (size / 2),
        y: position.y - (size / 2),
        z: position.z - (size / 2)
      },
      max: {
        x: position.x + (size / 2),
        y: position.y + (size / 2),
        z: position.z + (size / 2)
      },
      size
    };
  }

  // Get a human-readable quadrant description
  getQuadrantDescription(quadrantCode) {
    const parts = quadrantCode.split('-');
    const level = parts[0].charCodeAt(0) - 65 + 1; // A=1, B=2, etc.
    const position = this.quadrantToPosition(quadrantCode);
    
    return {
      code: quadrantCode,
      level: level,
      position: position,
      description: `Sector ${parts[0]}${parts.length > 1 ? ` / Sub-${parts.slice(1).join('-')}` : ''}`,
      coordinates: `${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`
    };
  }
}

export const quadrantSystem = new QuadrantSystem();