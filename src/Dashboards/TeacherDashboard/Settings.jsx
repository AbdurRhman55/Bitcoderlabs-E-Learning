// src/components/sections/SettingsTab.jsx
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaGithub,
  FaSave,
  FaUpload,
  FaEdit,
  FaTimes,
  FaBriefcase,
  FaBook,
  FaGlobe,
  FaGraduationCap,
  FaBuilding,
  FaBriefcase as FaBriefcaseAlt,
  FaCertificate,
} from "react-icons/fa";
import { apiClient } from "../../api/index.js";

const SettingsTab = ({ profile, setProfile, showNotification }) => {
  const [activeSection, setActiveSection] = useState("profile");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Profile form state - Match API fields exactly
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    bio: "",
    experience: "",
    specialization: "",
    education: [],
    work_experience: [],
    projects: [],
    certifications: [],
    social_links: "",
    portfolio_url: "",
  });

  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      console.log("Initializing form with profile:", profile);

      // Parse social_links if it's a string
      let socialLinks = {};
      if (profile.socialLinks) {
        if (typeof profile.socialLinks === "string") {
          try {
            socialLinks = JSON.parse(profile.socialLinks);
          } catch (e) {
            console.error("Error parsing social_links:", e);
          }
        } else {
          socialLinks = profile.socialLinks;
        }
      }

      // Initialize arrays if they don't exist
      const defaultArray = [];

      setProfileForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        title: profile.title || profile.qualification || "",
        bio: profile.about || "",
        experience: profile.experience || "",
        specialization: Array.isArray(profile.skills)
          ? profile.skills.join(", ")
          : profile.skills || "",
        education: profile.education || defaultArray,
        work_experience: profile.work_experience || defaultArray,
        projects: profile.projects || defaultArray,
        certifications: profile.certifications || defaultArray,
        social_links: JSON.stringify(socialLinks) || "{}",
        portfolio_url: profile.portfolio_url || "",
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Array field handlers
  const handleArrayFieldChange = (arrayName, index, field, value) => {
    setProfileForm((prev) => {
      const newArray = [...(prev[arrayName] || [])];
      if (!newArray[index]) {
        newArray[index] = {};
      }
      newArray[index][field] = value;
      return {
        ...prev,
        [arrayName]: newArray,
      };
    });
  };

  const addArrayItem = (arrayName) => {
    setProfileForm((prev) => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), {}],
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setProfileForm((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }));
  };

  const handleSavePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }
    showNotification("Password updated successfully", "success");
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      showNotification("Name and Email are required", "error");
      return;
    }

    try {
      setLoading(true);

      // Get the current user to get the instructor ID
      console.log("Getting current user...");
      const currentUser = await apiClient.getCurrentUser();
      console.log("Current user response:", currentUser);

      // Get instructor ID from response
      const instructorId = currentUser?.user?.instructor_id;

      //   console.log(instructorId);

      if (!instructorId) {
        console.error("No instructor ID found in response:", currentUser);
        showNotification("Unable to get instructor ID from profile", "error");
        return;
      }

      // Prepare data for API - EXACTLY matching your API schema
      const updateData = new FormData();

      // Add all fields to FormData
      updateData.append("name", profileForm.name);
      updateData.append("email", profileForm.email);
      if (profileForm.phone) updateData.append("phone", profileForm.phone);
      if (profileForm.title) updateData.append("title", profileForm.title);
      if (profileForm.bio) updateData.append("bio", profileForm.bio);
      if (profileForm.experience)
        updateData.append("experience", profileForm.experience);
      if (profileForm.specialization)
        updateData.append("specialization", profileForm.specialization);
      if (profileForm.portfolio_url)
        updateData.append("portfolio_url", profileForm.portfolio_url);

      // Add social_links as JSON string
      if (profileForm.social_links && profileForm.social_links !== "{}") {
        updateData.append("social_links", profileForm.social_links);
      }

      // Add arrays as JSON strings
      if (profileForm.education.length > 0) {
        updateData.append("education", JSON.stringify(profileForm.education));
      }

      if (profileForm.work_experience.length > 0) {
        updateData.append(
          "work_experience",
          JSON.stringify(profileForm.work_experience)
        );
      }

      if (profileForm.projects.length > 0) {
        updateData.append("projects", JSON.stringify(profileForm.projects));
      }

      if (profileForm.certifications.length > 0) {
        updateData.append(
          "certifications",
          JSON.stringify(profileForm.certifications)
        );
      }

      // Add _method for Laravel to treat as PUT
      updateData.append("_method", "PUT");

      console.log("Sending FormData with fields:");
      for (let [key, value] of updateData.entries()) {
        console.log(key, value);
      }

      // Call API to update profile using FormData
      // Use updateInstructorProfile instead of updateInstructor to avoid backend temp path bug
      console.log(`Calling updateInstructorProfile`);
      const response = await apiClient.updateInstructorProfile(updateData);
      console.log("Update response:", response);

      if (response && response.data) {
        console.log("Update successful:", response.data);

        // Parse response data for local state update
        const responseData = response.data;

        // Update local state
        const updatedProfile = {
          ...profile,
          name: responseData.name || profileForm.name,
          email: responseData.email || profileForm.email,
          phone: responseData.phone || profileForm.phone,
          title: responseData.title || profileForm.title,
          qualification: responseData.title || profileForm.title, // Keep backward compatibility
          about: responseData.bio || profileForm.bio,
          experience: responseData.experience || profileForm.experience,
          skills: responseData.specialization
            ? Array.isArray(responseData.specialization)
              ? responseData.specialization
              : typeof responseData.specialization === "string"
                ? responseData.specialization.split(",").map((s) => s.trim())
                : [responseData.specialization]
            : profileForm.specialization
              .split(",")
              .map((s) => s.trim())
              .filter((s) => s),

          // Handle social_links
          socialLinks: responseData.social_links
            ? typeof responseData.social_links === "string"
              ? JSON.parse(responseData.social_links)
              : responseData.social_links
            : profileForm.social_links
              ? JSON.parse(profileForm.social_links)
              : {},

          // Handle arrays
          education: responseData.education || profileForm.education,
          work_experience:
            responseData.work_experience || profileForm.work_experience,
          projects: responseData.projects || profileForm.projects,
          certifications:
            responseData.certifications || profileForm.certifications,
          portfolio_url:
            responseData.portfolio_url || profileForm.portfolio_url,
        };

        console.log("Updated profile for state:", updatedProfile);
        setProfile(updatedProfile);
        setIsEditing(false);
        showNotification("Profile updated successfully", "success");
      } else {
        console.error("No response data from update:", response);
        showNotification("Failed to update profile - no response", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
      showNotification(
        error.message || "Error updating profile. Check console for details.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Please select an image file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image size should be less than 5MB", "error");
      return;
    }

    try {
      setImageLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("_method", "PUT");

      console.log("Uploading image for current user");
      await apiClient.updateInstructorProfile(formData);

      // Fetch fresh profile to get the correct URL
      const freshProfileResponse = await apiClient.getMyProfile();
      const freshData = freshProfileResponse.data?.data || freshProfileResponse.data;

      if (freshData) {
        const imageUrl = freshData.image;
        console.log("Refetched Image URL:", imageUrl);

        let finalImageUrl = profile.profileImage;
        if (imageUrl && typeof imageUrl === 'string' && imageUrl !== "null") {
          finalImageUrl = imageUrl.startsWith('http') ? imageUrl : `http://127.0.0.1:8000/storage/${imageUrl}`;
        }

        // Update local state
        const updatedProfile = {
          ...profile,
          profileImage: finalImageUrl,
        };

        setProfile(updatedProfile);
        showNotification("Profile picture updated successfully", "success");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showNotification(error.message || "Failed to upload image", "error");
    } finally {
      setImageLoading(false);
    }
  };

  const sections = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "education", label: "Education", icon: <FaGraduationCap /> },
    { id: "experience", label: "Experience", icon: <FaBriefcaseAlt /> },
    { id: "certifications", label: "Certifications", icon: <FaCertificate /> },
    { id: "security", label: "Security", icon: <FaLock /> },
  ];

  // Render array fields component
  const renderArraySection = (title, arrayName, fields, icon) => {
    const items = profileForm[arrayName] || [];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </h3>
          {isEditing && (
            <button
              onClick={() => addArrayItem(arrayName)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add {title.slice(0, -1)}
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No {title.toLowerCase()} added yet.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium text-gray-800">
                    {title.slice(0, -1)} #{index + 1}
                  </h4>
                  {isEditing && (
                    <button
                      onClick={() => removeArrayItem(arrayName, index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={item[field.name] || ""}
                          onChange={(e) =>
                            handleArrayFieldChange(
                              arrayName,
                              index,
                              field.name,
                              e.target.value
                            )
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary text-sm"
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded border border-gray-200">
                          <p className="text-gray-800 text-sm">
                            {item[field.name] || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
        {isEditing && activeSection === "profile" && (
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave className="mr-2" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
        {!isEditing && activeSection === "profile" && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    if (section.id !== "profile") {
                      setIsEditing(false);
                    }
                  }}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${activeSection === section.id
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <span
                    className={`mr-3 ${activeSection === section.id
                      ? "text-white"
                      : "text-gray-500"
                      }`}
                  >
                    {section.icon}
                  </span>
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeSection === "profile" && (
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Profile Picture
                </h3>
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  <div className="relative">
                    <img
                      src={
                        profile?.profileImage ||
                        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200"
                      }
                      alt={profile?.name || "Profile"}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-colors">
                        <FaUpload />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={imageLoading}
                        />
                      </label>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">
                        {isEditing
                          ? "Click the upload icon to change your profile picture"
                          : "Your current profile picture"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: Square image, at least 400x400 pixels
                      </p>
                    </div>
                    {imageLoading && (
                      <div className="text-sm text-blue-600">
                        Uploading image...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-6">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2 text-gray-500" />
                      Full Name *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          handleProfileChange("name", e.target.value)
                        }
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800">
                          {profile?.name || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2 text-gray-500" />
                      Email Address *
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          handleProfileChange("email", e.target.value)
                        }
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800">
                          {profile?.email || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2 text-gray-500" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) =>
                          handleProfileChange("phone", e.target.value)
                        }
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800">
                          {profile?.phone || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Title/Qualification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaBriefcase className="inline mr-2 text-gray-500" />
                      Title/Qualification
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileForm.title}
                        onChange={(e) =>
                          handleProfileChange("title", e.target.value)
                        }
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="e.g., Senior Software Engineer"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800">
                          {profile?.title ||
                            profile?.qualification ||
                            "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaBriefcaseAlt className="inline mr-2 text-gray-500" />
                      Experience
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileForm.experience}
                        onChange={(e) =>
                          handleProfileChange("experience", e.target.value)
                        }
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="e.g., 5+ years in web development"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800">
                          {profile?.experience || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Specialization/Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaBook className="inline mr-2 text-gray-500" />
                      Specialization/Skills
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileForm.specialization}
                        onChange={(e) =>
                          handleProfileChange("specialization", e.target.value)
                        }
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="e.g., React, Node.js, Machine Learning"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800">
                          {Array.isArray(profile?.skills)
                            ? profile.skills.join(", ")
                            : profile?.skills || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Portfolio URL */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaGlobe className="inline mr-2 text-gray-500" />
                      Portfolio URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={profileForm.portfolio_url}
                        onChange={(e) =>
                          handleProfileChange("portfolio_url", e.target.value)
                        }
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="https://yourportfolio.com"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800 truncate">
                          {profile?.portfolio_url || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bio/About Me */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      About Me / Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) =>
                          handleProfileChange("bio", e.target.value)
                        }
                        rows="4"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="Tell us about yourself, your experience, and teaching philosophy..."
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-800 whitespace-pre-line">
                          {profile?.about || "Not provided"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    <FaGlobe className="inline mr-2" />
                    Social Links
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaLinkedin className="inline mr-2 text-blue-600" />
                        LinkedIn
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profileForm.linkedin || ""}
                          onChange={(e) => {
                            try {
                              const currentLinks = JSON.parse(
                                profileForm.social_links || "{}"
                              );
                              currentLinks.linkedin = e.target.value;
                              handleProfileChange(
                                "social_links",
                                JSON.stringify(currentLinks)
                              );
                            } catch (error) {
                              console.error("Error updating LinkedIn:", error);
                            }
                          }}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="https://linkedin.com/in/username"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-800 truncate">
                            {profile?.socialLinks?.linkedin || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Twitter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaTwitter className="inline mr-2 text-blue-400" />
                        Twitter
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profileForm.twitter || ""}
                          onChange={(e) => {
                            try {
                              const currentLinks = JSON.parse(
                                profileForm.social_links || "{}"
                              );
                              currentLinks.twitter = e.target.value;
                              handleProfileChange(
                                "social_links",
                                JSON.stringify(currentLinks)
                              );
                            } catch (error) {
                              console.error("Error updating Twitter:", error);
                            }
                          }}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="https://twitter.com/username"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-800 truncate">
                            {profile?.socialLinks?.twitter || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* GitHub */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FaGithub className="inline mr-2 text-gray-800" />
                        GitHub
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profileForm.github || ""}
                          onChange={(e) => {
                            try {
                              const currentLinks = JSON.parse(
                                profileForm.social_links || "{}"
                              );
                              currentLinks.github = e.target.value;
                              handleProfileChange(
                                "social_links",
                                JSON.stringify(currentLinks)
                              );
                            } catch (error) {
                              console.error("Error updating GitHub:", error);
                            }
                          }}
                          className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          placeholder="https://github.com/username"
                        />
                      ) : (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-800 truncate">
                            {profile?.socialLinks?.github || "Not provided"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "education" && (
            <div>
              {renderArraySection(
                "Education",
                "education",
                [
                  {
                    name: "institution",
                    label: "Institution",
                    placeholder: "University Name",
                  },
                  {
                    name: "degree",
                    label: "Degree",
                    placeholder: "Bachelor of Science",
                  },
                  { name: "year", label: "Year", placeholder: "2015-2019" },
                  {
                    name: "description",
                    label: "Description",
                    placeholder: "Description of your education",
                  },
                ],
                <FaGraduationCap className="text-gray-600" />
              )}
            </div>
          )}

          {activeSection === "experience" && (
            <div>
              {renderArraySection(
                "Work Experience",
                "work_experience",
                [
                  {
                    name: "institution",
                    label: "Company/Institution",
                    placeholder: "Company Name",
                  },
                  {
                    name: "position",
                    label: "Position",
                    placeholder: "Senior Developer",
                  },
                  {
                    name: "duration",
                    label: "Duration",
                    placeholder: "2019-2023",
                  },
                  {
                    name: "description",
                    label: "Description",
                    placeholder: "Description of your role",
                  },
                ],
                <FaBriefcaseAlt className="text-gray-600" />
              )}
            </div>
          )}

          {activeSection === "certifications" && (
            <div>
              {renderArraySection(
                "Certifications",
                "certifications",
                [
                  {
                    name: "name",
                    label: "Certification Name",
                    placeholder: "AWS Certified Developer",
                  },
                  {
                    name: "issuer",
                    label: "Issuer",
                    placeholder: "Amazon Web Services",
                  },
                  {
                    name: "issue_date",
                    label: "Issue Date",
                    placeholder: "2023-01-15",
                  },
                  {
                    name: "expiry_date",
                    label: "Expiry Date",
                    placeholder: "2026-01-15",
                  },
                  {
                    name: "credential_id",
                    label: "Credential ID",
                    placeholder: "ABC123XYZ",
                  },
                ],
                <FaCertificate className="text-gray-600" />
              )}
            </div>
          )}

          {activeSection === "security" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-6">
                Security Settings
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        handleInputChange("currentPassword", e.target.value)
                      }
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter current password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        handleInputChange("newPassword", e.target.value)
                      }
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSavePassword}
                    className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <FaSave className="mr-2" />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
