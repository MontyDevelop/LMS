const ADMIN_EMAIL = "admin@lms.com";
const ADMIN_PASSWORD = "admin123"; // optional

const form = document.getElementById("loginForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;
  const password = document.getElementById("password")?.value || "";

  // 🛡️ Check for admin credentials
  if (role === "admin") {
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      alert("⛔ Invalid admin credentials");
      return;
    }
  }

  localStorage.setItem("userEmail", email);
  localStorage.setItem("userRole", role);

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const newUser = { email, role };

  const isExisting = users.some(u => u.email === email && u.role === role);
  if (!isExisting) {
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  }

  if (role === "teacher") {
    window.location.href = "dashboard.html";
  } else if (role === "student") {
    window.location.href = "student_dashboard.html";
  } else if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    alert("Please select a valid role.");
  }
});
