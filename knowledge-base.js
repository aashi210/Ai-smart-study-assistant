/**
 * AI Smart Study Assistant - Academic Knowledge Base
 * Built-in multi-disciplinary repository of curriculum topics, 
 * flashcards, sample quizzes, and structured academic explanations.
 */

const KNOWLEDGE_BASE = {
  topics: {
    "neural networks": {
      category: "Computer Science & AI",
      title: "Artificial Neural Networks (ANN)",
      eli5: "Think of an artificial neural network like a team of friends trying to guess what animal is in a picture. The first friend looks for simple lines, the next friend looks for ears and tails, and the last friend combines their guesses to shout 'It's a cat!' They learn by making mistakes and getting corrected over time.",
      highSchool: "Artificial Neural Networks are computational models inspired by the biological brain. They consist of layers of interconnected nodes (neurons) that process inputs, assign weights and biases, and pass signals through activation functions to make classifications or predictions.",
      expert: "An Artificial Neural Network is a directed graph of parameterized mathematical transformations arranged in layers (input, hidden, output). For an input vector $\\mathbf{x}$, each layer computes $\\mathbf{a}^{(l)} = \\sigma(\\mathbf{W}^{(l)} \\mathbf{a}^{(l-1)} + \\mathbf{b}^{(l)})$, where $\\mathbf{W}$ is the weight matrix, $\\mathbf{b}$ is the bias vector, and $\\sigma$ is a non-linear activation function (such as ReLU, GELU, or Softmax). Optimization is typically achieved via gradient descent utilizing the Backpropagation algorithm derived from the multivariate chain rule.",
      analogy: "A musical orchestra tuning its instruments: each musician (neuron) adjusts their volume and pitch (weights and biases) based on feedback from the conductor (loss function) until the symphony sounds harmonious.",
      keyFormulas: [
        { name: "Forward Propagation", formula: "$a^{(l)} = \\sigma(W^{(l)} a^{(l-1)} + b^{(l)})$", desc: "Transforms input from previous layer via linear combination and non-linear activation." },
        { name: "Mean Squared Error Loss", formula: "$L = \\frac{1}{2n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2$", desc: "Measures discrepancy between predicted and target values." },
        { name: "Gradient Descent Weight Update", formula: "$W := W - \\alpha \\frac{\\partial L}{\\partial W}$", desc: "Adjusts weights proportionally to the negative gradient scaled by learning rate $\\alpha$." }
      ],
      pitfalls: [
        "Confusing artificial neurons with biological brains (ANNs are mathematical approximations, not literal brains).",
        "Overfitting: training for too many epochs without regularization (dropout, weight decay).",
        "Vanishing/Exploding Gradients when using deep architectures with saturating activations like Sigmoid."
      ],
      keyTerms: ["Perceptron", "Backpropagation", "Activation Function (ReLU)", "Loss Function", "Overfitting", "Gradient Descent"],
      flashcards: [
        { q: "What is the primary role of an activation function in a neural network?", a: "To introduce non-linearity, allowing the network to learn complex patterns and arbitrary decision boundaries." },
        { q: "What does the Backpropagation algorithm calculate?", a: "The gradient of the loss function with respect to each weight in the network via the calculus chain rule." },
        { q: "What is overfitting in neural networks?", a: "When the model memorizes noise in the training set and fails to generalize to unseen test data." }
      ],
      sampleQuiz: [
        {
          question: "Which of the following functions is most commonly used to prevent vanishing gradients in deep hidden layers?",
          options: ["Sigmoid", "ReLU (Rectified Linear Unit)", "Linear Identity", "Step Function"],
          correct: 1,
          explanation: "ReLU ($f(x) = \\max(0, x)$) maintains a constant gradient of 1 for all positive inputs, significantly alleviating the vanishing gradient problem compared to saturating functions like Sigmoid."
        },
        {
          question: "What happens during the backward pass (backpropagation) in training?",
          options: [
            "Input features are normalized",
            "Predictions are converted to class labels",
            "Gradients of the loss are propagated back to update weights",
            "The model generates new synthetic training data"
          ],
          correct: 2,
          explanation: "Backpropagation computes the partial derivative of the loss function with respect to each trainable parameter using the chain rule, enabling gradient descent to update weights."
        },
        {
          question: "True or False: A single-layer perceptron without hidden layers can solve the XOR classification problem.",
          options: ["True", "False"],
          correct: 1,
          explanation: "False! Minsky and Papert proved in 1969 that single-layer perceptrons can only classify linearly separable functions, and XOR is non-linearly separable."
        }
      ]
    },
    "photosynthesis": {
      category: "Biology & Life Sciences",
      title: "Photosynthesis and Cellular Energy",
      eli5: "Plants are like solar-powered kitchens. They take sunlight, water from the soil, and carbon dioxide from the air to cook up their favorite food (sugar/glucose), and they give us oxygen as a thank-you gift!",
      highSchool: "Photosynthesis is the biochemical process by which green plants, algae, and cyanobacteria convert light energy into chemical energy stored in glucose. The process occurs inside chloroplasts and consists of two main stages: the Light-Dependent Reactions (in thylakoids) and the Calvin Cycle (Light-Independent Reactions in the stroma).",
      expert: "Photosynthesis is an anabolic redox reaction driven by solar photons. In the light reactions occurring along the thylakoid membrane, photon absorption by Photosystems II (P680) and I (P700) induces photolysis of water ($2H_2O \\rightarrow O_2 + 4H^+ + 4e^-$) and photophosphorylation, generating ATP and NADPH. In the stroma, the enzyme RuBisCO catalyzes the carboxylation of Ribulose-1,5-bisphosphate (RuBP) during the Calvin Cycle to synthesize glyceraldehyde-3-phosphate (G3P), the building block for hexose sugars.",
      analogy: "A solar charging station: Solar panels (chlorophyll) capture sun rays to recharge mobile batteries (ATP & NADPH), which are then plugged into a candy manufacturing machine (Calvin Cycle) to produce sugar bars.",
      keyFormulas: [
        { name: "Overall Photosynthesis Equation", formula: "$6CO_2 + 6H_2O + \\text{light energy} \\rightarrow C_6H_{12}O_6 + 6O_2$", desc: "Net transformation of carbon dioxide and water into glucose and oxygen gas." },
        { name: "Photolysis of Water", formula: "$2H_2O \\rightarrow 4H^+ + 4e^- + O_2$", desc: "Water splitting that replenishes electrons in Photosystem II and releases atmospheric oxygen." }
      ],
      pitfalls: [
        "Believing plants do photosynthesis during the day and respiration at night (respiration occurs continuously day and night).",
        "Thinking the oxygen released comes from carbon dioxide (isotopic labeling proves oxygen originates from water photolysis).",
        "Assuming the 'Dark Reactions' (Calvin Cycle) only happen in total darkness (they require ATP and NADPH from light reactions, so they typically operate during daytime)."
      ],
      keyTerms: ["Chloroplast", "Thylakoid Membrane", "RuBisCO", "Calvin Cycle", "Photolysis", "ATP & NADPH"],
      flashcards: [
        { q: "Where do the light-dependent reactions take place inside a plant cell?", a: "Inside the thylakoid membranes of chloroplasts." },
        { q: "What is the crucial carbon-fixing enzyme in the Calvin Cycle?", a: "RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase)." },
        { q: "What molecule provides the electrons and oxygen released during photosynthesis?", a: "Water ($H_2O$) through the process of photolysis." }
      ],
      sampleQuiz: [
        {
          question: "Which pigment is primarily responsible for absorbing red and blue wavelengths of light while reflecting green?",
          options: ["Carotenoid", "Chlorophyll a", "Anthocyanin", "Hemoglobin"],
          correct: 1,
          explanation: "Chlorophyll a is the primary photosynthetic pigment that absorbs photons strongly in the blue (430 nm) and red (660 nm) spectrum while reflecting green light."
        },
        {
          question: "Where does the Calvin Cycle (light-independent reactions) occur?",
          options: ["Thylakoid Lumen", "Stroma of the chloroplast", "Outer mitochondrial membrane", "Cell nucleus"],
          correct: 1,
          explanation: "The Calvin cycle reactions occur in the stroma (the fluid-filled space surrounding the thylakoid stacks inside chloroplasts)."
        }
      ]
    },
    "calculus derivatives": {
      category: "Mathematics",
      title: "Derivatives and Rates of Change",
      eli5: "Imagine looking at your bicycle's speedometer. It doesn't tell you how far you traveled all day; it tells you exactly how fast your wheels are spinning right this split second. A derivative is just a mathematical speedometer for any curve!",
      highSchool: "The derivative of a function measures the instantaneous rate of change of the function with respect to its variable. Geometrically, it represents the slope of the tangent line to the curve at any given point.",
      expert: "The derivative of a real-valued function $f(x)$ at $x = a$ is defined as the limit of the difference quotient: $f'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}$, provided this limit exists. In differential calculus, derivatives quantify sensitivity to change, enabling optimization (finding extrema where $f'(x) = 0$), linear approximation via Taylor series, and modeling dynamical systems with differential equations.",
      analogy: "Freezing a single frame of a high-speed camera film: while the whole movie shows complete motion, the frozen frame with a velocity vector tells you the exact direction and speed at that exact millisecond.",
      keyFormulas: [
        { name: "Formal Limit Definition", formula: "$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$", desc: "Fundamental definition of the derivative as the limit of secant line slopes." },
        { name: "Power Rule", formula: "$\\frac{d}{dx}[x^n] = n x^{n-1}$", desc: "Differentiating polynomial terms for any real constant $n$." },
        { name: "Chain Rule", formula: "$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$", desc: "Differentiating composite functions by multiplying outer derivative by inner derivative." }
      ],
      pitfalls: [
        "Confusing average rate of change $\\frac{\\Delta y}{\\Delta x}$ with instantaneous rate of change $\\frac{dy}{dx}$.",
        "Forgetting to apply the Chain Rule when differentiating composite expressions like $(3x+2)^5$.",
        "Assuming that a continuous function is always differentiable (e.g., $f(x) = |x|$ is continuous at $x=0$ but has a sharp corner, so it is not differentiable there)."
      ],
      keyTerms: ["Limit", "Tangent Line", "Secant Line", "Chain Rule", "Product Rule", "Inflection Point"],
      flashcards: [
        { q: "What does the first derivative $f'(x)$ tell you about a graph?", a: "It tells you the slope of the tangent line and whether the function is increasing ($f'>0$) or decreasing ($f'<0$)." },
        { q: "What is the derivative of $\\sin(x)$ with respect to $x$?", a: "$\\cos(x)$." },
        { q: "What condition must be met at a local maximum or minimum of a differentiable function?", a: "The first derivative must equal zero: $f'(x) = 0$ (critical point)." }
      ],
      sampleQuiz: [
        {
          question: "What is the derivative of $f(x) = 4x^3 - 5x + 7$?",
          options: ["$12x^2 - 5$", "$12x^3 - 5$", "$4x^2 - 5$", "$12x^2 - 5x$"],
          correct: 0,
          explanation: "Using the power rule: $\\frac{d}{dx}(4x^3) = 12x^2$, $\\frac{d}{dx}(-5x) = -5$, and $\\frac{d}{dx}(7) = 0$. Combining gives $12x^2 - 5$."
        },
        {
          question: "If $f'(x) > 0$ for all $x$ in an interval $(a, b)$, what does this imply about $f(x)$?",
          options: ["The function is concave down", "The function is strictly increasing", "The function has a horizontal tangent", "The function is undefined"],
          correct: 1,
          explanation: "A positive first derivative indicates a positive rate of change, which means the function values are strictly increasing over that interval."
        }
      ]
    },
    "newton's laws": {
      category: "Physics & Mechanics",
      title: "Newton's Three Laws of Motion",
      eli5: "1. A lazy couch potato stays on the couch unless pushed. 2. The heavier a bowling ball is, the harder you have to push to roll it fast. 3. If you jump off a skateboard, you push the board backwards while you fly forwards!",
      highSchool: "Sir Isaac Newton's three laws of classical mechanics govern the motion of macroscopic objects under forces: 1) Law of Inertia: An object remains at rest or in uniform velocity unless acted upon by a net external force. 2) $F = ma$: Net force equals mass times acceleration. 3) Action-Reaction: For every action, there is an equal and opposite reaction force.",
      expert: "Newtonian mechanics formulates the kinematics and dynamics of bodies in inertial reference frames. The 1st law defines inertial frames ($d\\mathbf{v}/dt = 0$ when $\\sum \\mathbf{F}_{ext} = 0$). The 2nd law defines force as the time rate of change of linear momentum: $\\mathbf{F}_{net} = \\frac{d\\mathbf{p}}{dt} = \\frac{d(m\\mathbf{v})}{dt} = m\\mathbf{a}$ (for constant mass). The 3rd law expresses the conservation of linear momentum: interacting bodies exert simultaneous forces that are collinear, equal in magnitude, and opposite in direction ($\\mathbf{F}_{AB} = -\\mathbf{F}_{BA}$).",
      analogy: "A rocket launching into space: Exhaust gas is forced out downwards at high velocity (Action), and this backward jet exerts an equal and opposite forward thrust pushing the massive rocket upward into orbit (Reaction).",
      keyFormulas: [
        { name: "Newton's Second Law", formula: "$\\mathbf{F}_{net} = m \\mathbf{a}$", desc: "Acceleration is directly proportional to net force and inversely proportional to inertial mass." },
        { name: "Linear Momentum", formula: "$\\mathbf{p} = m \\mathbf{v}$", desc: "Product of mass and velocity; conserved in isolated systems." },
        { name: "Newton's Third Law Pair", formula: "$\\mathbf{F}_{12} = -\\mathbf{F}_{21}$", desc: "Interaction forces between two bodies are always equal in magnitude and opposite in vector direction." }
      ],
      pitfalls: [
        "Believing continuous force is necessary to keep an object moving (inertia keeps it moving; friction is the external force slowing it down).",
        "Thinking action and reaction forces cancel each other out (they act on two DIFFERENT objects, so they never cancel each other!).",
        "Confusing mass (intrinsic quantity of matter in kg) with weight (gravitational force in Newtons: $W = mg$)."
      ],
      keyTerms: ["Inertia", "Net Force", "Mass vs Weight", "Action-Reaction Pairs", "Momentum", "Equilibrium"],
      flashcards: [
        { q: "Do action and reaction force pairs ever cancel each other out?", a: "No, because they act on two different bodies, not on the same object." },
        { q: "What is an inertial reference frame?", a: "A frame of reference in which an object with zero net force moves at constant velocity without accelerating." },
        { q: "What is the SI unit of force?", a: "The Newton (N), which equals $1\\text{ kg} \\cdot \\text{m/s}^2$." }
      ],
      sampleQuiz: [
        {
          question: "An astronaut in deep space with zero gravity throws a 2 kg wrench at 10 m/s. What will happen to the wrench after it leaves the hand?",
          options: [
            "It will gradually slow down and stop",
            "It will curve towards Earth",
            "It will continue moving at 10 m/s in a straight line forever until acted on by another force",
            "It will accelerate exponentially"
          ],
          correct: 2,
          explanation: "According to Newton's First Law (Inertia), with no external force or friction acting upon it in deep space, the wrench maintains its constant velocity and direction indefinitely."
        },
        {
          question: "If a 50 N net force is applied to a 10 kg mass, what is the resulting acceleration?",
          options: ["500 m/s²", "5 m/s²", "0.2 m/s²", "50 m/s²"],
          correct: 1,
          explanation: "Using $F = ma \\implies a = \\frac{F}{m} = \\frac{50\\text{ N}}{10\\text{ kg}} = 5\\text{ m/s}^2$."
        }
      ]
    },
    "sorting algorithms": {
      category: "Computer Science & Data Structures",
      title: "Sorting Algorithms & Big-O Complexity",
      eli5: "Imagine organizing a messy deck of cards. You could compare two cards side-by-side and swap them (Bubble Sort - slow!), or split the deck into halves, sort the small piles, and weave them together like magic (Merge Sort - super fast!).",
      highSchool: "Sorting algorithms arrange elements of a list in a specified order (numerical or alphabetical). Common algorithms include Bubble Sort, Insertion Sort, Merge Sort, and Quick Sort. Their efficiency is measured using Big-O notation for time and space complexity.",
      expert: "Comparison-based sorting algorithms operate within an $\\Omega(n \\log n)$ theoretical lower bound proven via decision tree models. Algorithms like QuickSort utilize a divide-and-conquer paradigm with an average time complexity of $\\mathcal{O}(n \\log n)$ and worst-case $\\mathcal{O}(n^2)$ when pivots are poorly selected. MergeSort guarantees $\\mathcal{O}(n \\log n)$ time in all cases with stability at the cost of $\\mathcal{O}(n)$ auxiliary space. Non-comparison sorts like Radix Sort achieve $\\mathcal{O}(d \\cdot n)$ under bounded key distributions.",
      analogy: "Organizing books in a giant library: Instead of checking every book against every other book one by one, librarians categorize books by section, author letter, and then sub-sort the smaller shelves simultaneously.",
      keyFormulas: [
        { name: "MergeSort Recurrence", formula: "$T(n) = 2T(n/2) + \\mathcal{O}(n) = \\mathcal{O}(n \\log n)$", desc: "Master theorem solution for dividing into two subproblems and linear merge." },
        { name: "Bubble/Insertion Sort Comparisons", formula: "$\\sum_{i=1}^{n-1} i = \\frac{n(n-1)}{2} = \\mathcal{O}(n^2)$", desc: "Quadratic pair comparisons required in worst-case naive sorting." }
      ],
      pitfalls: [
        "Assuming QuickSort is always faster than MergeSort (QuickSort can degrade to $\\mathcal{O}(n^2)$ on already sorted arrays if the pivot is the first or last element).",
        "Overlooking algorithmic stability: a stable sort preserves the relative order of records with equal keys.",
        "Choosing MergeSort for low-memory microcontrollers where $\\mathcal{O}(n)$ auxiliary memory is unavailable."
      ],
      keyTerms: ["Big-O Notation", "Divide and Conquer", "QuickSort", "MergeSort", "Algorithmic Stability", "Worst-case vs Average-case"],
      flashcards: [
        { q: "What is the worst-case time complexity of standard QuickSort?", a: "$\\mathcal{O}(n^2)$, which occurs when the pivot consistently partitions the array into an empty subarray and $n-1$ elements." },
        { q: "What makes an algorithm 'stable'?", a: "When elements with duplicate keys retain their original relative order after sorting." },
        { q: "What is the lower bound for comparison-based sorting algorithms?", a: "$\\Omega(n \\log n)$ comparisons in the worst case." }
      ],
      sampleQuiz: [
        {
          question: "Which sorting algorithm guarantees $\\mathcal{O}(n \\log n)$ time complexity in all cases (worst, best, and average)?",
          options: ["QuickSort", "MergeSort", "Selection Sort", "Bubble Sort"],
          correct: 1,
          explanation: "MergeSort always splits the array into two halves ($O(\\log n)$ levels) and requires linear $O(n)$ work to merge them at each level, ensuring $O(n \\log n)$ runtime in all cases."
        },
        {
          question: "What is the space complexity of an in-place Bubble Sort?",
          options: ["$O(1)$", "$O(n)$", "$O(n^2)$", "$O(\\log n)$"],
          correct: 0,
          explanation: "Bubble Sort operates directly on the input array using only a single temporary swap variable, meaning it requires $O(1)$ auxiliary memory."
        }
      ]
    },
    "quantum superposition": {
      category: "Physics & Quantum Computing",
      title: "Quantum Superposition & Qubits",
      eli5: "Imagine a coin spinning on a tabletop. While it's spinning, it is not just heads and not just tails—it is a blur of both possibilities at once! Only when you slap your hand down does it decide to be heads or tails. That spinning blur is superposition!",
      highSchool: "In classical computing, a bit is either 0 or 1. In quantum computing, a qubit can exist in a superposition of states, representing both 0 and 1 simultaneously with probability amplitudes. When measured, the superposition collapses into one definite state.",
      expert: "Superposition is a fundamental principle of quantum mechanics dictated by the linearity of the Schrödinger wave equation. Any quantum state $|\\psi\\rangle$ can be expressed as a linear combination of orthonormal basis eigenstates: $|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$, where $\\alpha, \\beta \\in \\mathbb{C}$ and normalize such that $|\\alpha|^2 + |\\beta|^2 = 1$. The Born Rule specifies that measurement in the computational basis yields outcome $|0\\rangle$ with probability $|\\alpha|^2$ and $|1\\rangle$ with probability $|\\beta|^2$, instigating wave function collapse.",
      analogy: "A musical chord: when you strike a C-major chord on a piano, you hear C, E, and G vibrating together in one acoustic wave. A single ear listening to the harmony hears the blend, but a spectrum analyzer can resolve the component frequencies.",
      keyFormulas: [
        { name: "Single Qubit State Vector", formula: "$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$", desc: "Linear superposition of computational basis states." },
        { name: "Born Normalization Condition", formula: "$|\\alpha|^2 + |\\beta|^2 = 1$", desc: "Total sum of measurement probabilities must equal 100%." }
      ],
      pitfalls: [
        "Believing a quantum computer simply checks all possible answers in parallel simultaneously (superposition allows interference of probability amplitudes, not free parallel universes).",
        "Thinking you can read the superposition values directly (any physical measurement immediately collapses the state to $|0\\rangle$ or $|1\\rangle$)."
      ],
      keyTerms: ["Qubit", "Wave Function Collapse", "Born Rule", "Hadamard Gate", "Bloch Sphere", "Quantum Decoherence"],
      flashcards: [
        { q: "What does the Born Rule calculate in quantum mechanics?", a: "The probability of obtaining a specific measurement outcome, equal to the squared magnitude of the state's probability amplitude." },
        { q: "What quantum logic gate creates an equal superposition from state $|0\\rangle$?", a: "The Hadamard Gate (H), transforming $|0\\rangle$ into $\\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)$." }
      ],
      sampleQuiz: [
        {
          question: "If a qubit is in the state $|\\psi\\rangle = \\frac{1}{2}|0\\rangle + \\frac{\\sqrt{3}}{2}|1\\rangle$, what is the probability of measuring $|1\\rangle$?",
          options: ["25%", "50%", "75%", "100%"],
          correct: 2,
          explanation: "According to the Born rule, $P(1) = |\\beta|^2 = \\left(\\frac{\\sqrt{3}}{2}\\right)^2 = \\frac{3}{4} = 75\\%$."
        }
      ]
    }
  },

  academicQuestions: [
    {
      keywords: ["quadratic", "equation", "formula", "roots", "solve"],
      question: "How do I solve a quadratic equation $ax^2 + bx + c = 0$ step-by-step?",
      steps: [
        "**Step 1: Identify coefficients** — Write down the values of $a$, $b$, and $c$ from standard form $ax^2 + bx + c = 0$.",
        "**Step 2: Calculate the Discriminant** — Compute $\\Delta = b^2 - 4ac$. This determines root types: if $\\Delta > 0$ (2 distinct real roots), if $\\Delta = 0$ (1 repeated root), if $\\Delta < 0$ (2 complex conjugate roots).",
        "**Step 3: Apply the Quadratic Formula** — $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.",
        "**Step 4: Solve for both signs** — Evaluate $x_1 = \\frac{-b + \\sqrt{\\Delta}}{2a}$ and $x_2 = \\frac{-b - \\sqrt{\\Delta}}{2a}$."
      ],
      example: "Example: Solve $2x^2 + 5x - 3 = 0$:\n- $a=2, b=5, c=-3$\n- $\\Delta = 5^2 - 4(2)(-3) = 25 + 24 = 49$\n- $\\sqrt{\\Delta} = 7$\n- $x_1 = \\frac{-5 + 7}{4} = \\frac{2}{4} = 0.5$\n- $x_2 = \\frac{-5 - 7}{4} = \\frac{-12}{4} = -3$\nRoots are $x = 0.5$ and $x = -3$."
    },
    {
      keywords: ["mitochondria", "powerhouse", "cell", "atp"],
      question: "Why is the mitochondrion known as the powerhouse of the cell?",
      steps: [
        "**Step 1: Cellular Respiration Center** — Mitochondria generate over 90% of the cell's adenosine triphosphate (ATP), the universal chemical energy currency of biological organisms.",
        "**Step 2: Three Energy Stages** — While glycolysis occurs in the cytoplasm, the Krebs Cycle (Citric Acid Cycle) and Oxidative Phosphorylation take place inside the mitochondrial matrix and inner membrane cristae.",
        "**Step 3: Electron Transport Chain (ETC)** — High-energy electrons from NADH and FADH₂ are transferred through protein complexes, pumping protons ($H^+$) into the intermembrane space.",
        "**Step 4: ATP Synthase Turbine** — The resulting electrochemical proton gradient drives ATP Synthase like a tiny microscopic hydroelectric turbine, synthesizing ATP from ADP and inorganic phosphate ($P_i$)."
      ],
      example: "Summary: Without mitochondria, eukaryotic cells could only generate 2 ATP per glucose molecule via anaerobic glycolysis, whereas mitochondria yield ~30-32 ATP per glucose molecule!"
    },
    {
      keywords: ["ice", "float", "water", "density"],
      question: "Why does ice float on liquid water?",
      steps: [
        "**Step 1: Unique Hydrogen Bonding** — Water ($H_2O$) molecules form hydrogen bonds between partially negative oxygen atoms and partially positive hydrogen atoms.",
        "**Step 2: Crystalline Lattice Expansion** — As water cools below $4^\\circ\\text{C}$ towards freezing ($0^\\circ\\text{C}$), thermal motion slows down, allowing hydrogen bonds to lock water molecules into a rigid hexagonal crystal lattice.",
        "**Step 3: Lower Density than Liquid** — This hexagonal arrangement holds the molecules further apart than they are in chaotic liquid water, creating empty hexagonal voids.",
        "**Step 4: Archimedes' Principle** — Because ice has roughly 9% lower density (~$0.917\\text{ g/cm}^3$) than liquid water (~$1.000\\text{ g/cm}^3$), the buoyant force exceeds the weight of the ice, causing it to float."
      ],
      example: "Ecological Significance: Floating ice insulates lakes and oceans in winter, keeping the water below at $4^\\circ\\text{C}$ and preserving aquatic life!"
    }
  ]
};

// Export for module systems or window global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KNOWLEDGE_BASE };
}
