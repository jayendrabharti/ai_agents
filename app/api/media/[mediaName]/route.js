import { NextResponse } from 'next/server';
import { join } from 'path';
import { promises as fs } from 'fs';

const files = {
    "lawyer1": "lawyer1.png",
    "lawyer2": "lawyer2.png",
    "lawyerBackground": "lawyerBackground.jpg",
    
    "doctor1": "doctor1.png",
    "doctor2": "doctor2.png",
    "doctorBackground": "doctorBackground.jpg",
    
    "software_engineer1": "software_engineer1.png",
    "software_engineer2": "software_engineer2.png",
    "software_engineerBackground": "software_engineerBackground.jpg",
}

export const GET = async (request, { params }) => {
    try {
        const { mediaName } = await params;

        if(files[mediaName]){
            var filePath = join(process.cwd(), 'public', 'images' , files[mediaName]);
        }
        else {
            return new NextResponse("Media not found", { status: 404 });
        }

        const imageData = await fs.readFile(filePath);

        return new NextResponse(imageData, {
            status: 200,
            headers: { 'Content-Type': 'image/png' },
        });

    } catch (error) {
        return new NextResponse("Failed to get media", { status: 500 });
    }
}