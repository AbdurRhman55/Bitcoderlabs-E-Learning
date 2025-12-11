 export async function loginUser() {
    const response = await fetch("http://127.0.0.1:8000/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    console.log(data);
    if (data.token) {
      alert("Login successful!");
      navigate("/");
    }
    return data.success;
  }