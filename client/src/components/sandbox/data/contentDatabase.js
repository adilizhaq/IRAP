
import {
  Code,
  Brain,
  Rocket,
  Gamepad2,
  Clock,
  Microscope,
  Cpu,
  TrendingUp,
  Dumbbell,
} from 'lucide-react';

// ============================================================================
// CONTENT_DATABASE
// 8 diverse categories × 4 cards each = 32 cards
// ============================================================================

export const CONTENT_DATABASE = [
  // ── 1. PROGRAMMING ────────────────────────────────────────────────────────
  {
    id: 'post_01',
    category: 'programming',
    type: 'tutorial',
    difficulty: 'Beginner',
    title: 'How Binary Search Works',
    subtitle: 'Algorithms • Fundamentals',
    icon: Code,
    color: 'blue',
    content: {
      preview: 'Binary search finds an item in a sorted list by repeatedly cutting the search range in half.',
      expanded: 'Binary search works only on sorted data. Check the middle item, compare it with the target, and discard the half that cannot contain the answer. Repeat until the target is found or the range is empty. Its time complexity is O(log n), making it much faster than checking every item in large sorted lists.',
    },
  },
  {
    id: 'post_02',
    category: 'programming',
    type: 'tutorial',
    difficulty: 'Intermediate',
    title: 'React Custom Hook: useDebounce',
    subtitle: 'Frontend • React',
    icon: Code,
    color: 'blue',
    content: {
      preview: 'Debouncing waits until a user pauses typing before running an action, such as a search request.',
      expanded: `import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,
    },
  },
  {
    id: 'post_03',
    category: 'programming',
    type: 'article',
    difficulty: 'Intermediate',
    title: 'What Happens When You Enter a URL?',
    subtitle: 'Web Development • Behind the Scenes',
    icon: Code,
    color: 'blue',
    content: {
      preview: 'A browser request involves DNS, network connections, servers, and rendering—not just opening a page.',
      expanded: 'The browser interprets the URL and typically looks up the domain through DNS. It establishes a connection to the server, negotiates HTTPS when needed, and sends an HTTP request. The server responds with resources such as HTML, CSS, JavaScript, and images. The browser parses these resources, calculates styles, and paints the result on screen.',
    },
  },
  {
    id: 'post_04',
    category: 'programming',
    type: 'poll',
    difficulty: 'All Levels',
    title: 'Which Skill Should Developers Learn Next?',
    subtitle: 'Developer Community • Poll',
    icon: Code,
    color: 'blue',
    content: {
      question: 'If you had one month to level up, what would you focus on?',
      options: [
        'Data structures and algorithms',
        'Backend and APIs',
        'Cloud and deployment',
        'Testing and clean code',
      ],
    },
  },

  // ── 2. ARTIFICIAL INTELLIGENCE ─────────────────────────────────────────────
  {
    id: 'post_05',
    category: 'ai',
    type: 'video',
    difficulty: 'Intermediate',
    title: 'How Large Language Models Generate Text',
    subtitle: 'AI • Explainer',
    icon: Brain,
    color: 'purple',
    content: {
      url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
      length: '08:40',
      overlay: 'Tokens, Context & Prediction',
    },
  },
  {
    id: 'post_06',
    category: 'ai',
    type: 'article',
    difficulty: 'Beginner',
    title: 'AI Agents vs Traditional Chatbots',
    subtitle: 'AI Systems • Practical Guide',
    icon: Brain,
    color: 'purple',
    content: {
      preview: 'A chatbot mainly responds to prompts; an agent may also plan steps and use tools to complete a task.',
      expanded: 'A traditional chatbot is primarily designed to produce a response to a message. An AI agent can break a goal into steps, call tools, inspect results, and continue toward the goal. Agents still need boundaries, evaluation, and human oversight because tool use and multi-step reasoning can fail.',
    },
  },
  {
    id: 'post_07',
    category: 'ai',
    type: 'poll',
    difficulty: 'All Levels',
    title: 'Where Is AI Most Useful to You?',
    subtitle: 'AI Tools • Community Poll',
    icon: Brain,
    color: 'purple',
    content: {
      question: 'Which task do you most want AI to make easier?',
      options: [
        'Learning and research',
        'Coding and debugging',
        'Creative work',
        'Daily planning and admin',
      ],
    },
  },
  {
    id: 'post_08',
    category: 'ai',
    type: 'story',
    difficulty: 'Practical',
    title: 'A Week of Using AI as a Study Partner',
    subtitle: 'Learning • Personal Experiment',
    icon: Brain,
    color: 'purple',
    content: {
      preview: 'Instead of asking AI for finished answers, a student used it to generate practice questions and explain mistakes.',
      expanded: 'The experiment focused on using AI as a learning partner rather than a shortcut. Each session started with a short explanation, followed by practice questions and a review of incorrect answers. Verify important facts and try solving problems independently before checking the explanation.',
    },
  },

  // ── 3. STARTUPS & BUSINESS ─────────────────────────────────────────────────
  {
    id: 'post_09',
    category: 'startups',
    type: 'poll',
    difficulty: 'All Levels',
    title: 'Would You Build a Business Solo?',
    subtitle: 'Entrepreneurship • Community Poll',
    icon: Rocket,
    color: 'orange',
    content: {
      question: 'With modern no-code and AI tools, would you launch a small online business alone?',
      options: [
        'Yes, start small and test',
        'Only with a co-founder',
        'I would freelance first',
        'Not interested in business',
      ],
    },
  },
  {
    id: 'post_10',
    category: 'startups',
    type: 'story',
    difficulty: 'Practical',
    title: 'Why Your First 10 Customers Matter',
    subtitle: 'Founder Notes • Early Growth',
    icon: Rocket,
    color: 'orange',
    content: {
      preview: 'Early customers can teach a founder more than a large number of untested assumptions.',
      expanded: 'Before investing heavily in features or advertising, speak with people who experience the problem you want to solve. Show them a simple prototype, ask what they currently do, and observe whether they will actually use or pay for a solution. Early feedback helps narrow the product to a real need.',
    },
  },
  {
    id: 'post_11',
    category: 'startups',
    type: 'article',
    difficulty: 'Beginner',
    title: 'MVP: Build the Smallest Useful Version',
    subtitle: 'Product Strategy • Startup Basics',
    icon: Rocket,
    color: 'orange',
    content: {
      preview: 'A minimum viable product tests a core assumption with the smallest practical set of features.',
      expanded: 'An MVP is not simply a low-quality product. It is a focused version designed to test whether a proposed solution is useful to a real audience. Identify the main problem, build only what is needed to test it, collect feedback, and use the evidence to decide what to improve next.',
    },
  },
  {
    id: 'post_12',
    category: 'startups',
    type: 'product',
    difficulty: 'Founder Toolkit',
    title: 'A Simple Landing Page Starter Kit',
    subtitle: 'Business Tools • Website Planning',
    icon: Rocket,
    color: 'orange',
    content: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
      price: 'Free template',
      overlay: 'Headline • Benefits • Call to Action',
    },
  },

  // ── 4. GAMING ──────────────────────────────────────────────────────────────
  {
    id: 'post_13',
    category: 'gaming',
    type: 'product',
    difficulty: 'Enthusiast',
    title: 'Mechanical Keyboards for Competitive Play',
    subtitle: 'Gaming Gear • Setup',
    icon: Gamepad2,
    color: 'emerald',
    content: {
      url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop',
      price: 'Varies by model',
      overlay: 'Switches • Latency • Layout',
    },
  },
  {
    id: 'post_14',
    category: 'gaming',
    type: 'video',
    difficulty: 'Intermediate',
    title: 'How to Review Your Gameplay',
    subtitle: 'Esports • Skill Building',
    icon: Gamepad2,
    color: 'emerald',
    content: {
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
      length: '07:25',
      overlay: 'Decision-Making & Positioning',
    },
  },
  {
    id: 'post_15',
    category: 'gaming',
    type: 'poll',
    difficulty: 'All Levels',
    title: 'What Makes a Game Truly Great?',
    subtitle: 'Gaming Culture • Poll',
    icon: Gamepad2,
    color: 'emerald',
    content: {
      question: 'What keeps you playing a game for years?',
      options: [
        'Competitive depth',
        'Story and characters',
        'Friends and community',
        'Frequent new content',
      ],
    },
  },
  {
    id: 'post_16',
    category: 'gaming',
    type: 'article',
    difficulty: 'Beginner',
    title: 'FPS, Refresh Rate and Input Lag Explained',
    subtitle: 'Gaming Tech • Performance',
    icon: Gamepad2,
    color: 'emerald',
    content: {
      preview: 'Frames per second, monitor refresh rate, and input lag are related but measure different things.',
      expanded: 'FPS measures how many frames a game renders each second. Refresh rate measures how often a display can update each second. Input lag is the delay between an action and the visible response. Higher FPS and refresh rates can make play feel smoother, but actual results also depend on hardware, settings, and the display.',
    },
  },

  // ── 5. PRODUCTIVITY & LEARNING ─────────────────────────────────────────────
  {
    id: 'post_17',
    category: 'productivity',
    type: 'story',
    difficulty: 'Practical',
    title: 'Trying Focus Blocks for One Week',
    subtitle: 'Habits • Personal Workflow',
    icon: Clock,
    color: 'teal',
    content: {
      preview: 'Choose one task, silence notifications, and work on it for a set period.',
      expanded: 'Start by writing down one clear outcome for the session. Put distracting apps away, work for a manageable block such as 25 or 45 minutes, then take a short break. At the end, record what helped and what interrupted you. Adjust the duration to suit the task instead of treating one method as universal.',
    },
  },
  {
    id: 'post_18',
    category: 'productivity',
    type: 'article',
    difficulty: 'Beginner',
    title: 'The Two-Minute Rule',
    subtitle: 'Task Management • Everyday Systems',
    icon: Clock,
    color: 'teal',
    content: {
      preview: 'If a small task genuinely takes about two minutes, doing it now may be easier than tracking it for later.',
      expanded: 'Use the rule for quick, low-effort actions such as replying to a simple message or putting an item away. Do not let tiny tasks interrupt deep work or replace important priorities. For larger tasks, capture them in a trusted list and schedule a realistic time to handle them.',
    },
  },
  {
    id: 'post_19',
    category: 'productivity',
    type: 'poll',
    difficulty: 'All Levels',
    title: 'When Are You Most Focused?',
    subtitle: 'Work Habits • Poll',
    icon: Clock,
    color: 'teal',
    content: {
      question: 'When do you usually do your best focused work?',
      options: [
        'Early morning',
        'Late morning or afternoon',
        'Evening',
        'It changes every day',
      ],
    },
  },
  {
    id: 'post_20',
    category: 'productivity',
    type: 'tutorial',
    difficulty: 'Beginner',
    title: 'Turn a Big Goal into Small Steps',
    subtitle: 'Planning • How-To',
    icon: Clock,
    color: 'teal',
    content: {
      preview: 'A goal becomes easier to start when the next action is concrete and small.',
      expanded: 'Write the outcome you want, define what “done” means, and break the work into milestones. Then choose one action that can be completed in 15–30 minutes. Put that action on your calendar and review progress regularly. Small steps do not guarantee success, but they make starting and measuring progress easier.',
    },
  },

  // ── 6. PSYCHOLOGY & WELLBEING ──────────────────────────────────────────────
  {
    id: 'post_21',
    category: 'psychology',
    type: 'article',
    difficulty: 'Beginner',
    title: 'Why Notifications Break Your Attention',
    subtitle: 'Cognitive Science • Digital Habits',
    icon: Microscope,
    color: 'rose',
    content: {
      preview: 'A notification can interrupt a task and leave you thinking about the message even after you return to work.',
      expanded: 'Attention has to shift from the task to the alert and then back again. Even a brief interruption can make it harder to remember where you were or what you planned to do next. Try disabling non-essential notifications and checking messages at planned intervals. The best setup depends on your responsibilities and need to stay reachable.',
    },
  },
  {
    id: 'post_22',
    category: 'psychology',
    type: 'poll',
    difficulty: 'All Levels',
    title: 'What Usually Causes Your Stress?',
    subtitle: 'Self-Reflection • Poll',
    icon: Microscope,
    color: 'rose',
    content: {
      question: 'Which everyday factor most often makes it hard for you to relax?',
      options: [
        'Too many tasks',
        'Uncertainty about the future',
        'Digital distractions',
        'Not enough rest',
      ],
    },
  },
  {
    id: 'post_23',
    category: 'psychology',
    type: 'story',
    difficulty: 'Practical',
    title: 'Notice a Thought Without Chasing It',
    subtitle: 'Mindfulness • Everyday Practice',
    icon: Microscope,
    color: 'rose',
    content: {
      preview: 'A simple mindfulness exercise is to notice that your mind has wandered and gently return to the present.',
      expanded: 'Sit comfortably and focus on your breathing or the sounds around you. When a thought appears, label it gently as “thinking” rather than judging yourself for having it. Then return your attention to your chosen focus. The aim is not to stop thoughts completely; it is to practise noticing them without automatically following every one.',
    },
  },
  {
    id: 'post_24',
    category: 'psychology',
    type: 'video',
    difficulty: 'Beginner',
    title: 'The Psychology of Habits',
    subtitle: 'Behavior • Explainer',
    icon: Microscope,
    color: 'rose',
    content: {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
      length: '09:10',
      overlay: 'Cues, Actions & Rewards',
    },
  },

  // ── 7. TECHNOLOGY & HARDWARE ───────────────────────────────────────────────
  {
    id: 'post_25',
    category: 'technology',
    type: 'video',
    difficulty: 'Intermediate',
    title: 'How Modern Chips Are Manufactured',
    subtitle: 'Semiconductors • Hardware',
    icon: Cpu,
    color: 'amber',
    content: {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
      length: '10:12',
      overlay: 'Silicon • Lithography • Transistors',
    },
  },
  {
    id: 'post_26',
    category: 'technology',
    type: 'article',
    difficulty: 'Beginner',
    title: 'RAM vs Storage: What Is the Difference?',
    subtitle: 'Computer Basics • Hardware',
    icon: Cpu,
    color: 'amber',
    content: {
      preview: 'RAM is working space for active tasks; storage keeps files and apps when the device is powered off.',
      expanded: 'RAM is fast temporary memory used by running programs. Storage, such as an SSD, holds the operating system, applications, photos, and documents over time. More RAM can help with multitasking, while faster or larger storage can improve loading and provide room for files. They solve different problems and are not interchangeable.',
    },
  },
  {
    id: 'post_27',
    category: 'technology',
    type: 'product',
    difficulty: 'Enthusiast',
    title: 'USB-C: One Connector, Many Capabilities',
    subtitle: 'Devices • Connectivity',
    icon: Cpu,
    color: 'amber',
    content: {
      url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=1000&auto=format&fit=crop',
      price: 'Depends on device and cable',
      overlay: 'Charging • Data • Display',
    },
  },
  {
    id: 'post_28',
    category: 'technology',
    type: 'poll',
    difficulty: 'All Levels',
    title: 'Which Tech Upgrade Matters Most?',
    subtitle: 'Hardware • Community Poll',
    icon: Cpu,
    color: 'amber',
    content: {
      question: 'If you could upgrade one part of your main device, what would you choose?',
      options: [
        'Battery life',
        'Performance',
        'Display quality',
        'Repairability and lifespan',
      ],
    },
  },

  // ── 8. SPORTS & FITNESS ────────────────────────────────────────────────────
  {
    id: 'post_29',
    category: 'sports',
    type: 'video',
    difficulty: 'Intermediate',
    title: 'Football Tactics: Understanding the High Press',
    subtitle: 'Football • Tactical Breakdown',
    icon: TrendingUp,
    color: 'green',
    content: {
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop',
      length: '08:55',
      overlay: 'Pressing Triggers & Team Shape',
    },
  },
  {
    id: 'post_30',
    category: 'sports',
    type: 'article',
    difficulty: 'Beginner',
    title: 'What Does Progressive Overload Mean?',
    subtitle: 'Fitness • Training Basics',
    icon: Dumbbell,
    color: 'green',
    content: {
      preview: 'Progressive overload means gradually adjusting training demands as your body adapts.',
      expanded: 'Progress can come from adding a small amount of weight, performing another repetition, improving technique, or increasing training volume carefully. Changes should be gradual and matched to recovery. More is not always better; pain, persistent fatigue, and poor form are reasons to reduce the load or seek qualified guidance.',
    },
  },
  {
    id: 'post_31',
    category: 'sports',
    type: 'poll',
    difficulty: 'All Levels',
    title: 'What Keeps You Consistent with Exercise?',
    subtitle: 'Fitness • Community Poll',
    icon: Dumbbell,
    color: 'green',
    content: {
      question: 'Which factor helps you stick with physical activity?',
      options: [
        'A clear goal',
        'Friends or a team',
        'Seeing progress',
        'Making it enjoyable',
      ],
    },
  },
  {
    id: 'post_32',
    category: 'sports',
    type: 'story',
    difficulty: 'Practical',
    title: 'Starting Small: A Sustainable Fitness Routine',
    subtitle: 'Movement • Habit Building',
    icon: Dumbbell,
    color: 'green',
    content: {
      preview: 'A routine built around realistic sessions is often easier to maintain than an ambitious plan that quickly becomes exhausting.',
      expanded: 'Begin with an activity you can repeat consistently, such as a short walk, beginner strength session, or recreational sport. Choose a schedule that fits your life, increase difficulty gradually, and allow time for recovery. If you have a medical concern or are returning after a long break, tailor the plan with a qualified professional.',
    },
  },
];


// Shuffle the feed in place so existing CONTENT_DATABASE imports use this order.
for (let i = CONTENT_DATABASE.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));

  [
    CONTENT_DATABASE[i],
    CONTENT_DATABASE[j],
  ] = [
    CONTENT_DATABASE[j],
    CONTENT_DATABASE[i],
  ];
}

// Keep the original category list.
export const CATEGORIES = [
  ...new Set(CONTENT_DATABASE.map((item) => item.category)),
];

// One representative card per category for the Stories tray.
export const STORY_ITEMS = CATEGORIES.map((category) =>
  CONTENT_DATABASE.find((item) => item.category === category)
);

// Interaction weights.
export const WEIGHTS = {
  view: 1,
  hover: 2,
  tap: 2,
  hold: 4,
  swipe: 1,
  readMore: 5,
  expand: 5,
  like: 8,
  save: 12,
  dislike: -10,
  time: 1,
};

// Background videos.
export const BACKGROUND_VIDEOS = [
  '/bg1.mp4',
  '/bg2.mp4',
  '/bg3.mp4',
];

