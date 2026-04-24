import { BASE_URL } from "@/constants/constants";

import plimit from "p-limit";
export async function getCloudinarySignature(
  uid: string,
  folder: "listings" | "pfp",
) {
  const res = await fetch(`${BASE_URL}/api/cloudinary`, {
    headers: {
      Authorization: uid,
      "x-cloud-folder": folder,
    },
  });

  return await res.json();
}

const limit = plimit(10);

export async function uploadImages(
  images: string[],
  uid: string,
): Promise<string[]> {
  const { timestamp, signature, cloudName, apiKey } =
    await getCloudinarySignature(uid, "listings");

  const imagesToUpload = images.map((image) =>
    limit(() =>
      uploadImage(image, uid, { timestamp, signature, cloudName, apiKey }),
    ),
  );

  return Promise.all(imagesToUpload);
}
export async function uploadPFP(uri: string, uid: string) {
  const { timestamp, signature, cloudName, apiKey } =
    await getCloudinarySignature(uid, "pfp");

  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: `upload_${Date.now()}.jpg`,
  } as any);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("api_key", apiKey!);
  formData.append("folder", "pfp");
  formData.append("moderation", "aws_rek");  // ← add this

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  const data = await res.json();

  
  if (data.moderation?.[0]?.status === "rejected") {
    throw new Error("IMAGE_REJECTED");
  }

  if (!data.secure_url) {
    throw new Error(data.error?.message ?? "Upload failed");
  }

  return data.secure_url;
}
export async function uploadImage(
  uri: string,
  uid: string,
  credentials?: {
    timestamp: string;
    signature: string;
    cloudName: string;
    apiKey: string;
  },
): Promise<string> {
  const { timestamp, signature, cloudName, apiKey } =
    credentials ?? (await getCloudinarySignature(uid, "listings"));

  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: `upload_${Date.now()}.jpg`,
  } as any);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("api_key", apiKey);
  formData.append("folder", "listings");

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData },
  );

  const data = await uploadRes.json();

  if (!data.secure_url) {
    console.error("Cloudinary upload failed:", JSON.stringify(data));
    throw new Error(data.error?.message ?? "Upload failed");
  }

  return data.secure_url;
}
