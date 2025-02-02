"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { FaImages, FaTrash } from "react-icons/fa";

import { Button } from "./button";

interface UploadImageFormProps {
  disable?: boolean;
  onChange: (values: string[]) => void; // Updated to accept array of strings
  onRemove: (values: string[]) => void; // Updated to accept array of strings
  value: string[];
}

const UploadProductImageForm = ({
  disable,
  onChange,
  onRemove,
  value,
}: UploadImageFormProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange([...value, result.info.secure_url]); // Append new URL to existing array
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() =>
                  onRemove(value.filter((currentUrl) => currentUrl !== url))
                } // Filter out the URL to be removed
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
      <CldUploadWidget uploadPreset="wnbe67jp" onSuccess={onUpload}>
        {({ open }) => {
          return (
            <Button onClick={() => open()} disabled={disable} type="button">
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default UploadProductImageForm;
