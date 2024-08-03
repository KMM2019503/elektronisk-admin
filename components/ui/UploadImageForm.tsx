"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { RiImageAddFill } from "react-icons/ri";
import { Button } from "./button";
import { toast } from "@/components/ui/use-toast";
export interface onChangePropsType {
  url: string;
}

interface UploadImageFormProps {
  disable?: boolean;
  onChange: (values: string[]) => void;
  onRemove: (values: string) => void;
  value: string[];
}

const UploadImageForm = ({
  disable,
  onChange,
  onRemove,
  value,
}: UploadImageFormProps) => {
  const [files, setFiles] = useState<Blob[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [preview, setPreview] = useState(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const readFile = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
    });
  };

  const uploadFile = async (base64data: string): Promise<string> => {
    const response = await fetch("/api/image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file: base64data }),
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log("File uploaded successfully:", data.url);
      return data.url;
    } else {
      throw new Error(`Upload failed: ${data.error}`);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      console.error("No files selected");
      return;
    }
    setLoading(true);

    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const base64data = await readFile(file);
          return await uploadFile(base64data);
        })
      );

      console.log("UploadedUrls:", uploadedUrls);
      onChange(uploadedUrls);
      toast({
        title: "Successfully Uploaded Images",
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles([...files, ...newFiles]);
    setPreview((prev) => [
      ...prev,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleRemoveImage = (url: string) => {
    setPreview((prev) => prev.filter((image) => image !== url));
    onRemove(url);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {preview.length > 0 &&
          preview.map((url, i) => (
            <div
              key={i}
              className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
            >
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  onClick={() => handleRemoveImage(url)}
                  variant={"destructive"}
                  size={"icon"}
                  className="z-50"
                >
                  <FaTrash className="h-4 w-4" />
                </Button>
              </div>
              <Image src={url} alt="url" fill className="object-cover" />
            </div>
          ))}
      </div>
      <div className="w-full flex items-center gap-5">
        <div className="bg-grey-lighter">
          <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-gray-400">
            <RiImageAddFill className="size-8" />
            <span className="mt-2 text-base leading-normal">Select Photos</span>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
          </label>
        </div>
        <Button
          onClick={handleUpload}
          type="button"
          disabled={loading || files.length <= 0 || disable}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default UploadImageForm;
