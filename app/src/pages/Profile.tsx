import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useUser, User } from "../contexts/UserContext";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../api";
import { toast } from "react-hot-toast";
import { set } from "react-hook-form";
import { useProfileImage } from "../utils/custom-hooks";

const Profile = () => {
  const { user: auth0User, logout } = useAuth0();
  const { user, error, loading, setUser } = useUser();
  const [mentorInfo, setMentorInfo] = useState<{
    first_name: string;
    last_name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    const fetchMentorInfo = async () => {
      if (user && user.role === "mentee") {
        try {
          const res = await api.get(
            `/api/mentor/mentor-for-mentee/${user._id}`
          );
          setMentorInfo(res.data);
        } catch (err) {
          console.error("Error fetching mentor info", err);
        }
      }
    };

    fetchMentorInfo();
  }, [user]);

  const profileImage = useProfileImage(user?.profile_picture_id);

  // Function to compute initials from first and last name
  const getInitials = () => {
    if (!user) return "";
    const firstInitial = user.first_name
      ? user.first_name.charAt(0).toUpperCase()
      : "";
    const lastInitial = user.last_name
      ? user.last_name.charAt(0).toUpperCase()
      : "";
    return firstInitial + lastInitial;
  };

  const handleImageUpload = async (values: any) => {
    try {
      console.log("values", values);

      if (!values.imageUpload) {
        toast.error("Please select an image");
        return;
      } else if (values.imageUpload.size > 1 * 1024 * 1024) {
        toast.error("Image size exceeds 1MB. Select a smaller image.", {
          duration: 5000,
        });
        return;
      } else if (
        !["image/jpeg", "image/png"].includes(values.imageUpload.type)
      ) {
        toast.error("Invalid image format. Only JPEG, and PNG are allowed.");
        return;
      }

      let profileImageS3id = null;

      if (values.imageUpload) {
        // Get presigned URL for the pfp
        const pfpImageResponse = await api.get(
          `/api/workshop/generate-presigned-url/${encodeURIComponent(values.imageUpload.name)}`
        );

        const { url: pfpImageUrl, objectKey: pfpImageObjectKey } =
          pfpImageResponse.data;

        // Upload the profile image to S3
        await fetch(pfpImageUrl, {
          method: "PUT",
          body: values.imageUpload,
          headers: { "Content-Type": values.imageUpload.type },
        });

        profileImageS3id = pfpImageObjectKey;
      }

      const payload = {
        profile_picture_id: profileImageS3id,
      };

      console.log("payload", payload);

      const { status } = await api.put(
        `/api/user/${encodeURIComponent(user!.auth_id)}`,
        payload
      );

      if (status === 200) {
        toast.success("Profile picture updated successfully");
        setUser({ ...user, profile_picture_id: profileImageS3id } as User);
      } else {
        toast.error("Failed to update profile picture. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Image upload failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="Profile">
        {loading ? (
          <p>Loading user info...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : auth0User && user ? (
          <div className="Block Profile-Block">
            <div className="Block-header">Profile Information</div>
            <div className="Block-subtitle">User Details and Settings</div>
            <div className="Block-content">
              <div className="Profile-avatar">
                {profileImage ? (
                  <div
                    className="Profile-avatar-image"
                    style={{
                      backgroundImage: `url(${profileImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                ) : (
                  <div className="Profile-initials">{getInitials()}</div>
                )}
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">Name:</div>
                <div>
                  {user.first_name} {user.last_name}
                </div>
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">Role:</div>
                <div>{user.role}</div>
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">Email:</div>
                <div>{user.email}</div>
              </div>
              <div className="Profile-field">
                <div className="Profile-field-label">
                  {profileImage ? "Change" : "Add"} profile picture:
                </div>

                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    handleImageUpload({ imageUpload: e.target.files?.[0] })
                  }
                />
                <div
                  className="Button Button-color--blue-1000"
                  onClick={() =>
                    document.getElementById("imageUpload")?.click()
                  }
                >
                  {profileImage ? "Change" : "Add"} Profile Picture
                </div>
              </div>
              {user.role === "mentee" && mentorInfo && (
                <div className="Profile-mentor-section">
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "1rem",
                      marginTop: "1.5rem",
                      marginBottom: "0.5rem",
                      color: "#333",
                    }}
                  >
                    Volunteer Info:
                  </div>
                  <div className="Profile-field">
                    <div className="Profile-field-label">Name:</div>
                    <div>
                      {mentorInfo.first_name} {mentorInfo.last_name}
                    </div>
                  </div>
                  <div className="Profile-field">
                    <div className="Profile-field-label">Email:</div>
                    <div>{mentorInfo.email}</div>
                  </div>
                </div>
              )}
              <div
                className="Button Button-color--blue-1000 Margin-top--20"
                onClick={() => {
                  const returnTo = window.location.origin + "/logout";
                  logout({ logoutParams: { returnTo } });
                }}
              >
                Log Out
              </div>
            </div>
          </div>
        ) : (
          <p>No user info available</p>
        )}
      </div>
    </>
  );
};

export default Profile;
