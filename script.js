let rating = 0;
let stars = document.querySelectorAll(".star");

// STAR CLICK HANDLING
stars.forEach(star => {
  star.addEventListener("click", () => {
    rating = Number(star.dataset.val);
    updateStars(rating);
  });
});

// UPDATE STAR UI
function updateStars(val) {
  stars.forEach(star => {
    star.classList.remove("active");
    if (Number(star.dataset.val) <= val) {
      star.classList.add("active");
    }
  });
}

// SUBMIT FEEDBACK
function submitFeedback() {
  let faculty = document.getElementById("faculty").value.trim();
  let comment = document.getElementById("comment").value.trim();

  if (!faculty || rating === 0) {
    alert("Please select faculty and rating!");
    return;
  }

  let feedback = {
    faculty,
    rating: Number(rating),
    comment
  };

  let data = JSON.parse(localStorage.getItem("fbData")) || [];

  // prevent duplicate entries
  let exists = data.some(f =>
    f.faculty.trim().toLowerCase() === faculty.toLowerCase() &&
    f.comment === comment &&
    f.rating === Number(rating)
  );

  if (!exists) {
    data.push(feedback);
  }

  localStorage.setItem("fbData", JSON.stringify(data));

  alert("Feedback submitted anonymously!");

  // RESET FORM
  document.getElementById("faculty").value = "";
  document.getElementById("comment").value = "";

  rating = 0;
  stars.forEach(star => star.classList.remove("active"));
}

// SHOW REPORT (ADMIN PANEL)
function showReport() {
  let data = JSON.parse(localStorage.getItem("fbData")) || [];
  let filter = document.getElementById("filterFaculty").value;

  let reportDiv = document.getElementById("report");
  reportDiv.innerHTML = "";

  if (data.length === 0) {
    reportDiv.innerHTML = "<p>No feedback found</p>";
    return;
  }

  // FIXED FILTERING (case + space safe)
  let filtered = filter === "all"
    ? data
    : data.filter(f =>
        f.faculty.trim().toLowerCase() === filter.trim().toLowerCase()
      );

  let facultyMap = {};

  // GROUP DATA
  filtered.forEach(f => {
    let name = f.faculty.trim();

    if (!facultyMap[name]) {
      facultyMap[name] = {
        total: 0,
        count: 0,
        comments: []
      };
    }

    facultyMap[name].total += Number(f.rating);
    facultyMap[name].count++;
    facultyMap[name].comments.push(f.comment);
  });

  // DISPLAY REPORT
  for (let faculty in facultyMap) {
    let avg = (facultyMap[faculty].total / facultyMap[faculty].count).toFixed(2);

    // remove duplicate comments
    let uniqueComments = [...new Set(facultyMap[faculty].comments)];

    let box = document.createElement("div");
    box.className = "report-box";

    box.innerHTML = `
      <h3>${faculty}</h3>
      <p><b>Average Rating:</b> ${avg}</p>
      <p><b>Feedback:</b></p>
      <ul>
        ${uniqueComments.map(c => `<li>${c}</li>`).join("")}
      </ul>
    `;

    reportDiv.appendChild(box);
  }
}