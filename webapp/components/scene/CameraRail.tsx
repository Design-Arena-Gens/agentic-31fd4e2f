import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

const TRACK_DURATION = 22; // seconds per full loop

export default function CameraRail() {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          new Vector3(-4.5, 2.2, -1.4),
          new Vector3(-5.5, 1.8, 2.5),
          new Vector3(-2.8, 1.6, 4.2),
          new Vector3(-0.8, 1.4, 2.8),
          new Vector3(0.2, 1.6, 1.8),
          new Vector3(0.6, 1.8, 0.6),
          new Vector3(0.4, 2.0, -0.4),
          new Vector3(0.0, 2.4, -1.4),
          new Vector3(-1.2, 2.8, -2.6),
          new Vector3(-3.6, 2.6, -2.2)
        ],
        true,
        "catmullrom",
        0.35
      ),
    []
  );

  const target = useMemo(() => new Vector3(0, 1.8, 0), []);
  const temp = useRef(new Vector3());

  useFrame((state, delta) => {
    const t = (state.clock.elapsedTime % TRACK_DURATION) / TRACK_DURATION;
    const eased = easeInOutSine(t);
    const position = curve.getPointAt(eased);
    const lookOffset = Math.sin(state.clock.elapsedTime * 0.35) * 0.2;
    target.set(0, 1.8 + lookOffset, 0);

    state.camera.position.lerp(position, 0.85);
    state.camera.lookAt(target);

    // subtle handheld drift
    temp.current.set(
      0.02 * Math.sin(state.clock.elapsedTime * 1.3),
      0.015 * Math.sin(state.clock.elapsedTime * 1.9),
      0.02 * Math.sin(state.clock.elapsedTime * 1.6)
    );
    state.camera.position.add(temp.current);

    state.camera.updateProjectionMatrix();
  });

  return null;
}

function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
