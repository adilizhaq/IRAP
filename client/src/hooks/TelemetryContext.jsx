import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
// Adjust this import path based on where your TelemetryContext.jsx lives!
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

  const currentlyVisibleRef = useRef(null);
  const previousCategoryRef = useRef(null);

  // -------------------------
  // SESSION TIMER
  // -------------------------
 useEffect(() => {
    if (!isTracking) return; // 🛑 STOP IF PAUSED
    const timer = setInterval(() => {
      setActiveTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isTracking]); // Add isTracking to dependencies

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
  // HOVER & ACTIONS
  // -------------------------
  const handleHover = (category) => {
    if (!isTracking) return;
    addEvent("hover", category);
    addLog(`[HOVER] ${category}`);
  };

  const handleAction = (action, category) => {
    if (!isTracking) return;
    addEvent(action, category);
    addLog(`[${action.toUpperCase()}] ${category}`);
  };

  // -------------------------
  // DWELL TIME ENGINE
  // -------------------------
  useEffect(() => {
    if (!isTracking) return; // 🛑 STOP IF PAUSED
    const dwellTimer = setInterval(() => {
      if (!currentlyVisibleRef.current) return;
      addEvent("dwell", currentlyVisibleRef.current, { duration: 100 });
    }, 100);
    return () => clearInterval(dwellTimer);
  }, [activeTime, isTracking]); // Add isTracking to dependencies

  // -------------------------
  // CATEGORY METRICS
  // -------------------------
  const metrics = useMemo(() => {
    const base = {};
    CONTENT_DATABASE.forEach((item) => {
      if (!base[item.category]) {
        base[item.category] = { views: 0, hovers: 0, likes: 0, saves: 0, dislikes: 0, expands: 0, dwellTime: 0 };
      }
    });

    events.forEach((event) => {
      const cat = event.category;
      if (!base[cat]) return;
      switch (event.type) {
        case "view": base[cat].views++; break;
        case "hover": base[cat].hovers++; break;
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
    const categoriesVisited = Object.keys(metrics).filter((cat) => metrics[cat].views > 0).length;
    const totalSaves = Object.values(metrics).reduce((sum, cat) => sum + cat.saves, 0);
    const totalDwell = Object.values(metrics).reduce((sum, cat) => sum + cat.dwellTime, 0);
    const totalViews = Object.values(metrics).reduce((sum, cat) => sum + cat.views, 0);

    return {
      explorer: Math.min(100, categoriesVisited * 15),
      collector: Math.min(100, totalSaves * 15),
      researcher: Math.min(100, Math.floor(totalDwell / 5000)),
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
  timeline,
  attentionShifts,
  logs,

  selectedRecommendation,
  setSelectedRecommendation,

  handleView,
  handleHover,
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