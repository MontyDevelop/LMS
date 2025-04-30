const role = localStorage.getItem("userRole");
const email = localStorage.getItem("userEmail");

const greeting = document.getElementById("greeting");
const details = document.getElementById("details");
const logoutBtn = document.getElementById("logoutBtn");

const form = document.getElementById("courseForm");
const courseList = document.getElementById("courseList");

let editingIndex = null;

// Only allow teachers
if (role === "teacher") {
  greeting.textContent = "Hello, Teacher!";
  details.textContent = `You're logged in as ${email}`;
  document.getElementById("courseSection").classList.remove("hidden");
  showCourses();
} else {
  greeting.textContent = "Access Denied";
  details.textContent = "You are not authorized to view this page.";
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  window.location.href = "login.html";
});

// Fetch courses and show only the ones by this teacher
function showCourses() {
  const courses = JSON.parse(localStorage.getItem("courses") || "[]");
  const myCourses = courses.filter(course => course.createdBy === email);
  courseList.innerHTML = "";

  myCourses.forEach((course, index) => {
    const li = document.createElement("li");
    li.className = "bg-white text-gray-900 p-4 rounded shadow flex flex-col justify-between";

    li.innerHTML = `
      <div>
        <h4 class="text-lg font-semibold">${course.title}</h4>
        <p class="mb-2">${course.description}</p>
        <p class="text-sm text-gray-600 mb-2">Live: ${course.time ? new Date(course.time).toLocaleString() : "N/A"}</p>
      </div>
      <div class="space-x-2 mt-auto">
        <button onclick="editCourse(${index})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
        <button onclick="deleteCourse(${index})" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Delete</button>
      </div>
    `;
    courseList.appendChild(li);
  });
}

// Populate form for editing
function editCourse(index) {
  const courses = JSON.parse(localStorage.getItem("courses") || "[]");
  const myCourses = courses.filter(course => course.createdBy === email);
  const course = myCourses[index];

  document.getElementById("courseTitle").value = course.title;
  document.getElementById("courseDesc").value = course.description;
  document.getElementById("courseVideo").value = course.video || "";
  document.getElementById("coursePDF").value = course.pdf || "";
  document.getElementById("courseFile").value = course.file || "";
  document.getElementById("courseTime").value = course.time || "";

  // Find actual index in full course list
  const allCourses = JSON.parse(localStorage.getItem("courses") || "[]");
  editingIndex = allCourses.findIndex(c => c.title === course.title && c.createdBy === email);
}

// Delete course
function deleteCourse(index) {
  const allCourses = JSON.parse(localStorage.getItem("courses") || "[]");
  const myCourses = allCourses.filter(course => course.createdBy === email);
  const courseToDelete = myCourses[index];

  if (confirm(`Are you sure you want to delete "${courseToDelete.title}"?`)) {
    const updated = allCourses.filter(c => !(c.title === courseToDelete.title && c.createdBy === email));
    localStorage.setItem("courses", JSON.stringify(updated));
    showCourses();
  }
}
const menuBtn = document.getElementById("menuBtn");
  const menuLinks = document.getElementById("menuLinks");

  menuBtn.addEventListener("click", () => {
    menuLinks.classList.toggle("hidden");
  });

// Submit form (create or edit)
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("courseTitle").value.trim();
  const desc = document.getElementById("courseDesc").value.trim();
  const video = document.getElementById("courseVideo").value.trim();
  const pdf = document.getElementById("coursePDF").value.trim();
  const file = document.getElementById("courseFile").value.trim();
  const time = document.getElementById("courseTime").value.trim();

  if (!title || !desc) {
    alert("Please fill in the course title and description.");
    return;
  }

  const newCourse = {
    title,
    description: desc,
    video,
    pdf,
    file,
    time,
    createdBy: email
  };

  let courses = JSON.parse(localStorage.getItem("courses") || "[]");

  if (editingIndex !== null) {
    courses[editingIndex] = newCourse;
    editingIndex = null;
  } else {
    courses.push(newCourse);
  }

  localStorage.setItem("courses", JSON.stringify(courses));
  form.reset();
  showCourses();
});
