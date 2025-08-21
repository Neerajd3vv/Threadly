import { bucket } from "../utils/gcpStorage";

export async function getResume(fileName: string) {
    try {

        if (!fileName) {
            throw new Error("File name is required");
        }

        const file = bucket.file(fileName);

        // resumeBuffer is we saving raw binary in memory of the server... 
        const [resumeBuffer] = await file.download();
        return resumeBuffer;

    } catch (error) {
        console.error("Error downloading resume:", error);
        throw error;
    }
}

