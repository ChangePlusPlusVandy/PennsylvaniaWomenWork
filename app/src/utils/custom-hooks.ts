// useProfileImage.ts
import { useEffect, useState } from "react";
import { api } from "../api";

export const useProfileImage = (profile_picture_id?: string | null) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!profile_picture_id) return;

      try {
        const res = await api.get(`/api/resource/getURL/${profile_picture_id}`);
        if (res.data?.signedUrl) {
          setProfileImage(res.data.signedUrl);
        }
      } catch (error) {
        console.error("Failed to fetch profile image:", error);
        setProfileImage(null);
      }
    };

    fetchProfileImage();
  }, [profile_picture_id]);

  return profileImage;
};
