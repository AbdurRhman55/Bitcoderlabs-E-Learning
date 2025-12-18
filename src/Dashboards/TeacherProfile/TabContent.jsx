// components/TabContent.jsx
import React from 'react';
import PersonalInfoTab from './PersonalInfo';
import EducationTab from './EducationTab';
import ExperienceTab from './Experiencetab';
// import WorkPhotosTab from './WorkPhotosTab';
import PreviewTab from './PreviewTab';

const TabContent = ({
    activeTab,
    profile,
    setProfile,
    educationList,
    setEducationList,
    experienceList,
    setExperienceList,
    project,
    setProjectList,
    Certification,
    setCertificationList,
    // setWorkPics,
    showNotification
}) => {
    console.log(project);

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
                projectsList={project}
                setProjectsList={setProjectList}
                Certification={Certification}
                setCertificationsList={setCertificationList}
            />
        ),

        preview: (
            <PreviewTab
                profile={profile}
                educationList={educationList}
                experienceList={experienceList}
                projectsList={project}
                certificationsList={Certification}
            // workPics={workPics}
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