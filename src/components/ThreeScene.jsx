import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { quadrantSystem } from '../utils/quadrantSystem';

const ThreeScene = ({ 
  onQuadrantSelect, 
  selectedQuadrant, 
  savedLocations, 
  missions, 
  units, 
  cameraPosition, 
  setCameraPosition 
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [keys, setKeys] = useState({});

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      5000
    );
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ff88, 0.8);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    // Create grid system
    const gridHelper = new THREE.GridHelper(1000, 20, 0x00ff88, 0x004422);
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Create star field
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });
    const starVertices = [];
    
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Handle camera movement
      handleCameraMovement();
      
      renderer.render(scene, camera);
    };

    animate();

    // Event listeners
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    const handleMouseMove = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((event.clientY - rect.top) / rect.height) * 2 + 1
      });
    };

    const handleMouseClick = (event) => {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mousePosition, camera);
      
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const quadrantCode = quadrantSystem.positionToQuadrant(point.x, point.y, point.z);
        onQuadrantSelect(quadrantCode, point);
      }
    };

    const handleKeyDown = (event) => {
      setKeys(prev => ({ ...prev, [event.code]: true }));
    };

    const handleKeyUp = (event) => {
      setKeys(prev => ({ ...prev, [event.code]: false }));
    };

    const handleWheel = (event) => {
      const zoomSpeed = 0.1;
      const direction = event.deltaY > 0 ? 1 : -1;
      
      // Zoom in/out
      const newPosition = camera.position.clone();
      newPosition.multiplyScalar(1 + direction * zoomSpeed);
      camera.position.copy(newPosition);
      
      setCameraPosition({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      });
    };

    // Camera movement handler
    const handleCameraMovement = () => {
      const moveSpeed = 2;
      const rotateSpeed = 0.02;
      
      if (keys['KeyW']) camera.position.z -= moveSpeed;
      if (keys['KeyS']) camera.position.z += moveSpeed;
      if (keys['KeyA']) camera.position.x -= moveSpeed;
      if (keys['KeyD']) camera.position.x += moveSpeed;
      if (keys['ArrowUp']) camera.position.y += moveSpeed;
      if (keys['ArrowDown']) camera.position.y -= moveSpeed;
      
      if (keys['KeyQ']) {
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotateSpeed);
      }
      
      if (keys['KeyE']) {
        camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -rotateSpeed);
      }
      
      camera.lookAt(0, 0, 0);
      
      setCameraPosition({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
      });
    };

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    mountRef.current.addEventListener('mousemove', handleMouseMove);
    mountRef.current.addEventListener('click', handleMouseClick);
    mountRef.current.addEventListener('wheel', handleWheel);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove);
        mountRef.current.removeEventListener('click', handleMouseClick);
        mountRef.current.removeEventListener('wheel', handleWheel);
        mountRef.current.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);

  // Update objects when data changes
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Clear existing markers
    const objectsToRemove = [];
    
    sceneRef.current.traverse((child) => {
      if (child.userData && (
        child.userData.type === 'location' || 
        child.userData.type === 'mission' || 
        child.userData.type === 'unit' ||
        child.userData.type === 'highlight'
      )) {
        objectsToRemove.push(child);
      }
    });
    
    objectsToRemove.forEach(obj => sceneRef.current.remove(obj));

    // Add saved locations
    savedLocations.forEach(location => {
      const geometry = new THREE.SphereGeometry(5, 8, 8);
      const material = new THREE.MeshBasicMaterial({
        color: location.color || 0x00ff88,
        transparent: true,
        opacity: 0.8
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(location.position_x, location.position_y, location.position_z);
      sphere.userData = { type: 'location', data: location };
      
      sceneRef.current.add(sphere);
    });

    // Add missions
    missions.forEach(mission => {
      const geometry = new THREE.ConeGeometry(5, 10, 8);
      const material = new THREE.MeshBasicMaterial({
        color: mission.priority === 'high' ? 0xff0000 : 
              mission.priority === 'medium' ? 0xffff00 : 0x00ff00,
        transparent: true,
        opacity: 0.8
      });
      
      const cone = new THREE.Mesh(geometry, material);
      cone.position.set(mission.position_x, mission.position_y, mission.position_z);
      cone.userData = { type: 'mission', data: mission };
      
      sceneRef.current.add(cone);
    });

    // Add units
    units.forEach(unit => {
      const geometry = new THREE.BoxGeometry(8, 4, 12);
      const material = new THREE.MeshBasicMaterial({
        color: unit.status === 'active' ? 0x0088ff : 0x888888,
        transparent: true,
        opacity: 0.8
      });
      
      const box = new THREE.Mesh(geometry, material);
      box.position.set(unit.position_x, unit.position_y, unit.position_z);
      box.userData = { type: 'unit', data: unit };
      
      sceneRef.current.add(box);
    });

    // Highlight selected quadrant
    if (selectedQuadrant) {
      try {
        const position = quadrantSystem.quadrantToPosition(selectedQuadrant);
        const size = 50; // Fixed size for visual clarity
        
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff88,
          opacity: 0.2,
          transparent: true,
          wireframe: true
        });
        
        const highlightBox = new THREE.Mesh(geometry, material);
        highlightBox.position.set(position.x, position.y, position.z);
        highlightBox.userData = { type: 'highlight' };
        
        sceneRef.current.add(highlightBox);
      } catch (error) {
        console.error("Error highlighting quadrant:", error);
      }
    }
  }, [savedLocations, missions, units, selectedQuadrant]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full" 
      style={{ cursor: 'crosshair' }}
    />
  );
};

export default ThreeScene;