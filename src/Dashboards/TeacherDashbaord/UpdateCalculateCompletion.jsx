// utils/calculateCompletion.js
export const calculateCompletion = (profile, educationList, experienceList, workPics) => {
    let totalScore = 0;
    const maxScore = 100;

    // Personal Info (45 points)
    if (profile.fullName?.trim()) totalScore += 10;
    if (profile.email?.trim()) totalScore += 10;
    if (profile.bio?.trim() && profile.bio.length >= 50) totalScore += 10;
    if (profile.phone?.trim()) totalScore += 5;
    if (profile.address?.trim()) totalScore += 5;
    if (profile.profileImageUrl) totalScore += 5;

    // Education (30 points)
    if (educationList.length > 0) {
        let educationScore = 0;
        educationList.forEach(edu => {
            if (edu.institution?.trim() && edu.degree?.trim()) {
                educationScore += 10; // Base score for complete education
                if (edu.year?.trim()) educationScore += 2;
                if (edu.description?.trim()) educationScore += 3;
            }
        });
        // Cap education score at 30
        totalScore += Math.min(educationScore, 30);
    }

    // Experience (15 points - bonus)
    if (experienceList.length > 0) {
        let experienceScore = 0;
        experienceList.forEach(exp => {
            if (exp.institution?.trim() && exp.position?.trim()) {
                experienceScore += 5; // Base score for complete experience
                if (exp.duration?.trim()) experienceScore += 2;
                if (exp.description?.trim()) experienceScore += 3;
            }
        });
        // Cap experience bonus at 15
        totalScore += Math.min(experienceScore, 15);
    }

    // Work Photos (10 points - bonus)
    if (workPics.length > 0) {
        totalScore += Math.min(workPics.length * 2, 10);
    }

    return Math.min(Math.round(totalScore), maxScore);
};

// Section-wise completion
export const calculateSectionCompletion = (profile, educationList, experienceList, workPics) => {
    return {
        personal: Math.round((
            [
                profile.fullName?.trim(),
                profile.email?.trim(),
                profile.bio?.trim() && profile.bio.length >= 50,
                profile.phone?.trim(),
                profile.address?.trim(),
                profile.profileImageUrl
            ].filter(Boolean).length / 6
        ) * 100),

        education: educationList.length > 0
            ? Math.round((
                educationList.filter(edu => edu.institution?.trim() && edu.degree?.trim()).length /
                educationList.length
            ) * 100)
            : 0,

        experience: experienceList.length > 0
            ? Math.round((
                experienceList.filter(exp => exp.institution?.trim() && exp.position?.trim()).length /
                experienceList.length
            ) * 100)
            : 0,

        workPhotos: Math.min(workPics.length * 20, 100),
    };
};