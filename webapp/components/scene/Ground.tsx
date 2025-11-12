import { useMemo } from "react";
import { RepeatWrapping, TextureLoader, Vector2 } from "three";
import { useLoader } from "@react-three/fiber";

export default function Ground() {
  const texture = useLoader(TextureLoader, "https://raw.githubusercontent.com/pmndrs/drei-assets/master/textures/floor/pebbles.jpg");

  useMemo(() => {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.copy(new Vector2(6, 6));
  }, [texture]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        map={texture}
        color="#1f2437"
        roughness={0.95}
        metalness={0.05}
      />
    </mesh>
  );
}
