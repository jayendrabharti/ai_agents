import { NextResponse } from 'next/server';
import { spawn, exec } from "child_process";
import fs from "fs";
import path from "path";

export const POST = async (request) => {
    try {
        
        const { audioBase64 } = await request.json();

        if (!audioBase64 ) {
            return new NextResponse("Missing audio data", { status: 500 });
        }
        const buffer = Buffer.from(audioBase64, "base64");
        const tempDir = path.join(process.cwd(), "public/uploads");
        const inputPath = path.join(tempDir, `input.ogg`);
        const outputPath = path.join(tempDir, "output.json");
        
        fs.mkdirSync(tempDir, { recursive: true });
        fs.writeFileSync(inputPath, buffer);

        // Run Rhubarb Lip Sync command
        const rhubarbPath = path.join(process.cwd(),"rhubarb/rhubarb");
        const command = `${rhubarbPath} -f json ${inputPath} -o ${outputPath}`;
        // const command = `${rhubarbPath} -o json -f ${outputPath} ${inputPath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error("Error executing Rhubarb:", stderr);
                return new NextResponse("Rhubarb execution failed", { status: 500 });
            }
            
            // Read generated JSON file
            if (fs.existsSync(outputPath)) {
                const phonemesData = fs.readFileSync(outputPath, "utf8");
                // return res.json(JSON.parse(phonemesData));
                return new NextResponse(JSON.parse(phonemesData), { status: 200 });
            } else {
                return new NextResponse("generation failed", { status: 500 });
            }
        });
        

    } catch (error) {
        console.log(error)
        return new NextResponse("Failed to get media", { status: 500 });
    }
}