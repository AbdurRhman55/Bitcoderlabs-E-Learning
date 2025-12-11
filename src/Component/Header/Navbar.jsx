import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Play, ArrowRight, Menu, X } from "lucide-react";
import Button from "../UI/Button";
import { blogs } from "../../../Data/BlogcardsArray";
import { useSelector,useDispatch } from "react-redux";
import { logout } from "../../../slices/AuthSlice";

const Navbar = () => {
  const [Users, setUsers] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState("beginner");
  const [activeCourse, setActiveCourse] = useState(null);
  const coursesDropdownRef = useRef(null);
  const location = useLocation();
  const token = localStorage.getItem("token");

  const Logout = useDispatch()

  const submitLogout=()=>{
     Logout(logout())

  }


  async function getUser() {
    const res = await fetch("http://127.0.0.1:8000/api/v1/me", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      bearerToken: localStorage.getItem("token"),
    })
    const data = await res.json();
    setUsers(data.user);
  }

  useEffect(() => {
    getUser();
  }, [])

  console.log(Users);


  const courseToSubcourses = {
    "html-basics": "html-basics-subcourses",
    "intro-css": "intro-css-subcourses",
    "js-basics": "js-basics-subcourses",
    "git-basics": "html-basics-subcourses",
    "react-fundamentals": "intro-css-subcourses",
    "nodejs-basics": "js-basics-subcourses",
    "tailwind-projects": "intro-css-subcourses",
    "mongodb-basics": "js-basics-subcourses",
    "full-stack": "full-stack-subcourses",
    "api-integration": "full-stack-subcourses",
    "nextjs-advanced": "full-stack-subcourses",
    microservices: "full-stack-subcourses",
  };

  const courseLevels = {
    beginner: [
      { id: "html-basics", name: "HTML Basics" },
      { id: "intro-css", name: "Intro to CSS" },
      { id: "js-basics", name: "JavaScript Basics" },
      { id: "git-basics", name: "Git Basics" },
    ],
    intermediate: [
      { id: "react-fundamentals", name: "React Fundamentals" },
      { id: "nodejs-basics", name: "Node.js Basics" },
      { id: "tailwind-projects", name: "Tailwind CSS Projects" },
      { id: "mongodb-basics", name: "MongoDB Basics" },
    ],
    advanced: [
      { id: "full-stack", name: "Full Stack Development" },
      { id: "api-integration", name: "API Integration" },
      { id: "nextjs-advanced", name: "Next.js Advanced" },
      { id: "microservices", name: "Microservices Architecture" },
    ],
  };

  const subcourses = {
    "html-basics-subcourses": [
      { name: "HTML Structure & Syntax" },
      { name: "Forms & Inputs" },
      { name: "Semantic HTML" },
      { name: "HTML5 Features" },
    ],
    "intro-css-subcourses": [
      { name: "CSS Selectors" },
      { name: "Box Model" },
      { name: "Flexbox" },
      { name: "CSS Grid" },
    ],
    "js-basics-subcourses": [
      { name: "Variables & Data Types" },
      { name: "Functions & Scope" },
      { name: "DOM Manipulation" },
      { name: "Event Handling" },
    ],
    "full-stack-subcourses": [
      { name: "Frontend Development" },
      { name: "Backend Development" },
      { name: "Database Integration" },
      { name: "Deployment Strategies" },
    ],
  };

  const handleLevelHover = (level) => {
    setActiveLevel(level);
    setActiveCourse(null);
  };

  const handleCourseHover = (courseId) => {
    setActiveCourse(courseId);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
    setActiveCourse(null);
    setActiveLevel("beginner");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        !event.target.closest("#mobile-menu") &&
        !event.target.closest("#menu-btn")
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const MobileCoursesDropdown = () => {
    const [mobileActiveLevel, setMobileActiveLevel] = useState("beginner");
    const [mobileActiveCourse, setMobileActiveCourse] = useState(null);

    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
            Course Levels
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {["beginner", "intermediate", "advanced"].map((level) => (
              <button
                key={level}
                className={`p-3 rounded-lg transition-all duration-200 border text-sm font-medium capitalize ${mobileActiveLevel === level
                  ? "bg-primary-dark text-white border-primary-dark"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary-dark hover:text-primary-dark"
                  }`}
                onClick={() => {
                  setMobileActiveLevel(level);
                  setMobileActiveCourse(null);
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
            Courses
          </h3>
          <div className="space-y-2">
            {courseLevels[mobileActiveLevel]?.map((course) => (
              <button
                key={course.id}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm font-medium ${mobileActiveCourse === course.id
                  ? "bg-primary-dark text-white border-primary-dark"
                  : "bg-white text-gray-700 border-gray-300 hover:border-primary-dark hover:text-primary-dark"
                  }`}
                onClick={() =>
                  setMobileActiveCourse(
                    mobileActiveCourse === course.id ? null : course.id
                  )
                }
              >
                {course.name}
              </button>
            ))}
          </div>
        </div>

        {mobileActiveCourse && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
              Lessons
            </h3>
            <div className="space-y-2">
              {subcourses[courseToSubcourses[mobileActiveCourse]]?.map(
                (subcourse, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-blue-50 border border-blue-200 transition-all duration-200 flex items-center"
                  >
                    <div className="w-8 h-8 bg-primary-dark rounded-lg flex items-center justify-center mr-3">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {subcourse.name}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      {" "}
      <header className="max-w-7xl mx-auto flex justify-between items-center lg:px-8 px-4 lg:py-2 py-3 bg-white relative z-50">
        {" "}
        <div className="flex items-center">
          {" "}
          <NavLink
            to="/"
            className="text-2xl font-bold text-gray-900 hover:no-underline tracking-tight"
            onClick={handleNavLinkClick}
          >
            Bit<span className="text-primary-dark">CoderLabs</span>{" "}
          </NavLink>{" "}
        </div>
        <nav className="hidden lg:flex items-center space-x-1">
          <div className="group relative px-3 py-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-medium transition-all duration-300 relative py-2 px-1 ${isActive
                  ? "text-primary-dark"
                  : "text-gray-700 hover:text-primary-dark"
                }`
              }
            >
              Home
              <span
                className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-dark transition-all duration-300 ${location.pathname === "/"
                  ? "scale-x-100"
                  : "scale-x-0 group-hover:scale-x-100"
                  }`}
              ></span>
            </NavLink>
          </div>

          <div
            className="courses-dropdown group relative px-3 py-2"
            ref={coursesDropdownRef}
          >
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `font-medium transition-all duration-300 relative py-2 px-1 flex items-center gap-1 ${isActive
                  ? "text-primary-dark"
                  : "text-gray-700 hover:text-primary-dark"
                }`
              }
            >
              Courses
              <svg
                className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </NavLink>

            <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 w-[800px] opacity-0 invisible -translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              {/* Level / Course / Subcourse columns */}
              <div className="flex h-[400px]">
                <div className="w-1/4 bg-white p-6 border-r border-gray-200 overflow-y-auto rounded-l-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                    Course Levels
                  </h3>
                  <ul className="space-y-1">
                    {["beginner", "intermediate", "advanced"].map((level) => (
                      <li key={level} className="level-item group/level">
                        <button
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between border ${activeLevel === level
                            ? "bg-primary-dark text-white shadow-md"
                            : "text-gray-700 border-transparent hover:bg-white hover:border-blue-200 hover:text-blue-600 hover:shadow-sm"
                            }`}
                          onMouseEnter={() => handleLevelHover(level)}
                        >
                          <span className="capitalize font-medium text-sm">
                            {level}
                          </span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover/level:opacity-100 transition-opacity duration-200" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="w-2/5 p-6 border-r border-gray-200 overflow-y-auto">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                    Courses
                  </h3>
                  <div className="space-y-1">
                    {courseLevels[activeLevel]?.map((course) => (
                      <div key={course.id} className="course-item group/course">
                        <button
                          className="w-full text-left p-3 rounded-lg text-gray-700 border border-transparent hover:bg-primary-dark hover:text-white cursor-pointer hover:border-white transition-all duration-200 flex items-center justify-between"
                          onMouseEnter={() => handleCourseHover(course.id)}
                        >
                          <span className="font-medium text-sm">
                            {course.name}
                          </span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover/course:opacity-100 transition-opacity duration-200" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-2/5 p-6 overflow-y-auto rounded-r-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                    Lessons
                  </h3>
                  {!activeCourse ? (
                    <div className="text-gray-400 text-sm italic text-center py-8">
                      Select a course to view lessons
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {subcourses[courseToSubcourses[activeCourse]]?.map(
                        (subcourse, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center cursor-pointer group/lesson border border-transparent hover:border-blue-200"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover/lesson:bg-primary-dark transition-colors duration-200">
                              <Play className="w-4 h-4 text-primary-dark group-hover/lesson:text-white transition-colors duration-200" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover/lesson:text-primary-dark transition-colors duration-200">
                              {subcourse.name}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {["about", "Blog", "prices", "contact"].map((item) => (
            <div key={item} className="group relative px-3 py-2">
              <NavLink
                to={`/${item}`}
                className={({ isActive }) =>
                  `font-medium transition-all duration-300 relative py-2 px-1 ${isActive
                    ? "text-primary-dark"
                    : "text-gray-700 hover:text-primary-dark"
                  }`
                }
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary-dark transition-all duration-300 ${location.pathname === `/${item}`
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                    }`}
                ></span>
              </NavLink>
            </div>
          ))}
        </nav>
        {/* Desktop Auth Buttons (static) */}
        <div className="hidden lg:flex items-center gap-3">
          {token ? (
            <>
              <Link onClick={submitLogout}>
                <Button
                  text="Logout"
                  variant="squarefull"
                  className="w-full justify-center"
                  size="sm"
                />
              </Link>
              <Link to="/StudentDashboard" onClick={handleNavLinkClick} className="relative">
                <h2 className=" rounded-full w-8 h-8 bg-primary text-white text-center flex justify-center items-center">
                  B
                </h2>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="block" onClick={handleNavLinkClick}>
                <Button
                  text="Sign In"
                  variant="squarefull"
                  className="w-full justify-center"
                />
              </Link>
              <Link to="/login" className="block" onClick={handleNavLinkClick}>
                <Button
                  text="Log In"
                  variant="squarefull"
                  className="w-full justify-center"
                />
              </Link>
            </>
          )}
        </div>
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            id="menu-btn"
            className="text-gray-700 hover:text-blue-600 transition-colors duration-300 p-2 rounded-lg hover:bg-blue-50"
            onClick={handleMobileMenuToggle}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>
      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden fixed top-0 left-0 right-0 bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out overflow-y-auto max-h-[calc(100vh-64px)] ${mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        style={{ marginTop: "64px" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="space-y-4 mb-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block py-3 px-4 rounded-lg font-medium transition-all duration-200 border ${isActive
                  ? "bg-primary-dark text-white border-primary-dark"
                  : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-primary-dark"
                }`
              }
              onClick={handleNavLinkClick}
            >
              Home
            </NavLink>

            <div className="py-3 px-4 rounded-lg border border-gray-200">
              <MobileCoursesDropdown />
            </div>

            {["about", "Blog", "prices", "contact"].map((item) => (
              <NavLink
                key={item}
                to={`/${item}`}
                className={({ isActive }) =>
                  `block py-3 px-4 rounded-lg font-medium transition-all duration-200 border ${isActive
                    ? "bg-primary-dark text-white border-primary-dark"
                    : "text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-primary-dark"
                  }`
                }
                onClick={handleNavLinkClick}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-3 pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
            {Users ? (
              <Link to="/StudentDashboard" onClick={handleNavLinkClick} className="relative">
                <h2 className=" rounded-full w-8 h-8 bg-primary text-white">
                  B
                </h2>
              </Link>
            ) : (
              <>
                <Link to="/register" className="block" onClick={handleNavLinkClick}>
                  <Button
                    text="Sign In"
                    variant="squarefull"
                    className="w-full justify-center"
                  />
                </Link>
                <Link to="/login" className="block" onClick={handleNavLinkClick}>
                  <Button
                    text="Log In"
                    variant="squarefull"
                    className="w-full justify-center"
                  />
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
