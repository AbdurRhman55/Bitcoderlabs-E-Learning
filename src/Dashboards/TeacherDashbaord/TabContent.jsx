// components/TabContent.jsx
import React from 'react';
import PersonalInfoTab from './PersonalInfo';
import EducationTab from './EducationTab';
import ExperienceTab from './EducationTab';
import WorkPhotosTab from './WorkPhotosTab';
import PreviewTab from './PreviewTab';

const TabContent = ({
    activeTab,
    profile,
    setProfile,
    educationList,
    setEducationList,
    experienceList,
    setExperienceList,
    workPics,
    setWorkPics,
    showNotification
}) => {

    const tabs = {
        personal: (
            <PersonalInfoTab
                profile={profile}
                setProfile={setProfile}
                showNotification={showNotification}
            />
        ),
        education: (
            <EducationTab
                educationList={educationList}
                setEducationList={setEducationList}
                showNotification={showNotification}
            />
        ),
        experience: (
            <ExperienceTab
                experienceList={experienceList}
                setExperienceList={setExperienceList}
                showNotification={showNotification}
            />
        ),
        workPics: (
            <WorkPhotosTab
                workPics={workPics}
                setWorkPics={setWorkPics}
                showNotification={showNotification}
            />
        ),
        preview: (
            <PreviewTab
                profile={profile}
                educationList={educationList}
                experienceList={experienceList}
                workPics={workPics}
            />
        ),
    };

    return (
        <div className="transition-all duration-300">
            {tabs[activeTab] || tabs.personal}
        </div>
    );
};

export default TabContent;