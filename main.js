// Chip toggle
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('selected'));
});

const CAREER_META = {
  "Software Engineer": { icon: "💻", desc: "Design and develop software applications and systems.", skills: "Programming, Algorithm Design", degrees: "Computer Science, Software Engineering" },
  "Data Scientist":    { icon: "📊", desc: "Analyse data and build predictive models.", skills: "Statistics, Machine Learning", degrees: "Data Science, Mathematics" },
  "Doctor":            { icon: "🩺", desc: "Diagnose and treat patients in clinical settings.", skills: "Clinical Knowledge, Communication", degrees: "Medicine, Biomedical Sciences" },
  "Lawyer":            { icon: "⚖️", desc: "Advise clients and represent them in legal matters.", skills: "Critical Thinking, Communication", degrees: "Law, Political Science" },
  "Teacher":           { icon: "📚", desc: "Educate and inspire students at various levels.", skills: "Communication, Patience", degrees: "Education, Subject Specialisation" },
  "Designer":          { icon: "🎨", desc: "Create visual concepts and user experiences.", skills: "Creativity, Visual Thinking", degrees: "Graphic Design, UX/UI Design" },
};

function getRecommendations() {
  const name        = document.getElementById('name').value.trim() || 'Student';
  const interests   = [...document.querySelectorAll('.chip.selected')].map(c => c.dataset.val);
  const math        = document.getElementById('math').value;
  const biology     = document.getElementById('biology').value;
  const english     = document.getElementById('english').value;
  const study_hours = document.getElementById('study_hours').value;

  // Update avatar label
  document.querySelector('.avatar').textContent = '🎓';

  fetch('/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, interests, math, biology, english, study_hours })
  })
  .then(r => r.json())
  .then(results => showResults(name, results, interests));
}

function showResults(name, results, interests) {
  const placeholder = document.getElementById('rec-placeholder');
  const result      = document.getElementById('rec-result');
  const panel       = document.getElementById('rec-panel');

  placeholder.style.display = 'none';
  result.style.display = 'block';

  const top  = results[0];
  const meta = CAREER_META[top.name] || { icon: "🎯", desc: "A great career for your profile.", skills: "Various", degrees: "Relevant degree" };

  document.getElementById('rec-icon').textContent  = meta.icon;
  document.getElementById('rec-title').textContent = `Recommended Career: ${top.name}`;
  document.getElementById('rec-desc').textContent  = meta.desc;
  document.getElementById('rec-skills').textContent  = meta.skills;
  document.getElementById('rec-degrees').textContent = meta.degrees;

  // Other careers
  const othersEl = document.getElementById('rec-others');
  othersEl.innerHTML = '';
  results.slice(0, 3).forEach((career, i) => {
    const m = CAREER_META[career.name] || { icon: "🎯" };
    const card = document.createElement('div');
    card.className = 'rec-other-card';
    card.innerHTML = `
      <div class="rank">#${i+1} Match</div>
      <div class="name">${m.icon} ${career.name}</div>
      <div class="score">${career.score}% match</div>
      <div class="rec-bar-wrap"><div class="rec-bar" style="width:0%" data-w="${career.score}%"></div></div>`;
    othersEl.appendChild(card);
  });

  // Update knowledge graph rules based on interests
  updateKGRules(interests, results[0].name);

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.rec-bar').forEach(b => b.style.width = b.dataset.w);
  }, 100);

  // Add saved note
  let note = panel.querySelector('.saved-note');
  if (!note) {
    note = document.createElement('p');
    note.className = 'saved-note';
    note.textContent = `✓ ${name}'s profile saved to MongoDB`;
    panel.appendChild(note);
  } else {
    note.textContent = `✓ ${name}'s profile saved to MongoDB`;
  }
}

function updateKGRules(interests, topCareer) {
  const ruleMap = {
    computers:      { label: "Interest: Technology", rule: "IF Coding Skills →", then: `THEN → Career: ${topCareer}`, cls: "yellow", dot: "blue" },
    research:       { label: "Interest: Science", rule: "IF Research Skills →", then: `THEN → Career: ${topCareer}`, cls: "green", dot: "teal" },
    biology:        { label: "Interest: Biology", rule: "IF Science Background →", then: `THEN → Career: Doctor / Scientist`, cls: "green", dot: "teal" },
    math:           { label: "Interest: Mathematics", rule: "IF Analytical Skills →", then: `THEN → Career: Data Scientist`, cls: "yellow", dot: "blue" },
    law:            { label: "Interest: Law", rule: "IF Communication Skills →", then: `THEN → Career: Lawyer`, cls: "orange-rule", dot: "orange" },
    helping_people: { label: "Interest: Helping People", rule: "IF Empathy + Education →", then: `THEN → Career: Teacher / Doctor`, cls: "green", dot: "teal" },
    education:      { label: "Interest: Education", rule: "IF Teaching Skills →", then: `THEN → Career: Teacher`, cls: "green", dot: "teal" },
    art:            { label: "Interest: Art & Design", rule: "IF Creativity Skills →", then: `THEN → Career: Designer`, cls: "yellow", dot: "orange" },
  };

  const kgList = document.getElementById('kg-rules');
  const activeRules = interests.filter(i => ruleMap[i]).slice(0, 3);

  if (activeRules.length === 0) return;

  kgList.innerHTML = '';
  activeRules.forEach(interest => {
    const r = ruleMap[interest];
    const item = document.createElement('div');
    item.className = 'kg-item';
    item.innerHTML = `
      <div class="kg-dot ${r.dot}"></div>
      <div class="kg-line">
        <span class="kg-label">${r.label}</span>
        <span class="kg-arrow">→</span>
        <span class="kg-rule ${r.cls}">${r.rule}</span>
      </div>
      <div class="kg-then">${r.then}</div>`;
    kgList.appendChild(item);
  });
}
