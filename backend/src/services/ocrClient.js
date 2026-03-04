import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { env } from "../config/env.js";

export async function extractFromWarrantyFile(filePath, originalName, mimeType) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), {
    filename: originalName || "warranty_upload",
    contentType: mimeType || "application/octet-stream"
  });

  const response = await axios.post(`${env.ocrServiceUrl}/extract`, form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
    timeout: 120000
  });

  return response.data;
}
