import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import { useMemo } from 'react';

export function useClonedGLTF(url) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  return cloned;
}
