// utils/formHelpers.js
import { getEmptyProfile, getEmptyEducation, getEmptyExperience } from './MockData';

// Form Validation
export const validateProfile = (profile) => {
    const errors = {};

    if (!profile.fullName?.trim()) {
        errors.fullName = 'Full name is required';
    }

    if (!profile.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
        errors.email = 'Invalid email format';
    }

    if (!profile.bio?.trim()) {
        errors.bio = 'Professional bio is required';
    } else if (profile.bio.length < 50) {
        errors.bio = 'Bio should be at least 50 characters';
    }

    return errors;
};

export const validateEducation = (education) => {
    const errors = {};

    if (!education.institution?.trim()) {
        errors.institution = 'Institution name is required';
    }

    if (!education.degree?.trim()) {
        errors.degree = 'Degree is required';
    }

    return errors;
};

export const validateExperience = (experience) => {
    const errors = {};

    if (!experience.institution?.trim()) {
        errors.institution = 'Institution name is required';
    }

    if (!experience.position?.trim()) {
        errors.position = 'Position is required';
    }

    return errors;
};

// File Validation
export const validateImageFile = (file, maxSizeMB = 2) => {
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!file.type.startsWith('image/')) {
        return { valid: false, error: 'File must be an image' };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: `Image size must be less than ${maxSizeMB}MB`
        };
    }

    return { valid: true };
};

// Form Helpers
export const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    if (phone.length <= 10) return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
};

export const formatYear = (value) => {
    const year = value.replace(/\D/g, '');
    if (year.length <= 4) return year;
    if (year.length <= 8) return `${year.slice(0, 4)}-${year.slice(4)}`;
    return year.slice(0, 4);
};

// Data Export
export const exportProfileData = (profile, educationList, experienceList, workPics) => {
    return {
        personalInfo: {
            ...profile,
            profileImage: undefined, // Remove file object
        },
        education: educationList,
        experience: experienceList,
        workPhotos: workPics.map(pic => ({
            caption: pic.caption,
            fileName: pic.fileName,
        })),
        exportDate: new Date().toISOString(),
    };
};

// Data Import
export const importProfileData = (data) => {
    return {
        profile: data.personalInfo || getEmptyProfile(),
        educationList: data.education || [],
        experienceList: data.experience || [],
        workPics: data.workPhotos || [],
    };
};

// Field Completion Check
export const isFieldComplete = (value) => {
    return value && value.trim().length > 0;
};

export const isEducationComplete = (education) => {
    return isFieldComplete(education.institution) && isFieldComplete(education.degree);
};

export const isExperienceComplete = (experience) => {
    return isFieldComplete(experience.institution) && isFieldComplete(experience.position);
};

// Form Submission Validation
export const validateSubmission = (profile, educationList) => {
    const profileErrors = validateProfile(profile);
    const hasProfileErrors = Object.keys(profileErrors).length > 0;

    const hasEducation = educationList.length > 0;
    const hasCompleteEducation = educationList.some(edu => isEducationComplete(edu));

    if (hasProfileErrors) {
        return {
            valid: false,
            errors: ['Please complete all required personal information fields'],
        };
    }

    if (!hasEducation || !hasCompleteEducation) {
        return {
            valid: false,
            errors: ['Please add at least one complete education entry'],
        };
    }

    return { valid: true };
};

// Local Storage Helpers
export const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
        return false;
    }
};

export const loadFromLocalStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return null;
    }
};
