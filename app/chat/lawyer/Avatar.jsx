import React, { useRef, useEffect, useState } from 'react'
import { useFrame, useGraph } from '@react-three/fiber'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

export default function Avatar(props) {
  const { scene } = useGLTF('https://models.readyplayer.me/67af4a20a277aa53024f777d.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone);
  
  const [animation,setAnimation] = useState('Idle');
  const { animations: idleAnimation } = useFBX("/avatars/LawyerAnimation.fbx");
  idleAnimation[0].name = "Idle"
  const groupRef = useRef(null);
  const { actions } = useAnimations([idleAnimation[0]],groupRef)

  useEffect(() => {
    if (actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
    }
    
    return () => {
      if (actions[animation]) {
        actions[animation].fadeOut(0.5);
      }
    };
  }, [animation, actions]);
  
  // Ensure the idle animation is always set
  useEffect(() => {
    if (!actions[animation]) {
      setAnimation("Idle");
    }
  }, [actions, animation]);
  

  let vmo = 0;
  let opening = true;
  nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary["mouthSmile"]] = 0.5;

  const { speaking } = props;

  useEffect(() => {
    let interval;
    if (speaking) {
      interval = setInterval(() => {
        if (opening) {
          vmo += 0.1;
          if (vmo >= 1) opening = false;
        } else {
          vmo -= 0.1;
          if (vmo <= 0) opening = true;
        }
        nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary["mouthOpen"]] = vmo;
      }, 30);
    } else {
      nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary["mouthOpen"]] = 0;
    }
    return () => clearInterval(interval);
  }, [speaking]);


  return (
    <group ref={groupRef} {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      
      <skinnedMesh 
        geometry={nodes.Wolf3D_Hair.geometry} 
        material={materials.Wolf3D_Hair} 
        skeleton={nodes.Wolf3D_Hair.skeleton} 
      />
      
      <skinnedMesh 
        geometry={nodes.Wolf3D_Glasses.geometry} 
        material={materials.Wolf3D_Glasses} 
        skeleton={nodes.Wolf3D_Glasses.skeleton} 
      />
      
      <skinnedMesh 
        geometry={nodes.Wolf3D_Body.geometry} 
        material={materials.Wolf3D_Body} 
        skeleton={nodes.Wolf3D_Body.skeleton} 
      />
      
      <skinnedMesh 
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry} 
        material={materials.Wolf3D_Outfit_Bottom} 
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} 
      />
      
      <skinnedMesh 
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry} 
        material={materials.Wolf3D_Outfit_Footwear} 
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} 
      />
      
      <skinnedMesh 
        geometry={nodes.Wolf3D_Outfit_Top.geometry} 
        material={materials.Wolf3D_Outfit_Top} 
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton} 
      />
      
      <skinnedMesh 
        name="EyeLeft" 
        geometry={nodes.EyeLeft.geometry} 
        material={materials.Wolf3D_Eye} 
        skeleton={nodes.EyeLeft.skeleton} 
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} 
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} 
      />
      
      <skinnedMesh 
        name="EyeRight" 
        geometry={nodes.EyeRight.geometry} 
        material={materials.Wolf3D_Eye} 
        skeleton={nodes.EyeRight.skeleton} 
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} 
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} 
      />
      
      <skinnedMesh 
        name="Wolf3D_Head" 
        geometry={nodes.Wolf3D_Head.geometry} 
        material={materials.Wolf3D_Skin} 
        skeleton={nodes.Wolf3D_Head.skeleton} 
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} 
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} 
      />
      
      <skinnedMesh 
        name="Wolf3D_Teeth" 
        geometry={nodes.Wolf3D_Teeth.geometry} 
        material={materials.Wolf3D_Teeth} 
        skeleton={nodes.Wolf3D_Teeth.skeleton} 
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} 
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} 
      />
    </group>
  )
}

useGLTF.preload('https://models.readyplayer.me/67af4a20a277aa53024f777d.glb')
