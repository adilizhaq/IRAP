import React from 'react';
import { Code, Gamepad2, Tv, Activity, Brain, Rocket, DollarSign, Microscope, Car, Lightbulb, Clock, Cpu } from 'lucide-react';

export const DEEP_DATABASE = {
  programming: [
    { title: "Advanced React Server Components", desc: "A deep dive into caching, streaming, and optimizing modern React architecture.", type: "Video", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop", icon: <Code size={16}/>, color: "blue" },
    { title: "Python Machine Learning from Scratch", desc: "Build a neural network without external libraries to understand the core math.", type: "Article", img: "https://images.unsplash.com/photo-1555949963-aa79dcee57d5?q=80&w=1000&auto=format&fit=crop", icon: <Code size={16}/>, color: "purple" },
    { title: "System Design Interview Prep", desc: "How to design scalable microservices for millions of concurrent users.", type: "Course", img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop", icon: <Code size={16}/>, color: "cyan" }
  ],
  gaming: [
    { title: "Next-Gen Engine Rendering Tech", desc: "Analyzing the lighting and polygon counts of the latest Unreal Engine 5 releases.", type: "Video", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop", icon: <Gamepad2 size={16}/>, color: "emerald" },
    { title: "Esports Tournament Highlights", desc: "The biggest plays, tactical shifts, and meta changes from the weekend.", type: "Article", img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop", icon: <Gamepad2 size={16}/>, color: "teal" },
    { title: "Mechanical Keyboard Switch Guide", desc: "Finding the perfect actuation force for competitive gaming.", type: "Hardware", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop", icon: <Gamepad2 size={16}/>, color: "green" }
  ],
  anime: [
    { title: "Studio Ghibli Animation Techniques", desc: "How traditional hand-drawn frames are blended with digital composition.", type: "Video", img: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop", icon: <Tv size={16}/>, color: "rose" },
    { title: "1/4 Scale Resin Statue Showcase", desc: "A detailed unboxing and quality review of the latest collector's piece.", type: "Review", img: "https://images.unsplash.com/photo-1601850494422-3fb19e13f072?q=80&w=1000&auto=format&fit=crop", icon: <Tv size={16}/>, color: "pink" },
    { title: "Winter Season Manga Tier List", desc: "Ranking the upcoming adaptations based on source material quality.", type: "Article", img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop", icon: <Tv size={16}/>, color: "fuchsia" }
  ],
  sports: [
    { title: "Data Analytics in Modern Football", desc: "How expected goals (xG) and heat maps are changing managerial decisions.", type: "Article", img: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1000&auto=format&fit=crop", icon: <Activity size={16}/>, color: "orange" },
    { title: "Athletic Recovery Science", desc: "Optimizing sleep, nutrition, and cold exposure for peak physical output.", type: "Video", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop", icon: <Activity size={16}/>, color: "amber" },
    { title: "Pro Running Cleats Comparison", desc: "Testing traction and weight distribution across the top 3 brands.", type: "Review", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop", icon: <Activity size={16}/>, color: "yellow" }
  ],
  ai: [
    { title: "Training LoRA Models Locally", desc: "Step-by-step guide to fine-tuning LLMs on consumer hardware.", type: "Tutorial", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop", icon: <Brain size={16}/>, color: "purple" },
    { title: "The Future of Autonomous Agents", desc: "How LangChain and AutoGPT are changing software development.", type: "Article", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", icon: <Brain size={16}/>, color: "fuchsia" },
    { title: "Vector Databases Explained", desc: "Understanding Pinecone, Milvus, and embedding math.", type: "Video", img: "https://images.unsplash.com/photo-1555949963-aa79dcee57d5?q=80&w=1000&auto=format&fit=crop", icon: <Brain size={16}/>, color: "blue" }
  ],
  startups: [
    { title: "Y Combinator Pitch Deck Teardown", desc: "Analyzing the slides that secured $2M in seed funding.", type: "Case Study", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=1000&auto=format&fit=crop", icon: <Rocket size={16}/>, color: "orange" },
    { title: "Finding B2B SaaS Product-Market Fit", desc: "When to pivot and when to double down on your core feature.", type: "Article", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop", icon: <Rocket size={16}/>, color: "amber" },
    { title: "Zero to $10k MRR Guide", desc: "Actionable steps for solo founders bootstrapping their first app.", type: "Course", img: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1000&auto=format&fit=crop", icon: <Rocket size={16}/>, color: "yellow" }
  ],
  finance: [
    { title: "Macroeconomic Trends 2026", desc: "How shifting interest rates are impacting venture capital flow.", type: "Report", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1000&auto=format&fit=crop", icon: <DollarSign size={16}/>, color: "emerald" },
    { title: "Algorithmic Trading Bot in Python", desc: "Using historical market data to backtest a moving average strategy.", type: "Tutorial", img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop", icon: <DollarSign size={16}/>, color: "teal" },
    { title: "Personal Tax Optimization", desc: "Legal frameworks for freelancers and independent contractors.", type: "Guide", img: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop", icon: <DollarSign size={16}/>, color: "green" }
  ],
  psychology: [
    { title: "Dopamine Detox Protocols", desc: "Resetting your baseline reward systems after heavy social media use.", type: "Science", img: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1000&auto=format&fit=crop", icon: <Microscope size={16}/>, color: "rose" },
    { title: "Cognitive Biases in UI Design", desc: "How digital interfaces manipulate user behavior through dark patterns.", type: "Article", img: "https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1000&auto=format&fit=crop", icon: <Microscope size={16}/>, color: "pink" },
    { title: "The Flow State Formula", desc: "Neuroscience-backed methods for achieving deep, uninterrupted focus.", type: "Video", img: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1000&auto=format&fit=crop", icon: <Microscope size={16}/>, color: "fuchsia" }
  ],
  cars: [
    { title: "Aerodynamics of F1 2026", desc: "Visualizing the air-flow changes under the new regulation standards.", type: "Video", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop", icon: <Car size={16}/>, color: "red" },
    { title: "GT3 RS Telemetry Breakdown", desc: "Analyzing braking points and cornering G-forces at the Nürburgring.", type: "Analysis", img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop", icon: <Car size={16}/>, color: "orange" },
    { title: "EV Solid-State Battery Tech", desc: "When will charging times finally match internal combustion refueling?", type: "Article", img: "https://images.unsplash.com/photo-1593941707882-a5bba14938cb?q=80&w=1000&auto=format&fit=crop", icon: <Car size={16}/>, color: "blue" }
  ],
  entrepreneurship: [
    { title: "Lean Startup Principles", desc: "Validating your core hypothesis before writing a single line of code.", type: "Guide", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop", icon: <Lightbulb size={16}/>, color: "amber" },
    { title: "Building B2B Flywheels", desc: "Creating systems where your customers do the marketing for you.", type: "Strategy", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", icon: <Lightbulb size={16}/>, color: "yellow" },
    { title: "Remote Team Leadership", desc: "Managing asynchronous engineering teams across different time zones.", type: "Article", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop", icon: <Lightbulb size={16}/>, color: "orange" }
  ],
  productivity: [
    { title: "Zettelkasten Note-Taking", desc: "Building a personal knowledge graph using Obsidian or Roam Research.", type: "System", img: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1000&auto=format&fit=crop", icon: <Clock size={16}/>, color: "cyan" },
    { title: "Time Blocking Frameworks", desc: "Calendar management strategies to protect your deep work sessions.", type: "Video", img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1000&auto=format&fit=crop", icon: <Clock size={16}/>, color: "blue" },
    { title: "Auditing Cognitive Load", desc: "Minimizing context switching to prevent end-of-day mental fatigue.", type: "Article", img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop", icon: <Clock size={16}/>, color: "teal" }
  ],
  technology: [
    { title: "Quantum Computing 101", desc: "Understanding qubits, superposition, and the threat to RSA encryption.", type: "Explainer", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop", icon: <Cpu size={16}/>, color: "sky" },
    { title: "AR/VR Optical Lenses", desc: "The engineering challenges behind creating lightweight micro-OLED displays.", type: "Hardware", img: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000&auto=format&fit=crop", icon: <Cpu size={16}/>, color: "blue" },
    { title: "Silicon Wafer Fabrication", desc: "Inside the extreme ultraviolet lithography machines powering modern chips.", type: "Article", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop", icon: <Cpu size={16}/>, color: "indigo" }
  ]
};