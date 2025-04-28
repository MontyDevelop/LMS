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
    const enrolled = JSON.parse(localStorage.getItem("enrolled_" + studentEmail) || "[]");

    function showCourses() {
      allCoursesDiv.innerHTML = "";
      allCourses.forEach((course, index) => {
        const courseDiv = document.createElement("div");
        courseDiv.className = "course";
        courseDiv.innerHTML = `
          <div class="course-card">
          <strong>${course.title}</strong><br>${course.description}<br>
          <em>Created by: ${course.createdBy}</em><br>
          <button onclick="enroll(${index})">Enroll</button>
          <button onclick="viewDetails(${index})">View Details</button>
          </div>
        `;
        allCoursesDiv.appendChild(courseDiv);
      });
    }

    function showEnrolledCourses() {
      enrolledList.innerHTML = "";
      enrolled.forEach((course, index) => {
        const li = document.createElement("li");
        const status = course.completed ? "✅ Completed" : "❌ Not Completed";
        li.innerHTML = `
        <strong>${course.title}</strong> - ${course.description} <br>
        Status: ${status}
        <button onclick="toggleComplete(${index})">${course.completed ? "Mark Incomplete" : "Mark Completed"}</button>
        ${course.completed ? `<button onclick="downloadCertificate('${course.title}')">🎓 Download Certificate</button>` : ""}
      `;
        enrolledList.appendChild(li);
      });
    }

    function enroll(index) {
      const selected = allCourses[index];
      const alreadyEnrolled = enrolled.some(c => c.title === selected.title);
      if (alreadyEnrolled) {
        alert("Already enrolled!");
        return;
      }
      enrolled.push(selected);
      localStorage.setItem("enrolled_" + studentEmail, JSON.stringify(enrolled));
      showEnrolledCourses();
    }

    function unenroll(title) {
      const updatedEnrolled = enrolled.filter(course => course.title !== title);
      localStorage.setItem("enrolled_" + studentEmail, JSON.stringify(updatedEnrolled));
      enrolled.length = 0;
      updatedEnrolled.forEach(c => enrolled.push(c));
      showEnrolledCourses();
    }
    function viewDetails(index) {
      const selected = allCourses[index];
      localStorage.setItem("selectedCourse", JSON.stringify(selected));
      window.location.href = "course_details.html";
    }

    function toggleComplete(index) {
      enrolled[index].completed = !enrolled[index].completed;
      localStorage.setItem("enrolled_" + studentEmail, JSON.stringify(enrolled));
      showEnrolledCourses();
    }

    function downloadCertificate(courseTitle) {
      const studentName = studentEmail.split("@")[0]; // You can also ask for full name
      const date = new Date().toLocaleDateString();
      const certID = "LMS-" + Math.floor(100000 + Math.random() * 900000);

      document.getElementById("studentName").innerText = studentName;
      document.getElementById("courseTitle").innerText = courseTitle;
      document.getElementById("completionDate").innerText = date;
      document.getElementById("certificateID").innerText = certID;

      const qrDiv = document.getElementById("qrcode");
      qrDiv.innerHTML = ""; // Clear old QR
      new QRCode(qrDiv, {
        text: "https://your-school-website.com", // 🔥 Put your own site link here
        width: 100,
        height: 100
      });

      const element = document.getElementById("certificate");
      element.style.display = "block"; // Show it for printing

      const opt = {
        margin: 1,
        filename: `${courseTitle}_Certificate.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        element.style.display = "none"; // Hide again after download
      });
    }



    function logout() {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      window.location.href = "login.html";
    }

    showCourses();
    showEnrolledCourses();