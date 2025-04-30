const studentEmail = localStorage.getItem("userEmail");
const role = localStorage.getItem("userRole");

if (role !== "student") {
  alert("Access denied. Redirecting to login.");
  window.location.href = "login.html";
}

document.getElementById("studentEmail").textContent = "Logged in as: " + studentEmail;

const allCoursesDiv = document.getElementById("allCourses");
const enrolledList = document.getElementById("enrolledList");

const allCourses = JSON.parse(localStorage.getItem("courses") || "[]");
let enrolled = JSON.parse(localStorage.getItem("enrolled_" + studentEmail) || "[]");

// Show all courses (filtered optional)
function showCourses(courseList = allCourses) {
  allCoursesDiv.innerHTML = "";
  courseList.forEach((course, index) => {
    const courseDiv = document.createElement("div");
    courseDiv.className = "bg-white text-gray-800 p-4 rounded-lg shadow flex flex-col justify-between";
    courseDiv.innerHTML = `
      <div>
        <h3 class="text-lg font-semibold mb-1">${course.title}</h3>
        <p class="mb-2">${course.description}</p>
        <p class="text-sm text-gray-600 mb-4">By: ${course.createdBy}</p>
      </div>
      <div class="space-x-2">
        <button onclick="enroll(${index})" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Enroll</button>
        <button onclick="viewDetails(${index})" class="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded">Details</button>
      </div>
    `;
    allCoursesDiv.appendChild(courseDiv);
  });
}

// Show enrolled courses
function showEnrolledCourses() {
  enrolledList.innerHTML = "";
  enrolled.forEach((course, index) => {
    const status = course.completed ? "Completed" : "Not Completed";
    const listItem = document.createElement("li");
    listItem.className = "bg-white text-gray-900 p-4 rounded shadow";
    listItem.innerHTML = `
      <strong>${course.title}</strong> - ${course.description} <br>
      <span class="text-sm">Status: ${status}</span><br/>
      <button onclick="toggleComplete(${index})" class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mt-2">
        ${course.completed ? "Mark Incomplete" : "Mark Completed"}
      </button>
      ${course.completed ? `
        <button onclick="downloadCertificate('${course.title}')" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded ml-2">
          🎓 Download Certificate
        </button>` : ""}
    `;
    enrolledList.appendChild(listItem);
  });
}

// Search courses
function filterCourses() {
  const keyword = document.getElementById("searchCourse").value.toLowerCase();
  const filtered = allCourses.filter(c =>
    c.title.toLowerCase().includes(keyword) || c.description.toLowerCase().includes(keyword)
  );
  showCourses(filtered);
}

// Enroll in a course
function enroll(index) {
  const selected = allCourses[index];
  const exists = enrolled.some(c => c.title === selected.title);
  if (exists) {
    alert("Already enrolled!");
    return;
  }

  enrolled.push(selected);
  localStorage.setItem("enrolled_" + studentEmail, JSON.stringify(enrolled));
  showEnrolledCourses();
}

// View course details
function viewDetails(index) {
  const selected = allCourses[index];
  localStorage.setItem("selectedCourse", JSON.stringify(selected));
  window.location.href = "course_details.html";
}

// Toggle course complete status
function toggleComplete(index) {
  enrolled[index].completed = !enrolled[index].completed;
  localStorage.setItem("enrolled_" + studentEmail, JSON.stringify(enrolled));
  showEnrolledCourses();
}

// Download certificate as PDF
function downloadCertificate(courseTitle) {
  const studentName = studentEmail.split("@")[0];
  const date = new Date().toLocaleDateString();
  const certID = "LMS-" + Math.floor(100000 + Math.random() * 900000);

  document.getElementById("studentName").innerText = studentName;
  document.getElementById("courseTitle").innerText = courseTitle;
  document.getElementById("completionDate").innerText = date;
  document.getElementById("certificateID").innerText = certID;

  const qrDiv = document.getElementById("qrcode");
  qrDiv.innerHTML = "";
  new QRCode(qrDiv, {
    text: "https://your-school-website.com", // Customize this
    width: 100,
    height: 100
  });

  const certElement = document.getElementById("certificate");
  certElement.style.display = "block";

  const opt = {
    margin: 1,
    filename: `${courseTitle}_Certificate.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(certElement).set(opt).save().then(() => {
    certElement.style.display = "none";
  });
}

// Logout
function logout() {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userRole");
  window.location.href = "login.html";
}

const menuBtn = document.getElementById("menuBtn");
  const menuLinks = document.getElementById("menuLinks");

  menuBtn.addEventListener("click", () => {
    menuLinks.classList.toggle("hidden");
  });

// Initialize
showCourses();
showEnrolledCourses();
