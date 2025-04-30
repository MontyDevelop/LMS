const courseData = JSON.parse(localStorage.getItem("selectedCourse"));
const courseDetailsDiv = document.getElementById("courseDetails");
const feedbackSection = document.getElementById("feedbackSection");

if (!courseData) {
  courseDetailsDiv.innerText = "No course data found.";
} else {
  renderCourseDetails();
  showFeedback();
}

function renderCourseDetails() {
  courseDetailsDiv.innerHTML = `
    <h3 class="text-xl font-bold mb-2">${courseData.title}</h3>
    <p class="mb-2"><strong>Description:</strong> ${courseData.description}</p>
    <p class="mb-2"><strong>Created by:</strong> ${courseData.createdBy}</p>

    ${courseData.video ? `
      <p class="mb-1"><strong>Video:</strong></p>
      <video width="100%" height="300" controls class="mb-4">
        <source src="${courseData.video}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    ` : ''}

    ${courseData.pdf ? `
      <p class="mb-1"><strong>PDF:</strong></p>
      <iframe src="${courseData.pdf}" width="100%" height="500px" class="mb-4 rounded border"></iframe>
    ` : ''}

    ${courseData.file ? `
      <p class="mb-1"><strong>Downloadable Material:</strong></p>
      <a href="${courseData.file}" target="_blank" download>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Download File</button>
      </a>
    ` : ''}

    ${courseData.time ? `
      <p class="mt-4"><strong>Live Class Time:</strong> ${new Date(courseData.time).toLocaleString()}</p>
    ` : ''}
  `;
}

// Submit feedback
function submitFeedback() {
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value.trim();
  const student = localStorage.getItem("userEmail");

  if (!rating && !comment) {
    alert("Please provide a rating or comment.");
    return;
  }

  const key = "feedback_" + courseData.title;
  const feedback = JSON.parse(localStorage.getItem(key)) || [];

  feedback.push({ student, rating, comment });
  localStorage.setItem(key, JSON.stringify(feedback));

  alert("✅ Thank you for your feedback!");
  document.getElementById("rating").value = "";
  document.getElementById("comment").value = "";
  showFeedback();
}

// Show all feedback
function showFeedback() {
  const key = "feedback_" + courseData.title;
  const feedbacks = JSON.parse(localStorage.getItem(key)) || [];

  feedbackSection.innerHTML = "<h3 class='text-lg font-semibold mb-2'>Feedback:</h3>";

  let totalRating = 0;
  let ratingCount = 0;

  feedbacks.forEach(f => {
    if (f.rating) {
      totalRating += parseInt(f.rating);
      ratingCount++;
    }

    feedbackSection.innerHTML += `
      <div class="border-b py-2">
        <p>⭐ ${f.rating || "No Rating"} — <em>"${f.comment || "No Comment"}"</em></p>
        <p class="text-sm text-gray-600">by ${f.student}</p>
      </div>
    `;
  });

  if (ratingCount > 0) {
    const avg = (totalRating / ratingCount).toFixed(1);
    feedbackSection.innerHTML = `
      <div class="mb-4 p-3 bg-blue-100 text-blue-900 rounded shadow">
        🌟 Average Rating: <strong>${avg} / 5</strong> from ${ratingCount} ratings
      </div>
    ` + feedbackSection.innerHTML;
  } else {
    feedbackSection.innerHTML += "<p>No feedback yet.</p>";
  }
}
const menuBtn = document.getElementById("menuBtn");
  const menuLinks = document.getElementById("menuLinks");

  menuBtn.addEventListener("click", () => {
    menuLinks.classList.toggle("hidden");
  });
