"use client";

import { useState, useRef } from "react";
import { Camera, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUpdateProfilePicture } from "@/hooks/api/useUserProfile";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  userName?: string;
}

export function ProfilePictureUpload({
  currentImageUrl,
  userName,
}: ProfilePictureUploadProps) {
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { updateProfilePicture: updateAuthProfilePicture } = useAuthContext();

  const { mutate: updateProfilePicture, isPending } = useUpdateProfilePicture();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    updateProfilePicture(
      { profilePicture: file },
      {
        onSuccess: (userData) => {
          toast.success("Profile picture updated successfully!");
          
          // Update AuthContext with new profile picture URL
          if (userData.profilePicture) {
            updateAuthProfilePicture(userData.profilePicture);
          }
          
          // Invalidate user query to refetch updated user data
          queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error) => {
          toast.error(
            error.data?.message || "Failed to update profile picture"
          );
        },
      }
    );

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Avatar className="h-24 w-24 cursor-pointer" onClick={triggerFileInput}>
          <AvatarImage src={currentImageUrl} alt={userName || "Profile"} />
          <AvatarFallback className="text-lg">
            <User className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>

        {/* Overlay on hover */}
        {(isHovered || isPending) && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer"
            onClick={triggerFileInput}
          >
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}

        {/* Loading indicator */}
        {isPending && (
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={triggerFileInput}
        disabled={isPending}
        className="text-xs"
      >
        {isPending ? "Uploading..." : "Change Picture"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
