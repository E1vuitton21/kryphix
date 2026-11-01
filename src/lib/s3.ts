import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";
import * as fs from "fs";
import * as path from "path";

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || "http://localhost:9000";
const MINIO_REGION = process.env.MINIO_REGION || "us-east-1";
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || "kryphix_minio_user";
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || "kryphix_minio_secret_2026";
export const S3_VAULT_BUCKET = process.env.MINIO_BUCKET_NAME || "kryphix-vault-blobs";

export const s3Client = new S3Client({
  endpoint: MINIO_ENDPOINT,
  region: MINIO_REGION,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // Required for local MinIO
});

const LOCAL_STORAGE_DIR = path.join(process.cwd(), ".vault_data");

function ensureLocalDirExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

let bucketChecked = false;

export async function ensureVaultBucketExists(): Promise<void> {
  if (bucketChecked) return;
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: S3_VAULT_BUCKET }));
    bucketChecked = true;
  } catch (err: any) {
    if (err.$metadata?.httpStatusCode === 404 || err.name === "NotFound") {
      try {
        await s3Client.send(new CreateBucketCommand({ Bucket: S3_VAULT_BUCKET }));
        bucketChecked = true;
      } catch (createErr) {
        // Fallback to local disk
      }
    }
  }
}

export async function uploadVaultBlob(
  key: string,
  buffer: Buffer,
  contentType: string = "application/octet-stream"
): Promise<{ key: string; size: number }> {
  try {
    await ensureVaultBucketExists();
    const command = new PutObjectCommand({
      Bucket: S3_VAULT_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    await s3Client.send(command);
  } catch (s3Err) {
    // Graceful fallback to local encrypted disk
    const localFilePath = path.join(LOCAL_STORAGE_DIR, key);
    ensureLocalDirExists(localFilePath);
    fs.writeFileSync(localFilePath, buffer);
  }
  return { key, size: buffer.length };
}

export async function downloadVaultBlob(key: string): Promise<Buffer> {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_VAULT_BUCKET,
      Key: key,
    });
    const response = await s3Client.send(command);
    if (response.Body) {
      const stream = response.Body as Readable;
      return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on("error", (err) => reject(err));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
      });
    }
  } catch (s3Err) {
    // Check local fallback
    const localFilePath = path.join(LOCAL_STORAGE_DIR, key);
    if (fs.existsSync(localFilePath)) {
      return fs.readFileSync(localFilePath);
    }
  }
  throw new Error(`Blob not found: ${key}`);
}

export async function deleteVaultBlob(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_VAULT_BUCKET,
      Key: key,
    });
    await s3Client.send(command);
  } catch {}

  const localFilePath = path.join(LOCAL_STORAGE_DIR, key);
  if (fs.existsSync(localFilePath)) {
    try {
      fs.unlinkSync(localFilePath);
    } catch {}
  }
}
