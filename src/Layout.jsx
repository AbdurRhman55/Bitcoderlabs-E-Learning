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
import Dashboard from "./Pages/Dashboard";
// import AllCourses from "./Dashboard/AllCourses";

function Layout() {
const location = useLocation();

// Hide Navbar and Footer on specific pages
const hideNavFooter = ["/login", "/register", "/forgotpassword", "/resetpassword","/Dashboard" ].includes(location.pathname);

return (
<> <ScrollToTop />

  {/* Navbar visible only when not on hidden pages */}
  {!hideNavFooter && <Navbar />}

  {/* All application routes */}
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
    <Route path="/dashboard" element={<Dashboard/>}/>
    {/* <Route path="/AllCourses" element={<AllCourses/>}/> */}

  </Routes>

  {/* Footer visible only when not on hidden pages */}
  {!hideNavFooter && <Footer />}
</>

);
}

export default Layout;
