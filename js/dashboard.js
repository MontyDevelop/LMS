const role = localStorage.getItem("userRole");
const email = localStorage.getItem("userEmail");

const greeting = document.getElementById("greeting");
const details = document.getElementById("details");
const logoutBtn = document.getElementById("logoutBtn");

const form = document.getElementById("courseForm");
const courseList = document.getElementById("courseList");
let editingIndex = null;


function showCourses() {
    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    courseList.innerHTML = "";

    courses
        .filter(course => course.createdBy === email)
        .forEach((course, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
            <strong>${course.title}</strong><br>${course.description}<br>
            <button onclick="editCourse(${index})">Edit</button>
            <button onclick="deleteCourse(${index})">Delete</button>
          `;
            courseList.appendChild(li);
        });
}

if (role === "teacher") {
    greeting.textContent = "Hello Teacher!";
    details.textContent = `You're logged in as ${email}.`;
    document.getElementById("courseSection").style.display = "block";
    showCourses();
} else {
    greeting.textContent = "Access Denied";
    details.textContent = "You are not authorized to view this page.";
}

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    window.location.href = "login.html";

});



function editCourse(index) {
    const courses = JSON.parse(localStorage.getItem("courses") || "[]");
    const course = courses[index];

    // Fill the form with course data
    document.getElementById("courseTitle").value = course.title;
    document.getElementById("courseDesc").value = course.description;
    document.getElementById("courseVideo").value = course.video || '';
    document.getElementById("coursePDF").value = course.pdf || '';

    editingIndex = index;
}

function deleteCourse(index) {
    let courses = JSON.parse(localStorage.getItem("courses") || "[]");
    if (confirm("Are you sure you want to delete this course?")) {
        courses.splice(index, 1);
        localStorage.setItem("courses", JSON.stringify(courses));
        showCourses();
    }
}


form.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("courseTitle").value.trim();
    const desc = document.getElementById("courseDesc").value.trim();

    if (!title || !desc) return alert("Please enter both title and description.");

    const video = document.getElementById("courseVideo")?.value.trim() || "";
    const pdf = document.getElementById("coursePDF")?.value.trim() || "";

    const file = document.getElementById("courseFile").value.trim();
    const time = document.getElementById("courseTime").value.trim();

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
        // Update existing course
        courses[editingIndex] = newCourse;
        editingIndex = null;
    } else {
        // Add new course
        courses.push(newCourse);
    }
    localStorage.setItem("courses", JSON.stringify(courses));
    form.reset();
    showCourses();
});