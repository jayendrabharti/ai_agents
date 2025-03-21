import { NextResponse } from 'next/server';
import { join } from 'path';
import { promises as fs } from 'fs';


export const GET = async (request, { params }) => {
    try {
        const { mediaName } = await params;

        if(mediaName == "lawyerBackground"){
            var filePath = join(process.cwd(), 'public', 'lawyerBackground.jpg');
        }
        else if(mediaName == "lawyer1"){
            var filePath = join(process.cwd(), 'public', 'lawyer1.png');
        }
        else if(mediaName == "lawyer2"){
            var filePath = join(process.cwd(), 'public', 'lawyer2.png');
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