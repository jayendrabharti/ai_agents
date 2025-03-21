import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Avatar from "./Avatar";

export default function LawyerModel({speaking}){
    
    // const texture = useTexture("/api/media/lawyerBackground");
    const viewport = useThree((state) => state.viewport);
    
    return(
      <>
      <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 2} />
      <Avatar speaking={speaking} position={[0, -3, 0]} scale={3} />
      <Environment preset="sunset" />
      {/* <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial map={texture} />
      </mesh> */}
    </>        
    )
}