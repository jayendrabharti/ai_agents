"use server";

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

export async function GenerateLipSync() {
    // Function to execute a command as a Promise
    function runCommand(command) {
        return new Promise((resolve, reject) => {
            console.log(`Executing: ${command}`);
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing command: ${error.message}`);
                    return reject(error);
                }

                if (stderr) {
                    console.warn(`Command warning: ${stderr}`);
                }

                resolve(stdout);
            });
        });
    }

    try {
        const cwd = process.cwd();
        const dirPath = path.join(cwd, 'rhubarb');

        const rhubarbPath = path.join(dirPath, 'rhubarb.exe');
        const inputFilePath = path.join(dirPath, 'speech.wav');
        const outputFilePath = path.join(dirPath, 'output.json');

        try {
            await fs.access(inputFilePath);
        } catch (error) {
            throw new Error(`Input file not found: ${inputFilePath}`);
        }

        const generateCommand = `${rhubarbPath} -f json "${inputFilePath}" -o "${outputFilePath}"`;

        console.log("Rhubarb command:", generateCommand);

        await runCommand(generateCommand);

        console.log("Reading output.json...");
        const outputContent = await fs.readFile(outputFilePath, 'utf8');

        return outputContent;
    } catch (error) {
        console.error("Error in GenerateLipSync:", error);
        throw error;
    }
}