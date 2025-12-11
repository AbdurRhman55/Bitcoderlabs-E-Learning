// data/mockData.js
export const loadMockData = () => {
    return {
        profile: {
            fullName: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@example.edu',
            phone: '+1 (555) 123-4567',
            address: '123 Education Ave, Boston, MA',
            bio: 'Dedicated educator with 10+ years of experience in STEM education, passionate about innovative teaching methods and student-centered learning approaches.',
            profileImageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?crop=faces&fit=crop&w=200&h=200',
            status: 'draft',
        },
        educationList: [
            {
                id: 1,
                institution: 'Harvard University',
                degree: 'Ph.D. in Education',
                year: '2015-2019',
                description: 'Specialized in Curriculum Development and Educational Technology'
            },
            {
                id: 2,
                institution: 'Stanford University',
                degree: 'M.Ed. in Teaching',
                year: '2012-2014',
                description: 'Focus on Educational Technology and Instructional Design'
            },
            {
                id: 3,
                institution: 'University of California',
                degree: 'B.S. in Mathematics',
                year: '2008-2012',
                description: 'Minor in Education, Graduated Summa Cum Laude'
            },
        ],
        experienceList: [
            {
                id: 1,
                institution: 'Boston High School',
                position: 'Math Department Head',
                duration: '2019-Present',
                description: 'Led curriculum redesign for STEM courses, trained 15+ teachers on new teaching methodologies, improved student performance by 25%'
            },
            {
                id: 2,
                institution: 'Lincoln Middle School',
                position: 'Mathematics Teacher',
                duration: '2015-2019',
                description: 'Implemented project-based learning approaches, developed digital assessment tools, coached robotics team to state championships'
            },
            {
                id: 3,
                institution: 'Education First Institute',
                position: 'Teaching Fellow',
                duration: '2014-2015',
                description: 'Developed new assessment methodologies, conducted educational research, published 3 papers in educational journals'
            },
        ],
        workPics: [
            {
                id: 1,
                url: 'https://images.unsplash.com/photo-1524178234883-043d5c3f3cf4?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
                caption: 'Innovative Classroom Setup 2023',
                fileName: 'classroom.jpg'
            },
            {
                id: 2,
                url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
                caption: 'Student Project Exhibition Day',
                fileName: 'exhibition.jpg'
            },
            {
                id: 3,
                url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?crop=entropy&cs=tinysrgb&fit=crop&w=400&h=300',
                caption: 'Science Fair Judging Panel',
                fileName: 'science-fair.jpg'
            },
        ],
    };
};

export const getEmptyProfile = () => ({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    profileImage: null,
    profileImageUrl: '',
    status: 'draft',
});

export const getEmptyEducation = (id) => ({
    id,
    institution: '',
    degree: '',
    year: '',
    description: '',
});

export const getEmptyExperience = (id) => ({
    id,
    institution: '',
    position: '',
    duration: '',
    description: '',
});