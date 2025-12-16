const API_BASE_URL = "http://localhost:8000/api/v1";

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      // For non-JSON responses, check if it's an auth issue
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login
        throw new Error("Authentication failed. Please log in again.");
      }
      // For other non-JSON responses (like validation errors returning HTML), don't clear token
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. Server returned non-JSON response. Check if all required fields are filled.`);
      }
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login
        throw new Error("Authentication failed. Please log in again.");
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

  // Admin Dashboard
  async getAdminStats() {
    return this.request("/dashboard/admin/stats");
  }

  // Users Management
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users${queryString ? `?${queryString}` : ""}`);
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

  // Courses Management
  async getCourses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/courses${queryString ? `?${queryString}` : ""}`);
  }

  async createCourse(courseData) {
    return this.request("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id, courseData) {
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

  // Categories
  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/categories${queryString ? `?${queryString}` : ""}`);
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
}

export const apiClient = new ApiClient();
