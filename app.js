// ============================================================
//  GET FIT — 90 Day Challenge  |  app.js
// ============================================================

// ---------- STATE ----------
var state = {};

function loadState() {
  try {
    var s = localStorage.getItem('getfit90_v2');
    state = s ? JSON.parse(s) : {};
  } catch (e) {
    state = {};
  }
  if (!state.answers)       state.answers = {};
  if (!state.completed)     state.completed = {};
  if (!state.startDate)     state.startDate = null;
  if (!state.plan)          state.plan = null;
}

function saveState() {
  try { localStorage.setItem('getfit90_v2', JSON.stringify(state)); } catch(e){}
}

// ---------- DATA ----------
var BODY_TYPES = {
  ecto: {
    name: 'Ectomorph', icon: '🦴',
    trait: 'Fast metabolism · Lean frame · Hard gainer',
    tips: ['Focus on volume — more sets per session', 'Rest 48hrs between same muscle groups', 'Add plyometrics for extra muscle stimulus']
  },
  meso: {
    name: 'Mesomorph', icon: '💪',
    trait: 'Athletic build · Responds well to training',
    tips: ['Mix explosive and controlled movements', 'Track progressive overload every week', 'Push intensity — your body adapts fast']
  },
  endo: {
    name: 'Endomorph', icon: '🔥',
    trait: 'Powerful build · Benefits from cardio focus',
    tips: ['Keep rest periods short (30–45 sec)', 'Prioritize high-intensity circuits to burn fat', 'Add a 20-min walk after every session']
  }
};

var EXERCISES = {
  Push:        ['Push-Ups', 'Decline Push-Ups', 'Diamond Push-Ups', 'Pike Push-Ups', 'Tricep Dips'],
  Pull:        ['Pull-Ups', 'Inverted Rows', 'Chin-Ups', 'Archer Rows', 'Dead Hangs'],
  Legs:        ['Squats', 'Jump Squats', 'Lunges', 'Bulgarian Split Squats', 'Glute Bridges'],
  Core:        ['Plank', 'Hollow Body Hold', 'Leg Raises', 'Mountain Climbers', 'Bicycle Crunches'],
  'Full Body': ['Burpees', 'Man Makers', 'Bear Crawls', 'Squat Jumps', 'Turkish Get-Ups'],
  HIIT:        ['Burpees', 'High Knees', 'Jump Squats', 'Speed Skaters', 'Box Jumps'],
  Circuit:     ['Push-Ups', 'Squats', 'Burpees', 'Mountain Climbers', 'Jump Lunges'],
  Conditioning:['Jump Rope', 'Bear Crawl', 'Lateral Shuffles', 'Agility Drills', 'Box Jumps'],
  Cardio:      ['Jogging', 'Jump Rope', 'Jumping Jacks', 'High Knees', 'Shadowboxing'],
  Plyometrics: ['Box Jumps', 'Broad Jumps', 'Clap Push-Ups', 'Lateral Bounds', 'Explosive Squats'],
  Mobility:    ['Hip Circles', 'Shoulder Rolls', 'Pigeon Pose', 'Cat-Cow', 'Thoracic Rotation'],
  'Push/Pull': ['Push-Ups', 'Pull-Ups', 'Dips', 'Inverted Rows', 'Pike Push-Ups'],
  Upper:       ['Push-Ups', 'Pull-Ups', 'Dips', 'Pike Press', 'Shoulder Taps'],
  Lower:       ['Squats', 'Lunges', 'Glute Bridges', 'Step-Ups', 'Single Leg RDL'],
  Strength:    ['Push-Ups', 'Squats', 'Dips', 'Inverted Rows', 'Lunges'],
  Power:       ['Clap Push-Ups', 'Jump Squats', 'Box Jumps', 'Explosive Pull-Ups', 'Broad Jumps'],
  Rest:        []
};

var TEMPLATES = {
  muscle: {
    beginner:  { schedule: ['Push','Rest','Pull','Rest','Legs','Rest','Rest'],    phases: ['Foundation','Strength Build','Power Phase'] },
    inter:     { schedule: ['Push','Pull','Legs','Rest','Push/Pull','Rest','Rest'], phases: ['Strength Build','Hypertrophy','Power Phase'] },
    advanced:  { schedule: ['Push','Pull','Legs','Core','Push/Pull','Conditioning','Rest'], phases: ['Hypertrophy','Power','Peaking'] }
  },
  fat: {
    beginner:  { schedule: ['Circuit','Rest','Cardio','Rest','Full Body','Rest','Rest'], phases: ['Fat Burn Intro','HIIT Foundation','Metabolic Blast'] },
    inter:     { schedule: ['HIIT','Circuit','Rest','Full Body','HIIT','Rest','Rest'],   phases: ['Metabolic Conditioning','HIIT Blast','Peak Fat Burn'] },
    advanced:  { schedule: ['HIIT','Strength','Circuit','Rest','HIIT','Full Body','Rest'], phases: ['Metabolic Blast','Peak Burn','Final Cut'] }
  },
  athletic: {
    beginner:  { schedule: ['Mobility','Strength','Rest','Plyometrics','Rest','Conditioning','Rest'], phases: ['Movement Quality','Athletic Base','Sport Performance'] },
    inter:     { schedule: ['Strength','Plyometrics','Conditioning','Rest','Strength','Mobility','Rest'], phases: ['Athletic Base','Power Dev','Peak Performance'] },
    advanced:  { schedule: ['Strength','Power','Conditioning','Mobility','Strength','HIIT','Rest'],    phases: ['Power Phase','Athletic Peak','Competition Prep'] }
  },
  overall: {
    beginner:  { schedule: ['Full Body','Rest','Cardio','Rest','Full Body','Rest','Rest'],            phases: ['Base Fitness','Balanced Build','Overall Peak'] },
    inter:     { schedule: ['Upper','Lower','Core','Rest','Full Body','Conditioning','Rest'],          phases: ['Balanced Strength','Progressive Overload','Peak Fitness'] },
    advanced:  { schedule: ['Push','Pull','Legs','Core','Conditioning','Full Body','Rest'],            phases: ['Strength','Power','Peak Fitness'] }
  }
};

// ---------- QUIZ ----------
var QUESTIONS = [
  {
    step: 'STEP 01', text: 'What is your body type?', key: 'bodyType', type: 'bodytype',
    options: [
      { icon: '🦴', label: 'Ectomorph',  desc: 'Slim · Hard to gain weight',      val: 'ecto' },
      { icon: '💪', label: 'Mesomorph',  desc: 'Athletic · Gains muscle easily',  val: 'meso' },
      { icon: '🔥', label: 'Endomorph',  desc: 'Stocky · Gains fat easily',       val: 'endo' }
    ]
  },
  {
    step: 'STEP 02', text: 'What is your fitness level?', key: 'level', type: 'list',
    options: [
      { icon: '🌱', label: 'Beginner',      desc: 'Little or no exercise experience', val: 'beginner' },
      { icon: '⚡', label: 'Intermediate',  desc: 'Work out 1–3 times a week',        val: 'inter' },
      { icon: '🔥', label: 'Advanced',      desc: 'Train 4+ days a week consistently',val: 'advanced' }
    ]
  },
  {
    step: 'STEP 03', text: 'What is your primary goal?', key: 'goal', type: 'list',
    options: [
      { icon: '🏋️', label: 'Build Muscle',    desc: 'Gain size and strength',          val: 'muscle' },
      { icon: '⚖️', label: 'Lose Fat',         desc: 'Burn calories and slim down',     val: 'fat' },
      { icon: '🤸', label: 'Get Athletic',     desc: 'Improve endurance and mobility',  val: 'athletic' },
      { icon: '💡', label: 'Overall Fitness',  desc: 'Well-rounded health improvement', val: 'overall' }
    ]
  },
  {
    step: 'STEP 04', text: 'How many days can you train per week?', key: 'days', type: 'list',
    options: [
      { icon: '3️⃣', label: '3 Days / Week', desc: 'Recommended for beginners',   val: 3 },
      { icon: '4️⃣', label: '4 Days / Week', desc: 'Balanced training split',     val: 4 },
      { icon: '5️⃣', label: '5 Days / Week', desc: 'For dedicated athletes',      val: 5 }
    ]
  },
  {
    step: 'STEP 05', text: 'Where will you train?', key: 'location', type: 'list',
    options: [
      { icon: '🏠', label: 'Home',     desc: 'No equipment needed',          val: 'home' },
      { icon: '🌳', label: 'Outdoors', desc: 'Park, playground, etc.',        val: 'outdoor' },
      { icon: '🏋️', label: 'Gym',      desc: 'Access to pull-up bars, etc.', val: 'gym' }
    ]
  },
  {
    step: 'STEP 06', text: 'How long can you train each session?', key: 'duration', type: 'list',
    options: [
      { icon: '⚡', label: '20–30 min', desc: 'Quick and efficient',   val: 25 },
      { icon: '🕐', label: '30–45 min', desc: 'Standard session',      val: 40 },
      { icon: '💪', label: '45–60 min', desc: 'Full power workout',    val: 55 }
    ]
  }
];

var currentQ = 0;
var selectedVal = null; // the currently picked value for this question

function showQuiz() {
  showScreen('quiz');
  currentQ = 0;
  renderQuestion();
}

function renderQuestion() {
  var q = QUESTIONS[currentQ];
  var pct = Math.round(((currentQ + 1) / QUESTIONS.length) * 100);

  document.getElementById('quiz-counter').textContent = (currentQ + 1) + ' / ' + QUESTIONS.length;
  document.getElementById('quiz-bar').style.width = pct + '%';
  document.getElementById('quiz-step').textContent = q.step;
  document.getElementById('quiz-question').textContent = q.text;
  document.getElementById('btn-back').style.display = currentQ === 0 ? 'none' : 'block';

  // Restore previously selected value for this question (if any)
  var saved = state.answers[q.key];
  selectedVal = (saved !== undefined) ? saved : null;

  renderOptions(q);
  document.getElementById('btn-next').disabled = (selectedVal === null || selectedVal === undefined);
}

function renderOptions(q) {
  var container = document.getElementById('quiz-options');
  container.innerHTML = '';

  if (q.type === 'bodytype') {
    var grid = document.createElement('div');
    grid.className = 'body-type-grid';
    q.options.forEach(function(opt) {
      var btn = document.createElement('button');
      btn.className = 'bt-btn' + (selectedVal === opt.val ? ' selected' : '');
      btn.innerHTML =
        '<span class="bt-icon">' + opt.icon + '</span>' +
        '<span class="bt-name">' + opt.label + '</span>' +
        '<span class="bt-desc">' + opt.desc + '</span>';
      btn.addEventListener('click', function() {
        selectOption(opt.val, grid, 'bt-btn');
      });
      grid.appendChild(btn);
    });
    container.appendChild(grid);
  } else {
    q.options.forEach(function(opt) {
      var btn = document.createElement('button');
      btn.className = 'opt-btn' + (looseEq(selectedVal, opt.val) ? ' selected' : '');
      btn.innerHTML =
        '<span class="opt-icon">' + opt.icon + '</span>' +
        '<div>' +
          '<div class="opt-label">' + opt.label + '</div>' +
          '<div class="opt-desc">' + opt.desc + '</div>' +
        '</div>';
      btn.addEventListener('click', function() {
        selectOption(opt.val, container, 'opt-btn');
      });
      container.appendChild(btn);
    });
  }
}

// loose equality so numeric 3 === '3'
function looseEq(a, b) {
  if (a === null || a === undefined) return false;
  return a == b;
}

function selectOption(val, container, cls) {
  selectedVal = val;
  // clear all selected in this container
  var all = container.querySelectorAll('.' + cls);
  for (var i = 0; i < all.length; i++) {
    all[i].classList.remove('selected');
  }
  // find and mark the clicked one
  for (var i = 0; i < all.length; i++) {
    // match by checking the button's click listener indirectly via re-rendering selected state
  }
  // Simplest: re-render options with new selectedVal
  renderOptions(QUESTIONS[currentQ]);
  document.getElementById('btn-next').disabled = false;
}

function nextQuestion() {
  if (selectedVal === null || selectedVal === undefined) return;
  state.answers[QUESTIONS[currentQ].key] = selectedVal;
  saveState();

  if (currentQ < QUESTIONS.length - 1) {
    currentQ++;
    selectedVal = null;
    renderQuestion();
  } else {
    buildAndShowPlan();
  }
}

function prevQuestion() {
  if (currentQ > 0) {
    currentQ--;
    selectedVal = null;
    renderQuestion();
  } else {
    showScreen('welcome');
  }
}

// ---------- PLAN BUILD ----------
function buildAndShowPlan() {
  var a = state.answers;
  var goal  = a.goal   || 'overall';
  var level = a.level  || 'beginner';
  var bt    = a.bodyType || 'meso';

  var tmpl = (TEMPLATES[goal] || TEMPLATES.overall)[level] || TEMPLATES.overall.beginner;
  var btData = BODY_TYPES[bt] || BODY_TYPES.meso;

  var weeks = [];
  for (var w = 0; w < 13; w++) {
    var phase = w < 4 ? 0 : w < 9 ? 1 : 2;
    var days = [];
    for (var d = 0; d < 7; d++) {
      var dayType = tmpl.schedule[d % tmpl.schedule.length];
      var exList  = EXERCISES[dayType] || EXERCISES['Full Body'];
      days.push({
        num:      w * 7 + d + 1,
        type:     dayType,
        isRest:   dayType === 'Rest',
        exercises: dayType === 'Rest' ? [] : exList.slice(0, 4)
      });
    }
    weeks.push({ num: w + 1, phase: tmpl.phases[phase], days: days });
  }

  state.plan = {
    bodyType: bt,
    goal: goal,
    level: level,
    btData: btData,
    weeks: weeks
  };
  if (!state.startDate) state.startDate = todayStr();
  saveState();

  renderPlan();
  renderToday();
  renderProgress();
  showScreen('app');
  switchTab('plan');
}

// ---------- RENDER: PLAN TAB ----------
function renderPlan() {
  var p   = state.plan;
  var bt  = p.btData;
  var goalLabel  = { muscle: 'Build Muscle', fat: 'Lose Fat', athletic: 'Get Athletic', overall: 'Overall Fitness' };
  var levelLabel = { beginner: 'Beginner', inter: 'Intermediate', advanced: 'Advanced' };
  var totalWorkouts = 0;
  p.weeks.forEach(function(w){ w.days.forEach(function(d){ if(!d.isRest) totalWorkouts++; }); });

  var html = '';

  // Header
  html += '<div class="plan-header">';
  html += '<div class="plan-badge"><span class="plan-badge-label">' + bt.name.toUpperCase() + '</span><span>' + bt.icon + ' ' + bt.name + '</span></div>';
  html += '<div class="plan-title">YOUR 90-DAY<br>' + (goalLabel[p.goal] || 'FITNESS') + ' PLAN</div>';
  html += '<div class="plan-sub">' + bt.trait + '</div>';
  html += '<div class="plan-sub" style="margin-top:3px">' + levelLabel[p.level] + ' Level</div>';
  html += '</div>';

  // Stats
  html += '<div class="stats-row">';
  html += '<div class="stat-box"><div class="stat-num">90</div><div class="stat-lbl">DAYS</div></div>';
  html += '<div class="stat-box"><div class="stat-num">3</div><div class="stat-lbl">PHASES</div></div>';
  html += '<div class="stat-box"><div class="stat-num">' + totalWorkouts + '</div><div class="stat-lbl">WORKOUTS</div></div>';
  html += '</div>';

  // Tips
  html += '<div class="tips-card">';
  html += '<div class="tips-label">YOUR BODY TYPE TIPS</div>';
  bt.tips.forEach(function(t){ html += '<div class="tip-row">→ ' + t + '</div>'; });
  html += '</div>';

  // Weeks
  html += '<div class="section-title">13-WEEK BREAKDOWN</div>';
  p.weeks.forEach(function(wk, wi) {
    var phaseLabel = wi < 4 ? 'PHASE 1' : wi < 9 ? 'PHASE 2' : 'PHASE 3';
    html += '<div class="week-card" id="wcard-' + wi + '">';
    html += '<div class="week-head" onclick="toggleWeek(' + wi + ')">';
    html += '<span class="week-tag">WK ' + wk.num + '</span>';
    html += '<span class="week-name">Week ' + wk.num + ' — ' + wk.phase + '</span>';
    html += '<span class="week-phase">' + phaseLabel + '</span>';
    html += '<span class="week-arrow">▼</span>';
    html += '</div>';
    html += '<div class="week-body">';
    wk.days.forEach(function(d) {
      html += '<div class="day-row">';
      html += '<div class="day-num ' + (d.isRest ? 'rest' : 'work') + '">' + d.num + '</div>';
      html += '<div>';
      html += '<div class="day-type">' + d.type + '</div>';
      if (d.isRest) {
        html += '<div class="rest-note">Recovery · Light stretching</div>';
      } else {
        html += '<div class="day-exercises">';
        d.exercises.forEach(function(ex){ html += '<span class="ex-chip">' + ex + '</span>'; });
        html += '</div>';
      }
      html += '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  });

  document.getElementById('plan-content').innerHTML = html;
  // Open first week by default
  var first = document.getElementById('wcard-0');
  if (first) first.classList.add('open');
}

function toggleWeek(i) {
  var card = document.getElementById('wcard-' + i);
  if (card) card.classList.toggle('open');
}

// ---------- RENDER: TODAY TAB ----------
var exDoneMap = {}; // tracks checked exercises for today

function renderToday() {
  var p = state.plan;
  var dayNum = getCurrentDayNum();
  var clamp  = Math.max(1, Math.min(dayNum, 90));
  var wi = Math.floor((clamp - 1) / 7);
  var di = (clamp - 1) % 7;
  var todayData = p.weeks[Math.min(wi, 12)].days[di];
  var isDone = !!state.completed[clamp];
  var streak = calcStreak();

  var html = '';

  // Header
  html += '<div class="today-header">';
  html += '<div class="today-meta">DAY ' + clamp + ' OF 90</div>';
  html += '<div class="today-title">' + formatDate(new Date()) + '</div>';
  html += '</div>';

  // Streak bar
  html += '<div class="streak-bar">';
  html += '<div><div class="streak-num">' + streak + '</div><div class="streak-lbl">DAY STREAK</div></div>';
  html += '<div class="streak-icon">🔥</div>';
  html += '</div>';

  if (isDone) {
    html += '<div class="done-card"><div class="done-icon">✅</div>';
    html += '<div class="done-title">DAY ' + clamp + ' COMPLETE!</div>';
    html += '<div class="done-sub">Amazing work. Rest up and come back tomorrow.</div></div>';
  } else if (todayData.isRest) {
    html += '<div class="rest-day-card"><div class="rest-icon">😴</div>';
    html += '<div class="rest-title">REST DAY</div>';
    html += '<div class="rest-sub">Light stretching and a walk are recommended. Hydrate well.</div></div>';
  } else {
    html += '<div class="workout-card">';
    html += '<div class="wk-label">TODAY\'S WORKOUT</div>';
    html += '<div class="wk-name">' + todayData.type + '</div>';
    html += '<div class="wk-sub">Tap each exercise when complete</div>';
    todayData.exercises.forEach(function(ex, ei) {
      var done = !!exDoneMap[ei];
      html += '<div class="ex-row' + (done ? ' done' : '') + '" id="exrow-' + ei + '" onclick="toggleEx(' + ei + ', ' + todayData.exercises.length + ')">';
      html += '<div class="ex-chk" id="exchk-' + ei + '">✓</div>';
      html += '<div class="ex-text"><div class="ex-name">' + ex + '</div><div class="ex-sets">3 sets × 10–15 reps</div></div>';
      html += '</div>';
    });
    var doneCount = Object.keys(exDoneMap).filter(function(k){ return exDoneMap[k]; }).length;
    var allDone = doneCount >= todayData.exercises.length;
    html += '<button class="btn-primary" id="btn-complete" style="margin-top:16px" ' + (allDone ? '' : 'disabled') + ' onclick="completeDay(' + clamp + ')">';
    html += 'COMPLETE DAY ' + clamp + '</button>';
    html += '</div>';
  }

  // Calendar
  html += '<div class="section-title" style="margin-top:24px">90-DAY CALENDAR</div>';
  html += '<div class="calendar-wrap">';
  html += '<div class="cal-days-hdr">';
  ['S','M','T','W','T','F','S'].forEach(function(d){ html += '<div class="cal-hdr-cell">' + d + '</div>'; });
  html += '</div>';
  html += '<div class="cal-grid">';
  var startDow = new Date(state.startDate).getDay();
  for (var i = 0; i < startDow; i++) html += '<div class="cal-cell empty"></div>';
  for (var d = 1; d <= 90; d++) {
    var wIdx = Math.floor((d-1)/7), dIdx = (d-1)%7;
    var dData = p.weeks[Math.min(wIdx,12)].days[dIdx];
    var cls = 'future';
    if (d === clamp) cls = 'today-cell';
    else if (d < clamp) cls = state.completed[d] ? 'completed' : (dData.isRest ? 'rest-day' : 'missed');
    else if (dData.isRest) cls = 'rest-day';
    html += '<div class="cal-cell ' + cls + '">' + d + '</div>';
  }
  html += '</div></div>';

  document.getElementById('today-content').innerHTML = html;
}

function toggleEx(idx, total) {
  exDoneMap[idx] = !exDoneMap[idx];
  var row = document.getElementById('exrow-' + idx);
  if (row) row.classList.toggle('done', !!exDoneMap[idx]);

  var doneCount = 0;
  for (var k in exDoneMap) { if (exDoneMap[k]) doneCount++; }
  var btn = document.getElementById('btn-complete');
  if (btn) btn.disabled = (doneCount < total);
}

function completeDay(dayNum) {
  state.completed[dayNum] = true;
  saveState();
  exDoneMap = {};
  renderToday();
  renderProgress();
  showToast('🔥 Day ' + dayNum + ' Complete!');
}

// ---------- RENDER: PROGRESS TAB ----------
function renderProgress() {
  var p = state.plan;
  var doneCount = Object.keys(state.completed).length;
  var pct = Math.round((doneCount / 90) * 100);
  var streak = calcStreak();

  var MILESTONES = [
    { icon: '🌱', name: 'First Step',    desc: 'Complete Day 1',    day: 1,  earned: doneCount >= 1 },
    { icon: '🔥', name: 'On Fire',       desc: '7-day streak',      day: 7,  earned: streak >= 7 },
    { icon: '⚡', name: 'Phase 1 Done',  desc: 'Complete 30 days',  day: 30, earned: doneCount >= 30 },
    { icon: '💪', name: 'Halfway Hero',  desc: 'Reach Day 45',      day:
