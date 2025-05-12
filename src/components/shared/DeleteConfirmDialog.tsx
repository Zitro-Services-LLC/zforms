
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface DeleteConfirmDialogProps {
  title: string;
  description: string;
  onDelete: () => void;
  isDeleting?: boolean;
  trigger?: React.ReactNode;
  variant?: "outline" | "destructive" | "default" | "ghost" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  buttonLabel?: string;
}

const DeleteConfirmDialog = ({
  title,
  description,
  onDelete,
  isDeleting = false,
  trigger,
  variant = "outline",
  size = "default",
  buttonLabel = "Delete"
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant={variant} size={size} className="text-red-500 hover:bg-red-50 hover:text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            {buttonLabel}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            <div className="mt-2 font-semibold text-red-600">
              This action cannot be undone.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
