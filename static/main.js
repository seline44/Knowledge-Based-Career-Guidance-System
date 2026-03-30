// ── Chip toggle (interests) ─────────────────────────────────
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

// ── Environment selector ─────────────────────────────────────
let selectedEnv = 'indoors';
function selectEnv(btn) {
  document.querySelectorAll('.env-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedEnv = btn.dataset.val;
}

// ── Toggle group (gender / part-time / extracurricular) ───────
function setToggle(btn, hiddenId) {
  const group = btn.closest('.toggle-group');
  group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(hiddenId).value = btn.dataset.val;
}

// ── Career metadata ──────────────────────────────────────────
const CAREER_META = {
  "Software Engineer":      { icon: "💻", desc: "Design and develop software applications and systems.", skills: "Math, Physics, Programming", degrees: "BSc Computer Science / Software Engineering" },
  "Doctor":                 { icon: "🩺", desc: "Diagnose and treat patients in clinical settings.", skills: "Biology, Chemistry, Communication", degrees: "MBChB / Bachelor of Medicine and Surgery" },
  "Lawyer":                 { icon: "⚖️", desc: "Advise clients and represent them in legal matters.", skills: "English, History, Critical Thinking", degrees: "LLB Bachelor of Laws" },
  "Teacher":                { icon: "📚", desc: "Educate and inspire students at various levels.", skills: "English, Communication, Patience", degrees: "BEd Bachelor of Education" },
  "Scientist":              { icon: "🔬", desc: "Conduct research and experiments to advance knowledge.", skills: "Biology, Chemistry, Physics", degrees: "BSc in relevant science field" },
  "Business Owner":         { icon: "🏢", desc: "Start and manage a business enterprise.", skills: "Math, Communication, Leadership", degrees: "BBA Business Administration" },
  "Accountant":             { icon: "🧮", desc: "Manage financial records and ensure compliance.", skills: "Math, Logic, Organization", degrees: "BCom Accounting / Finance" },
  "Banker":                 { icon: "🏦", desc: "Manage financial services and banking operations.", skills: "Math, English, Communication", degrees: "BCom Finance / Economics" },
  "Designer":               { icon: "🎨", desc: "Create visual concepts and user experiences.", skills: "Biology, Geography, Visual Thinking", degrees: "BDes Graphic / UX Design" },
  "Artist":                 { icon: "🖌️", desc: "Create original artwork and creative expressions.", skills: "Art, English, History", degrees: "BFA Bachelor of Fine Arts" },
  "Writer":                 { icon: "✍️", desc: "Create written content for various media.", skills: "English, History, Research", degrees: "BA Journalism / English Literature" },
  "Game Developer":         { icon: "🎮", desc: "Design and build interactive video games.", skills: "Math, Physics, Programming", degrees: "BSc Computer Science / Game Design" },
  "Construction Engineer":  { icon: "🏗️", desc: "Plan and oversee construction and infrastructure.", skills: "Physics, Math, Critical Thinking", degrees: "BEng Civil / Construction Engineering" },
  "Stock Investor":         { icon: "📈", desc: "Analyse markets and manage investment portfolios.", skills: "Math, Biology, Economics", degrees: "BCom Finance / Economics / Mathematics" },
  "Real Estate Developer":  { icon: "🏘️", desc: "Develop and manage property and real estate.", skills: "Physics, Chemistry, Geography", degrees: "BCom Property Studies / Law" },
  "Government Officer":     { icon: "🏛️", desc: "Work in public service and policy implementation.", skills: "History, English, Communication", degrees: "BPA Public Administration / Political Science" },
  "Social Network Studies": { icon: "🌐", desc: "Study and manage social media and digital communities.", skills: "English, Biology, Technology", degrees: "BA Media & Communications / Sociology" },
  // Week 1 Knowledge Base careers
  "Data Scientist":         { icon: "📊", desc: "Analyse large datasets to find patterns and insights.", skills: "Math, Statistics, Programming", degrees: "BSc Data Science / Computer Science" },
  "Graphic Designer":       { icon: "🖼️", desc: "Create visual content for brands, media, and products.", skills: "Creativity, Visual Thinking, Communication", degrees: "BDes Graphic Design" },
  "Environmental Scientist":{ icon: "🌍", desc: "Study the environment and solve ecological problems.", skills: "Science, Critical Thinking, Writing", degrees: "BSc Environmental Science" },
  "Journalist":             { icon: "📰", desc: "Investigate and report on news and important events.", skills: "Writing, Communication, Research", degrees: "BA Journalism / Media Studies" },
  "Cybersecurity Analyst":  { icon: "🔐", desc: "Protect computer systems and networks from cyber threats.", skills: "Logic, Programming, Critical Thinking", degrees: "BSc Cybersecurity / Computer Science" },
  "Architect":              { icon: "🏛️", desc: "Design buildings and structures for function and aesthetics.", skills: "Math, Creativity, Visual Thinking", degrees: "BArch Bachelor of Architecture" },
  "Nurse":                  { icon: "🏥", desc: "Provide direct patient care and support medical teams.", skills: "Science, Communication, Critical Thinking", degrees: "BNSc Bachelor of Nursing Science" },
};

const RIASEC_FULL = {
  R: { name: "Realistic",     color: "#4f46e5", desc: "Practical, hands-on problem solving" },
  I: { name: "Investigative", color: "#0891b2", desc: "Analytical, intellectual curiosity" },
  A: { name: "Artistic",      color: "#be185d", desc: "Creative, expressive, imaginative" },
  S: { name: "Social",        color: "#0369a1", desc: "Helping, teaching, serving others" },
  E: { name: "Enterprising",  color: "#b45309", desc: "Leading, persuading, managing" },
  C: { name: "Conventional",  color: "#065f46", desc: "Organising, data, detail-oriented" },
};

// ── Collect form values ───────────────────────────────────────
function collectProfile() {
  const name      = document.getElementById('name').value.trim() || 'Student';
  const interests = [...document.querySelectorAll('#chips .chip.selected')].map(c => c.dataset.val);
  const skills    = [...document.querySelectorAll('#skill-chips .s-chip.selected')].map(c => c.dataset.val);
  const traits    = [...document.querySelectorAll('#trait-chips .t-chip.selected')].map(c => c.dataset.val);
  const preferred_environment = selectedEnv;

  const math        = +document.getElementById('math').value;
  const history     = +document.getElementById('history').value;
  const physics     = +document.getElementById('physics').value;
  const chemistry   = +document.getElementById('chemistry').value;
  const biology     = +document.getElementById('biology').value;
  const english     = +document.getElementById('english').value;
  const geography   = +document.getElementById('geography').value;
  const study_hours = +document.getElementById('study_hours').value;

  const gender          = +document.getElementById('gender-val').value;
  const part_time       = +document.getElementById('parttime-val').value;
  const absence         = +document.getElementById('absence').value;
  const extracurricular = +document.getElementById('extra-val').value;

  return { name, interests, skills, traits, preferred_environment,
           math, history, physics, chemistry, biology, english, geography,
           study_hours, gender, part_time, absence, extracurricular };
}

// ── Get Recommendations ───────────────────────────────────────
function getRecommendations() {
  const profile = collectProfile();

  document.getElementById('rec-placeholder').style.display = 'none';
  document.getElementById('rec-result').style.display = 'none';
  document.getElementById('rec-loading').style.display = 'block';

  // Animate loading steps
  let step = 0;
  const steps = ['ls1','ls2','ls3','ls4'];
  steps.forEach(id => document.getElementById(id).classList.remove('active'));
  const stepTimer = setInterval(() => {
    if (step < steps.length) {
      document.getElementById(steps[step]).classList.add('active');
      step++;
    } else {
      clearInterval(stepTimer);
    }
  }, 250);

  fetch('/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  })
  .then(r => r.json())
  .then(results => {
    clearInterval(stepTimer);
    document.getElementById('rec-loading').style.display = 'none';
    showResults(profile, results);
  })
  .catch(() => {
    clearInterval(stepTimer);
    document.getElementById('rec-loading').style.display = 'none';
    document.getElementById('rec-placeholder').style.display = 'block';
    document.getElementById('rec-placeholder').innerHTML = '<div class="placeholder-icon">❌</div><p>Could not connect to the server. Make sure Flask is running.</p>';
  });
}

// ── Show Results ──────────────────────────────────────────────
function showResults(profile, results) {
  window._lastResults = results;
  window._lastProfile = profile;

  document.getElementById('rec-result').style.display = 'block';

  const top    = results[0];
  const meta   = CAREER_META[top.name] || { icon: '🎯', desc: 'A rewarding career that matches your profile.', skills: 'Various', degrees: 'Relevant degree' };
  const riasec = RIASEC_FULL[top.riasec] || { name: top.riasec, color: '#555', desc: '' };

  document.getElementById('rec-icon').textContent    = meta.icon;
  document.getElementById('rec-title').textContent   = `Recommended: ${top.name}`;
  document.getElementById('rec-desc').textContent    = meta.desc;
  document.getElementById('rec-skills').textContent  = meta.skills;
  document.getElementById('rec-degrees').textContent = meta.degrees;

  // RIASEC badge
  document.getElementById('rec-riasec').innerHTML = `
    <span class="riasec-badge" style="background:${riasec.color}">${top.riasec} · ${riasec.name}</span>
    <span class="riasec-desc">${riasec.desc}</span>`;

  // Confidence
  const confidence = top.score >= 75 ? 'High' : top.score >= 55 ? 'Medium' : 'Low';
  const confColor  = top.score >= 75 ? '#15803d' : top.score >= 55 ? '#b45309' : '#dc2626';
  document.getElementById('rec-confidence').innerHTML = `
    <span class="conf-label">Match Confidence:</span>
    <span class="conf-value" style="color:${confColor}">${confidence} (${top.score}%)</span>
    <div class="conf-bar-wrap">
      <div class="conf-bar" style="width:0%;background:${confColor}" data-w="${top.score}%"></div>
    </div>`;

  // Forward Chaining reasons (from fc_reasons in response)
  const fcReasons = top.fc_reasons || [];
  const rulesHtml = buildRulesHtml(top.name, profile, fcReasons);
  document.getElementById('rec-rules').innerHTML = `
    <div class="rules-title">📋 Why this career? (Forward Chaining rules)</div>
    ${rulesHtml}`;

  // All match cards (up to 5)
  const othersEl = document.getElementById('rec-others');
  othersEl.innerHTML = '';
  results.slice(0, 5).forEach((career, i) => {
    const m = CAREER_META[career.name] || { icon: '🎯' };
    const r = RIASEC_FULL[career.riasec] || { name: career.riasec, color: '#555' };
    const card = document.createElement('div');
    card.className = 'rec-other-card';
    card.innerHTML = `
      <div class="rank">#${i+1} Match</div>
      <div class="name">${m.icon} ${career.name}</div>
      <div class="card-riasec" style="background:${r.color}">${career.riasec} · ${r.name}</div>
      <div class="score">${career.score}%</div>
      <div class="rec-bar-wrap"><div class="rec-bar" style="width:0%;background:${r.color}" data-w="${career.score}%"></div></div>`;
    othersEl.appendChild(card);
  });

  // Pipeline trace
  if (top.pipeline_trace) {
    renderPipelineTrace(top);
  }

  // Related careers (from backend related field)
  if (top.related && top.related.length > 0) {
    document.getElementById('related-section').style.display = 'block';
    const relEl = document.getElementById('related-careers');
    relEl.innerHTML = top.related.map(c => {
      const m = CAREER_META[c] || { icon: '🎯' };
      return `<span class="related-chip">${m.icon} ${c}</span>`;
    }).join('');
  } else {
    document.getElementById('related-section').style.display = 'none';
  }

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.rec-bar, .conf-bar').forEach(b => b.style.width = b.dataset.w);
  }, 100);

  // Saved note
  const note = document.getElementById('saved-note');
  note.textContent = `✓ ${profile.name}'s profile saved`;
  note.style.display = 'block';
}

// ── Build Forward Chaining rule explanations ─────────────────
function buildRulesHtml(careerName, profile, fcReasons) {
  const items = [];
  const s = profile;

  // Subject-based rules per career (mirrors week4 derive_profile_from_scores logic)
  const subjectRules = {
    "Software Engineer":      [["math", 80, "Strong Math score supports technical computing (>80 → computers, programming)"],
                               ["physics", 75, "Physics background supports algorithm and logic thinking"]],
    "Doctor":                 [["biology", 75, "Biology > 75 → health/biology interests and science skills"],
                               ["chemistry", 75, "Chemistry > 75 reinforces biology interest, essential for pharmacology"]],
    "Lawyer":                 [["english", 75, "High English score supports legal writing and argumentation"],
                               ["history", 75, "History knowledge supports understanding of legal precedents and governance"]],
    "Teacher":                [["english", 85, "English > 85 → education & current_events interest, expressive trait"],
                               ["history", 75, "History > 75 adds education/current_events interests"]],
    "Scientist":              [["biology", 75, "Biology > 75 → biology/health interests and science skill"],
                               ["chemistry", 75, "Chemistry > 75 → science skill and biology interest reinforced"]],
    "Game Developer":         [["math", 88, "Math > 88 → computers interest and programming skill"],
                               ["physics", 75, "Physics > 75 → technology interest and science skill"]],
    "Construction Engineer":  [["physics", 75, "Physics > 75 → technology interest and science skill"],
                               ["math", 80, "Math > 80 → math/problem_solving interests and logic skill"]],
    "Designer":               [["biology", 75, "Biology/visual interest connection — design linked to life sciences"],
                               ["geography", 70, "Geography > 70 → nature interest, spatial awareness"]],
    "Writer":                 [["english", 75, "English > 75 → communication/writing interests and skills"],
                               ["history", 75, "History > 75 → current_events/education interest for writing depth"]],
    "Artist":                 [["english", 85, "English > 85 adds expressive trait, creative signal"],
                               ["geography", 82, "Geography > 82 → curious trait and research interest"]],
    "Stock Investor":         [["math", 80, "Math > 80 → math/problem_solving interests and logic/math skills"],
                               ["biology", 75, "Biology scores correlated with analytical traits in dataset"]],
    "Accountant":             [["math", 80, "Math > 80 → math skills and detail_oriented trait"],
                               ["study_hours", 25, "High study hours (>25) → detail_oriented and patient traits"]],
    "Banker":                 [["math", 80, "Math > 80 supports financial calculations and analytical thinking"],
                               ["english", 75, "English > 75 → communication skills essential for client banking"]],
    "Business Owner":         [["math", 80, "Math supports financial planning; problem_solving interest"],
                               ["english", 75, "English > 75 → communication skill and helping_people interest"]],
    "Real Estate Developer":  [["physics", 75, "Physics → technology interest, structural/spatial thinking"],
                               ["math", 80, "Math > 80 → property valuation and financial planning"]],
    "Government Officer":     [["history", 75, "History > 75 → education/current_events interests"],
                               ["english", 75, "English > 75 → communication/writing skills for public service"]],
    "Social Network Studies": [["english", 75, "English > 75 → communication interest and writing skill"],
                               ["biology", 75, "Biological/social sciences link — community and wellbeing focus"]],
    "Data Scientist":         [["math", 88, "Math > 88 → computers, programming, statistics skills"],
                               ["biology", 75, "Research/science interest reinforces data analysis path"]],
    "Environmental Scientist":[["geography", 70, "Geography > 70 → nature interest, environmental awareness"],
                               ["biology", 75, "Biology > 75 → biology interest, science skill"]],
    "Journalist":             [["english", 75, "English > 75 → writing/communication skills and interests"],
                               ["history", 75, "History > 75 → current_events interest, context for reporting"]],
    "Cybersecurity Analyst":  [["math", 88, "Math > 88 → computers/problem_solving interests, programming skill"],
                               ["physics", 75, "Physics → technology interest and logical thinking"]],
    "Architect":              [["math", 80, "Math > 80 → math skills and design thinking"],
                               ["geography", 70, "Geography > 70 → nature/spatial awareness"]],
    "Nurse":                  [["biology", 80, "Biology > 80 + Chemistry > 75 → helping_people interest, empathetic trait"],
                               ["chemistry", 75, "Chemistry > 75 → science skills essential for clinical care"]],
    "Graphic Designer":       [["biology", 75, "Visual/biological design correlation in dataset"],
                               ["geography", 70, "Geographic / spatial thinking supports design composition"]],
  };

  // Add score-based reasons
  const careerRules = subjectRules[careerName] || [];
  careerRules.forEach(([subject, threshold, reason]) => {
    const val = subject === 'study_hours' ? s.study_hours : s[subject];
    if (val !== undefined && +val >= threshold) {
      items.push(reason);
    }
  });

  // Add interest-match reasons (from fc_reasons passed from backend)
  if (fcReasons && fcReasons.length > 0) {
    fcReasons.slice(0, 3).forEach(r => {
      const nice = r.replace('interest: ', '✦ interest: ').replace('skill: ', '✧ skill: ').replace('trait: ', '◆ trait: ');
      items.push(`Forward Chaining matched: ${nice}`);
    });
  }

  // Trait and interest matches from explicit profile selections
  if (profile.interests && profile.interests.length > 0) {
    items.push(`Selected interests align with career path: ${profile.interests.slice(0, 4).join(', ')}`);
  }

  // Study habit rules
  if (s.study_hours >= 35) items.push(`Very high weekly study hours (${s.study_hours}hrs) → curious, analytical traits derived`);
  else if (s.study_hours >= 25) items.push(`Good weekly study hours (${s.study_hours}hrs) → detail_oriented, patient traits derived`);

  // KG boost note
  if (window._lastResults && window._lastResults[0]?.kg_boost) {
    items.push('⚡ Knowledge Graph Boost applied — interest & trait signals used as tiebreaker over Decision Tree');
  }

  // Environment match
  if (profile.preferred_environment) {
    items.push(`Preferred environment: ${profile.preferred_environment} (matched against career environment in Knowledge Base)`);
  }

  const used = [...new Set(items)].slice(0, 5);
  if (used.length === 0) {
    return '<div class="rule-item"><span class="rule-icon">✓</span>Career matched via Decision Tree confidence score and Knowledge Graph traversal.</div>';
  }

  return used.map(r => `<div class="rule-item"><span class="rule-icon">✓</span>${r}</div>`).join('');
}

// ── Render Pipeline Trace ─────────────────────────────────────
// Shows DT → KG boost → Forward Chaining → conflict resolution
function renderPipelineTrace(top) {
  const trace = top.pipeline_trace;
  if (!trace) {
    document.getElementById('pipeline-trace').innerHTML = '';
    document.getElementById('pipeline-label').style.display = 'none';
    return;
  }
  document.getElementById('pipeline-label').style.display = 'block';

  // Conflict badge styling
  const conflictClass = {
    agree: 'conflict-agree',
    rules: 'conflict-rules',
    dt:    'conflict-dt',
    kg:    'conflict-kg',
  }[trace.conflict_winner] || 'conflict-dt';

  // DT top 3 list
  const dtList = (top.dt_top3 || []).map(d => {
    const r = RIASEC_FULL[d.riasec] || { color: '#888' };
    const barW = Math.round(d.pct * 1.2);
    return `<div class="trace-mini-item">
      <div class="trace-mini-bar" style="width:${Math.min(barW,100)}px;background:${r.color || '#1a4fa0'};flex-shrink:0"></div>
      <span>${d.name} — <strong>${d.pct}%</strong></span>
    </div>`;
  }).join('');

  // FC top 3 list
  const fcList = (top.fc_top3 || []).map(d => {
    const barW = Math.round(d.pct);
    return `<div class="trace-mini-item">
      <div class="trace-mini-bar" style="width:${Math.min(barW,100)}px;background:#0891b2;flex-shrink:0"></div>
      <span>${d.name} — <strong>${d.pct}%</strong></span>
    </div>`;
  }).join('');

  const kgBadge = top.kg_boost
    ? '<span class="trace-badge tb-purple">⚡ Activated</span>'
    : '<span class="trace-badge tb-green">✓ Not needed</span>';

  const dtConf = trace.dt_confidence || 0;
  const dtBadge = dtConf >= 70
    ? `<span class="trace-badge tb-green">${dtConf}% — High</span>`
    : dtConf >= 35
    ? `<span class="trace-badge tb-orange">${dtConf}% — Medium</span>`
    : `<span class="trace-badge tb-red">${dtConf}% — Low → KG Boost</span>`;

  const fcConf = trace.fc_confidence || 0;
  const fcBadge = fcConf >= 70
    ? `<span class="trace-badge tb-blue">${fcConf}% — Wins (≥70%)</span>`
    : `<span class="trace-badge tb-orange">${fcConf}%</span>`;

  document.getElementById('pipeline-trace').innerHTML = `
    <div class="pipeline-trace-wrap">
      <div class="trace-row">
        <div class="trace-label">🌳 Decision Tree</div>
        <div class="trace-value">
          <strong>${trace.dt_top}</strong> ${dtBadge}
          <div class="trace-mini-list">${dtList}</div>
        </div>
      </div>
      <div class="trace-row">
        <div class="trace-label">⚡ KG Boost</div>
        <div class="trace-value">${kgBadge}${top.kg_boost ? `<br/><span style="font-size:10px;color:#666">${top.conflict_note || ''}</span>` : ''}</div>
      </div>
      <div class="trace-row">
        <div class="trace-label">⚙️ Forward Chaining</div>
        <div class="trace-value">
          <strong>${trace.fc_top}</strong> ${fcBadge}
          <div class="trace-mini-list">${fcList}</div>
        </div>
      </div>
      <div class="trace-row">
        <div class="trace-label">⚖️ Blend Weights</div>
        <div class="trace-value"><span class="trace-badge tb-blue">${trace.blend_weights}</span></div>
      </div>
      <div class="trace-row">
        <div class="trace-label">📋 Conflict Resolution</div>
        <div class="trace-value">
          <div class="conflict-note-box ${conflictClass}">${trace.conflict_note}</div>
        </div>
      </div>
    </div>`;
}

// ── Test with CSV student ─────────────────────────────────────
function loadCSVStudent() {
  const modal = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = '🔍 Test with CSV Student';
  const body  = document.getElementById('modal-body');
  modal.classList.add('active');
  body.innerHTML = `
    <div style="margin-bottom:12px">
      <p style="font-size:12px;color:#666;margin-bottom:10px">Search for a student from the 6,000 CSV records and load their profile.</p>
      <div style="display:flex;gap:8px">
        <input id="csv-search-input" type="text" placeholder="Search by name or career..."
          style="flex:1;padding:8px 12px;border:1.5px solid #ddd;border-radius:8px;font-size:12px;outline:none;font-family:Poppins,sans-serif"/>
        <button onclick="searchCSVStudents()" style="padding:8px 14px;background:#1a4fa0;color:white;border:none;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;font-family:Poppins,sans-serif">Search</button>
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
        el.innerHTML = '<p style="color:#aaa;font-size:12px;text-align:center;padding:12px">No students found. Import the CSV first.</p>';
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
            <span>Study: ${s.study_hours}h</span>
          </div>
        </div>`).join('');
    });
}

// Map career aspiration → interest chips (full set matching KNOWLEDGE_GRAPH)
const CAREER_INTERESTS = {
  "Software Engineer":      ["computers", "technology", "problem_solving", "math"],
  "Doctor":                 ["biology", "health", "helping_people", "research"],
  "Lawyer":                 ["law", "communication", "helping_people", "current_events"],
  "Teacher":                ["education", "helping_people", "communication"],
  "Scientist":              ["research", "biology", "math"],
  "Business Owner":         ["communication", "problem_solving", "law"],
  "Accountant":             ["math", "problem_solving"],
  "Banker":                 ["math", "communication", "problem_solving"],
  "Designer":               ["art", "design", "technology", "problem_solving"],
  "Artist":                 ["art", "education", "communication"],
  "Writer":                 ["writing", "communication", "education", "current_events"],
  "Game Developer":         ["computers", "technology", "art", "problem_solving"],
  "Construction Engineer":  ["problem_solving", "math", "technology"],
  "Stock Investor":         ["math", "problem_solving", "research"],
  "Real Estate Developer":  ["law", "math", "communication"],
  "Government Officer":     ["law", "communication", "helping_people", "education"],
  "Social Network Studies": ["communication", "technology", "education", "helping_people"],
  // Week 1 Knowledge Base
  "Data Scientist":         ["computers", "math", "research"],
  "Environmental Scientist":["nature", "biology", "research"],
  "Journalist":             ["writing", "communication", "current_events"],
  "Cybersecurity Analyst":  ["computers", "technology", "problem_solving"],
  "Architect":              ["design", "math", "art"],
  "Nurse":                  ["health", "biology", "helping_people"],
  "Graphic Designer":       ["art", "design", "technology"],
};

// Traits implied by career
const CAREER_TRAITS = {
  "Software Engineer":      ["analytical", "detail_oriented", "patient"],
  "Doctor":                 ["empathetic", "patient", "detail_oriented"],
  "Lawyer":                 ["analytical", "expressive", "persistent"],
  "Teacher":                ["empathetic", "patient", "expressive"],
  "Scientist":              ["curious", "analytical", "detail_oriented"],
  "Designer":               ["creative", "detail_oriented", "expressive"],
  "Artist":                 ["creative", "expressive", "curious"],
  "Writer":                 ["expressive", "curious", "persistent"],
  "Data Scientist":         ["analytical", "curious", "detail_oriented"],
  "Nurse":                  ["empathetic", "patient", "calm_under_pressure"],
  "Environmental Scientist":["curious", "analytical", "passionate"],
  "Journalist":             ["curious", "expressive", "persistent"],
  "Architect":              ["creative", "detail_oriented", "analytical"],
};

function loadStudentProfile(student) {
  closeModal();

  document.getElementById('name').value = `${student.first_name} ${student.last_name}`;

  const fields = ['math','history','physics','chemistry','biology','english','geography'];
  const valIds = { biology:'bio-val', history:'hist-val', physics:'phys-val', chemistry:'chem-val', geography:'geo-val' };
  fields.forEach(f => {
    const el = document.getElementById(f);
    const valId = valIds[f] || f + '-val';
    const valEl = document.getElementById(valId);
    if (el && student.scores?.[f] !== undefined) {
      el.value = student.scores[f];
      if (valEl) valEl.textContent = student.scores[f];
    }
  });

  // Study hours
  const sh = document.getElementById('study_hours');
  const shv = document.getElementById('study-val');
  if (sh) { sh.value = student.study_hours || 20; if (shv) shv.textContent = student.study_hours || 20; }

  // Part-time & extracurricular
  if (student.part_time_job !== undefined) {
    const ptVal = student.part_time_job ? 1 : 0;
    document.getElementById('parttime-val').value = ptVal;
    document.querySelectorAll('.toggle-btn').forEach(b => {
      if (b.closest('.toggle-group') && b.dataset.val == ptVal && b.closest('.extra-inner')) {
        b.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      }
    });
  }

  // Clear and set interest chips from career
  document.querySelectorAll('#chips .chip').forEach(c => c.classList.remove('selected'));
  const careerInterests = CAREER_INTERESTS[student.career_aspiration] || [];
  careerInterests.forEach(val => {
    const chip = document.querySelector(`#chips .chip[data-val="${val}"]`);
    if (chip) chip.classList.add('selected');
  });

  // Clear and set trait chips
  document.querySelectorAll('#trait-chips .t-chip').forEach(c => c.classList.remove('selected'));
  const careerTraits = CAREER_TRAITS[student.career_aspiration] || [];
  careerTraits.forEach(val => {
    const chip = document.querySelector(`#trait-chips .t-chip[data-val="${val}"]`);
    if (chip) chip.classList.add('selected');
  });

  // Clear skills
  document.querySelectorAll('#skill-chips .s-chip').forEach(c => c.classList.remove('selected'));

  getRecommendations();
}

// ── View Details Modal ────────────────────────────────────────
function viewDetails() {
  const modal = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = '📋 Saved Profile';
  const body  = document.getElementById('modal-body');
  modal.classList.add('active');
  body.innerHTML = '<p style="text-align:center;color:#888;padding:20px">Loading...</p>';

  fetch('/api/profiles')
    .then(r => r.json())
    .then(profiles => {
      const name    = document.getElementById('name').value.trim() || 'Student';
      const profile = profiles.find(p => p.name === name) || profiles[0];

      if (!profile) {
        body.innerHTML = '<p style="color:#888;text-align:center;padding:20px">No saved profile found. Click "Get Career Suggestions" first.</p>';
        return;
      }

      const interests = Array.isArray(profile.interests) ? profile.interests : [];
      const skills    = Array.isArray(profile.skills)    ? profile.skills    : [];
      const traits    = Array.isArray(profile.traits)    ? profile.traits    : [];

      const badges = arr => arr.length
        ? arr.map(i => `<span class="modal-badge">${i}</span>`).join('')
        : '<span style="color:#aaa">None selected</span>';

      const recCards = [...document.querySelectorAll('.rec-other-card')];
      const recsHtml = recCards.slice(0, 5).map((card, i) => {
        const n = card.querySelector('.name')?.textContent || '';
        const sc = card.querySelector('.score')?.textContent || '';
        return `<div class="modal-row"><span class="label">#${i+1}</span><span class="value">${n} — ${sc}</span></div>`;
      }).join('');

      body.innerHTML = `
        <div class="modal-rec-title">👤 Student Profile</div>
        <div class="modal-row"><span class="label">Name</span><span class="value">${profile.name}</span></div>
        <div class="modal-row"><span class="label">Math</span><span class="value">${profile.math}</span></div>
        <div class="modal-row"><span class="label">History</span><span class="value">${profile.history ?? '-'}</span></div>
        <div class="modal-row"><span class="label">Physics</span><span class="value">${profile.physics ?? '-'}</span></div>
        <div class="modal-row"><span class="label">Chemistry</span><span class="value">${profile.chemistry ?? '-'}</span></div>
        <div class="modal-row"><span class="label">Biology</span><span class="value">${profile.biology}</span></div>
        <div class="modal-row"><span class="label">English</span><span class="value">${profile.english}</span></div>
        <div class="modal-row"><span class="label">Geography</span><span class="value">${profile.geography ?? '-'}</span></div>
        <div class="modal-row"><span class="label">Study Hrs/wk</span><span class="value">${profile.study_hours}</span></div>
        <div class="modal-row"><span class="label">Interests</span><span class="value">${badges(interests)}</span></div>
        <div class="modal-row"><span class="label">Skills</span><span class="value">${badges(skills)}</span></div>
        <div class="modal-row"><span class="label">Traits</span><span class="value">${badges(traits)}</span></div>
        <div style="margin-top:12px">
          <div class="modal-rec-title">🎯 Career Recommendations</div>
          ${recsHtml || '<p style="color:#aaa;font-size:12px">No recommendations yet.</p>'}
        </div>`;
    })
    .catch(() => {
      body.innerHTML = '<p style="color:#e07b2a;text-align:center;padding:20px">⚠️ Could not load profile data.</p>';
    });
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}