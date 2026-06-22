/* ==========================================================================
   THE PEPTIDE APP - SYSTEM ARCHITECTURE & LOGIC
   Vanilla JavaScript Router, State Machine, SVG Renderer, and Confetti Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // --- Core State Management ---
  const state = {
    user: {
      name: "Alex",
      goal: "healing",
      experience: "beginner",
      onboarded: false
    },
    activeProtocol: null, // The currently active running protocol
    customProtocols: [],   // Custom created protocols
    doseLogs: {},          // Injection history by date key: {"YYYY-MM-DD": [peptideId, ...]}
    metrics: {             // Outward health outcomes metrics log
      weight: [],
      energy: [],
      pain: []
    },
    streak: 0,
    lastLogDate: null,
    darkTheme: false
  };

  // --- Initialize App ---
  function init() {
    loadStateFromStorage();
    setupConfetti();
    setupRouting();
    setupOnboarding();
    setupTodayDashboard();
    setupExploreProtocols();
    setupReconstitutionCalc();
    setupPeptideLibrary();
    setupProfileSettings();
    updateSystemTheme();
    updateStatusBarTime();
    
    // Fade out loading screen and display onboarding if required
    setTimeout(() => {
      const loader = document.getElementById("loading-screen");
      if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 400);
      }
      
      if (!state.user.onboarded) {
        const onboarding = document.getElementById("onboarding-overlay");
        onboarding.classList.remove("hidden");
      }
    }, 800);
  }

  // --- LocalStorage Integration ---
  function loadStateFromStorage() {
    if (localStorage.getItem("peptide_user_onboarded") === "true") {
      state.user.onboarded = true;
      state.user.name = localStorage.getItem("peptide_user_name") || "Alex";
      state.user.goal = localStorage.getItem("peptide_user_goal") || "healing";
      state.user.experience = localStorage.getItem("peptide_user_experience") || "beginner";
      
      state.activeProtocol = JSON.parse(localStorage.getItem("peptide_active_protocol"));
      state.customProtocols = JSON.parse(localStorage.getItem("peptide_custom_protocols")) || [];
      state.doseLogs = JSON.parse(localStorage.getItem("peptide_dose_logs")) || {};
      state.metrics = JSON.parse(localStorage.getItem("peptide_metrics")) || { weight: [], energy: [], pain: [] };
      state.streak = parseInt(localStorage.getItem("peptide_streak")) || 0;
      state.lastLogDate = localStorage.getItem("peptide_last_log_date");
      state.darkTheme = localStorage.getItem("peptide_dark_theme") === "true";
      
      // Auto-validate active protocol dates and weeks
      if (state.activeProtocol) {
        calculateProtocolProgress();
      }
    } else {
      state.user.onboarded = false;
    }
  }

  function saveStateToStorage() {
    localStorage.setItem("peptide_user_onboarded", state.user.onboarded);
    localStorage.setItem("peptide_user_name", state.user.name);
    localStorage.setItem("peptide_user_goal", state.user.goal);
    localStorage.setItem("peptide_user_experience", state.user.experience);
    localStorage.setItem("peptide_active_protocol", JSON.stringify(state.activeProtocol));
    localStorage.setItem("peptide_custom_protocols", JSON.stringify(state.customProtocols));
    localStorage.setItem("peptide_dose_logs", JSON.stringify(state.doseLogs));
    localStorage.setItem("peptide_metrics", JSON.stringify(state.metrics));
    localStorage.setItem("peptide_streak", state.streak);
    localStorage.setItem("peptide_last_log_date", state.lastLogDate);
    localStorage.setItem("peptide_dark_theme", state.darkTheme);
  }

  function calculateProtocolProgress() {
    if (!state.activeProtocol || !state.activeProtocol.startDate) return;
    
    const start = new Date(state.activeProtocol.startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate current week of cycle
    const currentWeek = Math.min(
      Math.ceil(diffDays / 7) || 1, 
      state.activeProtocol.duration || 8
    );
    state.activeProtocol.currentWeek = currentWeek;
  }

  // --- Confetti particle system ---
  let confettiCtx;
  let confettiCanvas;
  let particles = [];
  
  function setupConfetti() {
    confettiCanvas = document.getElementById("confetti-canvas");
    confettiCtx = confettiCanvas.getContext("2d");
    
    // Resize canvas to match screen dimensions
    const resizeCanvas = () => {
      confettiCanvas.width = confettiCanvas.parentElement.clientWidth;
      confettiCanvas.height = confettiCanvas.parentElement.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }

  function spawnConfetti(x, y) {
    const colors = ["#c75f46", "#3fbe6b", "#f2ebdd", "#a8bfae", "#d66e56", "#ffd700"];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.7) * 12 - 2,
        radius: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        decay: Math.random() * 0.02 + 0.015
      });
    }
    if (particles.length === 40) {
      requestAnimationFrame(updateConfetti);
    }
  }

  function updateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // Gravity
      p.vx *= 0.98; // Friction
      p.opacity -= p.decay;
      
      confettiCtx.beginPath();
      confettiCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      confettiCtx.fillStyle = p.color;
      confettiCtx.globalAlpha = Math.max(p.opacity, 0);
      confettiCtx.fill();
      
      if (p.opacity <= 0 || p.y > confettiCanvas.height) {
        particles.splice(i, 1);
      }
    }
    
    if (particles.length > 0) {
      requestAnimationFrame(updateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // --- Routing & Tab Management ---
  function setupRouting() {
    const navTabs = document.querySelectorAll(".bottom-nav .nav-tab");
    const screens = document.querySelectorAll(".screen-content .screen");

    navTabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = tab.getAttribute("data-tab");
        
        // Remove active from all tabs
        navTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        // Show target screen
        screens.forEach(screen => {
          screen.classList.remove("active");
          if (screen.id === `screen-${targetTab}`) {
            screen.classList.add("active");
          }
        });

        // Trigger updates depending on tab navigation
        if (targetTab === "today") {
          setupTodayDashboard();
        } else if (targetTab === "profile") {
          renderHistoryCalendar();
          updateMetricsDisplay();
        } else if (targetTab === "explore") {
          renderExploreProtocols();
        }
      });
    });
  }

  function updateStatusBarTime() {
    const timeEl = document.getElementById("status-time");
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      minutes = minutes < 10 ? "0" + minutes : minutes;
      timeEl.textContent = `${hours}:${minutes}`;
    };
    updateTime();
    setInterval(updateTime, 60000);
  }

  // --- Onboarding Logic ---
  function setupOnboarding() {
    const step1 = document.getElementById("onboard-step-1");
    const step2 = document.getElementById("onboard-step-2");
    const step3 = document.getElementById("onboard-step-3");
    
    const btnNext1 = document.getElementById("btn-onboard-1");
    const btnNext2 = document.getElementById("btn-onboard-2");
    const btnSubmit = document.getElementById("btn-onboard-3");
    
    const btnBack2 = document.getElementById("btn-onboard-back-2");
    const btnBack3 = document.getElementById("btn-onboard-back-3");
    
    const goalOptions = document.querySelectorAll(".goal-option");
    const expOptions = document.querySelectorAll(".exp-option");
    const nameInput = document.getElementById("username-input");

    // Goal Selection
    goalOptions.forEach(opt => {
      opt.addEventListener("click", () => {
        goalOptions.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        state.user.goal = opt.getAttribute("data-goal");
        btnNext1.classList.remove("btn-disabled");
      });
    });

    // Experience Selection
    expOptions.forEach(opt => {
      opt.addEventListener("click", () => {
        expOptions.forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        state.user.experience = opt.getAttribute("data-exp");
        btnNext2.classList.remove("btn-disabled");
      });
    });

    // Navigation triggers
    btnNext1.addEventListener("click", () => {
      step1.classList.remove("active");
      step2.classList.add("active");
    });

    btnBack2.addEventListener("click", () => {
      step2.classList.remove("active");
      step1.classList.add("active");
    });

    btnNext2.addEventListener("click", () => {
      step2.classList.remove("active");
      step3.classList.add("active");
    });

    btnBack3.addEventListener("click", () => {
      step3.classList.remove("active");
      step2.classList.add("active");
    });

    // Complete Onboarding
    btnSubmit.addEventListener("click", () => {
      const name = nameInput.value.trim();
      state.user.name = name !== "" ? name : "Alex";
      state.user.onboarded = true;
      
      // Auto-assign starter protocol matching selected goal
      let defaultProtoId = "injury-repair"; // Healing
      if (state.user.goal === "longevity") defaultProtoId = "gh-longevity";
      else if (state.user.goal === "fat-loss") defaultProtoId = "metabolic-slim";
      else if (state.user.goal === "skin") defaultProtoId = "injury-repair"; // Fallback to healing GHK stack could go here
      
      const proto = window.CURATED_PROTOCOLS.find(p => p.id === defaultProtoId);
      if (proto) {
        state.activeProtocol = {
          ...proto,
          startDate: new Date().toISOString().split("T")[0],
          currentWeek: 1
        };
      }

      saveStateToStorage();
      
      // Close onboarding transition
      const onboarding = document.getElementById("onboarding-overlay");
      onboarding.classList.add("hidden");
      
      // Load UI displays
      setupTodayDashboard();
      updateSystemTheme();
    });
  }

  // --- Today Dashboard (Tab 1) ---
  function setupTodayDashboard() {
    const greetingEl = document.getElementById("dash-greeting");
    const goalEl = document.getElementById("dash-goal");
    const avatarEl = document.getElementById("dash-avatar");
    const checklistContainer = document.getElementById("dash-checklist");
    const checklistCount = document.getElementById("checklist-count");
    const activeCard = document.getElementById("dash-active-protocol-card");
    
    // Set static profile detail elements
    greetingEl.textContent = `Hey, ${state.user.name}`;
    avatarEl.textContent = state.user.name.charAt(0).toUpperCase();
    
    const goalLabels = {
      healing: "Recovery Mode 🩹",
      longevity: "Longevity Cycle 🧬",
      "fat-loss": "Appetite Control 🔥",
      skin: "Collagen Mode ✨"
    };
    goalEl.textContent = goalLabels[state.user.goal] || "Peptide Research";

    // Set Date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById("dash-date").textContent = new Date().toLocaleDateString("en-US", options);

    // Load active protocol card detail
    if (state.activeProtocol) {
      activeCard.style.display = "block";
      document.getElementById("dash-protocol-name").textContent = state.activeProtocol.name;
      document.getElementById("dash-protocol-desc").textContent = state.activeProtocol.description;
      document.getElementById("dash-protocol-weeks").textContent = `Week ${state.activeProtocol.currentWeek} of ${state.activeProtocol.duration}`;
      
      renderDailyChecklist(checklistContainer, checklistCount);
    } else {
      activeCard.style.display = "none";
      checklistCount.textContent = "0 / 0";
      checklistContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🩹</div>
          <h3 class="empty-title">No Active Protocol</h3>
          <p class="empty-desc">Explore science-backed stacks to match your goals and start tracking outcomes.</p>
          <button class="btn btn-primary btn-secondary" id="btn-dash-explore-redirect" style="padding: 10px 20px; font-size: 0.85rem;">Find a Protocol</button>
        </div>
      `;
      
      document.getElementById("btn-dash-explore-redirect").addEventListener("click", () => {
        document.querySelector(".bottom-nav .nav-tab[data-tab='explore']").click();
      });
      
      updateProgressRing(0, 0);
    }

    updateStreakDisplay();
  }

  function renderDailyChecklist(container, countEl) {
    container.innerHTML = "";
    
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    const dateKey = today.toISOString().split("T")[0];
    
    // Gather scheduled doses for today
    const scheduledDoses = [];
    
    state.activeProtocol.peptides.forEach((pep, index) => {
      let isScheduled = false;
      
      // Calculate scheduling condition based on frequency
      if (pep.frequency === "daily") {
        isScheduled = true;
      } else if (pep.frequency === "weekly") {
        // Active weekly on the same day as protocol start
        const startDay = new Date(state.activeProtocol.startDate).getDay();
        isScheduled = (dayOfWeek === startDay);
      } else if (pep.frequency === "twice-weekly") {
        // Active on Tue (2) & Fri (5)
        isScheduled = (dayOfWeek === 2 || dayOfWeek === 5);
      } else if (pep.frequency === "cyclical") {
        // 5 Days On / 2 Days Off calculation
        const start = new Date(state.activeProtocol.startDate);
        const diffTime = Math.abs(today - start);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        isScheduled = (diffDays % 7 < 5);
      }
      
      if (isScheduled) {
        scheduledDoses.push({
          ...pep,
          uniqueId: `${pep.peptideId}-${index}`
        });
      }
    });

    if (scheduledDoses.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 24px 10px;">
          <div class="empty-icon font-emoji" style="font-size: 1.8rem; margin-bottom: 8px;">😴</div>
          <h4 class="empty-title" style="font-size: 0.95rem;">Rest Day</h4>
          <p class="empty-desc" style="font-size: 0.75rem; margin-bottom: 0;">No doses scheduled for today on your protocol cycle.</p>
        </div>
      `;
      countEl.textContent = "0 / 0";
      updateProgressRing(0, 0);
      return;
    }

    // Get today's logs
    const todaysLogs = state.doseLogs[dateKey] || [];
    let completedCount = 0;

    scheduledDoses.forEach(dose => {
      const isTaken = todaysLogs.some(log => log.uniqueId === dose.uniqueId);
      if (isTaken) completedCount++;

      const pepInfo = window.PEPTIDE_LIBRARY.find(p => p.id === dose.peptideId) || { name: dose.peptideId.toUpperCase() };

      const item = document.createElement("div");
      item.className = `dose-item ${isTaken ? 'taken' : ''}`;
      
      const badgeTimeClass = dose.instructions.toLowerCase().includes("night") || dose.frequencyLabel.toLowerCase().includes("night") ? "badge-time" : "";
      
      item.innerHTML = `
        <div class="dose-details">
          <span class="dose-peptide">${pepInfo.name}</span>
          <span class="dose-instruction">${dose.instructions}</span>
          <div class="dose-meta">
            <span class="badge-tag">${dose.dose}${dose.unit}</span>
            <span class="badge-tag ${badgeTimeClass}">${dose.frequencyLabel}</span>
          </div>
        </div>
        <div class="log-checkbox ${isTaken ? 'checked' : ''}" data-id="${dose.uniqueId}">
          <svg viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      `;

      // Checkbox click action
      const checkbox = item.querySelector(".log-checkbox");
      checkbox.addEventListener("click", (e) => {
        const checkboxRect = checkbox.getBoundingClientRect();
        const containerRect = document.querySelector(".iphone-screen").getBoundingClientRect();
        const x = checkboxRect.left - containerRect.left + (checkboxRect.width / 2);
        const y = checkboxRect.top - containerRect.top + (checkboxRect.height / 2);
        
        toggleDoseLog(dose.uniqueId, x, y);
      });

      container.appendChild(item);
    });

    countEl.textContent = `${completedCount} / ${scheduledDoses.length}`;
    updateProgressRing(completedCount, scheduledDoses.length);
  }

  function toggleDoseLog(uniqueId, clickX, clickY) {
    const today = new Date();
    const dateKey = today.toISOString().split("T")[0];
    
    if (!state.doseLogs[dateKey]) {
      state.doseLogs[dateKey] = [];
    }

    const index = state.doseLogs[dateKey].findIndex(log => log.uniqueId === uniqueId);
    
    if (index === -1) {
      // Add Log
      state.doseLogs[dateKey].push({
        uniqueId: uniqueId,
        time: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      
      // Trigger confetti particle burst from checkbox position
      spawnConfetti(clickX, clickY);
      
      // Calculate Streaks
      updateStreakOnDoseLog(dateKey);
    } else {
      // Remove Log
      state.doseLogs[dateKey].splice(index, 1);
      if (state.doseLogs[dateKey].length === 0) {
        delete state.doseLogs[dateKey];
      }
      
      // Validate streak status
      recalculateStreak();
    }

    saveStateToStorage();
    setupTodayDashboard();
  }

  function updateProgressRing(completed, total) {
    const circle = document.getElementById("dash-progress-circle");
    const percentEl = document.getElementById("dash-progress-percent");
    const titleEl = document.getElementById("dash-progress-title");
    const descEl = document.getElementById("dash-progress-subtitle");
    
    if (total === 0) {
      circle.style.strokeDashoffset = 251.2;
      percentEl.textContent = "0%";
      return;
    }

    const percent = Math.round((completed / total) * 100);
    percentEl.textContent = `${percent}%`;

    // 251.2 is the circumference of circle (r=40: 2 * PI * 40 = 251.3)
    const offset = 251.2 - (251.2 * percent / 100);
    circle.style.strokeDashoffset = offset;

    // Header messages
    if (percent === 0) {
      titleEl.textContent = "Starting Today";
      descEl.textContent = "Log your scheduled doses to fill your day's ring.";
    } else if (percent < 100) {
      titleEl.textContent = "Progress In Motion";
      descEl.textContent = `${completed} of ${total} doses taken. You are almost complete.`;
    } else {
      titleEl.textContent = "Perfect Compliance! 🎉";
      descEl.textContent = "All scheduled protocol doses logged. Your cellular markers thank you.";
    }
  }

  function updateStreakOnDoseLog(todayDateKey) {
    // If today is already logged, verify if it was contiguous with lastLogDate
    if (state.lastLogDate) {
      const lastLog = new Date(state.lastLogDate);
      const today = new Date(todayDateKey);
      const diffTime = Math.abs(today - lastLog);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        state.streak += 1;
        state.lastLogDate = todayDateKey;
      } else if (diffDays > 1) {
        state.streak = 1;
        state.lastLogDate = todayDateKey;
      }
    } else {
      state.streak = 1;
      state.lastLogDate = todayDateKey;
    }
  }

  function recalculateStreak() {
    // Basic streak check: check if any log exists for yesterday or today
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    const hasToday = state.doseLogs[todayStr] && state.doseLogs[todayStr].length > 0;
    const hasYesterday = state.doseLogs[yesterdayStr] && state.doseLogs[yesterdayStr].length > 0;
    
    if (!hasToday && !hasYesterday) {
      state.streak = 0;
      state.lastLogDate = null;
    }
  }

  function updateStreakDisplay() {
    const banner = document.getElementById("dash-streak-banner");
    const streakDaysEl = document.getElementById("dash-streak-days");
    
    if (state.streak > 0) {
      banner.style.display = "flex";
      streakDaysEl.textContent = `${state.streak} Day Streak!`;
    } else {
      banner.style.display = "none";
    }
  }

  // --- Explore Protocols (Tab 2) ---
  let exploreFilter = "all";
  
  function setupExploreProtocols() {
    const chips = document.querySelectorAll("#explore-chips .chip");
    chips.forEach(chip => {
      chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        exploreFilter = chip.getAttribute("data-filter");
        renderExploreProtocols();
      });
    });

    // Custom Builder trigger
    document.getElementById("btn-custom-protocol-trigger").addEventListener("click", () => {
      openCustomProtocolBuilder();
    });

    // Handle Custom Protocol creation
    const form = document.getElementById("custom-protocol-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      createCustomProtocol();
    });

    // Back buttons
    document.getElementById("btn-protocol-detail-back").addEventListener("click", () => {
      document.getElementById("protocol-detail-overlay").classList.remove("active");
    });
    
    document.getElementById("btn-builder-back").addEventListener("click", () => {
      document.getElementById("protocol-builder-overlay").classList.remove("active");
    });
  }

  function renderExploreProtocols() {
    const container = document.getElementById("explore-protocols-list");
    container.innerHTML = "";

    // Combine standard and custom protocols
    const allProtocols = [...window.CURATED_PROTOCOLS, ...state.customProtocols];
    
    const filtered = allProtocols.filter(p => exploreFilter === "all" || p.goal === exploreFilter);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 20px 0;">
          <p class="empty-desc">No protocols found matching this goal filter.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(proto => {
      const card = document.createElement("div");
      card.className = "card protocol-card";
      
      const compoundsHtml = proto.peptides.map(pep => {
        const pepInfo = window.PEPTIDE_LIBRARY.find(p => p.id === pep.peptideId) || { name: pep.peptideId.toUpperCase() };
        return `<span class="compound-tag">${pepInfo.name}</span>`;
      }).join(" ");

      card.innerHTML = `
        <div class="protocol-header">
          <h3 class="protocol-name">${proto.name}</h3>
          <span class="protocol-difficulty">${proto.difficulty}</span>
        </div>
        <p class="protocol-desc">${proto.description}</p>
        <div class="protocol-meta">
          <span class="protocol-duration">⏱️ ${proto.duration} Weeks</span>
          <div class="protocol-compounds">${compoundsHtml}</div>
        </div>
      `;

      card.addEventListener("click", () => {
        openProtocolDetailOverlay(proto);
      });

      container.appendChild(card);
    });
  }

  function openProtocolDetailOverlay(proto) {
    const overlay = document.getElementById("protocol-detail-overlay");
    document.getElementById("overlay-protocol-name").textContent = proto.name;
    document.getElementById("overlay-protocol-desc-text").textContent = proto.description;
    
    // Render checklist view inside detail overlay
    const listContainer = document.getElementById("overlay-peptides-list");
    const learnContainer = document.getElementById("overlay-learn-list");
    const sourcesContainer = document.getElementById("overlay-sources-list");
    
    listContainer.innerHTML = "";
    learnContainer.innerHTML = "";
    sourcesContainer.innerHTML = "";

    proto.peptides.forEach(pep => {
      const pepInfo = window.PEPTIDE_LIBRARY.find(p => p.id === pep.peptideId) || {
        name: pep.peptideId.toUpperCase(),
        mechanism: "Mechanism details not loaded.",
        sources: []
      };
      
      // 1. Schedule Tab list item
      const item = document.createElement("div");
      item.className = "detail-peptide-card";
      item.innerHTML = `
        <div class="detail-peptide-name">
          <span>${pepInfo.name}</span>
          <span class="detail-peptide-dose">${pep.dose}${pep.unit}</span>
        </div>
        <div class="detail-peptide-freq">Frequency: ${pep.frequencyLabel}</div>
        <div class="detail-peptide-desc">${pep.instructions}</div>
      `;
      listContainer.appendChild(item);

      // 2. Learn Tab details
      const learnCard = document.createElement("div");
      learnCard.className = "detail-peptide-card";
      learnCard.innerHTML = `
        <h4 style="font-family: var(--font-heading); font-weight: 800; font-size: 0.95rem; margin-bottom: 4px;">${pepInfo.name} Mechanism</h4>
        <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4;">${pepInfo.mechanism}</p>
      `;
      learnContainer.appendChild(learnCard);

      // 3. Sources Tab details
      pepInfo.sources.forEach(src => {
        const srcLi = document.createElement("li");
        srcLi.className = "source-item";
        srcLi.textContent = src;
        sourcesContainer.appendChild(srcLi);
      });
    });

    if (sourcesContainer.children.length === 0) {
      sourcesContainer.innerHTML = `<li class="source-item">Citations verified internally against clinical guidelines.</li>`;
    }

    // Detail overlay sub-tab switching
    const tabs = overlay.querySelectorAll(".detail-tab");
    const contents = overlay.querySelectorAll(".detail-tab-content");
    
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        const targetContent = tab.getAttribute("data-detail-tab");
        contents.forEach(content => {
          content.classList.remove("active");
          if (content.id === `detail-tab-${targetContent}`) {
            content.classList.add("active");
          }
        });
      });
    });

    // Activate tab schedule by default
    overlay.querySelector(".detail-tab[data-detail-tab='schedule']").click();

    // Start Protocol button
    const startBtn = document.getElementById("btn-start-protocol");
    startBtn.onclick = () => {
      state.activeProtocol = {
        ...proto,
        startDate: new Date().toISOString().split("T")[0],
        currentWeek: 1
      };
      saveStateToStorage();
      overlay.classList.remove("active");
      
      // Redirect to Today dashboard
      document.querySelector(".bottom-nav .nav-tab[data-tab='today']").click();
    };

    overlay.classList.add("active");
  }

  function openCustomProtocolBuilder() {
    const overlay = document.getElementById("protocol-builder-overlay");
    const selectEl = document.getElementById("build-peptide");
    
    selectEl.innerHTML = "";
    window.PEPTIDE_LIBRARY.forEach(pep => {
      const opt = document.createElement("option");
      opt.value = pep.id;
      opt.textContent = `${pep.name} (${pep.fullName})`;
      selectEl.appendChild(opt);
    });

    overlay.classList.add("active");
  }

  function createCustomProtocol() {
    const name = document.getElementById("build-name").value;
    const pepId = document.getElementById("build-peptide").value;
    const dose = parseInt(document.getElementById("build-dose").value);
    const unit = document.getElementById("build-unit").value;
    const freq = document.getElementById("build-frequency").value;
    const duration = parseInt(document.getElementById("build-duration").value);
    const reminder = document.getElementById("build-reminder").value;

    const freqLabels = {
      daily: "Daily",
      weekly: "Once a Week",
      "twice-weekly": "Twice a Week",
      cyclical: "5 Days On / 2 Days Off"
    };

    const freqInstructions = {
      daily: `Inject ${dose}${unit} subcutaneously once a day.`,
      weekly: `Inject ${dose}${unit} subcutaneously once a week.`,
      "twice-weekly": `Inject ${dose}${unit} subcutaneously twice a week.`,
      cyclical: `Inject ${dose}${unit} subcutaneously for 5 days, followed by a 2-day break.`
    };

    const newProtocol = {
      id: "custom-" + Date.now(),
      name: name,
      description: `Custom stack with ${window.PEPTIDE_LIBRARY.find(p=>p.id===pepId).name}. Created dynamically.`,
      duration: duration,
      difficulty: "Intermediate",
      goal: state.user.goal,
      peptides: [
        {
          peptideId: pepId,
          dose: dose,
          unit: unit,
          frequency: freq,
          frequencyLabel: freqLabels[freq] + ` (${reminder})`,
          instructions: freqInstructions[freq]
        }
      ]
    };

    state.customProtocols.push(newProtocol);
    state.activeProtocol = {
      ...newProtocol,
      startDate: new Date().toISOString().split("T")[0],
      currentWeek: 1
    };

    saveStateToStorage();
    
    // Close overlays & forms
    document.getElementById("protocol-builder-overlay").classList.remove("active");
    document.getElementById("custom-protocol-form").reset();
    
    // Redirect to Dashboard
    document.querySelector(".bottom-nav .nav-tab[data-tab='today']").click();
  }

  // --- Reconstitution Calculator (Tab 3) ---
  function setupReconstitutionCalc() {
    const vialInput = document.getElementById("calc-vial-size");
    const bacInput = document.getElementById("calc-bac-water");
    const doseInput = document.getElementById("calc-dose");
    const syringeInput = document.getElementById("calc-syringe");

    const inputs = [vialInput, bacInput, doseInput, syringeInput];
    inputs.forEach(input => {
      input.addEventListener("input", calculateSyringeDraw);
      input.addEventListener("change", calculateSyringeDraw);
    });

    // Reconstitution steps accordion toggle
    const accordionHeaders = document.querySelectorAll(".accordion-item .accordion-header");
    accordionHeaders.forEach(header => {
      header.addEventListener("click", () => {
        const item = header.parentElement;
        const isActive = item.classList.contains("active");
        
        // Close all accordion items
        document.querySelectorAll(".accordion-item").forEach(i => i.classList.remove("active"));
        
        if (!isActive) {
          item.classList.add("active");
        }
      });
    });

    calculateSyringeDraw();
  }

  function calculateSyringeDraw() {
    const vialMg = parseFloat(document.getElementById("calc-vial-size").value) || 5;
    const bacMl = parseFloat(document.getElementById("calc-bac-water").value) || 2;
    const doseMcg = parseFloat(document.getElementById("calc-dose").value) || 250;
    const syringeSize = parseInt(document.getElementById("calc-syringe").value) || 100;

    const unitsResultEl = document.getElementById("calc-units-result");
    const volumeResultEl = document.getElementById("calc-volume-result");
    const instructionEl = document.getElementById("calc-instruction-text");
    const warningEl = document.getElementById("syringe-warning");

    // Reconstitution Math:
    // Total mcg = vialMg * 1000
    // Concentration = Total mcg / bacMl (mcg per 1ml)
    // Syringe has syringeSize units inside 1ml.
    // So unitsToDraw = (doseMcg / Concentration) * syringeSize
    // Which resolves to:
    // unitsToDraw = (doseMcg / (vialMg * 1000)) * bacMl * syringeSize
    
    const totalMcg = vialMg * 1000;
    const unitsToDraw = (doseMcg / totalMcg) * bacMl * syringeSize;
    const volumeMl = (doseMcg / totalMcg) * bacMl;

    const roundedUnits = Math.round(unitsToDraw * 10) / 10;
    unitsResultEl.textContent = roundedUnits.toFixed(1);
    volumeResultEl.textContent = `(${volumeMl.toFixed(3)} ml)`;

    // Set draw instructions
    instructionEl.textContent = `Draw to the ${roundedUnits.toFixed(1)} unit mark on your ${syringeSize}-unit syringe.`;

    // Render Syringe Plunger Position SVG
    drawSyringePlunger(roundedUnits, syringeSize);

    // Show warnings if capacity exceeded
    if (roundedUnits > syringeSize) {
      warningEl.style.display = "block";
      unitsResultEl.style.color = "var(--accent-color)";
    } else {
      warningEl.style.display = "none";
      unitsResultEl.style.color = "var(--accent-color)";
    }
  }

  function drawSyringePlunger(unitsToDraw, syringeSize) {
    const svg = document.getElementById("syringe-svg");
    const fluid = document.getElementById("syringe-fluid");
    const seal = document.getElementById("syringe-seal");
    const sealLine = document.getElementById("syringe-seal-line");
    const shaft = document.getElementById("syringe-plunger-shaft");
    const thumbRest = document.getElementById("syringe-thumb-rest");
    const ticksGroup = document.getElementById("syringe-tick-marks");

    const BARREL_START_X = 30;
    const BARREL_WIDTH = 250;
    
    // Position fractional draw
    const fraction = Math.min(unitsToDraw / syringeSize, 1.25); // cap plunger pulling size
    const fillWidth = BARREL_WIDTH * Math.min(fraction, 1.0);
    const plungerX = BARREL_START_X + (BARREL_WIDTH * fraction);

    // Update fill shading width
    fluid.setAttribute("width", fillWidth);

    // Update plunger coordinate segments
    seal.setAttribute("x", plungerX);
    sealLine.setAttribute("x1", plungerX);
    sealLine.setAttribute("x2", plungerX);

    shaft.setAttribute("x", plungerX + 12);
    shaft.setAttribute("width", 322 - (plungerX + 12));

    thumbRest.setAttribute("x", 322 + (plungerX - BARREL_START_X - fillWidth)); // Keep end attached

    // Render Dynamic ticks based on syringe selected
    ticksGroup.innerHTML = "";
    
    let tickCount = 100;
    let labelInterval = 10;
    if (syringeSize === 50) {
      tickCount = 50;
      labelInterval = 5;
    } else if (syringeSize === 30) {
      tickCount = 30;
      labelInterval = 5;
    }

    const step = BARREL_WIDTH / tickCount;

    for (let i = 0; i <= tickCount; i++) {
      const x = BARREL_START_X + (i * step);
      const isLabel = (i % labelInterval === 0);
      const isMedium = (tickCount <= 50) ? (i % 1 === 0) : (i % 5 === 0);
      
      const tick = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tick.setAttribute("x1", x);
      tick.setAttribute("x2", x);
      
      if (isLabel) {
        tick.setAttribute("y1", 20);
        tick.setAttribute("y2", 34);
        tick.setAttribute("stroke", "var(--text-primary)");
        tick.setAttribute("stroke-width", "1.5");

        // Add text labels below ticks
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", 16);
        text.setAttribute("font-size", "7.5px");
        text.setAttribute("font-weight", "800");
        text.setAttribute("fill", "var(--text-secondary)");
        text.setAttribute("text-anchor", "middle");
        text.textContent = i;
        ticksGroup.appendChild(text);
      } else {
        tick.setAttribute("y1", 20);
        tick.setAttribute("y2", isMedium ? 28 : 24);
        tick.setAttribute("stroke", "var(--text-tertiary)");
        tick.setAttribute("stroke-width", "1");
      }
      
      ticksGroup.appendChild(tick);
    }
  }

  // --- Science & Peptide Library (Tab 4) ---
  function setupPeptideLibrary() {
    const searchInput = document.getElementById("library-search-input");
    searchInput.addEventListener("input", renderPeptideLibrary);

    // Back buttons
    document.getElementById("btn-peptide-detail-back").addEventListener("click", () => {
      document.getElementById("peptide-detail-overlay").classList.remove("active");
    });

    document.getElementById("btn-pep-calc-redirect").addEventListener("click", () => {
      document.getElementById("peptide-detail-overlay").classList.remove("active");
      
      // Redirect to Calculator Tab
      document.querySelector(".bottom-nav .nav-tab[data-tab='calculator']").click();
    });

    renderPeptideLibrary();
  }

  function renderPeptideLibrary() {
    const query = document.getElementById("library-search-input").value.toLowerCase().trim();
    const container = document.getElementById("library-peptides-list");
    container.innerHTML = "";

    const filtered = window.PEPTIDE_LIBRARY.filter(pep => {
      return pep.name.toLowerCase().includes(query) ||
             pep.fullName.toLowerCase().includes(query) ||
             pep.categoryLabel.toLowerCase().includes(query) ||
             pep.mechanism.toLowerCase().includes(query) ||
             pep.tagline.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 30px 0;">
          <p class="empty-desc">No peptides match your library search query.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(pep => {
      const item = document.createElement("div");
      item.className = "peptide-list-item";
      
      item.innerHTML = `
        <div class="peptide-info">
          <div class="peptide-name-row">
            <span class="peptide-title">${pep.name}</span>
            <span class="badge-tag" style="background-color: var(--bg-tertiary); font-size: 0.6rem;">${pep.categoryLabel}</span>
          </div>
          <p class="peptide-tagline">${pep.tagline}</p>
        </div>
        <span style="font-size: 1.1rem; color: var(--accent-color);">chevron_right ➔</span>
      `;

      item.addEventListener("click", () => {
        openPeptideDetailOverlay(pep);
      });

      container.appendChild(item);
    });
  }

  function openPeptideDetailOverlay(pep) {
    const overlay = document.getElementById("peptide-detail-overlay");
    document.getElementById("overlay-peptide-name").textContent = pep.name;
    document.getElementById("overlay-pep-fullname").textContent = pep.fullName;
    document.getElementById("overlay-pep-tagline").textContent = pep.tagline;
    document.getElementById("overlay-pep-cat").textContent = `Category: ${pep.categoryLabel}`;
    
    // Core content
    document.getElementById("overlay-pep-mechanism").textContent = pep.mechanism;
    document.getElementById("overlay-pep-recon").textContent = pep.reconstitution;

    // Render benefits list
    const benefitsContainer = document.getElementById("overlay-pep-benefits");
    benefitsContainer.innerHTML = "";
    pep.benefits.forEach(b => {
      const li = document.createElement("li");
      li.className = "source-item";
      li.textContent = b;
      benefitsContainer.appendChild(li);
    });

    // Render side effects
    const effectsContainer = document.getElementById("overlay-pep-effects");
    effectsContainer.innerHTML = "";
    pep.sideEffects.forEach(e => {
      const li = document.createElement("li");
      li.className = "source-item";
      li.textContent = e;
      effectsContainer.appendChild(li);
    });

    // Render typical doses
    const rangesContainer = document.getElementById("overlay-pep-ranges");
    rangesContainer.innerHTML = "";
    pep.typicalDoses.forEach(dose => {
      const div = document.createElement("div");
      div.className = "detail-peptide-card";
      div.innerHTML = `
        <div class="detail-peptide-name">
          <span>${dose.label}</span>
          <span class="detail-peptide-dose">${dose.value}${dose.unit}</span>
        </div>
      `;
      rangesContainer.appendChild(div);
    });

    // Render scientific sources
    const sourcesContainer = document.getElementById("overlay-pep-sources");
    sourcesContainer.innerHTML = "";
    pep.sources.forEach(src => {
      const li = document.createElement("li");
      li.className = "source-item";
      li.textContent = src;
      sourcesContainer.appendChild(li);
    });

    // Handle tab switching
    const tabs = overlay.querySelectorAll(".detail-tab");
    const contents = overlay.querySelectorAll(".detail-tab-content");
    
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        
        const targetContent = tab.getAttribute("data-pep-tab");
        contents.forEach(content => {
          content.classList.remove("active");
          if (content.id === `pep-tab-${targetContent}`) {
            content.classList.add("active");
          }
        });
      });
    });

    // Default to Science
    overlay.querySelector(".detail-tab[data-pep-tab='science']").click();

    // Redirect to calculator parameter inject action
    document.getElementById("btn-pep-calc-redirect").onclick = () => {
      overlay.classList.remove("active");
      
      // Inject details directly into calculator inputs
      document.getElementById("calc-vial-size").value = pep.defaultVialSize || 5;
      document.getElementById("calc-bac-water").value = pep.defaultBacWater || 2;
      document.getElementById("calc-dose").value = pep.typicalDoses[0].value;
      
      calculateSyringeDraw();
      
      // Open Calculator tab
      document.querySelector(".bottom-nav .nav-tab[data-tab='calculator']").click();
    };

    overlay.classList.add("active");
  }

  // --- Profile & Settings (Tab 5) ---
  let activeMetricModalType = "";

  function setupProfileSettings() {
    const toggle = document.getElementById("settings-dark-theme-toggle");
    toggle.checked = state.darkTheme;
    toggle.addEventListener("change", (e) => {
      state.darkTheme = e.target.checked;
      saveStateToStorage();
      updateSystemTheme();
    });

    // Avatar / Name setup
    document.getElementById("profile-name").textContent = state.user.name;
    document.getElementById("profile-avatar").textContent = state.user.name.charAt(0).toUpperCase();

    const goalLabels = {
      healing: "Goal: Healing & Recovery",
      longevity: "Goal: Longevity & Cellular Age",
      "fat-loss": "Goal: Fat Loss & Satiety",
      skin: "Goal: Skin & Dermal Elasticity"
    };
    document.getElementById("profile-goal").textContent = goalLabels[state.user.goal] || "Goal: Custom Protocol";

    // Setup Reset DB button
    document.getElementById("btn-reset-db").addEventListener("click", () => {
      openModal("Reset App Database?", "This will permanently erase all protocol logs, Local Storage configurations, and user settings. There is no undo.", "confirm_reset");
    });

    // Setup Export JSON button
    document.getElementById("btn-export-db").addEventListener("click", exportDatabaseJSON);

    // Setup Outcome Metric buttons
    document.getElementById("btn-log-weight").addEventListener("click", () => {
      activeMetricModalType = "weight";
      openModal("Log Body Weight", "Enter your current weight in pounds to log your outcome trend.", "metric_input");
    });

    document.getElementById("btn-log-energy").addEventListener("click", () => {
      activeMetricModalType = "energy";
      openModal("Log Energy Level", "Rate your subjective energy today from 1 (lethargic) to 10 (fully optimized).", "metric_input");
    });

    document.getElementById("btn-log-pain").addEventListener("click", () => {
      activeMetricModalType = "pain";
      openModal("Log Joint Pain", "Rate your subjective local pain from 0 (none) to 10 (severe pain limit).", "metric_input");
    });

    // Modal action bindings
    document.getElementById("btn-modal-cancel").addEventListener("click", closeModal);
    document.getElementById("btn-modal-submit").addEventListener("click", submitModalAction);

    renderHistoryCalendar();
    updateMetricsDisplay();
  }

  function updateSystemTheme() {
    if (state.darkTheme) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }

  function renderHistoryCalendar() {
    const container = document.getElementById("calendar-grid-days");
    
    // Clear previous day grids but maintain headers
    const labels = container.querySelectorAll(".calendar-day-label");
    container.innerHTML = "";
    labels.forEach(l => container.appendChild(l));

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById("calendar-month").textContent = `${monthNames[month]} ${year}`;

    // Get first day of month and number of days
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Render leading empty grid spaces
    for (let i = 0; i < firstDayIndex; i++) {
      const empty = document.createElement("span");
      empty.className = "calendar-day empty";
      container.appendChild(empty);
    }

    // Render days
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split("T")[0];
      
      const daySpan = document.createElement("span");
      daySpan.className = "calendar-day";
      daySpan.textContent = day;
      
      // Determine day status styling
      const logs = state.doseLogs[dateKey];
      const isFuture = date > today;

      if (!isFuture) {
        // Evaluate active protocol scheduled requirements for that historical day
        let wasScheduled = false;
        if (state.activeProtocol) {
          const dayOfWeek = date.getDay();
          
          state.activeProtocol.peptides.forEach(pep => {
            if (pep.frequency === "daily") wasScheduled = true;
            else if (pep.frequency === "weekly") {
              const startDay = new Date(state.activeProtocol.startDate).getDay();
              if (dayOfWeek === startDay) wasScheduled = true;
            } else if (pep.frequency === "twice-weekly") {
              if (dayOfWeek === 2 || dayOfWeek === 5) wasScheduled = true;
            } else if (pep.frequency === "cyclical") {
              const start = new Date(state.activeProtocol.startDate);
              const diffTime = Math.abs(date - start);
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays >= 0 && diffDays % 7 < 5) wasScheduled = true;
            }
          });
        }

        if (logs && logs.length > 0) {
          daySpan.classList.add("taken-dose");
        } else if (wasScheduled) {
          // If past scheduled day but no log recorded, count as missed
          if (date.toDateString() === today.toDateString()) {
            daySpan.classList.add("active-dose"); // Today active dashed border
          } else {
            daySpan.classList.add("missed-dose");
          }
        }
      }

      // Day click display historic stats
      daySpan.addEventListener("click", () => {
        if (logs && logs.length > 0) {
          const detailStr = logs.map(l => {
            const idParts = l.uniqueId.split("-")[0];
            const pepName = window.PEPTIDE_LIBRARY.find(p=>p.id===idParts)?.name || idParts.toUpperCase();
            return `• ${pepName} injected at ${l.time}`;
          }).join("\n");
          
          openModal(`Logs for ${monthNames[month]} ${day}`, detailStr, "info");
        } else {
          openModal(`Logs for ${monthNames[month]} ${day}`, "No peptide doses were logged on this date.", "info");
        }
      });

      container.appendChild(daySpan);
    }
  }

  function updateMetricsDisplay() {
    const weightEl = document.getElementById("metric-weight");
    const energyEl = document.getElementById("metric-energy");
    const painEl = document.getElementById("metric-pain");

    const wLogs = state.metrics.weight;
    const eLogs = state.metrics.energy;
    const pLogs = state.metrics.pain;

    weightEl.textContent = wLogs.length > 0 ? `${wLogs[wLogs.length - 1].value} lbs` : "-- lbs";
    energyEl.textContent = eLogs.length > 0 ? `${eLogs[eLogs.length - 1].value} / 10` : "-- / 10";
    painEl.textContent = pLogs.length > 0 ? `${pLogs[pLogs.length - 1].value} / 10` : "-- / 10";
  }

  // --- Modal Overlay Controls ---
  function openModal(title, description, type) {
    const modal = document.getElementById("modal-overlay");
    const titleEl = document.getElementById("modal-title");
    const descEl = document.getElementById("modal-desc");
    const inputContainer = document.getElementById("modal-input-container");
    const submitBtn = document.getElementById("btn-modal-submit");

    titleEl.textContent = title;
    descEl.textContent = description;
    inputContainer.innerHTML = "";
    
    submitBtn.style.display = "inline-flex";
    submitBtn.textContent = "Save";

    if (type === "metric_input") {
      const input = document.createElement("input");
      input.id = "modal-text-input";
      input.className = "form-input";
      
      if (activeMetricModalType === "weight") {
        input.type = "number";
        input.placeholder = "e.g. 185";
        input.step = "0.1";
      } else {
        input.type = "number";
        input.placeholder = "Range 1 to 10";
        input.min = "1";
        input.max = "10";
      }
      
      inputContainer.appendChild(input);
      setTimeout(() => input.focus(), 150);
    } else if (type === "confirm_reset") {
      submitBtn.textContent = "Wipe Database";
      submitBtn.style.backgroundColor = "var(--accent-color)";
    } else if (type === "info") {
      submitBtn.style.display = "none"; // Info modal only needs close button
    }

    modal.setAttribute("data-modal-type", type);
    modal.classList.add("active");
  }

  function closeModal() {
    document.getElementById("modal-overlay").classList.remove("active");
  }

  function submitModalAction() {
    const modal = document.getElementById("modal-overlay");
    const type = modal.getAttribute("data-modal-type");
    const dateKey = new Date().toISOString().split("T")[0];

    if (type === "metric_input") {
      const val = parseFloat(document.getElementById("modal-text-input").value);
      if (isNaN(val)) {
        alert("Please enter a valid numeric value.");
        return;
      }

      state.metrics[activeMetricModalType].push({
        date: dateKey,
        value: val
      });
      
      saveStateToStorage();
      updateMetricsDisplay();
    } else if (type === "confirm_reset") {
      localStorage.clear();
      window.location.reload();
      return;
    }

    closeModal();
  }

  function exportDatabaseJSON() {
    const dbDump = {
      user: state.user,
      activeProtocol: state.activeProtocol,
      customProtocols: state.customProtocols,
      doseLogs: state.doseLogs,
      metrics: state.metrics,
      streak: state.streak,
      lastLogDate: state.lastLogDate
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbDump, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `the_peptide_app_data_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // --- Trigger Initialization ---
  init();
});
