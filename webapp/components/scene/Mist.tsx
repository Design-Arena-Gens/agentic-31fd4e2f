import { useMemo, useRef } from "react";
import { BufferAttribute, Points } from "three";
import { useFrame } from "@react-three/fiber";

const PARTICLE_COUNT = 1600;

export default function Mist() {
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 6 + Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      const height = -1.4 + Math.random() * 3.2;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = height;
      arr[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  const speeds = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i] = 0.08 + Math.random() * 0.12;
    }
    return arr;
  }, []);

  const pointsRef = useRef<Points>(null);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const positionsAttr = pointsRef.current.geometry.getAttribute(
      "position"
    ) as BufferAttribute;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const yIndex = i * 3 + 1;
      positionsAttr.array[yIndex] += speeds[i] * delta;
      if (positionsAttr.array[yIndex] > 2.4) {
        positionsAttr.array[yIndex] = -2.2;
      }
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.32}
        transparent
        opacity={0.18}
        color="#9fb4ff"
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
