import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
import { CONTENT_DATABASE, WEIGHTS } from "../components/sandbox/data/contentDatabase";

// 1. Create the Context
const TelemetryContext = createContext();

// 2. Create the Global Provider
export const TelemetryProvider = ({ children }) => {
  const [isTracking, setIsTracking] = useState(false);
  const pauseTracking = () => setIsTracking(false);
  const resumeTracking = () => setIsTracking(true);

  const [activeTime, setActiveTime] = useState(0);
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [attentionShifts, setAttentionShifts] = useState([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  // Real-time Touch Hardware Metrics
  const [touchMetrics, setTouchMetrics] = useState({
    swipeVelocity: 0,
    gestureFrequency: 0,
    touchIntensity: 0,
    holdDuration: "0.0"
  });

  const currentlyVisibleRef = useRef(null);
  const previousCategoryRef = useRef(null);
  const touchStartRef = useRef(null);

  // -------------------------
  // SESSION TIMER
  // -------------------------
  useEffect(() => {
    if (!isTracking) return;
    const timer = setInterval(() => {
      setActiveTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isTracking]);

  // -------------------------
  // LOGGING ENGINE
  // -------------------------
  const addLog = (message) => {
    setLogs((prev) => [...prev.slice(-49), message]);
  };

  // -------------------------
  // EVENT ENGINE
  // -------------------------
  const addEvent = (type, category, metadata = {}) => {
    const event = {
      id: crypto.randomUUID(),
      type,
      category,
      timestamp: Date.now(),
      sessionTime: activeTime,
      ...metadata
    };
    setEvents((prev) => [...prev, event]);
    setTimeline((prev) => [
      ...prev,
      { time: activeTime, event: type, category }
    ]);
  };

  // -------------------------
  // VIEW DETECTION
  // -------------------------
  const handleView = (category) => {
    if (!isTracking) return;
    currentlyVisibleRef.current = category;
    addEvent("view", category);
    addLog(`[VIEW] ${category}`);

    if (previousCategoryRef.current && previousCategoryRef.current !== category) {
      setAttentionShifts((prev) => [
        ...prev,
        {
          from: previousCategoryRef.current,
          to: category,
          time: activeTime
        }
      ]);
    }
    previousCategoryRef.current = category;
  };

  // -------------------------
  // HOVER, TOUCH & ACTIONS
  // -------------------------
  const handleHover = (category) => {
    if (!isTracking) return;
    addEvent("hover", category);
    addLog(`[HOVER] ${category}`);
  };

  const handleTouch = (category, gestureType = "tap", metadata = {}) => {
    if (!isTracking) return;
    const targetCategory = category || currentlyVisibleRef.current || "general";
    if (category) currentlyVisibleRef.current = category;

    addEvent(gestureType, targetCategory, metadata);
    addLog(`[${gestureType.toUpperCase()}] ${targetCategory}`);
  };

  const handleAction = (action, category) => {
    if (!isTracking) return;
    addEvent(action, category);
    addLog(`[${action.toUpperCase()}] ${category}`);
  };

  // -------------------------
  // GLOBAL TOUCH GESTURE ENGINE
  // -------------------------
  useEffect(() => {
    if (!isTracking) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        force: touch.force || 0.5
      };
    };

    const handleTouchEnd = (e) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const duration = Math.max(Date.now() - touchStartRef.current.time, 1);
      const velocity = Math.floor(distance / (duration / 100));

      const activeCategory = currentlyVisibleRef.current;

      // Update hardware-level touch telemetry
      setTouchMetrics((prev) => ({
        swipeVelocity: velocity,
        gestureFrequency: prev.gestureFrequency + 1,
        touchIntensity: Math.min(100, prev.touchIntensity + Math.max(5, Math.floor(distance / 5))),
        holdDuration: (duration / 1000).toFixed(1)
      }));

      // Classify gesture: Swipe vs. Hold vs. Tap
      if (distance > 30) {
        const direction = Math.abs(dy) > Math.abs(dx)
          ? (dy < 0 ? "up" : "down")
          : (dx < 0 ? "left" : "right");

        if (activeCategory) {
          addEvent("swipe", activeCategory, { velocity, distance: Math.round(distance), direction });
          addLog(`[SWIPE ${direction.toUpperCase()}] ${activeCategory} (${velocity}px/s)`);
        }
      } else if (duration >= 500) {
        if (activeCategory) {
          addEvent("hold", activeCategory, { duration });
          addLog(`[HOLD] ${activeCategory} (${(duration / 1000).toFixed(1)}s)`);
        }
      } else {
        if (activeCategory) {
          addEvent("tap", activeCategory, { duration });
          addLog(`[TAP] ${activeCategory}`);
        }
      }

      touchStartRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isTracking, activeTime]);

  // -------------------------
  // DWELL TIME ENGINE
  // -------------------------
  useEffect(() => {
    if (!isTracking) return;
    const dwellTimer = setInterval(() => {
      if (!currentlyVisibleRef.current) return;
      addEvent("dwell", currentlyVisibleRef.current, { duration: 100 });
    }, 1000);
    return () => clearInterval(dwellTimer);
  }, [activeTime, isTracking]);

  // -------------------------
  // CATEGORY METRICS
  // -------------------------
  const metrics = useMemo(() => {
    const base = {};
    CONTENT_DATABASE.forEach((item) => {
      if (!base[item.category]) {
        base[item.category] = {
          views: 0,
          hovers: 0,
          taps: 0,
          holds: 0,
          swipes: 0,
          likes: 0,
          saves: 0,
          dislikes: 0,
          expands: 0,
          dwellTime: 0
        };
      }
    });

    events.forEach((event) => {
      const cat = event.category;
      if (!base[cat]) return;
      switch (event.type) {
        case "view": base[cat].views++; break;
        case "hover": base[cat].hovers++; break;
        case "tap": base[cat].taps++; break;
        case "hold": base[cat].holds++; break;
        case "swipe": base[cat].swipes++; break;
        case "like": base[cat].likes++; break;
        case "save": base[cat].saves++; break;
        case "dislike": base[cat].dislikes++; break;
        case "expand": base[cat].expands++; break;
        case "dwell": base[cat].dwellTime += event.duration || 0; break;
        default: break;
      }
    });
    return base;
  }, [events]);

  // -------------------------
  // INTEREST SCORES
  // -------------------------
  const interestScores = useMemo(() => {
    const scores = {};
    Object.entries(metrics).forEach(([category, data]) => {
      scores[category] =
        data.views * (WEIGHTS.view || 1) +
        data.hovers * (WEIGHTS.hover || 2) +
        data.taps * (WEIGHTS.tap || 2) +
        data.holds * (WEIGHTS.hold || 4) +
        data.swipes * (WEIGHTS.swipe || 1) +
        data.expands * (WEIGHTS.expand || 5) +
        data.likes * (WEIGHTS.like || 10) +
        data.saves * (WEIGHTS.save || 15) -
        data.dislikes * (WEIGHTS.dislike || 10) +
        data.dwellTime / 1000;
    });
    return scores;
  }, [metrics]);

  // -------------------------
  // BEHAVIORAL TRAITS
  // -------------------------
  const behavioralTraits = useMemo(() => {
    const categoriesVisited = Object.keys(metrics).filter((cat) => metrics[cat].views > 0 || metrics[cat].taps > 0).length;
    const totalSaves = Object.values(metrics).reduce((sum, cat) => sum + cat.saves, 0);
    const totalDwell = Object.values(metrics).reduce((sum, cat) => sum + cat.dwellTime, 0);
    const totalHolds = Object.values(metrics).reduce((sum, cat) => sum + cat.holds, 0);
    const totalViews = Object.values(metrics).reduce((sum, cat) => sum + cat.views + cat.swipes, 0);

    return {
      explorer: Math.min(100, categoriesVisited * 15),
      collector: Math.min(100, totalSaves * 15),
      researcher: Math.min(100, Math.floor(totalDwell / 5000) + totalHolds * 5),
      scanner: Math.min(100, totalViews > 0 ? Math.floor((totalViews * 100) / (activeTime + 1)) : 0)
    };
  }, [metrics, activeTime]);

  // -------------------------
  // GLOBAL SIGNALS
  // -------------------------
  const signals = useMemo(() => {
    return {
      totalEvents: events.length,
      totalViews: events.filter((e) => e.type === "view").length,
      totalHovers: events.filter((e) => e.type === "hover").length,
      totalTaps: events.filter((e) => e.type === "tap").length,
      totalHolds: events.filter((e) => e.type === "hold").length,
      totalSwipes: events.filter((e) => e.type === "swipe").length,
      totalTouches: events.filter((e) => ["tap", "hold", "swipe"].includes(e.type)).length,
      totalLikes: events.filter((e) => e.type === "like").length,
      totalSaves: events.filter((e) => e.type === "save").length,
      totalExpands: events.filter((e) => e.type === "expand").length,
      totalDislikes: events.filter((e) => e.type === "dislike").length
    };
  }, [events]);

  // Expose everything to the app
  const value = {
    activeTime,
    events,
    metrics,
    interestScores,
    behavioralTraits,
    signals,
    touchMetrics,
    timeline,
    attentionShifts,
    logs,

    selectedRecommendation,
    setSelectedRecommendation,

    handleView,
    handleHover,
    handleTouch,
    handleAction,
    pauseTracking,
    resumeTracking,
    isTracking
  };

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
};

// 3. Export the custom hook so components can use it easily
export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }
  return context;
};