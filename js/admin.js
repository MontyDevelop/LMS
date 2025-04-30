const users = JSON.parse(localStorage.getItem("users")) || [];
const courses = JSON.parse(localStorage.getItem("courses")) || [];
const userTable = document.querySelector("#userTable");
const courseTable = document.querySelector("#courseTable");
const statsDiv = document.getElementById("stats");

// Role check
const role = localStorage.getItem("userRole");
if (role !== "admin") {
  alert("Access denied. Admins only.");
  window.location.href = "login.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  window.location.href = "login.html";
});

// Render all users
function renderUsers(filteredUsers = users) {
  userTable.innerHTML = "";
  filteredUsers.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-3 border">${user.email}</td>
      <td class="p-3 border">${user.role}</td>
      <td class="p-3 border">
        <button onclick="deleteUser('${user.email}', '${user.role}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
      </td>
    `;
    userTable.appendChild(row);
  });
}

// Render all courses
function renderCourses(courseList = courses) {
  courseTable.innerHTML = "";
  courseList.forEach(course => {
    const enrolled = getEnrolled(course.title);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="p-3 border">${course.title}</td>
      <td class="p-3 border">${course.createdBy}</td>
      <td class="p-3 border">${course.time ? new Date(course.time).toLocaleString() : "N/A"}</td>
      <td class="p-3 border">${enrolled.length ? enrolled.join(", ") : "No Enrollments"}</td>
      <td class="p-3 border">
        <button onclick="deleteCourseByTitle('${course.title}')" class="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
      </td>
    `;
    courseTable.appendChild(row);
  });
}

// Get all enrolled students for a course
function getEnrolled(courseTitle) {
  const enrolledList = [];
  for (let key in localStorage) {
    if (key.startsWith("enrolled_")) {
      const enrolledCourses = JSON.parse(localStorage.getItem(key) || "[]");
      if (enrolledCourses.some(c => c.title === courseTitle)) {
        enrolledList.push(key.replace("enrolled_", ""));
      }
    }
  }
  return enrolledList;
}

// Delete a user
function deleteUser(email, role) {
  const updated = users.filter(u => !(u.email === email && u.role === role));
  localStorage.setItem("users", JSON.stringify(updated));
  renderUsers(updated);
  showStats();
}

// Delete a course
function deleteCourseByTitle(title) {
  const updated = courses.filter(c => c.title !== title);
  localStorage.setItem("courses", JSON.stringify(updated));
  renderCourses(updated);
  showStats();
}

// Filter by teacher
const teacherFilter = document.getElementById("teacherFilter");
const teachers = [...new Set(courses.map(c => c.createdBy))];
teachers.forEach(t => {
  const opt = document.createElement("option");
  opt.value = t;
  opt.textContent = t;
  teacherFilter.appendChild(opt);
});

function filterCourses() {
  const selected = teacherFilter.value;
  const filtered = selected ? courses.filter(c => c.createdBy === selected) : courses;
  renderCourses(filtered);
}

// Search users and courses
function searchAll() {
  const keyword = document.getElementById("searchBox").value.toLowerCase();

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(keyword) ||
    user.role.toLowerCase().includes(keyword)
  );

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(keyword) ||
    course.createdBy.toLowerCase().includes(keyword)
  );

  renderUsers(filteredUsers);
  renderCourses(filteredCourses);
}

// Show stats
function showStats() {
  const usersList = JSON.parse(localStorage.getItem("users") || "[]");
  const courseList = JSON.parse(localStorage.getItem("courses") || "[]");
  statsDiv.textContent = `📊 Total Users: ${usersList.length} | Total Courses: ${courseList.length}`;
}
const menuBtn = document.getElementById("menuBtn");
  const menuLinks = document.getElementById("menuLinks");

  menuBtn.addEventListener("click", () => {
    menuLinks.classList.toggle("hidden");
  });

// Initial render
renderUsers();
renderCourses();
showStats();
