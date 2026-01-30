// utils/calculateCompletion.js
export const calculateCompletion = (profile, educationList, experienceList, workPics) => {
    let totalFields = 0;
    let completedFields = 0;

    // Personal info (5 fields: name, email, phone, address, bio)
    const personalFields = ['fullName', 'email', 'phone', 'address', 'bio'];
    totalFields += 5;
    personalFields.forEach(field => {
        if (profile[field] && profile[field].trim() !== '') completedFields++;
    });

    // Profile image
    totalFields++;
    if (profile.profileImageUrl) completedFields++;

    // Education (minimum 1 complete entry = 2 fields: institution & degree)
    totalFields += 2;
    if (educationList.length > 0) {
        educationList.forEach(edu => {
            if (edu.institution && edu.institution.trim() && edu.degree && edu.degree.trim()) {
                completedFields += 2;
            }
        });
        // Cap at 100% for education
        if (completedFields > totalFields) completedFields = totalFields;
    }

    // Experience (optional bonus - adds up to 10% extra)
    if (experienceList.length > 0) {
        let experienceScore = 0;
        experienceList.forEach(exp => {
            if (exp.institution && exp.institution.trim() && exp.position && exp.position.trim()) {
                experienceScore += 2;
            }
        });
        // Add bonus (max 10% of total)
        completedFields += Math.min(experienceScore, 10);
    }

    // Work photos (bonus - up to 5% extra)
    if (workPics.length > 0) {
        completedFields += Math.min(workPics.length, 5);
    }

    const percentage = Math.round((completedFields / totalFields) * 100);
    return Math.min(percentage, 100);
};
