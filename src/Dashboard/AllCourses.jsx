// src/components/courses/CoursesPage.jsx
import React, { useState } from "react";
import CourseCard from "../Component/CourcesPage/CourseContent/CourseCards";
import AddCourseForm from "./AddCourseFrom";
import Button from "../Component/UI/Button";

export default function CoursesPage() {
  const courses = [
    {
      title: "React for Beginners",
      category: "Web Development",
      level: "beginner",
      instructor: "John Doe",
      description: "Learn React step by step",
      image: "https://via.placeholder.com/300",
      duration: "5h 30m",
      students: 120,
      lessons: 10,
      rating: 4.5,
      reviews: 20,
      price: 49,
      isWishlisted: false,
    },
    // Add more sample courses
  ];

  const [openForm, SetOpenForm] = useState(false);

  return (
    <div className="p-6">
      {openForm && <AddCourseForm />}
      <Button
        variant="outline"
        text="ADD FORM"
        onClick={() => SetOpenForm((prev) => !prev)}
      ></Button>

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  ${
          openForm ? "hidden" : "flex"
        }`}
      >
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
          // <h1 className="text-2xl font-bold mb-6">Courses</h1>
        ))}
      </div>
    </div>
  );
}
