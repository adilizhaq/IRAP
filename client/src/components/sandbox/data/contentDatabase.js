import {
  Code, Brain, Rocket, Gamepad2, Clock, Microscope, Bike, Cpu,
} from 'lucide-react';


// ============================================================================
// CONTENT_DATABASE
// ----------------------------------------------------------------------------
// The full set of feed posts. Each entry is a self-contained content node
// with metadata, display config, and body content.
//
// Fields:
//   id         — unique post identifier, used as key in postState
//   category   — behavioral scoring bucket (maps to metrics keys)
//   type       — controls which body renderer CardBody picks:
//                'tutorial' | 'video' | 'poll' | 'product' | 'story' | 'article'
//                NOTE: 'tutorial' renders as 'code' in the original CardBody switch.
//                      Kept as-is to match your original CONTENT_DATABASE exactly.
//   difficulty — display label only, no scoring impact
//   title      — card header text
//   subtitle   — card sub-header text
//   icon       — Lucide icon component for the category avatar
//   color      — key into getColor() for the avatar color scheme
//   content    — body payload, shape varies by type (see per-entry comments)
// ============================================================================

export const CONTENT_DATABASE = [
  {
    id: 'post_01',
    category: 'programming',
    type: 'tutorial',
    difficulty: 'Intermediate',
    title: 'Binary Search Time Complexity',
    subtitle: 'Educational • Tech',
    icon: Code,
    color: 'blue',
    content: {
      // Shown when expanded === false
      preview: `def binary_search(arr, target):\n  left, right = 0, len(arr) - 1\n  while left <= right:`,
      // Shown when expanded === true
      expanded: `def binary_search(arr, target):\n  left, right = 0, len(arr) - 1\n  while left <= right:\n    mid = (left + right) // 2\n    if arr[mid] == target:\n      return mid\n    elif arr[mid] < target:\n      left = mid + 1\n    else:\n      right = mid - 1\n  return -1\n\n# Time Complexity: O(log n)\n# Space Complexity: O(1)`,
    },
  },
  {
    id: 'post_02',
    category: 'ai',
    type: 'video',
    difficulty: 'Advanced',
    title: 'New LLM Context Windows Exceed 2M Tokens',
    subtitle: 'AI Research • Video Breakdown',
    icon: Brain,
    color: 'purple',
    content: {
      url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop',
      length: '14:22',
      overlay: 'Attention Mechanisms Explained',
    },
  },
  {
    id: 'post_03',
    category: 'startups',
    type: 'poll',
    difficulty: 'Beginner',
    title: 'Would you start a company in 2026?',
    subtitle: 'Community Pulse • Entrepreneurship',
    icon: Rocket,
    color: 'orange',
    content: {
      question:
        'With the rise of AI agents replacing junior developers, is bootstrapping a solo SaaS more or less viable today?',
      options: [
        'More Viable (Leverage AI)',
        'Less Viable (Market saturated)',
        'No Change',
      ],
    },
  },
  {
    id: 'post_04',
    category: 'gaming',
    type: 'product',
    difficulty: 'Enthusiast',
    title: 'Wooting 60HE+ Mechanical Keyboard',
    subtitle: 'Hardware • Competitive',
    icon: Gamepad2,
    color: 'emerald',
    content: {
      url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop',
      price: '$174.99',
      overlay: 'Analog Hall Effect Switches',
    },
  },
  
    id: 'post_05',
    category: 'productivity',
    type: 'story',
    difficulty: 'Intermediate',
    title: 'Deep Work: Reclaiming Focus in the Noise',
    subtitle: 'Lifestyle • Workflow',
    icon: Clock,
    color: 'teal',
    content: {
      preview:
        'I spent three years working 10-hour days but achieving almost nothing. My screen time was 6 hours a day. I decided to completely audit my attention...',
      expanded:
        "I spent three years working 10-hour days but achieving almost nothing. My screen time was 6 hours a day. I decided to completely audit my attention. The primary realization? Context switching was destroying my cognitive load. By implementing 90-minute strict 'Deep Work' blocks where my phone was in another room, my actual output tripled while my working hours halved.",
    },
  },
  {
    id: 'post_06',
    category: 'psychology',
    type: 'article',
    difficulty: 'Academic',
    title: 'Dopamine Exhaustion in the Scroll Era',
    subtitle: 'Behavioral Science • Health',
    icon: Microscope,
    color: 'rose',
    content: {
      preview:
        'Short-form content algorithms are engineered to exploit variable reward schedules, identical to slot machines. This constant baseline stimulation is leading to unprecedented levels of anhedonia...',
      expanded:
        'Short-form content algorithms are engineered to exploit variable reward schedules, identical to slot machines. This constant baseline stimulation is leading to unprecedented levels of anhedonia (the inability to feel pleasure in normally pleasurable activities). To reset your baseline, neuroscientists recommend 24-48 hour \'dopamine fasts\' focusing entirely on high-friction, low-reward activities.',
    },
  },
  {
    id: 'post_07',
    category: 'motorcycles',
    type: 'video',
    difficulty: 'Enthusiast',
    title: 'Ducati Panigale V4R Track Run',
    subtitle: 'Motorsport • Track Day',
    icon: Bike,
    color: 'red',
    content: {
      url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop',
      length: '08:14',
      overlay: 'On-Board Telemetry',
    },
  },
  {
    id: 'post_08',
    category: 'technology',
    type: 'product',
    difficulty: 'Beginner',
    title: 'Vision Pro 2 AR Glasses Leak',
    subtitle: 'Hardware • Future Tech',
    icon: Cpu,
    color: 'amber',
    content: {
      url: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1000&auto=format&fit=crop',
      price: '$1,499.00',
      overlay: 'Micro-OLED Displays',
    },
  },
];

// ============================================================================
// CATEGORIES
// Derived from CONTENT_DATABASE — single source of truth.
// Used to initialise metrics state in useSandboxEngine.
// ============================================================================
export const CATEGORIES = [...new Set(CONTENT_DATABASE.map(c => c.category))];

// ============================================================================
// WEIGHTS
// Scoring multipliers for each interaction type.
// Negative weight on 'dislike' because it signals rejection, not interest.
// 'time' is applied per-second by the dwell tracker in useSandboxEngine.
// ============================================================================
export const WEIGHTS = {
  view:     1,   // passive — card entered viewport
  hover:    2,   // mild intent — cursor rested 1.5s
  readMore: 5,   // moderate intent — expanded content
  like:     8,   // strong signal — explicit positive action
  save:     12,  // strongest signal — utility / revisit intent
  dislike: -10,  // rejection — subtract from category score
  time:     1,   // per-second dwell bonus
};

// ============================================================================
// BACKGROUND_VIDEOS
// Paths for the welcome screen slideshow. Served from /public.
// Cycle interval: 10 seconds (controlled in WelcomeScreen.jsx).
// ============================================================================
export const BACKGROUND_VIDEOS = [
  '/bg1.mp4',
  '/bg2.mp4',
  '/bg3.mp4',
];