const ADMIN_EMAIL = "admin@lms.com";
const ADMIN_PASSWORD = "admin123"; // Required for admin login

const form = document.getElementById("loginForm");
const errorDisplay = document.getElementById("loginError");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password")?.value || "";
  const role = document.getElementById("role").value;

  // Validate input
  if (!email || !role) {
    errorDisplay.textContent = "Please fill in all fields.";
    errorDisplay.classList.remove("hidden");
    return;
  }

  // Admin-specific check
  if (role === "admin" && (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD)) {
    errorDisplay.textContent = "⛔ Invalid admin credentials.";
    errorDisplay.classList.remove("hidden");
    return;
  }

  // Save user session
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userRole", role);

  // Save user to list if new
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.some(u => u.email === email && u.role === role);
  if (!exists) {
    users.push({ email, role });
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Redirect by role
  if (role === "student") {
    window.location.href = "student_dashboard.html";
  } else if (role === "teacher") {
    window.location.href = "dashboard.html";
  } else if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    errorDisplay.textContent = "⚠️ Please select a valid role.";
    errorDisplay.classList.remove("hidden");
  }
});

const menuBtn = document.getElementById("menuBtn");
  const menuLinks = document.getElementById("menuLinks");

  menuBtn.addEventListener("click", () => {
    menuLinks.classList.toggle("hidden");
  });
