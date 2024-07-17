"use client";

import { useEffect, useState } from "react";
import { CldUploadButton, CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";

import { Button } from "./button";

interface UploadImageFormProps {
  disable?: boolean;
  onChange: (values: string) => void;
  onRemove: (values: string) => void;
  value: string[];
}

const UploadImageForm = ({
  disable,
  onChange,
  onRemove,
  value,
}: UploadImageFormProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url, i) => (
          <div
            key={i}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
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
      <CldUploadWidget
        uploadPreset="wnbe67jp"
        onSuccess={(result: any) => {
          onChange(result?.info.secure_url);
        }}
      >
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

export default UploadImageForm;
