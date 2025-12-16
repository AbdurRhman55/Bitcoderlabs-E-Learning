import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./Pages/Home";
import Navbar from "./Component/Header/Navbar";
import Footer from "./Component/UI/Footer";
import Courses from "./Pages/Cources";
import About from "./Pages/About";
import Prices from "./Pages/Prices";
import Contact from "./Pages/Contact";
import CourseDetailPage from "./Pages/CourseDetailPage";
import Login from "./Component/Auth/Login";
import Register from "./Component/Auth/Register";
import Enroll from "./Pages/Enroll";
import Blog from "./Pages/Blog";
import ScrollToTop from "./Component/ScrollToTop";
import ForgotPassword from "./Component/Auth/ForgotPassword";
import ResetPassword from "./Component/Auth/ResetPassword";
import BlogDetail from "./Pages/BlogDetail";
import AdminDashboard from "./Pages/AdminDashboard";
// import UserProfile from "./UserProfile/UserProfile";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherProfile from "./Dashboards/TeacherProfile/TeacherProfile"
import SuperAdminLogin from "./Pages/SuperAdminLogin";
import TeacherMainDashboard from "./Dashboards/TeacherDashboard/TeacherMainDashboard";



function Layout() {
  const location = useLocation();

  // Always convert route to lowercase
  const path = location.pathname.toLowerCase();

  const pagesWithoutLayout = [
    "/studentdashboard",
    "/login",
    "/register",
    "/forgotpassword",
    "/resetpassword",
    "/admindashboard",
    "/superadminlogin",
    "/teacherprofile",
    "/teachermaindashboard"
  ];

  const hideNavFooter = pagesWithoutLayout.includes(path);

  return (
    <>
      <ScrollToTop />

      {!hideNavFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/enroll/:id" element={<Enroll />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/teacherprofile" element={<TeacherProfile />} />
        <Route path="/teachermaindashboard" element={<TeacherMainDashboard />} />
        <Route path="/superadminlogin" element={<SuperAdminLogin />} />
      </Routes>

      {!hideNavFooter && <Footer />}
    </>
  );
}

export default Layout;
