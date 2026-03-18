// ── Chip toggle ──────────────────────────────────────────────
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

// ── Career metadata ──────────────────────────────────────────
const CAREER_META = {
  "Software Engineer":      { icon: "💻", desc: "Design and develop software applications and systems.", skills: "Programming, Algorithm Design", degrees: "Computer Science, Software Engineering" },
  "Doctor":                 { icon: "🩺", desc: "Diagnose and treat patients in clinical settings.", skills: "Biology, Chemistry, Communication", degrees: "Medicine, Biomedical Sciences" },
  "Lawyer":                 { icon: "⚖️", desc: "Advise clients and represent them in legal matters.", skills: "Critical Thinking, Communication", degrees: "Law, Political Science" },
  "Teacher":                { icon: "📚", desc: "Educate and inspire students at various levels.", skills: "Communication, Patience", degrees: "Education, Subject Specialisation" },
  "Scientist":              { icon: "🔬", desc: "Conduct research and experiments to advance knowledge.", skills: "Research, Analytical Thinking", degrees: "Science, Biology, Chemistry" },
  "Business Owner":         { icon: "🏢", desc: "Start and manage a business enterprise.", skills: "Leadership, Financial Management", degrees: "Business Administration, Commerce" },
  "Accountant":             { icon: "🧮", desc: "Manage financial records and ensure compliance.", skills: "Mathematics, Attention to Detail", degrees: "Accounting, Finance" },
  "Banker":                 { icon: "🏦", desc: "Manage financial services and banking operations.", skills: "Mathematics, Communication", degrees: "Finance, Economics" },
  "Designer":               { icon: "🎨", desc: "Create visual concepts and user experiences.", skills: "Creativity, Visual Thinking", degrees: "Graphic Design, UX/UI Design" },
  "Artist":                 { icon: "🖌️", desc: "Create original artwork and creative expressions.", skills: "Creativity, Fine Arts", degrees: "Fine Arts, Visual Arts" },
  "Writer":                 { icon: "✍️", desc: "Create written content for various media.", skills: "Writing, Research, Creativity", degrees: "Journalism, Literature, Communications" },
  "Game Developer":         { icon: "🎮", desc: "Design and build interactive video games.", skills: "Programming, Creativity, Math", degrees: "Computer Science, Game Design" },
  "Construction Engineer":  { icon: "🏗️", desc: "Plan and oversee construction projects.", skills: "Physics, Mathematics, Problem Solving", degrees: "Civil Engineering, Construction Management" },
  "Stock Investor":         { icon: "📈", desc: "Analyse markets and manage investment portfolios.", skills: "Mathematics, Analysis, Economics", degrees: "Finance, Economics, Mathematics" },
  "Real Estate Developer":  { icon: "🏘️", desc: "Develop and manage property and real estate.", skills: "Geography, Business, Negotiation", degrees: "Real Estate, Business, Law" },
  "Government Officer":     { icon: "🏛️", desc: "Work in public service and policy implementation.", skills: "Communication, History, Leadership", degrees: "Public Administration, Political Science" },
  "Social Network Studies": { icon: "🌐", desc: "Study and manage social media and digital communities.", skills: "Communication, Technology, Research", degrees: "Communications, Sociology, Media Studies" },
};

// ── Dynamic meta based on actual scores ─────────────────────
function getDynamicMeta(careerName, scores) {
  const s = {
    math: +scores.math, history: +scores.history, physics: +scores.physics,
    chemistry: +scores.chemistry, biology: +scores.biology,
    english: +scores.english, geography: +scores.geography
  };

  // Subject display names
  const SUBJ_NAMES = {
    math: "Mathematics", history: "History", physics: "Physics",
    chemistry: "Chemistry", biology: "Biology",
    english: "English", geography: "Geography"
  };

  // Degree per career — what degree you study to enter this career
  const CAREER_DEGREES = {
    "Software Engineer":      "Bachelor of Computer Science / Software Engineering",
    "Doctor":                 "Bachelor of Medicine and Surgery (MBChB)",
    "Lawyer":                 "Bachelor of Laws (LLB)",
    "Teacher":                "Bachelor of Education (BEd)",
    "Scientist":              "Bachelor of Science (BSc)",
    "Business Owner":         "Bachelor of Business Administration (BBA)",
    "Accountant":             "Bachelor of Commerce in Accounting (BCom)",
    "Banker":                 "Bachelor of Commerce in Finance (BCom)",
    "Designer":               "Bachelor of Design (BDes)",
    "Artist":                 "Bachelor of Fine Arts (BFA)",
    "Writer":                 "Bachelor of Arts in Journalism / English (BA)",
    "Game Developer":         "Bachelor of Computer Science / Game Design",
    "Construction Engineer":  "Bachelor of Engineering in Civil Engineering (BEng)",
    "Stock Investor":         "Bachelor of Commerce in Finance / Economics (BCom)",
    "Real Estate Developer":  "Bachelor of Commerce in Property Studies (BCom)",
    "Government Officer":     "Bachelor of Public Administration (BPA)",
    "Social Network Studies": "Bachelor of Arts in Media & Communications (BA)",
  };

  function buildDegrees(careerName) {
    return CAREER_DEGREES[careerName] || "Relevant university degree";
  }

  // Icons and descriptions (factual, no degrees)
  const BASE = {
    "Software Engineer":      { icon: "💻", desc: "Design and develop software applications and systems." },
    "Doctor":                 { icon: "🩺", desc: "Diagnose and treat patients in clinical settings." },
    "Lawyer":                 { icon: "⚖️", desc: "Advise clients and represent them in legal matters." },
    "Teacher":                { icon: "📚", desc: "Educate and inspire students at various levels." },
    "Scientist":              { icon: "🔬", desc: "Conduct research and experiments to advance knowledge." },
    "Business Owner":         { icon: "🏢", desc: "Start and manage a business enterprise." },
    "Accountant":             { icon: "🧮", desc: "Manage financial records and ensure compliance." },
    "Banker":                 { icon: "🏦", desc: "Manage financial services and banking operations." },
    "Designer":               { icon: "🎨", desc: "Create visual concepts and user experiences." },
    "Artist":                 { icon: "🖌️", desc: "Create original artwork and creative expressions." },
    "Writer":                 { icon: "✍️", desc: "Create written content for various media." },
    "Game Developer":         { icon: "🎮", desc: "Design and build interactive video games." },
    "Construction Engineer":  { icon: "🏗️", desc: "Plan and oversee construction and infrastructure projects." },
    "Stock Investor":         { icon: "📈", desc: "Analyse markets and manage investment portfolios." },
    "Real Estate Developer":  { icon: "🏘️", desc: "Develop and manage property and real estate." },
    "Government Officer":     { icon: "🏛️", desc: "Work in public service and policy implementation." },
    "Social Network Studies": { icon: "🌐", desc: "Study and manage social media and digital communities." },
  };

  // Skills derived from real CSV score analysis — top subjects above global average per career
  const CAREER_SKILLS = {
    "Accountant":             "Math, Chemistry, Physics",
    "Artist":                 "Biology, Chemistry, Geography",
    "Banker":                 "English, Math, History",
    "Business Owner":         "Geography, Biology, Chemistry",
    "Construction Engineer":  "Physics, Math, Biology",
    "Designer":               "Biology, Geography, Physics",
    "Doctor":                 "Biology, Chemistry, Physics",
    "Game Developer":         "Physics, Math, Biology",
    "Government Officer":     "History, Biology, English",
    "Lawyer":                 "History, English, Math",
    "Real Estate Developer":  "Physics, Chemistry, History",
    "Scientist":              "Chemistry, Physics, Biology",
    "Social Network Studies": "Biology, Physics, History",
    "Software Engineer":      "Math, History, Biology",
    "Stock Investor":         "Math, Biology, Chemistry",
    "Teacher":                "English, Geography, Chemistry",
    "Writer":                 "English, History, Geography",
  };

  function buildSkills(careerName) {
    return CAREER_SKILLS[careerName] || "Various";
  }

  const base = BASE[careerName] || { icon: "🎯", desc: "A rewarding career that matches your profile." };

  return {
    icon:    base.icon,
    desc:    base.desc,
    skills:  buildSkills(careerName),
    degrees: buildDegrees(careerName),
  };
}

const RIASEC_FULL = {
  R: { name: "Realistic",     color: "#4f46e5", desc: "Practical, hands-on problem solving" },
  I: { name: "Investigative", color: "#0891b2", desc: "Analytical, intellectual curiosity" },
  A: { name: "Artistic",      color: "#be185d", desc: "Creative, expressive, imaginative" },
  S: { name: "Social",        color: "#0369a1", desc: "Helping, teaching, serving others" },
  E: { name: "Enterprising",  color: "#b45309", desc: "Leading, persuading, managing" },
  C: { name: "Conventional",  color: "#065f46", desc: "Organising, data, detail-oriented" },
};

// ── Get Recommendations ───────────────────────────────────────
function getRecommendations() {
  const name        = document.getElementById('name').value.trim() || 'Student';
  const interests   = [...document.querySelectorAll('.chip.selected')].map(c => c.dataset.val);
  const math        = document.getElementById('math').value;
  const history     = document.getElementById('history').value;
  const physics     = document.getElementById('physics').value;
  const chemistry   = document.getElementById('chemistry').value;
  const biology     = document.getElementById('biology').value;
  const english     = document.getElementById('english').value;
  const geography   = document.getElementById('geography').value;
  const study_hours = document.getElementById('study_hours').value;

  // Derive skills from high-scoring subjects (>= 75)
  const skills = [];
  if (+math     >= 75) skills.push('math');
  if (+physics  >= 75) skills.push('science');
  if (+biology  >= 75) skills.push('science');
  if (+chemistry>= 75) skills.push('science');
  if (+english  >= 75) skills.push('communication', 'writing');
  if (+math     >= 80) skills.push('logic');
  if (+study_hours >= 20) skills.push('organization');

  // Derive traits from interests selected
  const traitMap = {
    computers: 'analytical', math: 'analytical', research: 'curious',
    biology: 'detail_oriented', art: 'creative', communication: 'expressive',
    helping_people: 'empathetic', education: 'patient', law: 'persistent',
    problem_solving: 'analytical', technology: 'detail_oriented'
  };
  const traits = [...new Set(interests.map(i => traitMap[i]).filter(Boolean))];

  document.querySelector('.avatar').textContent = '🎓';
  document.getElementById('rec-placeholder').style.display = 'none';
  document.getElementById('rec-result').style.display = 'none';
  document.getElementById('rec-loading').style.display = 'block';

  fetch('/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, interests, skills, traits, math, history, physics, chemistry, biology, english, geography, study_hours })
  })
  .then(r => r.json())
  .then(results => {
    document.getElementById('rec-loading').style.display = 'none';
    showResults(name, results, interests, { math, history, physics, chemistry, biology, english, geography, study_hours });
  });
}

// ── Show Results ──────────────────────────────────────────────
function showResults(name, results, interests, scores) {
  window._lastResults  = results;
  window._lastProfile  = { name, interests, ...scores };

  const result = document.getElementById('rec-result');
  result.style.display = 'block';

  const top  = results[0];
  const meta = getDynamicMeta(top.name, scores);
  const riasec = RIASEC_FULL[top.riasec] || { name: top.riasec, color: "#555", desc: "" };

  document.getElementById('rec-icon').textContent    = meta.icon;
  document.getElementById('rec-title').textContent   = `Recommended Career: ${top.name}`;
  document.getElementById('rec-desc').textContent    = meta.desc;
  document.getElementById('rec-skills').textContent  = meta.skills;
  document.getElementById('rec-degrees').textContent = meta.degrees;

  // ── 1. RIASEC badge ──
  document.getElementById('rec-riasec').innerHTML = `
    <span class="riasec-badge" style="background:${riasec.color}">
      ${top.riasec} · ${riasec.name}
    </span>
    <span class="riasec-desc">${riasec.desc}</span>`;

  // ── 2. Confidence score ──
  const confidence = top.score >= 75 ? "High" : top.score >= 55 ? "Medium" : "Low";
  const confColor  = top.score >= 75 ? "#15803d" : top.score >= 55 ? "#b45309" : "#dc2626";
  document.getElementById('rec-confidence').innerHTML = `
    <span class="conf-label">Confidence:</span>
    <span class="conf-value" style="color:${confColor}">
      ${confidence} (${top.score}%)
    </span>
    <div class="conf-bar-wrap">
      <div class="conf-bar" style="width:0%;background:${confColor}" data-w="${top.score}%"></div>
    </div>`;

  // ── 3. Rule-based explanation ──
  const rules = generateRules(top.name, interests, scores);
  document.getElementById('rec-rules').innerHTML = `
    <div class="rules-title">📋 Why this career was recommended:</div>
    ${rules.map(r => `<div class="rule-item"><span class="rule-icon">✓</span>${r}</div>`).join('')}`;

  // ── Match cards (all 3) ──
  const othersEl = document.getElementById('rec-others');
  othersEl.innerHTML = '';
  results.slice(0, 3).forEach((career, i) => {
    const m = CAREER_META[career.name] || { icon: "🎯" };
    const r = RIASEC_FULL[career.riasec] || { name: career.riasec, color: "#555" };
    const card = document.createElement('div');
    card.className = 'rec-other-card';
    card.innerHTML = `
      <div class="rank">#${i+1} Match</div>
      <div class="name">${m.icon} ${career.name}</div>
      <div class="card-riasec" style="background:${r.color}">${career.riasec} · ${r.name}</div>
      <div class="score">${career.score}% match</div>
      <div class="rec-bar-wrap"><div class="rec-bar" style="width:0%;background:${r.color}" data-w="${career.score}%"></div></div>`;
    othersEl.appendChild(card);
  });

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.rec-bar, .conf-bar').forEach(b => b.style.width = b.dataset.w);
  }, 100);

  // Saved note
  const panel = document.getElementById('rec-panel');
  let note = panel.querySelector('.saved-note');
  if (!note) { note = document.createElement('p'); note.className = 'saved-note'; panel.appendChild(note); }
  note.textContent = `✓ ${name}'s profile saved to MongoDB`;
}

// ── Generate rule-based explanation ──────────────────────────
function generateRules(careerName, interests, scores) {
  const rules = [];
  const s = {
    math: +scores.math, history: +scores.history, physics: +scores.physics,
    chemistry: +scores.chemistry, biology: +scores.biology,
    english: +scores.english, geography: +scores.geography,
    study_hours: +scores.study_hours
  };

  const subjectRules = {
    "Software Engineer":     [["math", 70, "Strong Math score supports technical computing skills"],
                              ["physics", 65, "Physics background supports algorithm and logic thinking"]],
    "Doctor":                [["biology", 70, "High Biology score aligns with medical knowledge requirements"],
                              ["chemistry", 70, "Strong Chemistry score is essential for pharmacology and medicine"]],
    "Lawyer":                [["english", 70, "High English score supports legal writing and argumentation"],
                              ["history", 65, "History knowledge supports understanding of legal precedents"]],
    "Teacher":               [["english", 70, "Strong English supports classroom communication"],
                              ["history", 60, "History knowledge broadens teaching capability"]],
    "Scientist":             [["biology", 68, "Biology score supports research and scientific methodology"],
                              ["chemistry", 68, "Chemistry is core to laboratory sciences"]],
    "Accountant":            [["math", 75, "Excellent Math score is the foundation of accounting"],
                              ["english", 65, "English supports report writing and communication"]],
    "Banker":                [["math", 70, "Strong Math score supports financial calculations"],
                              ["english", 65, "Communication skills essential for client banking"]],
    "Business Owner":        [["math", 65, "Math supports financial planning and budgeting"],
                              ["english", 65, "English supports business communication and negotiation"]],
    "Designer":              [["english", 60, "Creative expression supported by English ability"],
                              ["math", 60, "Spatial and proportional thinking linked to Math"]],
    "Artist":                [["english", 62, "Artistic expression often linked to language and communication"],
                              ["history", 60, "Art history provides cultural context"]],
    "Writer":                [["english", 75, "Excellent English score is essential for writing careers"],
                              ["history", 65, "History knowledge enriches writing depth and context"]],
    "Game Developer":        [["math", 70, "Math is critical for game physics and programming logic"],
                              ["physics", 65, "Physics understanding supports realistic game simulation"]],
    "Construction Engineer": [["physics", 72, "Physics is the foundation of structural engineering"],
                              ["math", 70, "Mathematics is essential for engineering calculations"]],
    "Stock Investor":        [["math", 75, "Strong Math score supports financial analysis and trading"],
                              ["history", 65, "Economic history helps predict market trends"]],
    "Real Estate Developer": [["geography", 65, "Geography knowledge supports site selection and planning"],
                              ["math", 65, "Math supports property valuation and financial planning"]],
    "Government Officer":    [["history", 70, "Strong History score aligns with policy and governance"],
                              ["english", 68, "English is essential for public service communication"]],
    "Social Network Studies":[["english", 68, "Communication skills are core to social media management"],
                              ["geography", 60, "Geography supports understanding of global social trends"]],
  };

  // Subject-based rules
  const careerSubjectRules = subjectRules[careerName] || [];
  careerSubjectRules.forEach(([subject, threshold, reason]) => {
    if (s[subject] >= threshold) rules.push(reason);
  });

  // Study hours rule
  if (s.study_hours >= 30) rules.push(`High weekly study hours (${s.study_hours}hrs) reflect strong academic commitment`);
  else if (s.study_hours >= 15) rules.push(`Consistent study hours (${s.study_hours}hrs/week) support career readiness`);

  // Knowledge Graph boost note
  if (window._lastResults && window._lastResults[0]?.kg_boost) {
    rules.push("Knowledge Graph boost applied — interest & trait signals used as tiebreaker");
  }

  // Conflict resolution note
  if (window._lastResults && window._lastResults[0]?.conflict_note) {
    rules.push(window._lastResults[0].conflict_note);
  }

  return rules.slice(0, 4);
}

// ── Test with CSV student ─────────────────────────────────────
function loadCSVStudent() {
  const modal = document.getElementById('modal-overlay');
  const body  = document.getElementById('modal-body');
  modal.classList.add('active');
  body.innerHTML = `
    <div style="margin-bottom:12px">
      <div class="modal-rec-title">🔍 Test with Existing Student</div>
      <p style="font-size:12px;color:#666;margin-bottom:12px">Search for a student from the 6,000 CSV records and load their profile.</p>
      <div style="display:flex;gap:8px">
        <input id="csv-search-input" type="text" placeholder="Search by name or career..."
          style="flex:1;padding:8px 12px;border:1.5px solid #ddd;border-radius:8px;font-size:13px;outline:none;font-family:Poppins,sans-serif"/>
        <button onclick="searchCSVStudents()" style="padding:8px 16px;background:#1a4fa0;color:white;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:Poppins,sans-serif">Search</button>
      </div>
    </div>
    <div id="csv-results">
      <p style="color:#aaa;font-size:12px;text-align:center;padding:20px">Enter a name or career to search.</p>
    </div>`;

  document.getElementById('csv-search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchCSVStudents();
  });
}

function searchCSVStudents() {
  const query = document.getElementById('csv-search-input').value.trim();
  if (!query) return;
  const el = document.getElementById('csv-results');
  el.innerHTML = '<p style="color:#888;font-size:12px;text-align:center;padding:12px">Searching...</p>';

  fetch(`/api/students?search=${encodeURIComponent(query)}&per_page=6`)
    .then(r => r.json())
    .then(data => {
      if (!data.students || data.students.length === 0) {
        el.innerHTML = '<p style="color:#aaa;font-size:12px;text-align:center;padding:12px">No students found.</p>';
        return;
      }
      el.innerHTML = data.students.map(s => `
        <div class="csv-student-row" onclick="loadStudentProfile(${JSON.stringify(s).replace(/"/g, '&quot;')})">
          <div class="csv-student-name">${s.first_name} ${s.last_name}</div>
          <div class="csv-student-info">
            <span>${s.career_aspiration}</span>
            <span>Math: ${s.scores?.math ?? '-'}</span>
            <span>Bio: ${s.scores?.biology ?? '-'}</span>
            <span>Eng: ${s.scores?.english ?? '-'}</span>
          </div>
        </div>`).join('');
    });
}

// Map career aspiration → interest chips
const CAREER_INTERESTS = {
  "Software Engineer":      ["computers", "technology", "problem_solving", "math"],
  "Doctor":                 ["biology", "helping_people", "research"],
  "Lawyer":                 ["law", "communication", "helping_people"],
  "Teacher":                ["education", "helping_people", "communication"],
  "Scientist":              ["research", "biology", "math"],
  "Business Owner":         ["communication", "problem_solving", "law"],
  "Accountant":             ["math", "problem_solving"],
  "Banker":                 ["math", "communication"],
  "Designer":               ["art", "technology", "problem_solving"],
  "Artist":                 ["art", "education", "communication"],
  "Writer":                 ["communication", "education", "art"],
  "Game Developer":         ["computers", "technology", "art", "problem_solving"],
  "Construction Engineer":  ["problem_solving", "math", "technology"],
  "Stock Investor":         ["math", "problem_solving", "research"],
  "Real Estate Developer":  ["law", "math", "communication"],
  "Government Officer":     ["law", "communication", "helping_people", "education"],
  "Social Network Studies": ["communication", "technology", "education"],
};

function loadStudentProfile(student) {
  closeModal();

  // Fill in name
  document.getElementById('name').value = `${student.first_name} ${student.last_name}`;

  // Fill in scores
  const fields = ['math','history','physics','chemistry','biology','english','geography'];
  fields.forEach(f => {
    const el = document.getElementById(f);
    const valEl = document.getElementById(
      f === 'biology' ? 'bio-val' :
      f === 'history' ? 'hist-val' :
      f === 'physics' ? 'phys-val' :
      f === 'chemistry' ? 'chem-val' :
      f === 'geography' ? 'geo-val' :
      f + '-val'
    );
    if (el && student.scores?.[f] !== undefined) {
      el.value = student.scores[f];
      if (valEl) valEl.textContent = student.scores[f];
    }
  });

  // Set study hours
  const sh = document.getElementById('study_hours');
  const shv = document.getElementById('study-val');
  if (sh) { sh.value = student.study_hours || 20; shv.textContent = student.study_hours || 20; }

  // Clear all interests — recommendations driven by scores only for CSV students
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));

  // Auto-run recommendations
  getRecommendations();
}

// ── View Details Modal ────────────────────────────────────────
function viewDetails() {
  const modal = document.getElementById('modal-overlay');
  const body  = document.getElementById('modal-body');
  modal.classList.add('active');
  body.innerHTML = '<p style="text-align:center;color:#888;padding:20px">Loading from MongoDB...</p>';

  fetch('/api/profiles')
    .then(r => r.json())
    .then(profiles => {
      const name    = document.getElementById('name').value.trim() || 'Student';
      const profile = profiles.find(p => p.name === name) || profiles[0];

      if (!profile) {
        body.innerHTML = '<p style="color:#888;text-align:center;padding:20px">No saved profile found.</p>';
        return;
      }

      const interests = Array.isArray(profile.interests) ? profile.interests : [];
      const badges = interests.length
        ? interests.map(i => `<span class="modal-badge">${i}</span>`).join('')
        : '<span style="color:#aaa">None</span>';

      const recCards = [...document.querySelectorAll('.rec-other-card')];
      const recsHtml = recCards.map((card, i) => {
        const n = card.querySelector('.name')?.textContent || '';
        const sc = card.querySelector('.score')?.textContent || '';
        return `<div class="modal-row"><span class="label">#${i+1}</span><span class="value">${n} — ${sc}</span></div>`;
      }).join('');

      body.innerHTML = `
        <div class="modal-rec-title">📋 Saved Profile — MongoDB</div>
        <div class="modal-row"><span class="label">Name</span><span class="value">${profile.name}</span></div>
        <div class="modal-row"><span class="label">Math</span><span class="value">${profile.math}</span></div>
        <div class="modal-row"><span class="label">History</span><span class="value">${profile.history ?? '-'}</span></div>
        <div class="modal-row"><span class="label">Physics</span><span class="value">${profile.physics ?? '-'}</span></div>
        <div class="modal-row"><span class="label">Chemistry</span><span class="value">${profile.chemistry ?? '-'}</span></div>
        <div class="modal-row"><span class="label">Biology</span><span class="value">${profile.biology}</span></div>
        <div class="modal-row"><span class="label">English</span><span class="value">${profile.english}</span></div>
        <div class="modal-row"><span class="label">Geography</span><span class="value">${profile.geography ?? '-'}</span></div>
        <div class="modal-row"><span class="label">Study Hours</span><span class="value">${profile.study_hours}/week</span></div>
        <div class="modal-row"><span class="label">Interests</span><span class="value">${badges}</span></div>
        <div style="margin-top:12px">
          <div class="modal-rec-title">🎯 Career Recommendations</div>
          ${recsHtml || '<p style="color:#aaa;font-size:12px">No recommendations yet.</p>'}
        </div>`;
    })
    .catch(() => {
      body.innerHTML = '<p style="color:#e07b2a;text-align:center;padding:20px">⚠️ Could not connect to MongoDB.</p>';
    });
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });