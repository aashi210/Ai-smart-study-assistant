/**
 * AI Smart Study Assistant - Intelligent AI Engine
 * Combines offline algorithmic NLP (TF-IDF summarization, keyphrase extraction,
 * cloze-test question generation, Socratic tutor logic) with optional Google Gemini API
 * for state-of-the-art live generative responses.
 */

class StudyAIEngine {
  constructor() {
    this.apiKey = localStorage.getItem('study_assistant_gemini_key') || '';
    this.useLiveAI = !!this.apiKey;
    this.modelName = 'gemini-1.5-flash';
  }

  setApiKey(key) {
    this.apiKey = key.trim();
    this.useLiveAI = !!this.apiKey;
    if (this.apiKey) {
      localStorage.setItem('study_assistant_gemini_key', this.apiKey);
    } else {
      localStorage.removeItem('study_assistant_gemini_key');
    }
  }

  hasApiKey() {
    return !!this.apiKey;
  }

  // --- NLP Utilities for Offline Mode ---
  tokenizeWords(text) {
    return text.toLowerCase().match(/\b[a-z0-9'-]+\b/g) || [];
  }

  tokenizeSentences(text) {
    // Splits by period, exclamation, question mark, keeping sentences intact
    const matches = text.match(/[^.!?\n]+[.!?]+(\s|$)|[^.!?\n]+$/g);
    if (!matches) return [text];
    return matches.map(s => s.trim()).filter(s => s.length > 8);
  }

  getStopwords() {
    return new Set([
      'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for', 'of', 'or', 'by',
      'with', 'as', 'that', 'it', 'from', 'this', 'be', 'are', 'was', 'were', 'has', 'have',
      'had', 'will', 'would', 'can', 'could', 'should', 'do', 'does', 'did', 'not', 'but',
      'their', 'they', 'them', 'these', 'those', 'such', 'into', 'than', 'then', 'about'
    ]);
  }

  extractKeywords(text, topN = 8) {
    const words = this.tokenizeWords(text);
    const stopwords = this.getStopwords();
    const freq = {};
    for (const w of words) {
      if (w.length > 3 && !stopwords.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    }
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(entry => entry[0]);
  }

  // --- Core Feature 1: Topic Explainer ("Understand Topics") ---
  async explainTopic(topic, depth = 'highSchool') {
    const cleanTopic = topic.trim().toLowerCase();

    // 1. If Live AI is active, query Gemini
    if (this.useLiveAI && this.apiKey) {
      try {
        const prompt = `You are a world-class academic tutor. Explain the topic "${topic}" for a student at the "${depth}" level (options are: eli5, highSchool, expert).
Return a JSON object with this EXACT structure (no markdown outside the JSON):
{
  "title": "Clear Topic Title",
  "category": "Academic Domain",
  "explanation": "Thorough, engaging explanation tailored to the requested depth level.",
  "analogy": "A memorable real-world analogy.",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3", "Concept 4"],
  "keyFormulas": [
    {"name": "Formula or Law Name", "formula": "LaTeX formula like $E = mc^2$", "desc": "Brief explanation"}
  ],
  "pitfalls": ["Common misconception 1", "Common misconception 2"],
  "summary": "2-sentence executive takeaway"
}`;
        const aiResponse = await this.callGemini(prompt);
        const parsed = this.parseJsonFromResponse(aiResponse);
        if (parsed && parsed.explanation) {
          return { source: 'live_ai', ...parsed };
        }
      } catch (err) {
        console.warn('Live AI failed, falling back to offline knowledge base:', err);
      }
    }

    // 2. Offline Knowledge Base Lookup
    for (const [key, data] of Object.entries(KNOWLEDGE_BASE.topics)) {
      if (cleanTopic.includes(key) || key.includes(cleanTopic)) {
        let explanationText = data.highSchool;
        if (depth === 'eli5') explanationText = data.eli5;
        if (depth === 'expert') explanationText = data.expert;

        return {
          source: 'curated_kb',
          title: data.title,
          category: data.category,
          explanation: explanationText,
          analogy: data.analogy,
          keyConcepts: data.keyTerms,
          keyFormulas: data.keyFormulas,
          pitfalls: data.pitfalls,
          summary: `${data.title} is a core foundation in ${data.category}. Mastery involves understanding its fundamental axioms, real-world dynamics, and mathematical underpinnings.`
        };
      }
    }

    // 3. Algorithmic Synthetic Generator for arbitrary topics
    const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    const depthDescriptions = {
      eli5: `Imagine ${topic} like a familiar game you play with friends every day. Everything works together following a simple rule: when one part changes, the other parts balance out so things keep functioning smoothly!`,
      highSchool: `${capitalizedTopic} is a key academic subject that studies how interconnected systems interact under specific principles and physical/mathematical constraints. It bridges theoretical fundamentals with observable experiments.`,
      expert: `${capitalizedTopic} represents a rigorous discipline governed by formal laws, mathematical equilibria, and analytical boundary conditions. Analysis requires evaluating state transitions, governing equations, and empirical validations.`
    };

    return {
      source: 'offline_nlp',
      title: capitalizedTopic,
      category: 'General Academic Studies',
      explanation: depthDescriptions[depth] || depthDescriptions.highSchool,
      analogy: `Think of ${capitalizedTopic} like a computer operating system or a clockwork engine: each individual component performs a specialized task, and the collective output exceeds the sum of its isolated parts.`,
      keyConcepts: [
        `Core Axiom of ${capitalizedTopic}`,
        "System Boundaries & State Variables",
        "Cause-and-Effect Relationships",
        "Analytical Problem Solving"
      ],
      keyFormulas: [
        { name: "Conservation / Equilibrium Principle", formula: "$\\sum \\text{Inputs} = \\sum \\text{Outputs} + \\Delta \\text{Stored}$", desc: "Fundamental continuity condition across physical and abstract systems." },
        { name: "Rate of Change / Dynamic Response", formula: "$\\frac{dY}{dt} = f(X, t) - \\lambda Y$", desc: "Governing rate of evolution over time." }
      ],
      pitfalls: [
        "Confusing correlation with direct causation when studying effects.",
        "Ignoring boundary constraints and limiting cases (e.g. at zero or infinity).",
        "Applying simplified formulas to complex, non-ideal situations without adjustments."
      ],
      summary: `Mastering ${capitalizedTopic} requires understanding the foundational mechanisms, testing with concrete examples, and verifying how variables behave under different constraints.`
    };
  }

  // --- Core Feature 2: Smart Notes & Flashcards ("Generate Short Notes") ---
  async generateNotes(text, mode = 'bullets') {
    const sentences = this.tokenizeSentences(text);
    const words = this.tokenizeWords(text);
    const readingTimeMins = Math.max(1, Math.ceil(words.length / 200));

    // 1. Live AI generation if enabled
    if (this.useLiveAI && this.apiKey && text.length > 40) {
      try {
        const prompt = `You are an expert study notes creator. Process the following text and generate comprehensive study notes in mode "${mode}" (options: 'bullets', 'cornell', 'cheatsheet', 'flashcards').
Input text:
"""${text}"""

Return a JSON object with this exact structure:
{
  "mode": "${mode}",
  "executiveSummary": "2-3 sentence overview of the material",
  "bulletPoints": ["Point 1 with bold key terms", "Point 2", "Point 3", "Point 4"],
  "cornell": {
    "cues": ["Cue question 1?", "Cue question 2?", "Cue question 3?"],
    "notes": ["Detailed note 1 corresponding to cue 1", "Detailed note 2", "Detailed note 3"],
    "summary": "Bottom section summary of the lecture"
  },
  "keyTerms": [
    {"term": "Term 1", "definition": "Clear concise definition"},
    {"term": "Term 2", "definition": "Clear concise definition"}
  ],
  "flashcards": [
    {"front": "Question or prompt?", "back": "Direct answer or explanation"},
    {"front": "Question 2?", "back": "Answer 2"}
  ],
  "timeSavedMinutes": ${Math.max(2, Math.floor(readingTimeMins * 0.75))}
}`;
        const aiResponse = await this.callGemini(prompt);
        const parsed = this.parseJsonFromResponse(aiResponse);
        if (parsed && (parsed.bulletPoints || parsed.flashcards)) {
          return { source: 'live_ai', ...parsed, readingTimeMins };
        }
      } catch (err) {
        console.warn('Live AI notes generation error:', err);
      }
    }

    // 2. Offline Extractive Summarization & Flashcard Generation
    const keywords = this.extractKeywords(text, 10);
    const stopwords = this.getStopwords();

    // Sentence scoring based on keyword frequency + sentence position
    const scoredSentences = sentences.map((sentence, idx) => {
      const sentenceWords = this.tokenizeWords(sentence);
      let score = 0;
      for (const w of sentenceWords) {
        if (keywords.includes(w)) score += 3;
        else if (!stopwords.has(w)) score += 1;
      }
      // Boost initial and final sentences of paragraphs
      if (idx === 0 || idx === sentences.length - 1) score *= 1.3;
      return { sentence: sentence.trim(), score, index: idx };
    });

    // Select top sentences in original flow order
    const topCount = Math.min(6, Math.max(3, Math.ceil(sentences.length * 0.4)));
    const selected = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, topCount)
      .sort((a, b) => a.index - b.index)
      .map(item => item.sentence);

    // Extract key terms & definitions heuristic (looking for "is", "defined as", colons)
    const keyTerms = [];
    for (const sentence of sentences) {
      const defMatch = sentence.match(/(.+?)\s+(is defined as|is known as|refers to|means|is)\s+(.+)/i);
      if (defMatch && defMatch[1].split(' ').length <= 4) {
        const term = defMatch[1].trim().replace(/^[-•*]\s*/, '');
        const def = defMatch[3].trim().replace(/[.]+$/, '');
        if (term.length > 2 && def.length > 5 && !keyTerms.some(k => k.term.toLowerCase() === term.toLowerCase())) {
          keyTerms.push({ term, definition: def });
        }
      }
    }

    // Fallback key terms from keywords if none found
    if (keyTerms.length === 0) {
      keywords.slice(0, 4).forEach(k => {
        keyTerms.push({
          term: k.charAt(0).toUpperCase() + k.slice(1),
          definition: `A focal subject identified frequently within the text, essential for conceptual comprehension.`
        });
      });
    }

    // Generate Flashcards
    const flashcards = [];
    keyTerms.forEach(kt => {
      flashcards.push({
        front: `What is the definition or role of "${kt.term}"?`,
        back: kt.definition
      });
    });

    // Add additional contextual flashcards from top sentences
    selected.slice(0, 3).forEach((s, i) => {
      flashcards.push({
        front: `Key Concept #${i + 1}: What is the core takeaway regarding "${keywords[i % keywords.length] || 'this topic'}"?`,
        back: s
      });
    });

    const executiveSummary = selected.length > 0 
      ? selected.slice(0, 2).join(' ') 
      : "Summary of study material highlighting core academic concepts and critical definitions.";

    return {
      source: 'offline_nlp',
      mode,
      executiveSummary,
      bulletPoints: selected,
      cornell: {
        cues: keyTerms.map(kt => `What defines ${kt.term}?`),
        notes: selected,
        summary: executiveSummary
      },
      keyTerms,
      flashcards,
      readingTimeMins,
      timeSavedMinutes: Math.max(1, Math.floor(readingTimeMins * 0.7))
    };
  }

  // --- Core Feature 3: Practice Quiz Creator ("Create Practice Quizzes") ---
  async generateQuiz(input, questionCount = 5, difficulty = 'medium') {
    const cleanInput = input.trim().toLowerCase();

    // 1. Live AI Generation if enabled
    if (this.useLiveAI && this.apiKey) {
      try {
        const prompt = `You are an examination question creator. Create ${questionCount} multiple-choice practice quiz questions on "${input}" at "${difficulty}" difficulty.
Return a JSON object with this exact structure:
{
  "topic": "${input}",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "question": "Clear academic question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0, // index of correct option (0, 1, 2, or 3)
      "explanation": "Detailed explanation of why this answer is correct and why other options are incorrect."
    }
  ]
}`;
        const aiResponse = await this.callGemini(prompt);
        const parsed = this.parseJsonFromResponse(aiResponse);
        if (parsed && parsed.questions && parsed.questions.length > 0) {
          return { source: 'live_ai', ...parsed };
        }
      } catch (err) {
        console.warn('Live AI quiz generation failed, using fallback:', err);
      }
    }

    // 2. Curated Knowledge Base Quiz lookup
    for (const [key, data] of Object.entries(KNOWLEDGE_BASE.topics)) {
      if (cleanInput.includes(key) || key.includes(cleanInput)) {
        if (data.sampleQuiz && data.sampleQuiz.length > 0) {
          return {
            source: 'curated_kb',
            topic: data.title,
            difficulty,
            questions: data.sampleQuiz
          };
        }
      }
    }

    // 3. Algorithmic Quiz Generator for custom text or general topics
    const sentences = this.tokenizeSentences(input);
    const keywords = this.extractKeywords(input, 12);
    const questions = [];

    if (sentences.length >= 2 && input.length > 60) {
      // Create questions from sentences
      for (let i = 0; i < Math.min(questionCount, sentences.length); i++) {
        const sent = sentences[i];
        const sentWords = this.tokenizeWords(sent);
        const candidateWords = sentWords.filter(w => keywords.includes(w) && w.length > 3);
        const targetWord = candidateWords[0] || keywords[i % keywords.length] || 'concept';
        
        const clozeQuestion = sent.replace(new RegExp(`\\b${targetWord}\\b`, 'i'), '_______');
        
        // Generate distractors from other keywords
        const distractors = keywords
          .filter(k => k.toLowerCase() !== targetWord.toLowerCase())
          .slice(0, 3);
        
        while (distractors.length < 3) {
          distractors.push(['parameter', 'variable', 'equilibrium', 'hypothesis', 'gradient'][distractors.length]);
        }

        const options = [targetWord, ...distractors].sort(() => Math.random() - 0.5);
        const correctIdx = options.indexOf(targetWord);

        questions.push({
          question: `Fill in the blank: "${clozeQuestion}"`,
          options: options.map(o => o.charAt(0).toUpperCase() + o.slice(1)),
          correct: correctIdx,
          explanation: `The accurate term is "${targetWord}", which completes the statement correctly based on the provided material.`
        });
      }
    }

    // Default academic questions if input was brief
    if (questions.length === 0) {
      questions.push(
        {
          question: `Which fundamental principle is most critical when evaluating ${input}?`,
          options: [
            `Empirical validation and mathematical consistency`,
            `Random trial without baseline metrics`,
            `Ignoring boundary constraints and limiting cases`,
            `Discarding opposing data points without review`
          ],
          correct: 0,
          explanation: `Scientific and academic rigor requires reproducible empirical evidence and mathematically consistent formulations.`
        },
        {
          question: `What is the primary objective of studying ${input} in modern academia?`,
          options: [
            `To identify predictive models and optimize functional solutions`,
            `To increase system latency and computational overhead`,
            `To eliminate all variables without observation`,
            `To replace logical reasoning with arbitrary assumptions`
          ],
          correct: 0,
          explanation: `The study of this topic aims to construct predictive frameworks and develop optimal solutions to real-world challenges.`
        },
        {
          question: `True or False: The principles governing ${input} remain consistent across standard inertial boundary conditions.`,
          options: ["True", "False"],
          correct: 0,
          explanation: `True. Standard academic axioms remain invariant under defined boundary conditions unless perturbed by external variables.`
        }
      );
    }

    return {
      source: 'offline_nlp',
      topic: input,
      difficulty,
      questions: questions.slice(0, questionCount)
    };
  }

  // --- Core Feature 4: Academic Q&A / Doubt Solver ("Answer Academic Questions") ---
  async answerDoubt(question, subject = 'General') {
    const cleanQ = question.trim().toLowerCase();

    // 1. Live AI Socratic Tutor if enabled
    if (this.useLiveAI && this.apiKey) {
      try {
        const prompt = `You are a patient, brilliant academic tutor specializing in ${subject}.
Answer this student question using the Socratic step-by-step method:
Question: "${question}"

Provide a structured JSON response with this exact shape:
{
  "subject": "${subject}",
  "directAnswer": "Crisp 1-2 sentence direct answer",
  "steps": [
    "Step 1: Identify given information and core principles",
    "Step 2: Mathematical / logical reasoning or derivation",
    "Step 3: Verification and conclusion"
  ],
  "keyTakeaway": "A memorable insight or rule of thumb",
  "practicePrompt": "A quick check-your-understanding follow-up question for the student to try next."
}`;
        const aiResponse = await this.callGemini(prompt);
        const parsed = this.parseJsonFromResponse(aiResponse);
        if (parsed && parsed.directAnswer) {
          return { source: 'live_ai', ...parsed };
        }
      } catch (err) {
        console.warn('Live AI tutor failed, falling back:', err);
      }
    }

    // 2. Curated Academic Doubts lookup
    for (const item of KNOWLEDGE_BASE.academicQuestions) {
      const match = item.keywords.some(kw => cleanQ.includes(kw));
      if (match) {
        return {
          source: 'curated_kb',
          subject,
          directAnswer: `Here is the comprehensive step-by-step solution for your query regarding ${item.keywords.join('/')}.`,
          steps: item.steps,
          keyTakeaway: item.example,
          practicePrompt: `Can you apply this exact reasoning to a similar variation of this problem?`
        };
      }
    }

    // 3. Algorithmic Socratic Tutor for general questions
    return {
      source: 'offline_nlp',
      subject,
      directAnswer: `Addressing your doubt: "${question}". Let's break this down systematically using first-principles reasoning.`,
      steps: [
        "**Step 1: Frame the Problem** — Identify the fundamental variables, known quantities, and what is being asked.",
        "**Step 2: Identify Governing Laws** — Determine which scientific theorem, mathematical formula, or domain rule applies to this scenario.",
        "**Step 3: Execute Step-by-Step Derivation** — Substitute the specific parameters and evaluate each transition logically.",
        "**Step 4: Check Dimensional Consistency & Edge Cases** — Verify that the units match and that the solution makes physical/logical sense at the extremes."
      ],
      keyTakeaway: "Golden Rule: Never memorize steps in isolation; understand the underlying conservation law or axiom that justifies each step.",
      practicePrompt: `Try restating this problem in your own words: what is the single most important variable influencing the outcome?`
    };
  }

  // --- API Call Helper (Google Gemini REST API) ---
  async callGemini(promptText) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response received from Gemini API');
    return text;
  }

  parseJsonFromResponse(rawText) {
    try {
      return JSON.parse(rawText);
    } catch (e) {
      // Strip markdown code fences if model enclosed in ```json ... ```
      const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();
      return JSON.parse(cleaned);
    }
  }
}

// Export instance
window.studyAI = new StudyAIEngine();
