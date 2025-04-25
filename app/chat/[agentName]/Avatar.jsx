"use client";
import React, { memo, useMemo, useEffect, useRef, useState, use } from 'react'
import { useFrame, useGraph } from '@react-three/fiber'
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { useClonedGLTF } from './ClonedGLTF';
import * as THREE from "three";

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

export const Avatar = memo((props)=>{
  
  const morphTargetSmoothing = 0.5;
  const { glb , lipSyncData , isSpeaking , isThinking , audio, useLipSync } = props;

  const clone = useClonedGLTF(glb);
  const { nodes, materials } = useGraph(clone)

  const idleAnimation = useMemo(() => {
    const { animations } = useFBX("/animations/IdleAnimation.fbx");
    animations[0].name = "idle";
    return animations;
  }, []);

  const [animation,setAnimation] = useState("idle");
  const groupRef = useRef(null);
  const currentAnimationRef = useRef("idle");
  
  const { actions } = useAnimations(idleAnimation,groupRef);

  useFrame(()=>{

    Object.values(corresponding).forEach((value)=>{
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary[value]
      ] = THREE.MathUtils.lerp(
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[value]
        ],
        0,
        morphTargetSmoothing
      );
      nodes.Wolf3D_Teeth.morphTargetInfluences[
        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
      ] = THREE.MathUtils.lerp(
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[value]
        ],
        0,
        morphTargetSmoothing
      );
    })
    
    if(!isSpeaking || !useLipSync){
      setAnimation('idle');
      return;
    }
    
    const currentAudioTime = audio.seek();
    
    for(let i=0; i < lipSyncData.mouthCues.length; i++){
      const mouthCue = lipSyncData.mouthCues[i];
      if(
        currentAudioTime >= mouthCue.start &&
        currentAudioTime <= mouthCue.end
      ){
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Head.morphTargetInfluences[
            nodes.Wolf3D_Head.morphTargetDictionary[
              corresponding[mouthCue.value]
            ]
          ],
          1,
          morphTargetSmoothing
        );
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
        ] = THREE.MathUtils.lerp(
          nodes.Wolf3D_Teeth.morphTargetInfluences[
            nodes.Wolf3D_Teeth.morphTargetDictionary[
              corresponding[mouthCue.value]
            ]
          ],
          1,
          morphTargetSmoothing
        );

        break;
      }
    }
  })

  useFrame((state) => {
      groupRef.current.getObjectByName("Head").lookAt(state.camera.position);
  });

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    currentAnimationRef.current = animation;
    return () => actions[animation]?.fadeOut(0.5);
}, [animation, actions]);


const visemeIndices = [
  nodes.Wolf3D_Head.morphTargetDictionary["viseme_aa"],
  nodes.Wolf3D_Head.morphTargetDictionary["viseme_O"],
  nodes.Wolf3D_Head.morphTargetDictionary["viseme_U"],
  nodes.Wolf3D_Head.morphTargetDictionary["viseme_E"],
  nodes.Wolf3D_Head.morphTargetDictionary["viseme_I"]
];

const currentVisemeIndex = useRef(0);
const visemeTimer = useRef(0);

useFrame((_, delta) => {
  if(useLipSync)return;
  // Clear all visemes
  Object.values(nodes.Wolf3D_Head.morphTargetDictionary).forEach((index) => {
    nodes.Wolf3D_Head.morphTargetInfluences[index] = 0;
    nodes.Wolf3D_Teeth.morphTargetInfluences[index] = 0;
  });

  if (isSpeaking) {
    visemeTimer.current += delta;

    // Change viseme every ~100ms
    if (visemeTimer.current > 0.1) {
      currentVisemeIndex.current = (currentVisemeIndex.current + 1) % visemeIndices.length;
      visemeTimer.current = 0;
    }

    const index = visemeIndices[currentVisemeIndex.current];
    nodes.Wolf3D_Head.morphTargetInfluences[index] = 0.5;
    nodes.Wolf3D_Teeth.morphTargetInfluences[index] = 0.5;
  }
});


useEffect(() => {
  console.log("dict:", nodes.Wolf3D_Head.morphTargetDictionary);
}, [isSpeaking]);


  return (
    <group {...props} dispose={null} ref={groupRef}>
      <primitive object={nodes.Hips} />

      <skinnedMesh 
        geometry={nodes.Wolf3D_Hair.geometry} 
        material={materials.Wolf3D_Hair} 
        skeleton={nodes.Wolf3D_Hair.skeleton} 
      />

      {nodes.Wolf3D_Glasses &&(
      <skinnedMesh 
        geometry={nodes.Wolf3D_Glasses.geometry} 
        material={materials.Wolf3D_Glasses} 
        skeleton={nodes.Wolf3D_Glasses.skeleton} 
      />
      )}

      {nodes.Wolf3D_Body &&(
      <skinnedMesh 
        geometry={nodes.Wolf3D_Body.geometry} 
        material={materials.Wolf3D_Body} 
        skeleton={nodes.Wolf3D_Body.skeleton} 
      />
      )}
      
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
})
