"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComfirm: () => void;
  loading: boolean;
}

const AlertModal = ({
  isOpen,
  onClose,
  onComfirm,
  loading,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <Modal
        title="Are you sure you want to Delete"
        description="This action cannot be undone"
        onClose={onClose}
        isOpen={isOpen}
      >
        <div className="flex items-center gap-4 justify-end">
          <Button
            onClick={onClose}
            disabled={loading}
            variant={"outline"}
            size={"sm"}
          >
            Cancle
          </Button>
          <Button
            onClick={onComfirm}
            disabled={loading}
            variant={"destructive"}
            size={"sm"}
          >
            Comfirm
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default AlertModal;
