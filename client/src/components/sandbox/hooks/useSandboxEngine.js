import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { CATEGORIES, WEIGHTS, CONTENT_DATABASE } from '../data/contentDatabase';

const DEFAULT_METRIC = {
  views: 0,
  hovers: 0,
  reads: 0,
  likes: 0,
  saves: 0,
  dislikes: 0,
  time: 0,
  score: 0,
};

const DEFAULT_POST_STATE = {
  liked: false,
  saved: false,
  disliked: false,
  expanded: false,
  hoverLogged: false,
};

export default function useSandboxEngine(onSessionComplete) {
  // ── 1. SESSION FLOW STATE ─────────────────────────────────────────────────
  const [isStarted, setIsStarted] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileText, setCompileText] = useState('Initializing Behavioral Matrix...');
  const [activeTime, setActiveTime] = useState(0);

  // ── 2. METRICS & POST STATE (Initialized from all 18 posts) ───────────────
  const [metrics, setMetrics] = useState(() =>
    CATEGORIES.reduce((acc, cat) => {
      acc[cat] = { ...DEFAULT_METRIC };
      return acc;
    }, {})
  );

  const [postState, setPostState] = useState(() =>
    CONTENT_DATABASE.reduce((acc, item) => {
      acc[item.id] = { ...DEFAULT_POST_STATE };
      return acc;
    }, {})
  );

  // ── 3. LOGS, TIMELINE & DRIFT ─────────────────────────────────────────────
  const [logs, setLogs] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [attentionShifts, setAttentionShifts] = useState([]);

  const currentlyVisibleRef = useRef(null);
  const lastCategoryRef = useRef(null);

  const addLog = useCallback((jsonObj) => {
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => [...prev.slice(-24), JSON.stringify(jsonObj)]);
    setTimeline((prev) => [...prev, { time: timeStr, ...jsonObj }]);
  }, []);

  // ── 4. ACTIVE DWELL TIMER ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isStarted || isCompiling) return;

    const timer = setInterval(() => {
      setActiveTime((prev) => prev + 1);

      const currentCat = currentlyVisibleRef.current;
      if (currentCat && currentCat !== 'START' && currentCat !== 'END') {
        const timeWeight = Number(WEIGHTS.time) || 1;
        setMetrics((prev) => {
          const catData = prev[currentCat] || DEFAULT_METRIC;
          return {
            ...prev,
            [currentCat]: {
              ...catData,
              time: (catData.time || 0) + 1,
              score: Number(((catData.score || 0) + timeWeight).toFixed(1)),
            },
          };
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isCompiling]);

  // ── 5. DOMINANT CATEGORY CALCULATION ──────────────────────────────────────
  const dominantCategory = useMemo(() => {
    let topCat = null;
    let maxScore = 0;

    Object.entries(metrics).forEach(([cat, data]) => {
      const score = Number(data?.score) || 0;
      if (score > maxScore) {
        maxScore = score;
        topCat = cat;
      }
    });

    return topCat;
  }, [metrics]);

  // ── 6. INTERACTION HANDLERS ───────────────────────────────────────────────
  const handleMouseEnter = useCallback(
    (cat, id) => {
      currentlyVisibleRef.current = cat;
      if (!cat || cat === 'START' || cat === 'END') return;

      // Track topic-to-topic attention drift
      if (lastCategoryRef.current && lastCategoryRef.current !== cat) {
        setAttentionShifts((prev) => [
          ...prev,
          { from: lastCategoryRef.current, to: cat },
        ]);
      }
      lastCategoryRef.current = cat;

      const viewWeight = Number(WEIGHTS.view) || 1;

      // Safe view increment
      setMetrics((prev) => {
        const catData = prev[cat] || DEFAULT_METRIC;
        return {
          ...prev,
          [cat]: {
            ...catData,
            views: (catData.views || 0) + 1,
            score: Number(((catData.score || 0) + viewWeight).toFixed(1)),
          },
        };
      });

      addLog({ event: 'view', category: cat, score: `+${viewWeight}` });

      // Safe 1.5s hover check using functional state updater (no stale closure)
      setTimeout(() => {
        if (currentlyVisibleRef.current === cat && id) {
          setPostState((prev) => {
            const currentPost = prev[id] || DEFAULT_POST_STATE;
            if (currentPost.hoverLogged) return prev;

            const hoverWeight = Number(WEIGHTS.hover) || 2;
            setMetrics((mPrev) => {
              const catData = mPrev[cat] || DEFAULT_METRIC;
              return {
                ...mPrev,
                [cat]: {
                  ...catData,
                  hovers: (catData.hovers || 0) + 1,
                  score: Number(((catData.score || 0) + hoverWeight).toFixed(1)),
                },
              };
            });

            addLog({ event: 'hover', category: cat, score: `+${hoverWeight}` });

            return {
              ...prev,
              [id]: { ...currentPost, hoverLogged: true },
            };
          });
        }
      }, 1500);
    },
    [addLog]
  );

  const handleMouseLeave = useCallback((cat) => {
    if (currentlyVisibleRef.current === cat) {
      currentlyVisibleRef.current = null;
    }
  }, []);

  const handleAction = useCallback(
    (id, cat, actionType) => {
      if (!id || !cat) return;

      // Normalize both 'expand' and 'readMore'
      const isExpandAction = actionType === 'readMore' || actionType === 'expand';
      const stateField = isExpandAction ? 'expanded' : `${actionType}d`;
      const statKey = isExpandAction ? 'reads' : `${actionType}s`;

      const rawWeight = isExpandAction
        ? WEIGHTS.expand ?? WEIGHTS.readMore ?? 5
        : WEIGHTS[actionType] ?? 1;
      const weight = Number(rawWeight) || 0;

      setPostState((prev) => {
        const currentPost = prev[id] || DEFAULT_POST_STATE;
        const isActive = Boolean(currentPost[stateField]);
        const multiplier = isActive ? -1 : 1;

        setMetrics((mPrev) => {
          const catData = mPrev[cat] || DEFAULT_METRIC;
          const nextCount = Math.max(0, (catData[statKey] || 0) + (isActive ? -1 : 1));
          const nextScore = Number(((catData.score || 0) + weight * multiplier).toFixed(1));

          return {
            ...mPrev,
            [cat]: {
              ...catData,
              [statKey]: nextCount,
              score: nextScore,
            },
          };
        });

        const deltaScore = weight * multiplier;
        addLog({
          event: isExpandAction ? 'readMore' : actionType,
          category: cat,
          score: deltaScore >= 0 ? `+${deltaScore}` : `${deltaScore}`,
        });

        return {
          ...prev,
          [id]: {
            ...currentPost,
            [stateField]: !isActive,
          },
        };
      });
    },
    [addLog]
  );

  // ── 7. COMPILE SESSION SNAPSHOT ───────────────────────────────────────────
  const handleCompile = useCallback(() => {
    setIsCompiling(true);
    currentlyVisibleRef.current = null;

    setTimeout(() => setCompileText('Quantifying Dopamine Loops & Dwell Vectors...'), 900);
    setTimeout(() => setCompileText('Synthesizing Subconscious Shadow Profile...'), 1800);

    setTimeout(() => {
      const dwellData = {};
      let totalInteractions = 0;

      Object.entries(metrics).forEach(([cat, data]) => {
        dwellData[cat] = Math.max(0, Math.round(Number(data?.score) || 0));
        totalInteractions +=
          (data?.views || 0) +
          (data?.hovers || 0) +
          (data?.reads || 0) +
          (data?.likes || 0) +
          (data?.saves || 0);
      });

      const payload = {
        stats: {
          activeTime: `${Math.floor(activeTime / 60)}m ${activeTime % 60}s`,
          scrollDepth: 100,
          interactions: totalInteractions,
          nodesCaptured: CONTENT_DATABASE.length,
        },
        dwellData,
        fullMetrics: metrics,
        dominantInterest: dominantCategory || 'programming',
        rawLogs: logs,
        timeline,
        attentionShifts,
        engagementGraph: Array.from(
          { length: 7 },
          (_, i) => Math.min(100, Math.floor(20 + (totalInteractions * (i + 1)) / 4))
        ),
      };

      if (onSessionComplete) {
        onSessionComplete(payload);
      }
    }, 2700);
  }, [metrics, activeTime, dominantCategory, logs, timeline, attentionShifts, onSessionComplete]);

  return {
    isStarted,
    setIsStarted,
    isCompiling,
    compileText,
    activeTime,
    metrics,
    postState,
    logs,
    timeline,
    attentionShifts,
    dominantCategory,
    handleMouseEnter,
    handleMouseLeave,
    handleAction,
    handleCompile,
  };
}