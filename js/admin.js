const users = JSON.parse(localStorage.getItem("users")) || [];
const courses = JSON.parse(localStorage.getItem("courses")) || [];
const userTable = document.querySelector("#userTable tbody");
const courseTable = document.querySelector("#courseTable tbody");

// 1. Render All Users
function renderUsers(filteredUsers = users) {
    userTable.innerHTML = "";
    filteredUsers.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td><button class="delete" onclick="deleteUser('${user.email}', '${user.role}')">Delete</button></td>
    `;
        userTable.appendChild(row);
    });
}

// 2. Render All Courses + Enrollments
function renderCourses(courseList = courses) {
    courseTable.innerHTML = "";
    courseList.forEach(course => {
        const enrolled = getEnrolled(course.title);
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${course.title}</td>
      <td>${course.createdBy}</td>
      <td>${course.time ? new Date(course.time).toLocaleString() : "N/A"}</td>
      <td>${enrolled.length ? enrolled.join(", ") : "No Enrollments"}</td>
      <td><button class="delete" onclick="deleteCourseByTitle('${course.title}')">Delete</button></td>
    `;
        courseTable.appendChild(row);
    });
}

function getEnrolled(courseTitle) {
    const enrolledList = [];
    for (let key in localStorage) {
        if (key.startsWith("enrolled_")) {
            const courses = JSON.parse(localStorage.getItem(key) || "[]");
            if (courses.some(c => c.title === courseTitle)) {
                enrolledList.push(key.replace("enrolled_", ""));
            }
        }
    }
    return enrolledList;
}

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
function searchAll() {
    const keyword = document.getElementById("searchBox").value.toLowerCase();

    // Users
    const userFiltered = users.filter(user =>
        user.email.toLowerCase().includes(keyword) ||
        user.role.toLowerCase().includes(keyword)
    );
    renderUsers(userFiltered);

    // Courses
    const courseFiltered = courses.filter(course =>
        course.title.toLowerCase().includes(keyword) ||
        course.createdBy.toLowerCase().includes(keyword)
    );
    renderCourses(courseFiltered);
}

function deleteUser(email, role) {
    let updated = users.filter(u => !(u.email === email && u.role === role));
    localStorage.setItem("users", JSON.stringify(updated));
    location.reload();
}

function deleteCourseByTitle(title) {
    let updated = courses.filter(c => c.title !== title);
    localStorage.setItem("courses", JSON.stringify(updated));
    location.reload();
}
renderUsers();
renderCourses();