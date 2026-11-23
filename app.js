/**
 * AI Smart Study Assistant - Application Logic
 * Manages Tab Navigation, Pomodoro Timer, Dynamic UI Rendering,
 * Speech Synthesis & Recognition, MathJax updates, and Storage.
 */

// --- Global State ---
const state = {
  activeTab: 'dashboard',
  theme: localStorage.getItem('study_theme') || 'dark',
  stats: {
    topicsExplored: parseInt(localStorage.getItem('study_topics_count') || '14', 10),
    notesCreated: parseInt(localStorage.getItem('study_notes_count') || '9', 10),
    quizTotalScores: parseInt(localStorage.getItem('study_quiz_scores_sum') || '276', 10),
    quizCount: parseInt(localStorage.getItem('study_quiz_count') || '3', 10)
  },
  pomodoro: {
    totalSeconds: 25 * 60,
    remainingSeconds: 25 * 60,
    intervalId: null,
    isRunning: false
  },
  currentQuiz: null,
  currentQuizIndex: 0,
  userQuizAnswers: {},
  speechSynthUtterance: null,
  speechRecognition: null,
  isRecordingVoice: false
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateStatsDisplay();
  updateAIStatusPill();
  initVoiceRecognition();

  // Pre-fill API key in settings if saved
  const savedKey = localStorage.getItem('study_assistant_gemini_key');
  if (savedKey) {
    const keyInput = document.getElementById('apiKeyInput');
    if (keyInput) keyInput.value = savedKey;
  }
});

// --- Theme Management ---
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('study_theme', state.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  if (state.theme === 'dark') {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  } else {
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
}

// --- Navigation Tabs ---
function switchTab(tabId) {
  state.activeTab = tabId;

  // Toggle nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const targetBtn = document.getElementById(`nav-${tabId}`);
  if (targetBtn) targetBtn.classList.add('active');

  // Toggle tab contents
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.remove('active');
  });
  const targetSection = document.getElementById(`tab-${tabId}`);
  if (targetSection) targetSection.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Statistics Management ---
function updateStatsDisplay() {
  const elTopics = document.getElementById('statTopicsCount');
  const elNotes = document.getElementById('statNotesCount');
  const elScore = document.getElementById('statQuizScore');

  if (elTopics) elTopics.textContent = state.stats.topicsExplored;
  if (elNotes) elNotes.textContent = state.stats.notesCreated;
  
  const avg = state.stats.quizCount > 0 
    ? Math.round(state.stats.quizTotalScores / state.stats.quizCount) 
    : 90;
  if (elScore) elScore.textContent = `${avg}%`;
}

function incrementTopicStat() {
  state.stats.topicsExplored += 1;
  localStorage.setItem('study_topics_count', state.stats.topicsExplored);
  updateStatsDisplay();
}

function incrementNotesStat() {
  state.stats.notesCreated += 1;
  localStorage.setItem('study_notes_count', state.stats.notesCreated);
  updateStatsDisplay();
}

function recordQuizScore(percentage) {
  state.stats.quizTotalScores += percentage;
  state.stats.quizCount += 1;
  localStorage.setItem('study_quiz_scores_sum', state.stats.quizTotalScores);
  localStorage.setItem('study_quiz_count', state.stats.quizCount);
  updateStatsDisplay();
}

// --- Pomodoro Study Timer ---
function togglePomodoro() {
  const btn = document.getElementById('pomodoroToggleBtn');
  if (state.pomodoro.isRunning) {
    clearInterval(state.pomodoro.intervalId);
    state.pomodoro.isRunning = false;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume`;
  } else {
    state.pomodoro.isRunning = true;
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause`;
    state.pomodoro.intervalId = setInterval(tickPomodoro, 1000);
  }
}

function tickPomodoro() {
  if (state.pomodoro.remainingSeconds > 0) {
    state.pomodoro.remainingSeconds--;
    updatePomodoroDisplay();
  } else {
    clearInterval(state.pomodoro.intervalId);
    state.pomodoro.isRunning = false;
    playChimeAlert();
    alert('🎉 Pomodoro study session complete! Take a well-deserved 5-minute break.');
    resetPomodoro();
  }
}

function updatePomodoroDisplay() {
  const mins = Math.floor(state.pomodoro.remainingSeconds / 60);
  const secs = state.pomodoro.remainingSeconds % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
  const display = document.getElementById('pomodoroDisplay');
  if (display) display.textContent = timeStr;

  const circle = document.getElementById('timerCircle');
  if (circle) {
    const progress = (state.pomodoro.remainingSeconds / state.pomodoro.totalSeconds) * 100;
    circle.style.setProperty('--timer-progress', `${progress}%`);
  }
}

function resetPomodoro() {
  clearInterval(state.pomodoro.intervalId);
  state.pomodoro.isRunning = false;
  state.pomodoro.remainingSeconds = state.pomodoro.totalSeconds;
  updatePomodoroDisplay();
  const btn = document.getElementById('pomodoroToggleBtn');
  if (btn) {
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Start Timer`;
  }
}

function playChimeAlert() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2); // A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    console.log('Audio chime unavailable', e);
  }
}

// --- Status & Settings ---
function updateAIStatusPill() {
  const pillText = document.getElementById('aiStatusText');
  if (!pillText) return;
  if (window.studyAI && window.studyAI.hasApiKey()) {
    pillText.textContent = 'Gemini 1.5 Flash';
  } else {
    pillText.textContent = 'Smart Engine (Offline)';
  }
}

function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.add('active');
}

function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.remove('active');
}

function saveSettings() {
  const keyInput = document.getElementById('apiKeyInput');
  const val = keyInput ? keyInput.value.trim() : '';
  window.studyAI.setApiKey(val);
  updateAIStatusPill();
  closeSettingsModal();
  alert(val ? 'Google Gemini API key activated!' : 'Using built-in Smart AI engine.');
}

function clearApiKey() {
  window.studyAI.setApiKey('');
  const keyInput = document.getElementById('apiKeyInput');
  if (keyInput) keyInput.value = '';
  updateAIStatusPill();
  closeSettingsModal();
  alert('Reverted to Built-in Offline Intelligence Engine.');
}

// --- Quick Topic Launcher from Dashboard ---
function quickLoadTopic(topic) {
  switchTab('explainer');
  const input = document.getElementById('explainerInput');
  if (input) input.value = topic;
  handleExplainTopic();
}

function setExplainerTopic(topic) {
  const input = document.getElementById('explainerInput');
  if (input) input.value = topic;
}

// --- FEATURE 1: TOPIC EXPLAINER ---
async function handleExplainTopic() {
  const topicInput = document.getElementById('explainerInput');
  const depthInput = document.getElementById('explainerDepth');
  const btn = document.getElementById('btnExplain');
  const outputPanel = document.getElementById('explainerOutput');

  const topic = topicInput ? topicInput.value.trim() : '';
  if (!topic) {
    alert('Please enter a topic name!');
    return;
  }

  const depth = depthInput ? depthInput.value : 'highSchool';

  // Loading state
  btn.disabled = true;
  const originalBtnHtml = btn.innerHTML;
  btn.innerHTML = `<span class="spinner"></span> Analyzing Concept...`;

  try {
    const data = await window.studyAI.explainTopic(topic, depth);
    
    // Populate elements
    document.getElementById('expCategory').textContent = data.category || 'Academic Concept';
    document.getElementById('expTitle').textContent = data.title || topic;
    document.getElementById('expText').textContent = data.explanation;
    document.getElementById('expAnalogy').textContent = data.analogy || 'No analogy available for this concept.';

    // Populate Formulas
    const formulasContainer = document.getElementById('expFormulasContainer');
    const formulasList = document.getElementById('expFormulasList');
    formulasList.innerHTML = '';
    
    if (data.keyFormulas && data.keyFormulas.length > 0) {
      formulasContainer.style.display = 'block';
      data.keyFormulas.forEach(f => {
        const item = document.createElement('div');
        item.className = 'formula-card';
        item.innerHTML = `
          <h5>${escapeHtml(f.name)}</h5>
          <div class="formula-display">${escapeHtml(f.formula)}</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">${escapeHtml(f.desc)}</div>
        `;
        formulasList.appendChild(item);
      });
    } else {
      formulasContainer.style.display = 'none';
    }

    // Populate Pitfalls
    const pitfallsList = document.getElementById('expPitfalls');
    pitfallsList.innerHTML = '';
    if (data.pitfalls && data.pitfalls.length > 0) {
      data.pitfalls.forEach(p => {
        const li = document.createElement('li');
        li.textContent = p;
        pitfallsList.appendChild(li);
      });
    } else {
      pitfallsList.innerHTML = '<li>Always verify base definitions and assumptions when applying theories.</li>';
    }

    // Populate Key Concepts
    const conceptsContainer = document.getElementById('expKeyConcepts');
    conceptsContainer.innerHTML = '';
    if (data.keyConcepts && data.keyConcepts.length > 0) {
      data.keyConcepts.forEach(c => {
        const span = document.createElement('span');
        span.className = 'concept-tag';
        span.textContent = c;
        conceptsContainer.appendChild(span);
      });
    }

    outputPanel.classList.add('active');
    incrementTopicStat();

    // Trigger MathJax re-render for LaTeX formulas
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([outputPanel]).catch(err => console.log('MathJax error:', err));
    }

    outputPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    console.error('Explanation error:', err);
    alert('An error occurred while generating the explanation: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalBtnHtml;
  }
}

// Text to speech for explanation
function speakExplanation() {
  if (!('speechSynthesis' in window)) {
    alert('Text-to-speech is not supported by your browser.');
    return;
  }

  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    const btn = document.getElementById('btnVoiceListen');
    if (btn) btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Listen (Audio)`;
    return;
  }

  const expText = document.getElementById('expText')?.textContent || '';
  const analogy = document.getElementById('expAnalogy')?.textContent || '';
  const fullText = `${expText}. Real world analogy: ${analogy}`;

  if (!fullText.trim()) {
    alert('Please generate an explanation first.');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(fullText);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  utterance.onend = () => {
    const btn = document.getElementById('btnVoiceListen');
    if (btn) btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Listen (Audio)`;
  };

  window.speechSynthesis.speak(utterance);
  const btn = document.getElementById('btnVoiceListen');
  if (btn) btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Stop Audio`;
}

function exportExplainerMarkdown() {
  const title = document.getElementById('expTitle')?.textContent || 'Topic';
  const category = document.getElementById('expCategory')?.textContent || 'General';
  const explanation = document.getElementById('expText')?.textContent || '';
  const analogy = document.getElementById('expAnalogy')?.textContent || '';

  const md = `# ${title}\n\n**Category:** ${category}\n\n## Overview\n${explanation}\n\n## Intuitive Analogy\n${analogy}\n\n---\n*Generated by AI Smart Study Assistant*`;
  downloadTextFile(`${title.replace(/\s+/g, '_')}_Summary.md`, md);
}

// --- FEATURE 2: SMART NOTES & FLASHCARDS ---
const SAMPLE_NOTES = {
  ml: `Machine Learning (ML) is a subfield of artificial intelligence that empowers computers to learn and improve from experience without being explicitly programmed. Rather than hand-coding software routines with a specific set of instructions, machine learning uses algorithms to parse large volumes of data, learn patterns, and make informed determinations or predictions. The three primary paradigms of machine learning are supervised learning, unsupervised learning, and reinforcement learning. Supervised learning utilizes labeled datasets where the desired output is already known, training models to map inputs to targets accurately. In contrast, unsupervised learning processes unlabelled datasets to uncover latent clusters and relationships. Reinforcement learning relies on agents taking actions within a dynamic environment to maximize cumulative reward feedback. Modern breakthroughs in deep learning rely heavily on multi-layered artificial neural networks.`,
  bio: `Cellular respiration is the biochemical mechanism by which organic compounds, predominantly glucose, are systematically oxidized to yield adenosine triphosphate (ATP), the universal chemical fuel for biochemical activities. The complete pathway encompasses four distinct phases: Glycolysis, the Pyruvate Dehydrogenase complex reaction, the Citric Acid (Krebs) cycle, and Oxidative Phosphorylation via the electron transport chain. Glycolysis takes place in the cytoplasm and is anaerobic, requiring no oxygen. The remaining phases occur within mitochondria. Oxidative phosphorylation generates the vast majority of cellular ATP through chemiosmosis driven by ATP Synthase. Overall, a single molecule of glucose yields approximately 30 to 32 ATP molecules under aerobic conditions.`
};

function loadSampleNote(key) {
  const input = document.getElementById('notesInput');
  if (input && SAMPLE_NOTES[key]) {
    input.value = SAMPLE_NOTES[key];
  }
}

function clearNotesInput() {
  const input = document.getElementById('notesInput');
  if (input) input.value = '';
}

async function handleGenerateNotes() {
  const input = document.getElementById('notesInput');
  const formatSelect = document.getElementById('notesFormat');
  const btn = document.getElementById('btnGenNotes');
  const outputPanel = document.getElementById('notesOutput');

  const text = input ? input.value.trim() : '';
  if (!text) {
    alert('Please enter or paste study text to summarize!');
    return;
  }

  const format = formatSelect ? formatSelect.value : 'bullets';

  // Loading state
  btn.disabled = true;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = `<span class="spinner"></span> Synthesizing Material...`;

  try {
    const data = await window.studyAI.generateNotes(text, format);

    // Update time saved badge
    const badge = document.getElementById('notesTimeBadge');
    if (badge) badge.textContent = `Saved ~${data.timeSavedMinutes || 8} mins reading time`;

    // Executive summary
    const execSum = document.getElementById('notesExecutiveSummary');
    if (execSum) execSum.textContent = data.executiveSummary || 'Summary of key academic points.';

    // Dynamic render based on format
    const container = document.getElementById('notesDynamicContainer');
    container.innerHTML = '';

    if (format === 'bullets') {
      renderBulletNotes(container, data);
    } else if (format === 'cornell') {
      renderCornellNotes(container, data);
    } else if (format === 'cheatsheet') {
      renderCheatsheetNotes(container, data);
    } else if (format === 'flashcards') {
      renderFlashcards(container, data);
    }

    outputPanel.classList.add('active');
    incrementNotesStat();

    outputPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    console.error('Notes generation error:', err);
    alert('Error generating notes: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

function renderBulletNotes(container, data) {
  const ul = document.createElement('ul');
  ul.style.cssText = 'padding-left:1.5rem; display:flex; flex-direction:column; gap:0.75rem;';
  
  (data.bulletPoints || []).forEach(pt => {
    const li = document.createElement('li');
    li.style.cssText = 'font-size:1rem; line-height:1.6; color:var(--text-main);';
    li.textContent = pt;
    ul.appendChild(li);
  });

  container.appendChild(ul);
}

function renderCornellNotes(container, data) {
  const grid = document.createElement('div');
  grid.className = 'cornell-grid';

  const cuesDiv = document.createElement('div');
  cuesDiv.className = 'cornell-cues';
  cuesDiv.innerHTML = `<h5 style="color:var(--text-dim); text-transform:uppercase; margin-bottom:0.75rem; font-size:0.8rem;">Cues & Study Questions</h5>`;
  
  const cues = data.cornell?.cues || ['Key Question 1', 'Key Question 2'];
  cues.forEach(q => {
    cuesDiv.innerHTML += `<p style="font-weight:600; font-size:0.9rem; margin-bottom:0.75rem; color:var(--accent);">${escapeHtml(q)}</p>`;
  });

  const notesDiv = document.createElement('div');
  notesDiv.className = 'cornell-notes';
  notesDiv.innerHTML = `<h5 style="color:var(--text-dim); text-transform:uppercase; margin-bottom:0.75rem; font-size:0.8rem;">Synthesized Lecture Notes</h5>`;
  
  const notes = data.cornell?.notes || data.bulletPoints || [];
  notes.forEach(n => {
    notesDiv.innerHTML += `<p style="font-size:0.95rem; margin-bottom:0.6rem; line-height:1.5;">• ${escapeHtml(n)}</p>`;
  });

  const sumDiv = document.createElement('div');
  sumDiv.className = 'cornell-summary';
  sumDiv.innerHTML = `
    <h5 style="color:var(--primary); text-transform:uppercase; margin-bottom:0.35rem; font-size:0.8rem;">Summary Takeaway</h5>
    <p style="font-size:0.95rem; color:var(--text-main);">${escapeHtml(data.cornell?.summary || data.executiveSummary)}</p>
  `;

  grid.appendChild(cuesDiv);
  grid.appendChild(notesDiv);
  grid.appendChild(sumDiv);
  container.appendChild(grid);
}

function renderCheatsheetNotes(container, data) {
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;';

  const terms = data.keyTerms || [];
  if (terms.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);">No isolated key terms identified.</p>';
  } else {
    terms.forEach(t => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.25rem;';
      card.innerHTML = `
        <h4 style="color:var(--accent); font-size:1.05rem; margin-bottom:0.35rem;">${escapeHtml(t.term)}</h4>
        <p style="color:var(--text-muted); font-size:0.9rem; line-height:1.5;">${escapeHtml(t.definition)}</p>
      `;
      grid.appendChild(card);
    });
  }

  container.appendChild(grid);
}

function renderFlashcards(container, data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'flashcards-container';

  const cards = data.flashcards || [];
  if (cards.length === 0) {
    wrapper.innerHTML = '<p style="color:var(--text-muted);">No flashcards available from this text.</p>';
  } else {
    cards.forEach((card, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'flashcard';
      cardEl.onclick = () => cardEl.classList.toggle('flipped');

      const frontText = card.front || card.q || 'Question';
      const backText = card.back || card.a || 'Answer';

      cardEl.innerHTML = `
        <div class="card-face card-front">
          <div class="card-label">Card #${idx + 1} • Question</div>
          <div class="card-text">${escapeHtml(frontText)}</div>
          <div class="card-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
            Click to Flip Card
          </div>
        </div>
        <div class="card-face card-back">
          <div class="card-label" style="color:var(--accent);">Card #${idx + 1} • Answer</div>
          <div class="card-text">${escapeHtml(backText)}</div>
          <div class="card-hint">Click again to flip back</div>
        </div>
      `;
      wrapper.appendChild(cardEl);
    });
  }

  container.appendChild(wrapper);
}

function copyNotesToClipboard() {
  const container = document.getElementById('notesDynamicContainer');
  const text = container ? container.innerText : '';
  navigator.clipboard.writeText(text).then(() => {
    alert('Notes copied to clipboard!');
  }).catch(() => {
    alert('Could not copy notes to clipboard.');
  });
}

function exportNotesMarkdown() {
  const execSum = document.getElementById('notesExecutiveSummary')?.textContent || '';
  const container = document.getElementById('notesDynamicContainer');
  const text = container ? container.innerText : '';

  const md = `# Study Notes\n\n## Executive Summary\n${execSum}\n\n## Detailed Notes\n${text}\n\n---\n*Exported from AI Smart Study Assistant*`;
  downloadTextFile('Study_Notes.md', md);
}

// --- FEATURE 3: PRACTICE QUIZ CREATOR ---
async function handleGenerateQuiz() {
  const topicInput = document.getElementById('quizTopicInput');
  const countSelect = document.getElementById('quizCount');
  const diffSelect = document.getElementById('quizDifficulty');
  const btn = document.getElementById('btnStartQuiz');

  const topic = topicInput ? topicInput.value.trim() : 'Neural Networks';
  const count = parseInt(countSelect.value, 10);
  const diff = diffSelect.value;

  btn.disabled = true;
  const originalHtml = btn.innerHTML;
  btn.innerHTML = `<span class="spinner"></span> Generating Quiz Questions...`;

  try {
    const data = await window.studyAI.generateQuiz(topic, count, diff);

    state.currentQuiz = data;
    state.currentQuizIndex = 0;
    state.userQuizAnswers = {};

    // Update Header Badges
    document.getElementById('quizTopicBadge').textContent = `Topic: ${data.topic || topic}`;
    document.getElementById('quizDiffBadge').textContent = diff.toUpperCase();

    // Show Player, Hide Score Card
    document.getElementById('quizPlayerPanel').style.display = 'block';
    document.getElementById('quizScoreCardPanel').style.display = 'none';

    renderQuizQuestion(0);

    document.getElementById('quizPlayerPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    console.error('Quiz creation error:', err);
    alert('Failed to create quiz: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

function renderQuizQuestion(idx) {
  if (!state.currentQuiz || !state.currentQuiz.questions) return;
  const q = state.currentQuiz.questions[idx];
  if (!q) return;

  state.currentQuizIndex = idx;
  const total = state.currentQuiz.questions.length;

  // Counter & Progress Bar
  document.getElementById('quizCounter').textContent = `Question ${idx + 1} of ${total}`;
  const progressPercent = ((idx + 1) / total) * 100;
  document.getElementById('quizProgressFill').style.width = `${progressPercent}%`;

  // Question Text
  document.getElementById('quizQuestionText').textContent = q.question;

  // Explanation Box (hidden initially)
  const expBox = document.getElementById('quizExplanationBox');
  expBox.style.display = 'none';

  // Render Options
  const container = document.getElementById('quizOptionsContainer');
  container.innerHTML = '';

  const alreadyAnswered = state.userQuizAnswers.hasOwnProperty(idx);
  const chosenOption = state.userQuizAnswers[idx];

  q.options.forEach((optText, optIdx) => {
    const optEl = document.createElement('div');
    optEl.className = 'quiz-option';
    optEl.textContent = `${String.fromCharCode(65 + optIdx)}. ${optText}`;

    if (alreadyAnswered) {
      optEl.classList.add('disabled');
      if (optIdx === q.correct) {
        optEl.classList.add('selected-correct');
      } else if (optIdx === chosenOption) {
        optEl.classList.add('selected-wrong');
      }
    } else {
      optEl.onclick = () => selectQuizOption(idx, optIdx, q.correct);
    }

    container.appendChild(optEl);
  });

  if (alreadyAnswered) {
    expBox.style.display = 'block';
    document.getElementById('quizExplanationText').textContent = q.explanation || 'No rationale provided.';
  }

  // Previous button visibility
  const prevBtn = document.getElementById('btnPrevQuestion');
  prevBtn.style.visibility = idx > 0 ? 'visible' : 'hidden';

  // Next / Finish button label
  const nextBtn = document.getElementById('btnNextQuestion');
  if (idx === total - 1) {
    nextBtn.textContent = 'View Final Results';
  } else {
    nextBtn.textContent = 'Next Question';
  }

  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([document.getElementById('quizPlayerPanel')]).catch(() => {});
  }
}

function selectQuizOption(qIdx, selectedOptIdx, correctOptIdx) {
  if (state.userQuizAnswers.hasOwnProperty(qIdx)) return;

  state.userQuizAnswers[qIdx] = selectedOptIdx;

  const container = document.getElementById('quizOptionsContainer');
  const optionEls = container.querySelectorAll('.quiz-option');

  optionEls.forEach((el, idx) => {
    el.classList.add('disabled');
    if (idx === correctOptIdx) {
      el.classList.add('selected-correct');
    } else if (idx === selectedOptIdx) {
      el.classList.add('selected-wrong');
    }
  });

  // Reveal Explanation
  const q = state.currentQuiz.questions[qIdx];
  const expBox = document.getElementById('quizExplanationBox');
  expBox.style.display = 'block';
  document.getElementById('quizExplanationText').textContent = q.explanation || 'Accurate answer highlighted.';
}

function nextQuizQuestion() {
  if (!state.currentQuiz) return;
  const total = state.currentQuiz.questions.length;

  if (state.currentQuizIndex < total - 1) {
    renderQuizQuestion(state.currentQuizIndex + 1);
  } else {
    // Finish Quiz and show Score Summary
    showQuizScoreSummary();
  }
}

function prevQuizQuestion() {
  if (state.currentQuizIndex > 0) {
    renderQuizQuestion(state.currentQuizIndex - 1);
  }
}

function showQuizScoreSummary() {
  const total = state.currentQuiz.questions.length;
  let correctCount = 0;

  state.currentQuiz.questions.forEach((q, idx) => {
    if (state.userQuizAnswers[idx] === q.correct) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / total) * 100);
  recordQuizScore(percentage);

  document.getElementById('quizPlayerPanel').style.display = 'none';
  const scorePanel = document.getElementById('quizScoreCardPanel');
  scorePanel.style.display = 'block';

  document.getElementById('quizFinalScorePercent').textContent = `${percentage}%`;

  const titleEl = document.getElementById('quizScoreTitle');
  const feedEl = document.getElementById('quizScoreFeedback');

  if (percentage >= 85) {
    titleEl.textContent = '🌟 Outstanding Mastery!';
    feedEl.textContent = `You scored ${correctCount} out of ${total} correctly! You have demonstrated exceptional understanding of these principles.`;
  } else if (percentage >= 60) {
    titleEl.textContent = '👍 Good Effort!';
    feedEl.textContent = `You scored ${correctCount} out of ${total} correctly. You have grasped the main ideas but reviewing edge cases will boost your retention.`;
  } else {
    titleEl.textContent = '📚 Needs Further Review';
    feedEl.textContent = `You scored ${correctCount} out of ${total} questions. We recommend revisiting the Topic Explainer and Smart Notes before taking another quiz.`;
  }

  scorePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function retakeQuiz() {
  if (!state.currentQuiz) return;
  state.currentQuizIndex = 0;
  state.userQuizAnswers = {};
  document.getElementById('quizScoreCardPanel').style.display = 'none';
  document.getElementById('quizPlayerPanel').style.display = 'block';
  renderQuizQuestion(0);
}

// --- FEATURE 4: ACADEMIC Q&A / DOUBT SOLVER ---
function handleChatKeyPress(e) {
  if (e.key === 'Enter') {
    sendChatQuestion();
  }
}

function askPredefinedDoubt(question) {
  const input = document.getElementById('chatInput');
  if (input) input.value = question;
  sendChatQuestion();
}

async function sendChatQuestion() {
  const input = document.getElementById('chatInput');
  const subjectSelect = document.getElementById('chatSubjectSelect');
  const question = input ? input.value.trim() : '';
  if (!question) return;

  const subject = subjectSelect ? subjectSelect.value : 'General';
  input.value = '';

  // Append user message
  appendChatMessage('user', escapeHtml(question));

  // Show thinking placeholder
  const placeholderId = appendThinkingMessage();

  try {
    const data = await window.studyAI.answerDoubt(question, subject);
    removeThinkingMessage(placeholderId);

    // Format tutor response
    let stepsHtml = '';
    if (data.steps && data.steps.length > 0) {
      stepsHtml = data.steps.map(s => `
        <div class="step-card">
          ${escapeHtml(s)}
        </div>
      `).join('');
    }

    const html = `
      <div style="font-weight:700; margin-bottom:0.4rem; color:var(--accent);">
        Subject: ${escapeHtml(data.subject || subject)}
      </div>
      <p style="margin-bottom:0.75rem;">${escapeHtml(data.directAnswer)}</p>
      ${stepsHtml}
      ${data.keyTakeaway ? `
        <div style="margin-top:0.75rem; padding:0.6rem; background:rgba(255,255,255,0.03); border-radius:var(--radius-sm); font-size:0.85rem; color:var(--text-muted);">
          <strong>Key Insight:</strong> ${escapeHtml(data.keyTakeaway)}
        </div>
      ` : ''}
      ${data.practicePrompt ? `
        <div style="margin-top:0.6rem; font-size:0.85rem; color:var(--primary); font-weight:600;">
          💡 Try This: ${escapeHtml(data.practicePrompt)}
        </div>
      ` : ''}
    `;

    appendChatMessage('ai', html, true);

  } catch (err) {
    removeThinkingMessage(placeholderId);
    appendChatMessage('ai', `Sorry, an error occurred while processing your academic query: ${err.message}`);
  }
}

function appendChatMessage(sender, contentHtml, isHtml = false) {
  const stream = document.getElementById('chatMessages');
  if (!stream) return;

  const msg = document.createElement('div');
  msg.className = `chat-message ${sender}`;

  const avatar = sender === 'ai' ? '<div class="chat-avatar ai">AI</div>' : '<div class="chat-avatar user-avatar">You</div>';
  const body = isHtml ? contentHtml : `<p>${contentHtml}</p>`;

  msg.innerHTML = `
    ${avatar}
    <div class="chat-bubble">
      ${body}
    </div>
  `;

  stream.appendChild(msg);
  stream.scrollTop = stream.scrollHeight;

  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise([msg]).catch(() => {});
  }
}

function appendThinkingMessage() {
  const stream = document.getElementById('chatMessages');
  const id = 'thinking-' + Date.now();
  const msg = document.createElement('div');
  msg.className = 'chat-message';
  msg.id = id;
  msg.innerHTML = `
    <div class="chat-avatar ai">AI</div>
    <div class="chat-bubble" style="display:flex; align-items:center; gap:0.5rem; color:var(--text-muted);">
      <span class="spinner"></span> Thinking & formulating Socratic derivation...
    </div>
  `;
  stream.appendChild(msg);
  stream.scrollTop = stream.scrollHeight;
  return id;
}

function removeThinkingMessage(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// --- Voice Input (Speech Recognition) ---
function initVoiceRecognition() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return;

  state.speechRecognition = new SpeechRec();
  state.speechRecognition.continuous = false;
  state.speechRecognition.interimResults = false;
  state.speechRecognition.lang = 'en-US';

  state.speechRecognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    const input = document.getElementById('chatInput');
    if (input) input.value = transcript;
    toggleVoiceInput(false);
  };

  state.speechRecognition.onerror = () => toggleVoiceInput(false);
  state.speechRecognition.onend = () => toggleVoiceInput(false);
}

function toggleVoiceInput(forceState) {
  if (!state.speechRecognition) {
    alert('Speech recognition is not supported in this browser.');
    return;
  }

  const micBtn = document.getElementById('micBtn');
  const shouldRecord = forceState !== undefined ? forceState : !state.isRecordingVoice;

  if (shouldRecord) {
    try {
      state.speechRecognition.start();
      state.isRecordingVoice = true;
      if (micBtn) micBtn.style.color = 'var(--danger)';
    } catch (e) {
      console.log('Voice start error:', e);
    }
  } else {
    try {
      state.speechRecognition.stop();
      state.isRecordingVoice = false;
      if (micBtn) micBtn.style.color = '';
    } catch (e) {
      console.log('Voice stop error:', e);
    }
  }
}

// --- Helper Utilities ---
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
