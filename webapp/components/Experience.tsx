"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Sky } from "@react-three/drei";
import CameraRail from "./scene/CameraRail";
import LightningField from "./scene/LightningField";
import Mist from "./scene/Mist";
import Statue from "./scene/Statue";
import Ground from "./scene/Ground";
import ThunderAmbience from "./scene/ThunderAmbience";

export default function Experience() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [6, 2.5, 6], fov: 42, near: 0.1, far: 100 }}
      >
        <color attach="background" args={["#03060f"]} />
        <fog attach="fog" args={["#050812", 4, 18]} />
        <Sky turbidity={16} rayleigh={0.4} mieCoefficient={0.004} mieDirectionalG={0.9} />
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[6, 12, 8]}
          intensity={0.35}
          color="#7aa2ff"
          castShadow
        />
        <Suspense fallback={null}>
          <CameraRail />
          <Statue />
          <Ground />
          <LightningField />
          <Mist />
        </Suspense>
      </Canvas>
      <ThunderAmbience />
    </>
  );
}
