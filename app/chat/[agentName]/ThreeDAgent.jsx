"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Avatar } from "./Avatar";

export default function ThreeDAgent({agentData,lipSyncData,isSpeaking,isThinking,audio}){
return(
<Canvas 
    shadows 
    camera={{ position: [0, 0, 8], fov: 20 }}
>

    <OrbitControls 
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 2} 
        enableRotate={false} 
    />
    
    <Avatar 
        position={[0, -4.5, 0]} 
        scale={3} 
        glb={agentData.glb}
        lipSyncData={lipSyncData}
        isSpeaking={isSpeaking}
        isThinking={isThinking}
        audio={audio}
    />
    
    <Environment 
        preset="sunset" 
    />

</Canvas>
)
}