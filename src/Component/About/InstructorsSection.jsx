import React, { useState, useEffect } from 'react';
import InstructorCard from './InstructorCard';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';
import { instructorsData } from '../../../Data/AboutArray';
import { apiClient } from '../../api/index.js';

export default function InstructorsSection() {
  const [instructors, setInstructors] = useState(instructorsData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getInstructors({ approval_status: 'approved' });


        if (response.data && Array.isArray(response.data) && response.data.length > 0) {

          const transformedInstructors = response.data.map((instructor) => {
            let skills = [];
            const skillsSet = new Set();

            if (instructor.specialization) {
              try {
                const parsedSpecialization = typeof instructor.specialization === 'string'
                  ? JSON.parse(instructor.specialization)
                  : instructor.specialization;

                if (Array.isArray(parsedSpecialization)) {
                  parsedSpecialization.forEach(skill => {
                    if (skill) skillsSet.add(skill);
                  });
                }
              } catch (e) {
                console.error('Error parsing specialization:', e);
              }
            }

            if (instructor.projects) {
              try {
                const projects = typeof instructor.projects === 'string'
                  ? JSON.parse(instructor.projects)
                  : instructor.projects;

                if (Array.isArray(projects)) {
                  projects.forEach(project => {
                    if (project.technologies) {
                      // Technologies are usually comma-separated strings
                      const techs = project.technologies.split(',').map(t => t.trim());
                      techs.forEach(tech => {
                        if (tech) skillsSet.add(tech);
                      });
                    }
                  });
                }
              } catch (e) {
                console.error('Error parsing projects:', e);
              }
            }

            skills = Array.from(skillsSet).slice(0, 6);

            let role = instructor.title;
            if (!role && instructor.education) {
              try {
                const education = typeof instructor.education === 'string'
                  ? JSON.parse(instructor.education)
                  : instructor.education;
                if (Array.isArray(education) && education.length > 0) {
                  role = education[0].degree;
                }
              } catch (e) {
                // ignore
              }
            }
            if (!role) role = 'Instructor';

            let social = { github: '#', linkedin: '#' };
            if (instructor.social_links) {
              try {
                const links = typeof instructor.social_links === 'string'
                  ? JSON.parse(instructor.social_links)
                  : instructor.social_links;
                social = {
                  github: links.github || '#',
                  linkedin: links.linkedin || '#'
                };
              } catch (e) {
                console.error('Error parsing social_links:', e);
              }
            }

            return {
              id: instructor.id,
              name: instructor.name || 'Instructor',
              role: role,
              bio: instructor.bio || 'Passionate educator dedicated to student success.',
              image: instructor.image
                ? `http://127.0.0.1:8000/storage/${instructor.image.replace(/^\/+/, '').replace(/^public\//, '')}`
                : null,
              skills: Array.isArray(skills) && skills.length > 0 ? skills : ['Teaching', 'Technology'],
              social: social,
              portfolio: instructor.portfolio_url || '#'
            };
          });

          setInstructors(transformedInstructors);
        } else {
          setInstructors(instructorsData);
        }
      } catch (error) {
        console.error('Error fetching instructors:', error);
        setInstructors(instructorsData);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  console.log(instructors);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full bg-gradient-to-br from-primary-light via-white to-blue-50 py-20 px-4 md:px-8 relative overflow-hidden">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
            Meet Our Instructors
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Learn from industry experts who are passionate about teaching and technology
          </p>
        </motion.div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
          </div>
        ) : (
          /* Instructor Grid */
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {instructors.map((instructor) => (
              <motion.div key={instructor.id} variants={itemVariants}>
                <InstructorCard instructor={instructor} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
