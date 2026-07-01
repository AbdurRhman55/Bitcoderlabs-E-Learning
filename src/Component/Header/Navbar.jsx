import React, { useState, useRef, useEffect, useCallback } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { Play, ArrowRight, Menu, X, Loader } from "lucide-react";
import Button from "../UI/Button";
import { useSelector, useDispatch } from "react-redux";
import { logoutAsync } from "../../../slices/AuthSlice";
import { fetchCourses, selectCourses } from "../../../slices/courseSlice";
import { apiClient } from "../../../src/api/index";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState("beginner");
  const [activeCourse, setActiveCourse] = useState(null);
  const [courseModules, setCourseModules] = useState({});
  const [loadingModules, setLoadingModules] = useState({});
  const coursesDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(state => state.auth);
  const courses = useSelector(selectCourses);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!courses || courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses]);

  const levels = [...new Set(courses.map((c) => c.level).filter(Boolean))];
  const [firstLevel] = levels;

  useEffect(() => {
    if (firstLevel && !levels.includes(activeLevel)) {
      setActiveLevel(firstLevel);
    }
  }, [firstLevel, levels]);

  const courseLevels = levels.reduce((acc, level) => {
    acc[level] = courses.filter((course) => course.level === level);
    return acc;
  }, {});

  const fetchCourseModules = useCallback(async (courseId) => {
    if (courseModules[courseId] || loadingModules[courseId]) return;
    setLoadingModules((prev) => ({ ...prev, [courseId]: true }));
    try {
      const res = await apiClient.getCourseModules({ course_id: courseId });
      const modules = res?.data?.data || res?.data || res || [];
      setCourseModules((prev) => ({ ...prev, [courseId]: modules }));
    } catch (err) {
      console.error("Failed to fetch modules:", err);
      setCourseModules((prev) => ({ ...prev, [courseId]: [] }));
    } finally {
      setLoadingModules((prev) => ({ ...prev, [courseId]: false }));
    }
  }, [courseModules, loadingModules]);

  const handleCourseHover = (courseId) => {
    setActiveCourse(courseId);
    fetchCourseModules(courseId);
  };

  const handleLevelHover = (level) => {
    setActiveLevel(level);
    setActiveCourse(null);
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
  };

  const getDashboardRoute = (role) => {
    const routes = {
      admin: '/admindashboard',
      instructor: '/teachermaindashboard',
      moderator: '/admindashboard',
      student: '/studentdashboard'
    };
    return routes[role] || '/studentdashboard';
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
    setActiveCourse(null);
    setActiveLevel(firstLevel || "beginner");
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
    const mobileModules = mobileActiveCourse ? courseModules[mobileActiveCourse] : null;
    const mobileLoading = mobileActiveCourse ? loadingModules[mobileActiveCourse] : false;

    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
            Course Levels
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {levels.map((level) => (
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
                onClick={() => {
                  if (mobileActiveCourse === course.id) {
                    navigate(`/course/${course.id}`);
                    setMobileMenuOpen(false);
                    setMobileActiveCourse(null);
                  } else {
                    setMobileActiveCourse(course.id);
                    fetchCourseModules(course.id);
                  }
                }}
              >
                <span>{course.title}</span>
                <span className="text-xs opacity-60 ml-1">&#8594;</span>
              </button>
            ))}
          </div>
        </div>

        {mobileActiveCourse && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
              Modules
            </h3>
            <div className="space-y-2">
              {mobileLoading ? (
                <div className="flex justify-center py-4">
                  <Loader className="w-5 h-5 animate-spin text-primary-dark" />
                </div>
              ) : mobileModules?.length > 0 ? (
                mobileModules.map((module, index) => (
                  <div
                    key={module.id || index}
                    className="p-3 rounded-lg bg-blue-50 border border-blue-200 transition-all duration-200 flex items-center"
                  >
                    <div className="w-8 h-8 bg-primary-dark rounded-lg flex items-center justify-center mr-3">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {module.title}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm italic text-center py-4">
                  No modules available
                </div>
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
                    {levels.map((level) => (
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
                          onClick={() => { navigate(`/course/${course.id}`); setActiveCourse(null); }}
                        >
                          <span className="font-medium text-sm">
                            {course.title}
                          </span>
                          <ArrowRight className="w-3 h-3 opacity-0 group-hover/course:opacity-100 transition-opacity duration-200" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-2/5 p-6 overflow-y-auto rounded-r-xl">
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                    Modules
                  </h3>
                  {!activeCourse ? (
                    <div className="text-gray-400 text-sm italic text-center py-8">
                      Select a course to view modules
                    </div>
                  ) : (
                    <div className="space-y-2">
              {loadingModules[activeCourse] ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin text-primary-dark" />
                </div>
              ) : courseModules[activeCourse]?.length > 0 ? (
                courseModules[activeCourse].map((module, index) => (
                  <div
                    key={module.id || index}
                    className="p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center cursor-pointer group/lesson border border-transparent hover:border-blue-200"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover/lesson:bg-primary-dark transition-colors duration-200">
                      <Play className="w-4 h-4 text-primary-dark group-hover/lesson:text-white transition-colors duration-200" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover/lesson:text-primary-dark transition-colors duration-200">
                      {module.title}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm italic text-center py-8">
                  No modules available
                </div>
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
        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button onClick={handleLogout}>
                <Button
                  text="Logout"
                  variant="squarefull"
                  className="w-full justify-center"
                  size="sm"
                />
              </button>
              <Link to={getDashboardRoute(user?.role)} onClick={handleNavLinkClick} className="relative">
                <div className="rounded-full w-8 h-8 bg-primary text-white text-center flex justify-center overflow-hidden items-center font-semibold">
                  {user?.avatar && user.avatar.startsWith('data:') ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
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
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardRoute(user?.role)} onClick={handleNavLinkClick} className="relative">
                  <div className="rounded-full w-8 h-8 bg-primary text-white text-center flex justify-center overflow-hidden items-center font-semibold">
                    {user?.avatar && user.avatar.startsWith('data:') ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-800">
                  Logout
                </button>
              </div>
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
