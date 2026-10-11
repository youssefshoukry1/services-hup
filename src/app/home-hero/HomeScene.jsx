"use client";

import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { MOUSE, TOUCH } from "three";
import HouseModel from "./HouseModel";

const target = [0.2, 1.1, 0.35];

function ViewControls({ autoRotate, active, onInteract }) {
  const controls = useRef(null);
  const { camera, size, invalidate } = useThree();

  useEffect(() => {
    // Keep the whole property in frame even when rotated diagonally on a phone.
    camera.zoom = Math.min(size.width / 9.2, size.height / 7.7);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, invalidate]);

  useEffect(() => {
    const angle = Math.PI / 5;
    camera.position.set(target[0] + Math.sin(angle) * 11, 8.2, target[2] + Math.cos(angle) * 11);
    camera.lookAt(...target);
    controls.current?.target.set(...target);
    controls.current?.update();
    invalidate();
  }, [camera, invalidate]);

  return <OrbitControls
    ref={controls}
    makeDefault
    target={target}
    enabled={active}
    enablePan={false}
    enableZoom={false}
    enableDamping
    dampingFactor={0.08}
    rotateSpeed={0.55}
    minPolarAngle={Math.PI / 3.5}
    maxPolarAngle={Math.PI / 2.12}
    autoRotate={autoRotate && active}
    autoRotateSpeed={0.45}
    mouseButtons={{ LEFT: MOUSE.ROTATE, MIDDLE: null, RIGHT: null }}
    touches={{ ONE: TOUCH.ROTATE, TWO: TOUCH.ROTATE }}
    onStart={onInteract}
  />;
}

export default function HomeScene({ active, reducedMotion, fallback, rotating, onInteract }) {
  const autoRotate = rotating && !reducedMotion;

  return (
    <Canvas
      orthographic
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [7, 8.2, 10], zoom: 60, near: 0.1, far: 80 }}
      frameloop={active && autoRotate ? "always" : "demand"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={fallback}
      onCreated={({ gl }) => {
        gl.setClearColor("#fbfcfb", 0);
      }}
    >
      <ambientLight intensity={0.65} />
      <hemisphereLight args={["#e9f1f4", "#a9b1a2", 1.4]} />
      <directionalLight position={[-5, 9, 6]} intensity={2.6} color="#fff6e8" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-normalBias={0.025} shadow-bias={-0.0001} shadow-radius={4} />
      <directionalLight position={[5, 4, -4]} intensity={1.1} color="#d8e7ed" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.2} position={[-5, 5, 3]} rotation={[0, Math.PI / 2, 0]} scale={[6, 6, 1]} />
        <Lightformer intensity={1.8} position={[4, 4, -3]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 5, 1]} />
        <Lightformer intensity={1.5} position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[8, 8, 1]} />
      </Environment>
      <HouseModel />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.09, 0]} receiveShadow><planeGeometry args={[200, 200]} /><shadowMaterial transparent opacity={0.16} /></mesh>
      <ViewControls autoRotate={autoRotate} active={active} onInteract={onInteract} />
    </Canvas>
  );
}
