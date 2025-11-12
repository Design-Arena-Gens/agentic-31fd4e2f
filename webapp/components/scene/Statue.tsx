import { useMemo } from "react";
import { MeshStandardMaterial, Color } from "three";
import { useFrame } from "@react-three/fiber";

const baseColor = new Color("#8d9cc5");
const rimColor = new Color("#bfc8f5");

export default function Statue() {
  const material = useMemo(() => {
    const mat = new MeshStandardMaterial({
      color: baseColor,
      metalness: 0.25,
      roughness: 0.55
    });
    mat.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <lights_fragment_begin>",
        `
          #include <lights_fragment_begin>
          float rim = 1.0 - saturate(dot(normal, normalize(vViewPosition)));
          rim = pow(rim, 2.5);
          diffuseColor.rgb = mix(diffuseColor.rgb, ${rimColor.getStyle()}, rim * 0.8);
        `
      );
    };
    return mat;
  }, []);

  useFrame(({ clock }) => {
    const pulse = (Math.sin(clock.elapsedTime * 0.6) + 1) * 0.5;
    material.emissive.setScalar(pulse * 0.12);
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh material={material} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.55, 2.8, 16, 8, true]} />
      </mesh>
      <mesh material={material} position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.45, 32, 32]} />
      </mesh>
      <mesh material={material} position={[0, 0.4, 0.35]} castShadow>
        <boxGeometry args={[1.1, 0.4, 0.4]} />
      </mesh>
      <mesh material={material} position={[0, -1.4, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 1.1, 0.8, 24]} />
      </mesh>
    </group>
  );
}
