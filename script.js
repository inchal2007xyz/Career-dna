
const careers = {
  frontend: {
    name: "Frontend Developer",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design", "API Integration", "Accessibility"],
    resources: {
      "HTML": "Learn semantic HTML and accessible page structure.",
      "CSS": "Practice layouts, Flexbox, Grid and responsive styling.",
      "JavaScript": "Study ES6+, DOM manipulation and asynchronous JavaScript.",
      "React": "Build reusable components and learn React hooks.",
      "Git": "Practice version control, branches and GitHub workflows.",
      "Responsive Design": "Build mobile-first interfaces for multiple screens.",
      "API Integration": "Learn REST APIs and fetch data using JavaScript.",
      "Accessibility": "Study keyboard navigation, labels and accessible interfaces."
    }
  },
  data: {
    name: "Data Analyst",
    skills: ["Python", "SQL", "Excel", "Statistics", "Data Visualization", "Power BI", "Data Cleaning", "Pandas"],
    resources: {
      "Python": "Learn Python fundamentals and data structures.",
      "SQL": "Practice SELECT, JOIN, GROUP BY and subqueries.",
      "Excel": "Learn formulas, pivot tables and data analysis.",
      "Statistics": "Study probability, distributions and hypothesis testing.",
      "Data Visualization": "Create meaningful charts and dashboards.",
      "Power BI": "Build interactive business intelligence dashboards.",
      "Data Cleaning": "Practice handling missing and inconsistent data.",
      "Pandas": "Learn DataFrames, filtering and data transformations."
    }
  },
  python: {
    name: "Python Developer",
    skills: ["Python", "OOP", "Data Structures", "SQL", "Flask", "Git", "REST APIs", "Testing"],
    resources: {
      "Python": "Master functions, collections and Python fundamentals.",
      "OOP": "Practice classes, inheritance and encapsulation.",
      "Data Structures": "Study arrays, lists, stacks, queues and trees.",
      "SQL": "Learn relational databases and SQL queries.",
      "Flask": "Create web applications using Flask.",
      "Git": "Learn version control and collaborative workflows.",
      "REST APIs": "Design and consume RESTful endpoints.",
      "Testing": "Write unit tests and debug Python applications."
    }
  },
  cyber: {
    name: "Cybersecurity Analyst",
    skills: ["Networking", "Linux", "Python", "Cybersecurity Basics", "Cryptography", "SIEM", "Risk Analysis", "Incident Response"],
    resources: {
      "Networking": "Understand TCP/IP, DNS, ports and network protocols.",
      "Linux": "Practice Linux commands, permissions and shell basics.",
      "Python": "Learn scripting for defensive security automation.",
      "Cybersecurity Basics": "Study security principles and common threats.",
      "Cryptography": "Understand encryption, hashing and digital signatures.",
      "SIEM": "Explore security monitoring and log analysis concepts.",
      "Risk Analysis": "Learn threat identification and risk assessment.",
      "Incident Response": "Study defensive incident handling procedures."
    }
  },
  uiux: {
    name: "UI/UX Designer",
    skills: ["Figma", "Wireframing", "Prototyping", "Typography", "Color Theory", "User Research", "Usability Testing", "Design Systems"],
    resources: {
      "Figma": "Practice designing screens and reusable components.",
      "Wireframing": "Create low-fidelity layouts for user flows.",
      "Prototyping": "Build interactive prototypes and transitions.",
      "Typography": "Study font hierarchy, readability and spacing.",
      "Color Theory": "Learn accessible color combinations and contrast.",
      "User Research": "Practice user interviews and persona creation.",
      "Usability Testing": "Test interfaces and improve user experience.",
      "Design Systems": "Create reusable design tokens and components."
    }
  }
};

const $ = id => document.getElementById(id);

let currentReport = null;

function normalize(value) {
  return value.trim().toLowerCase();
}

function analyzeCareer() {
  const name = $("student-name").value.trim();
  const role = $("career-role").value;
  const enteredSkills = $("skills").value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  $("error-message").textContent = "";

  if (!enteredSkills.length) {
    $("error-message").textContent =
      "Please enter at least one skill before analyzing.";
    return;
  }

  if (enteredSkills.length > 50) {
    $("error-message").textContent =
      "Please enter no more than 50 skills.";
    return;
  }

  const career = careers[role];
  const available = career.skills;

  const matched = available.filter(required =>
    enteredSkills.some(skill => normalize(skill) === normalize(required))
  );

  const missing = available.filter(skill => !matched.includes(skill));

  const score = Math.round((matched.length / available.length) * 100);

  currentReport = {
    name: name || "Student",
    role: career.name,
    score,
    matched,
    missing,
    date: new Date().toLocaleDateString()
  };

  displayResults(currentReport);
  saveReport(currentReport);
}

function displayResults(report) {
  const career = Object.values(careers).find(c => c.name === report.role);

  $("results").classList.remove("hidden");
  $("result-intro").textContent =
    `${report.name}, here is your ${report.role} readiness overview.`;

  $("score-value").textContent = report.score + "%";
  $("score-ring").style.background =
    `conic-gradient(var(--purple) ${report.score}%, #eeeaf8 ${report.score}%)`;

  $("matched-count").textContent = report.matched.length;
  $("missing-count").textContent = report.missing.length;

  $("matched-bar").style.width =
    (report.matched.length / 8 * 100) + "%";
  $("missing-bar").style.width =
    (report.missing.length / 8 * 100) + "%";

  $("matched-list").innerHTML = report.matched.length
    ? report.matched.map(s => `<span class="chip">${escapeHTML(s)}</span>`).join("")
    : '<span class="field-hint">No matching skills yet. Every journey starts somewhere.</span>';

  $("missing-list").innerHTML = report.missing.length
    ? report.missing.map(s => `<span class="chip missing">${escapeHTML(s)}</span>`).join("")
    : '<span class="chip">All target skills matched!</span>';

  if (report.score >= 75) {
    $("score-title").textContent = "Strong career alignment!";
    $("score-description").textContent = "You have a strong foundation. Refine your skills with projects.";
  } else if (report.score >= 40) {
    $("score-title").textContent = "You're building momentum!";
    $("score-description").textContent = "You have a good starting point. Focus on your missing skills.";
  } else {
    $("score-title").textContent = "Your growth journey starts now!";
    $("score-description").textContent = "Build your foundation one skill at a time.";
  }

  displayRoadmap(report, career);
  $("stat-score").textContent = report.score + "%";
  $("stat-gaps").textContent = report.missing.length;
  $("stat-caption").textContent = "Your latest skill match";

  $("results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function displayRoadmap(report, career) {
  const container = $("roadmap-content");

  if (!report.missing.length) {
    container.innerHTML = `
      <div class="roadmap-placeholder">
        <span>✦</span>
        <h3>All target skills matched!</h3>
        <p>Now build projects and strengthen your portfolio.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="roadmap-list">
      ${report.missing.map((skill, index) => `
        <article class="roadmap-item" data-skill="${escapeHTML(skill)}">
          <input type="checkbox" aria-label="Mark ${escapeHTML(skill)} as completed">
          <div>
            <h3>${index + 1}. ${escapeHTML(skill)}</h3>
            <p>${escapeHTML(career.resources[skill])}</p>
            <small>LEARNING GOAL ${String(index + 1).padStart(2, "0")}</small>
          </div>
        </article>
      `).join("")}
    </div>`;

  container.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.addEventListener("change", () => {
      box.closest(".roadmap-item").classList.toggle("completed", box.checked);
      saveProgress();
    });
  });

  restoreProgress();
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function saveReport(report) {
  localStorage.setItem("careerDNAReport", JSON.stringify(report));
  localStorage.removeItem("careerDNAProgress");
}

function saveProgress() {
  const checked = [...document.querySelectorAll(".roadmap-item input:checked")]
    .map(box => box.closest(".roadmap-item").dataset.skill);

  localStorage.setItem("careerDNAProgress", JSON.stringify(checked));
}

function restoreProgress() {
  const checked = JSON.parse(
    localStorage.getItem("careerDNAProgress") || "[]"
  );

  document.querySelectorAll(".roadmap-item").forEach(item => {
    const box = item.querySelector("input");
    if (checked.includes(item.dataset.skill)) {
      box.checked = true;
      item.classList.add("completed");
    }
  });
}

function downloadReport() {
  if (!currentReport) return;

  const report = currentReport;
  const text = `
CAREER DNA - PERSONAL CAREER REPORT
===================================

Name: ${report.name}
Target Career: ${report.role}
Analysis Date: ${report.date}

CAREER MATCH SCORE: ${report.score}%

MATCHED SKILLS:
${report.matched.length ? report.matched.join(", ") : "None"}

SKILLS TO DEVELOP:
${report.missing.length ? report.missing.join(", ") : "None"}

This report is generated using CAREER DNA's
rule-based skill matching system.

Keep learning. Keep growing.
`;

  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "career-dna-report.txt";
  link.click();

  URL.revokeObjectURL(url);
}

function loadSavedReport() {
  try {
    const saved = JSON.parse(localStorage.getItem("careerDNAReport"));
    if (saved && careers && Object.values(careers).some(c => c.name === saved.role)) {
      currentReport = saved;
      displayResults(saved);
    }
  } catch {
    localStorage.removeItem("careerDNAReport");
  }
}

$("analyze-btn").addEventListener("click", analyzeCareer);
$("download-btn").addEventListener("click", downloadReport);

loadSavedReport();
