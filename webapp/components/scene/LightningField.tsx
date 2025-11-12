import { useMemo, useRef } from "react";
import { Color, Group, Mesh, MeshBasicMaterial, PointLight, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

type Bolt = {
  position: Vector3;
  rotation: [number, number, number];
  height: number;
  baseIntensity: number;
};

const SPARK_COLOR = new Color("#8fb7ff");

export default function LightningField() {
  const bolts = useMemo<Bolt[]>(() => {
    const seed: Bolt[] = [];
    const positions = [
      new Vector3(-1.8, 0.2, 2.2),
      new Vector3(2.4, 0.4, 1.4),
      new Vector3(1.2, 0.1, -2.6),
      new Vector3(-2.2, 0.3, -2.8),
      new Vector3(0.6, 0.1, 3.1)
    ];
    positions.forEach((pos) => {
      seed.push({
        position: pos,
        rotation: [
          -Math.PI / 2 + (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.2
        ],
        height: 3 + Math.random() * 1.6,
        baseIntensity: 1.4 + Math.random() * 0.8
      });
    });
    return seed;
  }, []);

  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, index) => {
      const mesh = child as Mesh;
      const emissiveFactor =
        0.2 +
        Math.pow(Math.max(Math.sin(clock.elapsedTime * (3.2 + index)) + 0.4, 0), 2) *
          2.1;

      if (mesh.material) {
        const mat = mesh.material as MeshBasicMaterial;
        mat.opacity = 0.12 + Math.random() * 0.35 * emissiveFactor;
        mat.color.set(SPARK_COLOR).multiplyScalar(0.8 + emissiveFactor * 0.4);
        mat.needsUpdate = true;
      }

      const light = mesh.userData.pointLight as PointLight | undefined;
      if (light) {
        const flicker = emissiveFactor * bolts[index].baseIntensity;
        light.intensity = 0.8 + flicker * (1.4 + Math.random() * 0.4);
        light.distance = 4 + flicker * 2;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {bolts.map((bolt, index) => (
        <BoltMesh key={index} {...bolt} />
      ))}
    </group>
  );
}

function BoltMesh({ position, rotation, height }: Bolt) {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const s = 1 + Math.sin(clock.elapsedTime * 4.5) * 0.05;
    meshRef.current.scale.set(0.85 * s, 1, 0.85 * s);
  });

  return (
    <mesh position={position} rotation={rotation} ref={meshRef}>
      <coneGeometry args={[0.12, height, 6, 8, true]} />
      <meshBasicMaterial color={SPARK_COLOR} transparent opacity={0.3} />
      <pointLight
        color={SPARK_COLOR}
        intensity={1.6}
        distance={4}
        decay={2}
        position={[0, -height / 2, 0]}
        castShadow
        ref={(light) => {
          if (meshRef.current && light) {
            meshRef.current.userData.pointLight = light;
          }
        }}
      />
    </mesh>
  );
}
