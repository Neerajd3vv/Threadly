import { Storage } from "@google-cloud/storage"

const storage = new Storage({
    projectId: process.env.GCP_STORAGE_ID,
    credentials: JSON.parse(process.env.GCP_CREDENTIALS!)
})

const bucketName = process.env.GCP_RESUME_BUCKET_NAME

export const bucket = storage.bucket(bucketName!)