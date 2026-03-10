import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

export function IslandPlatform({ position,  }) {
  const { scene }   = useGLTF("/assets/models/island.glb");
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  return (
    <group position={position}>
      <primitive object={clonedScene} scale={[0.8, 0.8, 0.8]} position={[0,-2.2,0]} />
    </group>
  );
}

useGLTF.preload("/assets/models/island.glb");