import { useState, useEffect, useRef, useMemo } from 'react';

// ── Constants (will move to contentDatabase.js in the next step) ──────────
// Kept here temporarily so this hook is self-contained and you can test it
// before splitting data out. Once contentDatabase.js exists, replace these
// with: import { CATEGORIES, WEIGHTS, CONTENT_DATABASE } from '../data/contentDatabase';


const CONTENT_DATABASE = [
  {
    id: 'post_01', category: 'programming', type: 'tutorial', difficulty: 'Intermediate',
    title: 'Binary Search Time Complexity',
    subtitle: 'Educational • Tech',
  },
  {
    id: 'post_02', category: 'ai', type: 'video', difficulty: 'Advanced',
    title: 'New LLM Context Windows Exceed 2M Tokens',
    subtitle: 'AI Research • Video Breakdown',
  },
  {
    id: 'post_03', category: 'startups', type: 'poll', difficulty: 'Beginner',
    title: 'Would you start a company in 2026?',
    subtitle: 'Community Pulse • Entrepreneurship',
  },
  {
    id: 'post_04', category: 'gaming', type: 'product', difficulty: 'Enthusiast',
    title: 'Wooting 60HE+ Mechanical Keyboard',
    subtitle: 'Hardware • Competitive',
  },
  {
    id: 'post_05', category: 'productivity', type: 'story', difficulty: 'Intermediate',
    title: 'Deep Work: Reclaiming Focus in the Noise',
    subtitle: 'Lifestyle • Workflow',
  },
  {
    id: 'post_06', category: 'psychology', type: 'article', difficulty: 'Academic',
    title: 'Dopamine Exhaustion in the Scroll Era',
    subtitle: 'Behavioral Science • Health',
  },
  {
    id: 'post_07', category: 'motorcycles', type: 'video', difficulty: 'Enthusiast',
    title: 'Ducati Panigale V4R Track Run',
    subtitle: 'Motorsport • Track Day',
  },
  {
    id: 'post_08', category: 'technology', type: 'product', difficulty: 'Beginner',
    title: 'Vision Pro 2 AR Glasses Leak',
    subtitle: 'Hardware • Future Tech',
  },
];

const CATEGORIES = [...new Set(CONTENT_DATABASE.map(c => c.category))];
const WEIGHTS = { view: 1, hover: 2, readMore: 5, like: 8, save: 12, dislike: -10, time: 1 };

// ─────────────────────────────────────────────────────────────────────────────
// useSandboxEngine
//
// Extracted from SandboxView.jsx — owns every piece of state and logic that
// was previously living inside the god component. Components become pure
// presentational shells that receive state + handlers as props.
//
// Usage:
//   const engine = useSandboxEngine(onSessionComplete);
//   const { isStarted, isCompiling, metrics, postState, ... } = engine;
// ─────────────────────────────────────────────────────────────────────────────

export default function useSandboxEngine(onSessionComplete) {

  // ── Session flow ──────────────────────────────────────────────────────────
  const [isStarted, setIsStarted]     = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileText, setCompileText] = useState('Extracting Micro-Interactions...');

  // ── Active time counter ───────────────────────────────────────────────────
  const [activeTime, setActiveTime] = useState(0);

  // ── Telemetry log + timeline ──────────────────────────────────────────────
  const [logs, setLogs]         = useState([]);
  const [timeline, setTimeline] = useState([]);

  // ── Attention drift path ──────────────────────────────────────────────────
  const [attentionShifts, setAttentionShifts] = useState([]);

  // ── Per-category behavioral scores ───────────────────────────────────────
  const [metrics, setMetrics] = useState(
    CATEGORIES.reduce(
      (acc, cat) => ({
        ...acc,
        [cat]: { score: 0, views: 0, hovers: 0, reads: 0, likes: 0, saves: 0, dislikes: 0, time: 0 },
      }),
      {}
    )
  );

  // ── Per-post interaction state ────────────────────────────────────────────
  const [postState, setPostState] = useState(
    CONTENT_DATABASE.reduce(
      (acc, post) => ({
        ...acc,
        [post.id]: { expanded: false, liked: false, saved: false, disliked: false, hoverLogged: false },
      }),
      {}
    )
  );

  // ── Ref: tracks which category card the cursor is currently over ──────────
  // A ref (not state) so the dwell timer reads the latest value without
  // causing re-renders on every mouse move.
  const currentlyVisibleRef = useRef(null);

  // ── Active session timer ──────────────────────────────────────────────────
  // Identical to original: increments every second while the feed is live.
  useEffect(() => {
    if (!isStarted || isCompiling) return;
    const timer = setInterval(() => setActiveTime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isStarted, isCompiling]);

  // ── Dwell time tracker ────────────────────────────────────────────────────
  // Identical to original: every second the cursor sits on a card, that
  // category earns +WEIGHTS.time (1 pt). Rewards genuine reading.
  useEffect(() => {
    if (!isStarted || isCompiling) return;
    const dwellTimer = setInterval(() => {
      const current = currentlyVisibleRef.current;
      if (current && current !== 'START' && current !== 'END') {
        setMetrics(prev => ({
          ...prev,
          [current]: {
            ...prev[current],
            time: prev[current].time + 1,
            score: prev[current].score + WEIGHTS.time,
          },
        }));
      }
    }, 1000);
    return () => clearInterval(dwellTimer);
  }, [isStarted, isCompiling]);

  // ── Dominant category (memoised) ─────────────────────────────────────────
  // Identical to original: the highest-scoring category at any moment.
  // Drives the mid-feed recommendation injection.
  const dominantCategory = useMemo(() => {
    let top = { cat: 'None', score: -999 };
    Object.keys(metrics).forEach(cat => {
      if (metrics[cat].score > top.score) top = { cat, score: metrics[cat].score };
    });
    return top.score > 0 ? top.cat : null;
  }, [metrics]);

  // ── Attention drift tracker ───────────────────────────────────────────────
  // Identical to original: appends to the journey path only when the dominant
  // category changes — no duplicates.
  useEffect(() => {
    if (!dominantCategory) return;
    setAttentionShifts(prev => {
      if (prev.length === 0 || prev[prev.length - 1] !== dominantCategory) {
        return [...prev, dominantCategory];
      }
      return prev;
    });
  }, [dominantCategory]);

  // ── Logging engine ────────────────────────────────────────────────────────
  // Identical to original: timestamps each event, keeps last 13 in raw logs,
  // appends everything to the full timeline.
  const addLog = (jsonObj) => {
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    setLogs(prev => [...prev.slice(-12), JSON.stringify(jsonObj)]);
    setTimeline(prev => [...prev, { time: timeStr, ...jsonObj }]);
  };

  // ── handleMouseEnter ──────────────────────────────────────────────────────
  // Identical to original:
  //   • Sets currentlyVisibleRef for the dwell timer
  //   • Logs a 'view' event immediately
  //   • After 1500ms of continuous hover, logs a 'hover' event once per card
  const handleMouseEnter = (cat, id) => {
    currentlyVisibleRef.current = cat;
    if (cat === 'START' || cat === 'END') return;

    setMetrics(prev => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        views: prev[cat].views + 1,
        score: prev[cat].score + WEIGHTS.view,
      },
    }));
    addLog({ event: 'view', category: cat, score: `+${WEIGHTS.view}` });

    if (!postState[id].hoverLogged) {
      setTimeout(() => {
        if (currentlyVisibleRef.current === cat) {
          setMetrics(prev => ({
            ...prev,
            [cat]: {
              ...prev[cat],
              hovers: prev[cat].hovers + 1,
              score: prev[cat].score + WEIGHTS.hover,
            },
          }));
          setPostState(prev => ({ ...prev, [id]: { ...prev[id], hoverLogged: true } }));
          addLog({ event: 'hover', category: cat, score: `+${WEIGHTS.hover}` });
        }
      }, 1500);
    }
  };

  // ── handleMouseLeave ──────────────────────────────────────────────────────
  // Was inline in original (onMouseLeave on the card div). Extracted here so
  // components don't need to know about currentlyVisibleRef.
  const handleMouseLeave = (cat) => {
    if (currentlyVisibleRef.current === cat) currentlyVisibleRef.current = null;
  };

  // ── handleAction ─────────────────────────────────────────────────────────
  // Identical to original: unified handler for like / save / dislike / readMore.
  // Supports toggling — second click reverses the score (multiplier = -1).
  const handleAction = (id, cat, actionType) => {
    const isActive = postState[id][actionType === 'readMore' ? 'expanded' : actionType + 'd'];
    const statKey  = actionType === 'readMore' ? 'reads' : actionType + 's';
    const weight   = WEIGHTS[actionType];
    const multiplier = isActive ? -1 : 1;

    setPostState(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [actionType === 'readMore' ? 'expanded' : actionType + 'd']: !isActive,
      },
    }));

    setMetrics(prev => ({
      ...prev,
      [cat]: {
        ...prev[cat],
        [statKey]: prev[cat][statKey] + (isActive ? -1 : 1),
        score: prev[cat].score + weight * multiplier,
      },
    }));

    addLog({
      event: actionType,
      category: cat,
      score: `${multiplier > 0 ? '+' : ''}${weight * multiplier}`,
    });
  };

  // ── handleCompile ─────────────────────────────────────────────────────────
  // Identical to original: 4-stage text animation over 4 seconds, then
  // assembles the session payload and calls onSessionComplete.
  const handleCompile = () => {
    setIsCompiling(true);

    setTimeout(() => setCompileText('Calculating Dwell Heatmaps...'),        800);
    setTimeout(() => setCompileText('Parsing Attention Drift Vectors...'),   1600);
    setTimeout(() => setCompileText('Synthesizing Psychometric Profile...'), 2400);
    setTimeout(() => setCompileText('Finalizing Transparency Dashboard...'), 3200);

    setTimeout(() => {
      const totalInteractions = Object.values(metrics).reduce(
        (sum, m) => sum + m.views + (m.clicks || 0) + m.saves + m.likes + m.reads,
        0
      );

      const dwellMap = Object.keys(metrics).reduce(
        (acc, cat) => ({ ...acc, [cat]: metrics[cat].score }),
        {}
      );

      const payload = {
        stats: {
          activeTime:     `${Math.floor(activeTime / 60)}m ${activeTime % 60}s`,
          scrollDepth:    100,
          interactions:   totalInteractions,
          nodesCaptured:  CONTENT_DATABASE.length,
        },
        dwellData:        dwellMap,
        dominantInterest: dominantCategory
          ? dominantCategory.charAt(0).toUpperCase() + dominantCategory.slice(1)
          : 'Unknown',
        rawLogs:          logs,
        engagementGraph:  Array.from({ length: 7 }, () => Math.floor(Math.random() * 40) + 40),
      };

      onSessionComplete(payload);
    }, 4000);
  };

  // ── Public API ────────────────────────────────────────────────────────────
  return {
    // Session flow
    isStarted,
    isCompiling,
    compileText,
    setIsStarted,       // exposed so WelcomeScreen can call setIsStarted(true)

    // Telemetry
    activeTime,
    logs,
    timeline,
    attentionShifts,
    dominantCategory,

    // Scoring
    metrics,
    postState,

    // Handlers
    handleMouseEnter,
    handleMouseLeave,
    handleAction,
    handleCompile,
  };
}
