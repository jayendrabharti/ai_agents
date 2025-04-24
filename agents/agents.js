import { doctorKnowledgeBase, lawyerKnowledgeBase, softwareEngineerKnowledgeBase } from "./knowledgeBases";

export const lawyer = {
  id: 'lawyer',
  name: 'Harvey Spector',
  role: 'Lawyer',
  gender: 'male',
  description: 'Experienced lawyer specializing in corporate law and litigation.',
  imageUrl1: '/api/media/lawyer1',
  imageUrl2: '/api/media/lawyer2',
  backgroundImage: '/api/media/lawyerBackground',
  glb: "https://models.readyplayer.me/67af4a20a277aa53024f777d.glb?morphTargets=Oculus Visemes",
  href: '/chat/lawyer',
  knowledgeBase: lawyerKnowledgeBase
};

export const doctor = {
  id: 'doctor',
  name: 'Dr. Shaun Murphy',
  role: 'Doctor',
  gender: 'male',
  description: 'A Doctor with years of experience.',
  imageUrl1: '/api/media/doctor1',
  imageUrl2: '/api/media/doctor2',
  backgroundImage: '/api/media/doctorBackground',
  glb: "https://models.readyplayer.me/68053e40679b1816822bfed0.glb?morphTargets=Oculus Visemes",
  href: '/chat/doctor',
  knowledgeBase: doctorKnowledgeBase
};

export const software_engineer = {
  id: 'software_engineer',
  name: 'Jayendra Bharti',
  role: 'Software Engineer',
  gender: 'male',
  description: 'A software Engineer with experience in FAANG companies.',
  imageUrl1: '/api/media/software_engineer1',
  imageUrl2: '/api/media/doctor2',
  backgroundImage: '/api/media/software_engineerBackground',
  glb: "https://models.readyplayer.me/680a02d76931ba0ec6c481d3.glb?morphTargets=Oculus Visemes",
  href: '/chat/software_engineer',
  knowledgeBase: softwareEngineerKnowledgeBase
};


const agents = {lawyer,doctor,software_engineer};
export default agents;

export const agentsList = [lawyer,doctor,software_engineer]; 