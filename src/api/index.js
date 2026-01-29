// Allow overriding the API base during development using Vite env vars.
// Example .env.local:
// VITE_API_BASE_URL=/api/v1
// VITE_API_ORIGIN=http://127.0.0.1:8000
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

// Compute API_ORIGIN robustly. If VITE_API_ORIGIN is provided use it,
// otherwise derive from API_BASE_URL when it's an absolute URL or fallback
// to the current window origin for relative base paths (proxy use-case).
export const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || (
  /^https?:\/\//.test(API_BASE_URL) ? API_BASE_URL.replace(/\/api\/v1\/?$/, "") : window?.location?.origin || ''
);

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

    const config = {
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (isFormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
      }
    } else {
      if (config.headers && !config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    }

    const response = await fetch(url, config);
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        throw new Error("Authentication failed. Please log in again.");
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Server returned non-JSON response.`);
      }
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        throw new Error(data.message || "Authentication failed. Please log in again.");
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  // Auth endpoints
  async login(credentials) {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    const response = await this.request("/logout", {
      method: "POST",
    });
    localStorage.removeItem("token");
    return response;
  }

  async getCurrentUser() {
    return this.request("/me");
  }

  async verifyEmail(id, hash) {
    return this.request("/email/verify", {
      method: "POST",
      body: JSON.stringify({ id, hash }),
    });
  }

  async resendVerificationEmail(email) {
    return this.request("/email/resend", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async requestPasswordReset(email) {
    return this.request("/security/send-otp", {
      method: "POST",
      body: JSON.stringify({ type: "password_change", email }),
    });
  }

  async verifyPasswordResetOtp(otp) {
    return this.request("/security/verify-otp", {
      method: "POST",
      body: JSON.stringify({ otp, type: "password_change" }),
    });
  }

  async resetPassword(tempToken, newPassword, passwordConfirmation) {
    return this.request("/students/my/password", {
      method: "POST",
      headers: { Authorization: `Bearer ${tempToken}` },
      body: JSON.stringify({
        password: newPassword,
        password_confirmation: passwordConfirmation
      }),
    });
  }

  async updateMyProfile(id, userData) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Admin Dashboard
  async getAdminStats() {
    return this.request("/dashboard/admin/stats");
  }

  // Users Management
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ""}`);
  }

  async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async updateProfile(id, userData) {
    const isFormData = typeof FormData !== 'undefined' && userData instanceof FormData;

    if (id) {
      if (isFormData) {
        if (!userData.has('_method')) {
          userData.append('_method', 'PUT');
        }
        return this.request(`/users/${id}`, {
          method: "POST",
          body: userData,
        });
      }

      return this.request(`/users/${id}`, {
        method: "POST",
        body: JSON.stringify({
          ...userData,
          _method: "PUT"
        }),
      });
    }

    if (isFormData) {
      if (!userData.has('_method')) {
        userData.append('_method', 'PUT');
      }
      return this.request("/me", {
        method: "POST",
        body: userData,
      });
    }

    return this.request("/me", {
      method: "PATCH",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    });
  }

  async approveUser(userId) {
    return this.request(`/users/${userId}/approve`, {
      method: "POST",
    });
  }

  async rejectUser(userId) {
    return this.request(`/users/${userId}/reject`, {
      method: "POST",
    });
  }

  // Courses Management
  async getCourses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/courses${queryString ? `?${queryString}` : ""}`);
  }

  async getCourseById(id) {
    return this.request(`/courses/${id}`);
  }

  async getMyCourses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/courses/my${queryString ? `?${queryString}` : ""}`);
  }

  // Module Management
  async getCourseModules(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/course-modules${queryString ? `?${queryString}` : ""}`);
  }

  async createModule(moduleData) {
    const isFormData = typeof FormData !== 'undefined' && moduleData instanceof FormData;
    if (isFormData) {
      if (!moduleData.has('_method')) {
        moduleData.append('_method', 'POST');
      }
      return this.request("/course-modules", {
        method: "POST",
        body: moduleData,
      });
    }

    return this.request("/course-modules", {
      method: "POST",
      body: JSON.stringify(moduleData),
    });
  }

  async updateModule(id, moduleData) {
    const isFormData = typeof FormData !== 'undefined' && moduleData instanceof FormData;
    if (isFormData) {
      if (!moduleData.has('_method')) {
        moduleData.append('_method', 'PUT');
      }
      return this.request(`/course-modules/${id}`, {
        method: "POST",
        body: moduleData,
      });
    }

    return this.request(`/course-modules/${id}`, {
      method: "PUT",
      body: JSON.stringify(moduleData),
    });
  }

  async deleteModule(id) {
    return this.request(`/course-modules/${id}`, {
      method: "DELETE",
    });
  }

  // Lesson Management
  async getModuleLessons(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/course-lessons${queryString ? `?${queryString}` : ""}`);
  }

  async createLesson(lessonData) {
    const isFormData = typeof FormData !== 'undefined' && lessonData instanceof FormData;
    if (isFormData) {
      if (!lessonData.has('_method')) {
        lessonData.append('_method', 'POST');
      }
      return this.request("/course-lessons", {
        method: "POST",
        body: lessonData,
      });
    }

    return this.request("/course-lessons", {
      method: "POST",
      body: JSON.stringify(lessonData),
    });
  }

  async updateLesson(id, lessonData) {
    const isFormData = typeof FormData !== 'undefined' && lessonData instanceof FormData;
    if (isFormData) {
      if (!lessonData.has('_method')) {
        lessonData.append('_method', 'PUT');
      }
      return this.request(`/course-lessons/${id}`, {
        method: "POST",
        body: lessonData,
      });
    }

    return this.request(`/course-lessons/${id}`, {
      method: "PUT",
      body: JSON.stringify(lessonData),
    });
  }

  async deleteLesson(id) {
    return this.request(`/course-lessons/${id}`, {
      method: "DELETE",
    });
  }

  // Instructor Course Requests
  async getAvailableCourses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/courses/available${queryString ? `?${queryString}` : ""}`);
  }

  async getMyCourseRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/instructor-course-requests/my${queryString ? `?${queryString}` : ""}`);
  }

  async createCourseRequest(courseId) {
    return this.request(`/instructor-course-requests`, {
      method: "POST",
      body: JSON.stringify({ course_id: courseId }),
    });
  }

  async getCourseRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/instructor-course-requests${queryString ? `?${queryString}` : ""}`);
  }

  async approveCourseRequest(requestId) {
    return this.request(`/instructor-course-requests/${requestId}/approve`, {
      method: "POST",
    });
  }

  async rejectCourseRequest(requestId, reason) {
    return this.request(`/instructor-course-requests/${requestId}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async createCourse(courseData) {
    const isFormData = typeof FormData !== 'undefined' && courseData instanceof FormData;
    if (isFormData) {
      if (!courseData.has('_method')) {
        courseData.append('_method', 'POST');
      }
      return this.request("/courses", {
        method: "POST",
        body: courseData,
      });
    }

    return this.request("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id, courseData) {
    const isFormData = typeof FormData !== 'undefined' && courseData instanceof FormData;
    if (isFormData) {
      if (!courseData.has('_method')) {
        courseData.append('_method', 'PUT');
      }
      return this.request(`/courses/${id}`, {
        method: "POST",
        body: courseData,
      });
    }

    return this.request(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
    });
  }

  async deleteCourse(id) {
    return this.request(`/courses/${id}`, {
      method: "DELETE",
    });
  }

  // Instructors Management
  async getInstructors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/instructors${queryString ? `?${queryString}` : ""}`);
  }

  async singleInstructor(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/instructors${queryString ? `?${queryString}` : ""}`);
  }

  async approveInstructor(id) {
    return this.request(`/instructors/${id}/approve`, {
      method: "POST",
    });
  }

  async rejectInstructor(id) {
    return this.request(`/instructors/${id}/reject`, {
      method: "POST",
    });
  }

  async getMyProfile() {
    return this.request("/instructors/my/profile");
  }

  async updateInstructorProfile(instructorData) {
    const isFormData = typeof FormData !== 'undefined' && instructorData instanceof FormData;
    if (isFormData) {
      if (!instructorData.has('_method')) {
        instructorData.append('_method', 'PUT');
      }
      return this.request("/instructors/my/profile", {
        method: "POST",
        body: instructorData,
      });
    }

    return this.request("/instructors/my/profile", {
      method: "PUT",
      body: JSON.stringify(instructorData),
    });
  }

  async getInstructor(id) {
    return this.request(`/instructors/${id}`);
  }

  async updateInstructor(id, instructorData) {
    const isFormData = typeof FormData !== 'undefined' && instructorData instanceof FormData;
    if (isFormData) {
      if (!instructorData.has('_method')) {
        instructorData.append('_method', 'PUT');
      }
      return this.request(`/instructors/${id}`, {
        method: "POST",
        body: instructorData,
      });
    }

    return this.request(`/instructors/${id}`, {
      method: "PUT",
      body: JSON.stringify(instructorData),
    });
  }

  async submitInstructorForApproval(instructorId) {
    return this.request(`/instructors/${instructorId}/submit-for-approval`, {
      method: "POST",
    });
  }

  // Teacher Dashboard APIs
  async getTeacherStats() {
    return this.request("/instructors/my/stats");
  }

  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications${queryString ? `?${queryString}` : ""}`);
  }

  async getRecentActivities() {
    return this.request("/instructors/my/activities");
  }

  // Categories
  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/categories${queryString ? `?${queryString}` : ""}`);
  }

  async createCategory(categoryData) {
    const isFormData = typeof FormData !== 'undefined' && categoryData instanceof FormData;
    if (isFormData) {
      if (!categoryData.has('_method')) {
        categoryData.append('_method', 'POST');
      }
      return this.request("/categories", {
        method: "POST",
        body: categoryData,
      });
    }

    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    const isFormData = typeof FormData !== 'undefined' && categoryData instanceof FormData;
    if (isFormData) {
      if (!categoryData.has('_method')) {
        categoryData.append('_method', 'PUT');
      }
      return this.request(`/categories/${id}`, {
        method: "POST",
        body: categoryData,
      });
    }

    return this.request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Contact Messages
  async getContactMessages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/contact-messages${queryString ? `?${queryString}` : ""}`);
  }

  // Enrollments Management
  async getEnrollments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/enrollments${queryString ? `?${queryString}` : ""}`);
  }

  async getMyEnrollments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/enrollments/my${queryString ? `?${queryString}` : ""}`);
  }

  async getEnrollmentById(id) {
    return this.request(`/enrollments/${id}`);
  }

  async enrollCourse(enrollmentData) {
    const isFormData = typeof FormData !== 'undefined' && enrollmentData instanceof FormData;
    if (isFormData) {
      return this.request("/enrollments", {
        method: "POST",
        body: enrollmentData,
      });
    }

    return this.request("/enrollments", {
      method: "POST",
      body: JSON.stringify(enrollmentData),
    });
  }

  async getPendingEnrollments() {
    return this.request("/enrollments/pending");
  }

  async approveEnrollment(enrollmentId, adminNotes = null) {
    return this.request(`/enrollments/${enrollmentId}/approve`, {
      method: "POST",
      body: JSON.stringify({ admin_notes: adminNotes }),
    });
  }

  async rejectEnrollment(enrollmentId, adminNotes) {
    return this.request(`/enrollments/${enrollmentId}/reject`, {
      method: "POST",
      body: JSON.stringify({ admin_notes: adminNotes }),
    });
  }

  async deleteEnrollment(id) {
    return this.request(`/enrollments/${id}`, {
      method: "DELETE",
    });
  }

  // Reviews & Ratings
  async getCourseReviews(courseId) {
    return this.request(`/courses/${courseId}/reviews`);
  }

  async createReview(courseId, reviewData) {
    return this.request(`/courses/${courseId}/reviews`, {
      method: "POST",
      body: JSON.stringify({
        rating: reviewData.rating,
        review: reviewData.comment, // Alias common field names
        comment: reviewData.comment,
        course_id: courseId,
      }),
    });
  }

  // Progress Management
  async updateProgress(enrollmentId, progress) {
    return this.request(`/enrollments/${enrollmentId}`, {
      method: "POST",
      body: JSON.stringify({
        progress_percentage: progress,
        _method: "PUT"
      }),
    });
  }

  // Module Progress Management
  async updateModuleProgress(moduleId, progress) {
    return this.request(`/course-modules/${moduleId}`, {
      method: "POST",
      body: JSON.stringify({
        progress_percentage: progress,
        _method: "PUT"
      }),
    });
  }

  // Individual Lesson Progress
  async updateUserProgress(lessonId, isCompleted = true, timeSpent = 0) {
    return this.request("/user-progress", {
      method: "POST",
      body: JSON.stringify({
        course_lesson_id: lessonId,
        is_completed: isCompleted,
        time_spent: timeSpent
      }),
    });
  }

  async getUserProgress(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const res = await this.request(`/user-progress${queryString ? `?${queryString}` : ""}`);
    // Normalize response: support raw array, wrapper { data: [...] },
    // and LengthAwarePaginator-like structures that include `data` key.
    if (Array.isArray(res)) return res;
    if (res && Array.isArray(res.data)) return res.data;
    // If paginator was serialized as object with nested data, try to find it
    if (res && typeof res === "object") {
      for (const key of ["data", "items", "results"]) {
        if (Array.isArray(res[key])) return res[key];
      }
    }
    return [];
  }
}

export const apiClient = new ApiClient();

import '@fortawesome/fontawesome-free/css/all.min.css';