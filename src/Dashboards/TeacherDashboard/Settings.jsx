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
    education: [],
    work_experience: [],
    projects: [],
    certifications: [],
    github: "",
    linkedin: "",
    twitter: "",
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
        education: profile.education || defaultArray,
        work_experience: profile.work_experience || defaultArray,
        projects: profile.projects || defaultArray,
        certifications: profile.certifications || defaultArray,
        github: socialLinks.github || "",
        linkedin: socialLinks.linkedin || "",
        twitter: socialLinks.twitter || "",
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

      // Prepare social links object
      const socials = {
        github: profileForm.github || "",
        linkedin: profileForm.linkedin || "",
        twitter: profileForm.twitter || ""
      };

      // Prepare the payload for a JSON PUT request
      // We must stringify any field that the backend validates with the 'json' rule.
      // Laravel's 'json' validator expects a string that passes json_decode.
      const payload = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone || "",
        title: profileForm.title || "",
        bio: profileForm.bio || "",
        portfolio_url: profileForm.portfolio_url || "",
        social_links: JSON.stringify(socials),
        specialization: JSON.stringify(profile.skills || []),
        experience: profile.experience || "Teaching",
        education: JSON.stringify(profileForm.education || []),
        work_experience: JSON.stringify(profileForm.work_experience || []),
        projects: JSON.stringify(profileForm.projects || []),
        certifications: JSON.stringify(profileForm.certifications || []),
      };

      console.log("Submitting Profile Update (JSON):", payload);

      // Call API to update profile
      const response = await apiClient.updateInstructorProfile(payload);

      // Handle response structure (usually response.data or response is the instructor)
      const instructor = response?.data?.data || response?.data || response;

      if (instructor) {
        console.log("Update success, received instructor data:", instructor);

        // Map backend response back to the local profile state
        const updatedProfile = {
          ...profile,
          name: instructor.name || profileForm.name,
          email: instructor.email || profileForm.email,
          phone: instructor.phone || profileForm.phone,
          title: instructor.title || profileForm.title,
          qualification: instructor.title || profileForm.title,
          about: instructor.bio || profileForm.bio,
          experience: instructor.experience || profile.experience,
          skills: (() => {
            try {
              if (!instructor.specialization) return profile.skills || [];
              return typeof instructor.specialization === 'string'
                ? JSON.parse(instructor.specialization)
                : instructor.specialization;
            } catch (e) {
              return profile.skills || [];
            }
          })(),
          socialLinks: (() => {
            try {
              if (!instructor.social_links) return socials;
              return typeof instructor.social_links === 'string'
                ? JSON.parse(instructor.social_links)
                : instructor.social_links;
            } catch (e) {
              return socials;
            }
          })(),
          education: instructor.education || profileForm.education,
          work_experience: instructor.work_experience || profileForm.work_experience,
          projects: instructor.projects || profileForm.projects,
          certifications: instructor.certifications || profileForm.certifications,
          portfolio_url: instructor.portfolio_url || profileForm.portfolio_url,
        };

        setProfile(updatedProfile);
        setIsEditing(false);
        showNotification("Profile updated successfully", "success");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const msg = error.response?.data?.message || error.message || "Failed to update profile";
      showNotification(msg, "error");
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
    // { id: "education", label: "Education", icon: <FaGraduationCap /> },
    // { id: "experience", label: "Experience", icon: <FaBriefcaseAlt /> },
    // { id: "certifications", label: "Certifications", icon: <FaCertificate /> },
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Personalize your teacher profile and security preferences.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          {isEditing && activeSection === "profile" ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 sm:flex-none justify-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-bold text-sm transition-all flex items-center shadow-sm"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 sm:flex-none justify-center px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all flex items-center font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                <FaSave className="mr-2" />
                {loading ? "..." : "Save"}
              </button>
            </>
          ) : activeSection === "profile" && (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 lg:p-4 overflow-x-auto lg:overflow-x-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <nav className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    if (section.id !== "profile") {
                      setIsEditing(false);
                    }
                  }}
                  className={`flex items-center px-5 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 whitespace-nowrap ${activeSection === section.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    }`}
                >
                  <span
                    className={`mr-3 text-lg ${activeSection === section.id
                      ? "text-white"
                      : "text-gray-300 transition-colors"
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
                        (profile?.profileImage)
                          ? (profile.profileImage.startsWith('http')
                            ? profile.profileImage
                            : `http://127.0.0.1:8000/storage/${profile.profileImage.replace(/^\/+/, '').replace(/^public\//, '')}`)
                          : "https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200"
                      }
                      alt={profile?.name || "Profile"}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200";
                      }}
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
                          value={profileForm.linkedin}
                          onChange={(e) =>
                            handleProfileChange("linkedin", e.target.value)
                          }
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
                          value={profileForm.twitter}
                          onChange={(e) =>
                            handleProfileChange("twitter", e.target.value)
                          }
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
                          value={profileForm.github}
                          onChange={(e) =>
                            handleProfileChange("github", e.target.value)
                          }
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
