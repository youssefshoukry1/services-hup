"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { DoubleSide, Quaternion, Shape, Vector3 } from "three";

const palette = {
  plaster: "#d2c5af",
  trim: "#d2d3ce",
  metal: "#303d42",
  glass: "#86aeb3",
  wood: "#a37c57",
  paving: "#deded7",
};

function Box({ size, color, radius = 0.012, roughness = 0.7, metalness = 0, ...props }) {
  const bevel = Math.min(radius, ...size.map((dimension) => dimension / 2));
  return <RoundedBox args={size} radius={bevel} smoothness={2} castShadow receiveShadow {...props}>
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
  </RoundedBox>;
}

function Cylinder({ size, color, metalness = 0, ...props }) {
  return <mesh castShadow receiveShadow {...props}><cylinderGeometry args={[...size, 24]} /><meshStandardMaterial color={color} roughness={0.5} metalness={metalness} /></mesh>;
}

function Beam({ from, to, radius = 0.025, color }) {
  const { length, position, quaternion } = useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);
    const direction = end.clone().sub(start);
    return { length: direction.length(), position: start.add(end).multiplyScalar(0.5), quaternion: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize()) };
  }, [from, to]);
  return <Cylinder size={[radius, radius, length]} color={color} position={position} quaternion={quaternion} />;
}

function PlasterPatch({ points, color = "#baa88e", ...props }) {
  const shape = useMemo(() => {
    const outline = new Shape();
    points.forEach(([x, y], index) => index ? outline.lineTo(x, y) : outline.moveTo(x, y));
    outline.closePath();
    return outline;
  }, [points]);
  return <mesh receiveShadow {...props}><shapeGeometry args={[shape]} /><meshStandardMaterial color={color} roughness={0.98} side={DoubleSide} /></mesh>;
}

function Crack({ points, ...props }) {
  return <group {...props}>{points.slice(1).map((point, index) => <Beam key={index} from={[...points[index], 0]} to={[...point, 0]} radius={0.009} color="#867969" />)}</group>;
}

function FacadeRepairs() {
  return <group>
    {/* A fresh coat surrounds the lower window; the uneven edge is still being rolled. */}
    <PlasterPatch position={[-1.88, 0.28, 0.963]} color="#f1eee5" points={[[0, 0], [1.22, 0], [1.22, 0.98], [1.18, 1.02], [1.22, 1.13], [1.17, 1.22], [1.2, 1.46], [0.76, 1.46], [0.68, 1.54], [0.36, 1.51], [0.27, 1.46], [0, 1.48]]} />
    <PlasterPatch position={[-0.8, 1.75, 0.964]} points={[[0, 0], [0.2, -0.05], [0.45, 0.03], [0.68, -0.02], [0.84, 0.12], [0.71, 0.22], [0.51, 0.17], [0.25, 0.24], [0.1, 0.15]]} />
    <PlasterPatch position={[-0.7, 2.49, 0.964]} points={[[0, 0], [0.07, -0.19], [0.22, -0.26], [0.31, -0.15], [0.25, 0.02], [0.33, 0.17], [0.15, 0.24], [0.04, 0.16]]} />
    <Crack position={[-0.62, 2.8, 0.969]} points={[[0, 0.27], [-0.06, 0.12], [0.02, 0.03], [-0.08, -0.13], [-0.03, -0.3]]} />
    <Crack position={[-0.7, 2.67, 0.969]} points={[[0, 0], [-0.14, -0.06], [-0.17, -0.18]]} />
    {/* Exposed masonry at the entry is being patched before painting. */}
    <PlasterPatch position={[0.36, 0.35, 0.964]} color="#b18c73" points={[[0, 0], [0.31, -0.02], [0.35, 0.12], [0.28, 0.19], [0.34, 0.32], [0.21, 0.43], [0.08, 0.39], [-0.04, 0.26], [0.02, 0.16]]} />
    {[0.08, 0.2, 0.32].map((y) => <Box key={y} size={[0.24, 0.012, 0.008]} position={[0.51, 0.35 + y, 0.971]} color="#d8c9b7" radius={0.002} />)}
    {[0.14, 0.26].map((y, index) => <Box key={y} size={[0.012, 0.11, 0.008]} position={[index ? 0.56 : 0.46, 0.35 + y, 0.971]} color="#d8c9b7" radius={0.002} />)}
    <group position={[0.784, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
      <PlasterPatch position={[-0.18, 1.78, 0]} points={[[0, 0], [0.23, -0.08], [0.46, 0.02], [0.67, -0.04], [0.78, 0.15], [0.62, 0.3], [0.38, 0.23], [0.17, 0.33], [-0.04, 0.17]]} />
      <Crack position={[0.37, 2.72, 0.006]} points={[[0, 0.23], [0.05, 0.1], [-0.04, 0], [0.03, -0.18]]} />
    </group>
    <group position={[2.585, 0, -0.1]} rotation={[0, Math.PI / 2, 0]}>
      <PlasterPatch position={[-0.53, 0.27, 0]} color="#baa991" points={[[0, 0], [0.37, -0.06], [0.65, 0.03], [0.78, 0.14], [0.66, 0.29], [0.37, 0.23], [0.19, 0.31], [-0.05, 0.18]]} />
      <Crack position={[0.42, 1.21, 0.006]} points={[[0, 0.16], [-0.09, 0.04], [-0.05, -0.11], [-0.14, -0.26]]} />
    </group>
    <group position={[-0.55, 0, -1.563]} rotation={[0, Math.PI, 0]}>
      <PlasterPatch position={[-0.5, 1.75, 0]} points={[[0, 0], [0.39, -0.05], [0.65, 0.06], [0.9, 0], [1.04, 0.19], [0.73, 0.28], [0.49, 0.23], [0.25, 0.32], [-0.06, 0.17]]} />
      <Crack position={[0, 2.7, 0.006]} points={[[0, 0.25], [-0.08, 0.12], [0.03, 0.01], [-0.05, -0.15]]} />
    </group>
    <group position={[-1.884, 0, -0.1]} rotation={[0, -Math.PI / 2, 0]}>
      <PlasterPatch position={[-0.3, 0.35, 0]} points={[[0, 0], [0.31, -0.08], [0.48, 0.03], [0.57, 0.21], [0.39, 0.36], [0.19, 0.26], [-0.06, 0.14]]} />
      <Crack position={[-0.26, 2.83, 0.006]} points={[[0, 0.14], [0.11, 0], [0.04, -0.12], [0.09, -0.25]]} />
    </group>
  </group>;
}

function Painter() {
  const skin = "#c18d66";
  const workwear = "#127b7a";
  return <group position={[-1.5, 0.17, 1.93]}>
    {/* Feet planted apart, shoulders facing the facade, both hands guiding the roller. */}
    <Box size={[0.14, 0.1, 0.24]} color="#344343" position={[-0.13, 0.045, 0.025]} radius={0.025} />
    <Box size={[0.14, 0.1, 0.24]} color="#344343" position={[0.14, 0.045, -0.08]} radius={0.025} />
    <Beam from={[-0.13, 0.1, 0.04]} to={[-0.11, 0.35, 0.01]} radius={0.065} color="#365d61" />
    <Beam from={[-0.11, 0.35, 0.01]} to={[-0.09, 0.62, 0]} radius={0.072} color="#365d61" />
    <Beam from={[0.14, 0.1, -0.08]} to={[0.11, 0.36, -0.1]} radius={0.065} color="#365d61" />
    <Beam from={[0.11, 0.36, -0.1]} to={[0.09, 0.62, 0]} radius={0.072} color="#365d61" />
    <Box size={[0.32, 0.19, 0.21]} color="#365d61" position={[0, 0.62, 0]} radius={0.055} />
    <Box size={[0.36, 0.4, 0.23]} color={workwear} position={[0, 0.88, -0.02]} rotation={[-0.09, 0, 0]} radius={0.085} />
    <Box size={[0.035, 0.33, 0.015]} color="#9cb8ab" position={[-0.09, 0.9, 0.102]} radius={0.006} />
    <Box size={[0.035, 0.33, 0.015]} color="#9cb8ab" position={[0.09, 0.9, 0.102]} radius={0.006} />
    <Box size={[0.14, 0.11, 0.02]} color="#366466" position={[0, 0.8, 0.111]} radius={0.012} />
    <Cylinder size={[0.06, 0.06, 0.12]} color={skin} position={[0, 1.1, -0.04]} />
    <mesh position={[0, 1.23, -0.055]} scale={[0.88, 1.1, 0.94]} castShadow><sphereGeometry args={[0.12, 20, 16]} /><meshStandardMaterial color={skin} roughness={0.85} /></mesh>
    <Box size={[0.045, 0.065, 0.04]} color={skin} position={[0, 1.23, -0.174]} radius={0.015} />
    <mesh position={[0, 1.31, -0.055]} castShadow><sphereGeometry args={[0.14, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#d9af57" roughness={0.6} /></mesh>
    <Cylinder size={[0.163, 0.163, 0.028]} color="#d9af57" position={[0, 1.313, -0.065]} />
    <Box size={[0.025, 0.045, 0.2]} color="#e7c67f" position={[0, 1.432, -0.055]} radius={0.014} />
    <Beam from={[0.17, 1, -0.04]} to={[0.29, 1.1, -0.23]} radius={0.063} color={workwear} />
    <Beam from={[0.29, 1.1, -0.23]} to={[0.42, 1.3, -0.5]} radius={0.046} color={skin} />
    <Beam from={[-0.17, 1, -0.04]} to={[-0.09, 0.91, -0.24]} radius={0.063} color={workwear} />
    <Beam from={[-0.09, 0.91, -0.24]} to={[0.3, 1.1, -0.33]} radius={0.046} color={skin} />
    <Box size={[0.09, 0.11, 0.085]} color="#e0ceb0" position={[0.42, 1.3, -0.5]} radius={0.027} />
    <Box size={[0.09, 0.11, 0.085]} color="#e0ceb0" position={[0.3, 1.1, -0.33]} radius={0.027} />
    <Beam from={[0.22, 0.96, -0.22]} to={[0.48, 1.53, -0.88]} radius={0.018} color="#889a94" />
    <Beam from={[0.48, 1.53, -0.88]} to={[0.48, 1.64, -0.95]} radius={0.013} color="#889a94" />
    <Beam from={[0.48, 1.64, -0.95]} to={[0.36, 1.64, -0.95]} radius={0.013} color="#889a94" />
    <Cylinder size={[0.07, 0.07, 0.35]} color="#f1eee5" position={[0.31, 1.64, -0.95]} rotation={[0, 0, Math.PI / 2]} />
  </group>;
}

function Glazing({ position, rotation = [0, 0, 0], width = 0.77, height = 0.93, panes = 2 }) {
  return <group position={position} rotation={rotation}>
    <Box size={[width + 0.12, height + 0.12, 0.1]} color={palette.trim} />
    <Box size={[width, height, 0.055]} color={palette.metal} position={[0, 0, 0.065]} />
    <mesh position={[0, 0, 0.1]}>
      <boxGeometry args={[width - 0.065, height - 0.065, 0.025]} />
      <meshPhysicalMaterial color={palette.glass} roughness={0.13} metalness={0.28} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.5} />
    </mesh>
    {panes === 2 && <Box size={[0.035, height, 0.065]} color={palette.metal} position={[0, 0, 0.12]} radius={0.005} />}
    <Box size={[width + 0.17, 0.055, 0.2]} color={palette.trim} position={[0, -height / 2 - 0.035, 0.05]} radius={0.006} />
    {/* Slightly inset pale blinds give the glass depth without an external texture. */}
    <Box size={[width * 0.21, height - 0.1, 0.015]} color="#bbc9c5" position={[-width * 0.32, 0, 0.117]} radius={0.004} />
  </group>;
}

function WallLight({ position, rotation = [0, 0, 0] }) {
  return <group position={position} rotation={rotation}>
    <Box size={[0.085, 0.2, 0.085]} color={palette.metal} />
    <mesh position={[0, -0.085, 0.045]}><boxGeometry args={[0.05, 0.025, 0.015]} /><meshStandardMaterial color="#ffe8b7" emissive="#ffdc98" emissiveIntensity={0.5} /></mesh>
  </group>;
}

function Architecture() {
  const gable = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-1.325, 0);
    shape.lineTo(0, 0.84);
    shape.lineTo(1.325, 0);
    shape.closePath();
    return shape;
  }, []);
  const pitch = Math.atan2(0.94, 1.5);

  return <group>
    <Box size={[2.65, 3, 2.5]} position={[-0.55, 1.66, -0.3]} color={palette.plaster} />
    <Box size={[2.71, 0.18, 2.56]} position={[-0.55, 0.22, -0.3]} color="#cfcec7" />
    <Box size={[2.68, 0.05, 2.53]} position={[-0.55, 1.7, -0.3]} color="#e0dfd7" radius={0.008} />
    <mesh position={[-0.55, 3.16, -1.55]} castShadow receiveShadow>
      <extrudeGeometry args={[gable, { depth: 2.5, bevelEnabled: false }]} />
      <meshStandardMaterial color={palette.plaster} roughness={0.88} />
    </mesh>
    {[-1, 1].map((side) => <group key={side} position={[-0.55 + side * 0.75, 3.63, -0.3]} rotation={[0, 0, -side * pitch]}>
      <Box size={[1.8, 0.08, 2.88]} color="#354348" radius={0.012} roughness={0.48} metalness={0.35} />
      {Array.from({ length: 12 }, (_, i) => <Box key={i} size={[1.8, 0.025, 0.018]} color="#536065" position={[0, 0.05, -1.32 + i * 0.24]} radius={0.005} metalness={0.4} />)}
      {side === 1 && <group position={[0, 0.075, -0.5]}>
        <Box size={[0.66, 0.07, 0.86]} color="#202e33" />
        <Box size={[0.55, 0.025, 0.75]} color="#85a6b0" position={[0, 0.05, 0]} roughness={0.14} metalness={0.5} />
      </group>}
    </group>)}
    <Cylinder size={[0.055, 0.055, 2.88]} color="#536065" position={[-0.55, 4.12, -0.3]} rotation={[Math.PI / 2, 0, 0]} metalness={0.4} />
    {[-2.07, 0.97].map((x) => <group key={x}>
      <Cylinder size={[0.043, 0.043, 2.87]} color="#697377" position={[x, 3.16, -0.3]} rotation={[Math.PI / 2, 0, 0]} metalness={0.35} />
      <Cylinder size={[0.027, 0.027, 2.96]} color="#697377" position={[x, 1.65, -1.48]} metalness={0.35} />
    </group>)}

    {/* Front elevation: tall entrance, wood cladding, windows on both floors. */}
    <Box size={[0.82, 1.43, 0.065]} color="#695442" position={[-0.17, 0.94, 0.98]} />
    {Array.from({ length: 12 }, (_, i) => <Box key={i} size={[0.048, 1.39, 0.025]} color={i % 3 === 0 ? "#b48c65" : palette.wood} position={[-0.53 + i * 0.065, 0.95, 1.025]} radius={0.003} />)}
    <Box size={[0.46, 1.23, 0.055]} color="#32464a" position={[-0.12, 0.86, 1.055]} />
    <Box size={[0.065, 0.99, 0.022]} color="#a5b7b6" position={[-0.25, 0.91, 1.09]} radius={0.004} roughness={0.2} />
    <Box size={[0.024, 0.28, 0.035]} color="#d0d2ca" position={[0.055, 0.85, 1.105]} radius={0.005} metalness={0.8} />
    <Box size={[1.04, 0.075, 0.54]} color={palette.metal} position={[-0.18, 1.71, 1.12]} />
    <Glazing position={[-1.2, 0.98, 0.98]} width={0.61} height={0.87} />
    <Glazing position={[-1.18, 2.43, 0.98]} width={0.66} />
    <Glazing position={[0.02, 2.43, 0.98]} width={0.74} />
    <Glazing position={[-0.55, 3.45, 0.98]} width={0.32} height={0.29} panes={1} />
    <WallLight position={[0.47, 1.14, 1.02]} />
    <Box size={[1.17, 0.12, 0.46]} color={palette.paving} position={[-0.18, 0.18, 1.17]} />
    <Box size={[1.35, 0.08, 0.4]} color={palette.paving} position={[-0.18, 0.1, 1.45]} />

    {/* Both side elevations and the back are finished for a complete 360° view. */}
    {[-1, 1].map((side) => <group key={side}>
      {[-0.95, 0.32].map((z) => <Glazing key={z} position={[-0.55 + side * 1.35, 2.43, z]} rotation={[0, side * Math.PI / 2, 0]} width={0.72} />)}
      <Glazing position={[-0.55 + side * 1.35, 0.98, -0.69]} rotation={[0, side * Math.PI / 2, 0]} width={0.85} height={0.9} />
    </group>)}
    <Glazing position={[-0.55, 0.99, -1.58]} rotation={[0, Math.PI, 0]} width={1.85} height={1.38} />
    <Glazing position={[-1.18, 2.43, -1.58]} rotation={[0, Math.PI, 0]} width={0.66} />
    <Glazing position={[0.03, 2.43, -1.58]} rotation={[0, Math.PI, 0]} width={0.74} />
    <WallLight position={[-1.7, 1.27, -1.61]} rotation={[0, Math.PI, 0]} />
    <WallLight position={[0.65, 1.27, -1.61]} rotation={[0, Math.PI, 0]} />

    {/* Attached garage with a sectional door and a metal coping. */}
    <Box size={[1.8, 1.36, 2.3]} color="#d5cab6" position={[1.68, 0.85, -0.25]} />
    <Box size={[1.94, 0.12, 2.45]} color={palette.metal} position={[1.68, 1.56, -0.25]} />
    <Box size={[1.75, 0.025, 2.24]} color="#647073" position={[1.68, 1.635, -0.25]} radius={0.006} />
    <Box size={[1.54, 1.17, 0.065]} color="#34484c" position={[1.68, 0.8, 0.935]} />
    {Array.from({ length: 8 }, (_, i) => <Box key={i} size={[1.47, 0.128, 0.028]} color={i % 2 ? "#516267" : "#57696d"} position={[1.68, 0.28 + i * 0.145, 0.982]} radius={0.004} roughness={0.45} metalness={0.25} />)}
    <Box size={[0.19, 0.024, 0.026]} color="#d0d4cf" position={[1.68, 0.83, 1.006]} radius={0.004} metalness={0.7} />
    <Glazing position={[2.6, 0.95, -0.7]} rotation={[0, Math.PI / 2, 0]} width={0.86} height={0.36} panes={1} />
    <Glazing position={[1.7, 0.95, -1.425]} rotation={[0, Math.PI, 0]} width={0.82} height={0.36} panes={1} />
  </group>;
}

function Car() {
  return <group position={[1.7, 0.12, 2.07]}>
    <Box size={[0.94, 0.29, 1.79]} position={[0, 0.37, 0]} color="#2c7276" radius={0.11} roughness={0.25} metalness={0.55} />
    <Box size={[0.83, 0.12, 0.99]} position={[0, 0.52, -0.29]} color="#3b8285" radius={0.05} roughness={0.22} metalness={0.55} />
    {[-1, 1].map((side) => <Box key={side} size={[0.085, 0.12, 0.56]} position={[side * 0.39, 0.52, 0.63]} color="#3b8285" radius={0.025} roughness={0.22} metalness={0.55} />)}
    {/* Raised hood, recessed engine bay, battery, radiator, and a visible engine block. */}
    <Box size={[0.71, 0.022, 0.51]} position={[0, 0.529, 0.63]} color="#253638" radius={0.015} />
    <Box size={[0.33, 0.13, 0.29]} position={[0.025, 0.595, 0.61]} color="#6b7b7a" radius={0.025} metalness={0.5} />
    {[-0.09, -0.03, 0.03, 0.09].map((x) => <Box key={x} size={[0.025, 0.022, 0.24]} position={[x + 0.025, 0.67, 0.61]} color="#aab6b0" radius={0.005} metalness={0.65} />)}
    <Box size={[0.16, 0.105, 0.17]} position={[-0.245, 0.59, 0.72]} color="#3b4443" radius={0.012} />
    {[-0.29, -0.2].map((x, index) => <Box key={x} size={[0.035, 0.025, 0.035]} position={[x, 0.655, 0.72]} color={index ? "#bd7257" : "#b7bdb6"} radius={0.004} metalness={0.5} />)}
    <Box size={[0.61, 0.09, 0.045]} position={[0, 0.58, 0.86]} color="#87968f" radius={0.01} metalness={0.6} />
    <Beam from={[0.2, 0.615, 0.55]} to={[0.27, 0.575, 0.81]} radius={0.023} color="#253638" />
    <group position={[0, 0.6, 0.4]} rotation={[-1.08, 0, 0]}>
      <Box size={[0.78, 0.055, 0.55]} position={[0, 0, 0.275]} color="#3b8285" radius={0.035} roughness={0.25} metalness={0.55} />
      <Box size={[0.65, 0.016, 0.42]} position={[0, -0.036, 0.28]} color="#35585b" radius={0.02} />
      <Box size={[0.035, 0.015, 0.36]} position={[0, -0.052, 0.28]} color="#587578" radius={0.006} metalness={0.4} />
    </group>
    <Beam from={[-0.32, 0.57, 0.76]} to={[-0.32, 1, 0.62]} radius={0.009} color="#a0aea7" />
    <Box size={[0.75, 0.34, 0.88]} position={[0, 0.69, -0.09]} color="#263a43" radius={0.085} roughness={0.13} metalness={0.4} />
    <Box size={[0.69, 0.06, 0.77]} position={[0, 0.86, -0.1]} color="#368085" radius={0.025} roughness={0.22} metalness={0.55} />
    <Box size={[0.64, 0.26, 0.035]} position={[0, 0.71, 0.35]} rotation={[-0.28, 0, 0]} color="#90b2ba" radius={0.025} roughness={0.12} metalness={0.5} />
    <Box size={[0.64, 0.24, 0.035]} position={[0, 0.71, -0.54]} rotation={[0.25, 0, 0]} color="#678e9b" radius={0.025} roughness={0.13} metalness={0.5} />
    {[-1, 1].map((side) => <group key={side}>
      {[-0.57, 0.58].map((z) => <group key={z} position={[side * 0.47, 0.25, z]} rotation={[0, 0, Math.PI / 2]}>
        <Cylinder size={[0.19, 0.19, 0.115]} color="#263034" />
        <Cylinder size={[0.115, 0.115, 0.12]} color="#a3aeb0" metalness={0.7} />
        <Cylinder size={[0.047, 0.047, 0.125]} color="#4c5a5f" metalness={0.6} />
      </group>)}
      <Box size={[0.025, 0.2, 0.3]} color="#89aab4" position={[side * 0.384, 0.71, 0.12]} radius={0.018} roughness={0.12} metalness={0.5} />
      <Box size={[0.025, 0.2, 0.3]} color="#7297a5" position={[side * 0.384, 0.71, -0.25]} radius={0.018} roughness={0.12} metalness={0.5} />
      <Box size={[0.08, 0.055, 0.13]} color="#3a8084" position={[side * 0.46, 0.64, 0.3]} radius={0.02} metalness={0.4} />
      <Box size={[0.026, 0.023, 0.11]} color="#cad4d4" position={[side * 0.48, 0.49, -0.08]} radius={0.006} metalness={0.7} />
      <Box size={[0.26, 0.065, 0.025]} color="#e5f1e8" position={[side * 0.27, 0.43, 0.9]} radius={0.014} />
      <Box size={[0.24, 0.065, 0.025]} color="#b46b61" position={[side * 0.27, 0.43, -0.9]} radius={0.012} />
    </group>)}
    <Box size={[0.4, 0.1, 0.03]} color="#253638" position={[0, 0.29, 0.902]} radius={0.01} />
    <Box size={[0.22, 0.05, 0.025]} color="#e8e9dd" position={[0, 0.31, 0.925]} radius={0.004} />
  </group>;
}

function Mechanic() {
  const workwear = "#385762";
  const sleeves = "#438b89";
  const skin = "#a97552";
  return <group position={[2.64, 0.17, 2.64]} rotation={[0, Math.PI / 2, 0]}>
    {/* A second worker bends over the engine from the passenger side. */}
    <Box size={[0.14, 0.1, 0.24]} position={[-0.14, 0.045, 0.04]} color="#344343" radius={0.025} />
    <Box size={[0.14, 0.1, 0.24]} position={[0.15, 0.045, -0.015]} color="#344343" radius={0.025} />
    <Beam from={[-0.14, 0.1, 0.04]} to={[-0.11, 0.34, 0.08]} radius={0.065} color={workwear} />
    <Beam from={[-0.11, 0.34, 0.08]} to={[-0.09, 0.62, -0.035]} radius={0.072} color={workwear} />
    <Beam from={[0.15, 0.1, -0.015]} to={[0.13, 0.34, 0.07]} radius={0.065} color={workwear} />
    <Beam from={[0.13, 0.34, 0.07]} to={[0.09, 0.62, -0.035]} radius={0.072} color={workwear} />
    <Box size={[0.32, 0.18, 0.21]} position={[0, 0.62, -0.035]} color={workwear} radius={0.055} />
    <Box size={[0.36, 0.4, 0.23]} position={[0, 0.84, -0.16]} rotation={[-0.6, 0, 0]} color={sleeves} radius={0.085} />
    <group position={[0, 0.84, -0.16]} rotation={[-0.6, 0, 0]}>
      <Box size={[0.24, 0.27, 0.025]} position={[0, -0.01, 0.118]} color={workwear} radius={0.018} />
      {[-0.085, 0.085].map((x) => <Box key={x} size={[0.03, 0.35, 0.018]} position={[x, 0.01, 0.132]} color="#8ba6a0" radius={0.005} />)}
    </group>
    <Beam from={[0, 1.01, -0.275]} to={[0, 1.09, -0.36]} radius={0.056} color={skin} />
    <group position={[0, 1.14, -0.42]} rotation={[-0.32, 0, 0]}>
      <mesh scale={[0.88, 1.1, 0.94]} castShadow><sphereGeometry args={[0.12, 20, 16]} /><meshStandardMaterial color={skin} roughness={0.85} /></mesh>
      <Box size={[0.045, 0.065, 0.04]} position={[0, -0.005, -0.119]} color={skin} radius={0.015} />
      <mesh position={[0, 0.073, 0]} castShadow><sphereGeometry args={[0.125, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={workwear} roughness={0.9} /></mesh>
      <Box size={[0.19, 0.025, 0.13]} position={[0, 0.076, -0.105]} color={workwear} radius={0.016} />
    </group>
    {[-1, 1].map((side) => <group key={side}>
      <Beam from={[side * 0.17, 0.98, -0.25]} to={[side * 0.23, 0.83, -0.41]} radius={0.061} color={sleeves} />
      <Beam from={[side * 0.23, 0.83, -0.41]} to={[side * 0.18, 0.54, -0.65]} radius={0.045} color={skin} />
      <Box size={[0.085, 0.09, 0.09]} position={[side * 0.18, 0.54, -0.65]} color="#87978c" radius={0.024} />
    </group>)}
    <Beam from={[0.18, 0.52, -0.65]} to={[0.13, 0.49, -0.8]} radius={0.012} color="#c2ccc4" />
    <mesh position={[0.13, 0.49, -0.8]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.033, 0.009, 8, 16, Math.PI * 1.6]} /><meshStandardMaterial color="#c2ccc4" metalness={0.75} roughness={0.3} /></mesh>
    <group position={[-0.41, 0, 0.33]}>
      <Box size={[0.43, 0.2, 0.28]} position={[0, 0.1, 0]} color="#a3634e" radius={0.025} />
      <Box size={[0.45, 0.045, 0.3]} position={[0, 0.218, 0]} color="#b9785d" radius={0.012} />
      <Box size={[0.08, 0.06, 0.012]} position={[0, 0.19, -0.155]} color="#bbc2b8" radius={0.005} metalness={0.65} />
      <Beam from={[-0.095, 0.25, 0]} to={[-0.095, 0.3, 0]} radius={0.012} color="#344343" />
      <Beam from={[0.095, 0.25, 0]} to={[0.095, 0.3, 0]} radius={0.012} color="#344343" />
      <Beam from={[-0.095, 0.3, 0]} to={[0.095, 0.3, 0]} radius={0.018} color="#344343" />
    </group>
  </group>;
}

function PaintingEquipment() {
  return <group position={[-2.17, 0.15, 1.87]}>
    <Cylinder size={[0.19, 0.16, 0.31]} color="#e5e4da" position={[0, 0.155, 0]} metalness={0.3} />
    <Cylinder size={[0.194, 0.194, 0.055]} color="#087c78" position={[0, 0.14, 0]} />
    <Cylinder size={[0.17, 0.17, 0.016]} color="#91c6ba" position={[0, 0.32, 0]} />
    <mesh position={[0, 0.33, 0]} rotation={[0, 0, 0.05]}><torusGeometry args={[0.17, 0.012, 8, 24, Math.PI]} /><meshStandardMaterial color="#839697" metalness={0.75} roughness={0.28} /></mesh>
    <group position={[0.12, 0.42, -0.17]} rotation={[0.16, 0, -0.2]}>
      <Cylinder size={[0.025, 0.025, 0.7]} color="#698480" position={[0, 0.25, 0]} metalness={0.5} />
      <Cylinder size={[0.041, 0.041, 0.25]} color="#0d7876" position={[0, -0.15, 0]} />
      <Box size={[0.21, 0.025, 0.025]} color="#899a98" position={[0.09, 0.6, 0]} radius={0.006} metalness={0.7} />
      <Cylinder size={[0.08, 0.08, 0.37]} color="#e4e6da" position={[0.15, 0.68, 0]} rotation={[0, 0, Math.PI / 2]} />
    </group>
    <Box size={[0.38, 0.05, 0.54]} color="#3c5050" position={[-0.03, 0.025, 0.48]} radius={0.018} />
    <Box size={[0.3, 0.012, 0.28]} color="#82b8aa" position={[-0.03, 0.057, 0.39]} radius={0.006} />
  </group>;
}

function CleaningEquipment() {
  return <group position={[-0.87, 0.25, 1.27]}>
    <Cylinder size={[0.12, 0.095, 0.22]} color="#96b6b2" position={[0, 0.11, 0]} />
    <Cylinder size={[0.105, 0.105, 0.016]} color="#467e80" position={[0, 0.222, 0]} />
    <mesh position={[0, 0.23, 0]}><torusGeometry args={[0.105, 0.008, 8, 20, Math.PI]} /><meshStandardMaterial color="#bcc7c3" metalness={0.5} /></mesh>
    <group position={[-0.12, 0.42, -0.06]} rotation={[0, 0, 0.13]}>
      <Cylinder size={[0.012, 0.012, 0.78]} color="#b2bfbb" metalness={0.65} />
      <Box size={[0.32, 0.035, 0.045]} color="#354a4b" position={[0, 0.4, 0]} radius={0.008} />
      <Box size={[0.31, 0.013, 0.045]} color="#79ada6" position={[0, 0.42, 0]} radius={0.004} />
    </group>
    <Box size={[0.16, 0.014, 0.12]} color="#ddcbaa" position={[0.21, 0.016, 0.01]} radius={0.005} />
  </group>;
}

function Planter({ position, width = 0.38 }) {
  return <group position={position}>
    <Box size={[width, 0.26, width]} color="#7e8c83" position={[0, 0.13, 0]} radius={0.018} />
    <mesh position={[0, 0.34, 0]} scale={[1, 0.85, 1]} castShadow><sphereGeometry args={[width * 0.54, 16, 12]} /><meshStandardMaterial color="#738d69" roughness={0.95} /></mesh>
    <mesh position={[width * 0.12, 0.4, width * 0.05]} scale={[1, 0.85, 1]} castShadow><sphereGeometry args={[width * 0.39, 16, 12]} /><meshStandardMaterial color="#8e9e77" roughness={0.95} /></mesh>
  </group>;
}

function Site() {
  return <group>
    <Box size={[6.25, 0.16, 5.9]} color="#d8ddd5" position={[0.2, 0.005, 0.35]} radius={0.055} />
    <Box size={[6.17, 0.055, 5.82]} color="#a4af95" position={[0.2, 0.11, 0.35]} radius={0.025} />
    <Box size={[2.35, 0.025, 3.01]} color="#c4c7bf" position={[1.75, 0.145, 1.57]} radius={0.008} />
    {Array.from({ length: 8 }, (_, i) => <Box key={i} size={[2.35, 0.003, 0.012]} color="#aeb4ac" position={[1.75, 0.16, 0.23 + i * 0.4]} radius={0.002} />)}
    <Box size={[1.27, 0.025, 1.43]} color={palette.paving} position={[-0.17, 0.145, 2.39]} radius={0.008} />
    {[1.91, 2.39, 2.87].map((z) => <Box key={z} size={[1.27, 0.003, 0.012]} color="#bdc2b8" position={[-0.17, 0.16, z]} radius={0.002} />)}
    <Box size={[3.16, 0.08, 0.74]} color="#a89276" position={[-0.55, 0.16, -1.99]} radius={0.012} />
    {Array.from({ length: 17 }, (_, i) => <Box key={i} size={[0.012, 0.005, 0.74]} color="#806f5b" position={[-2.02 + i * 0.183, 0.203, -1.99]} radius={0.002} />)}
    <Planter position={[-1.42, 0.2, -2.03]} width={0.43} />
    <Planter position={[0.62, 0.2, -2.03]} width={0.43} />
    <Planter position={[0.51, 0.18, 1.19]} width={0.3} />
    <Box size={[1.41, 0.012, 1.24]} color="#d4c8ad" position={[-1.72, 0.17, 1.91]} radius={0.005} />
    {[[-2.05, 1.51, 0.08], [-1.83, 2.34, 0.055], [-1.25, 2.35, 0.04]].map(([x, z, radius]) => <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.178, z]}><circleGeometry args={[radius, 12]} /><meshStandardMaterial color="#eeeade" roughness={0.95} /></mesh>)}
  </group>;
}

export default function HouseModel() {
  return <group>
    <Site />
    <Architecture />
    <FacadeRepairs />
    <Painter />
    <Car />
    <Mechanic />
    <PaintingEquipment />
    <CleaningEquipment />
  </group>;
}
