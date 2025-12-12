/* ========================================
   todo.js - Task Quadrants logic
   ======================================== */
(function () {
  const STORAGE_KEY_BASE = "taskQuadrantsLCL";
  const STORAGE_PLANNER_KEY = `${STORAGE_KEY_BASE}-currentPlanner`;
  const PLANNERS = ["work", "home", "event"];

  /**
   * Task shape:
   * {
   *   id: string,
   *   title: string,
   *   notes: string,
   *   dueDate: string | null (YYYY-MM-DD),
   *   category: "now" | "next" | "planned" | "backburner",
   *   pinned: boolean,
   *   completed: boolean,
   *   createdAt: number (timestamp),
   *   orderIndex: number
   * }
   */

  function getDefaultHideCompletedMap() {
    return {
      now: false,
      next: false,
      planned: false,
      backburner: false,
    };
  }

  function normalizeCategoryId(cat) {
    if (cat === "week") return "next";
    if (cat === "month") return "planned";
    return cat;
  }

  function normalizeTasksCategories(list) {
    if (!Array.isArray(list)) return [];
    return list.map((t) => {
      if (!t || typeof t !== "object") return t;
      const newCat = normalizeCategoryId(t.category);
      if (newCat !== t.category) {
        return Object.assign({}, t, { category: newCat });
      }
      return t;
    });
  }

  function normalizeHideCompletedMapKeys(map) {
    const base = getDefaultHideCompletedMap();
    if (map && typeof map === "object") {
      Object.keys(map).forEach((key) => {
        const newKey = normalizeCategoryId(key);
        if (base.hasOwnProperty(newKey)) {
          base[newKey] = map[key];
        }
      });
    }
    return base;
  }

  let currentPlanner = "work";
  let tasks = [];
  let hideCompletedMap = getDefaultHideCompletedMap();
  let clockTimeEl = null;
  let railFillEl = null;
  let railMarkerEl = null;
  let railPercentEl = null;
  let dayRailTimerId = null;

  function getStorageKeyForPlanner(plannerId) {
    return `${STORAGE_KEY_BASE}-${plannerId}`;
  }

  /* ===== Storage Helpers ===== */

  function migrateLegacyToWork() {
    const workKey = getStorageKeyForPlanner("work");
    if (localStorage.getItem(workKey)) return;

    try {
      const legacy = localStorage.getItem(STORAGE_KEY_BASE);
      if (!legacy) return;
      const parsed = JSON.parse(legacy);
      let legacyTasks = [];
      let legacyHide = getDefaultHideCompletedMap();

      if (Array.isArray(parsed)) {
        legacyTasks = parsed.slice();
      } else if (parsed && Array.isArray(parsed.tasks)) {
        legacyTasks = parsed.tasks.slice();
        if (parsed.hideCompletedMap && typeof parsed.hideCompletedMap === "object") {
          legacyHide = Object.assign(legacyHide, parsed.hideCompletedMap);
        }
      } else {
        return;
      }

      const payload = {
        tasks: normalizeTasksCategories(legacyTasks),
        hideCompletedMap: normalizeHideCompletedMapKeys(legacyHide),
      };
      localStorage.setItem(workKey, JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to migrate legacy data:", e);
    }
  }

  function loadPlannerState(plannerId) {
    let nextTasks = [];
    let nextHide = getDefaultHideCompletedMap();

    try {
      const key = getStorageKeyForPlanner(plannerId);
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          nextTasks = parsed.slice();
        } else if (parsed && Array.isArray(parsed.tasks)) {
          nextTasks = parsed.tasks.slice();
          if (parsed.hideCompletedMap && typeof parsed.hideCompletedMap === "object") {
            nextHide = Object.assign(nextHide, parsed.hideCompletedMap);
          }
        }
      }
    } catch (e) {
      console.error("Failed to load planner state:", e);
    }

    return {
      tasks: normalizeTasksCategories(nextTasks),
      hideCompletedMap: normalizeHideCompletedMapKeys(nextHide),
    };
  }

  function loadState() {
    migrateLegacyToWork();
    const storedPlanner = localStorage.getItem(STORAGE_PLANNER_KEY);
    if (storedPlanner && PLANNERS.includes(storedPlanner)) {
      currentPlanner = storedPlanner;
    }
    const state = loadPlannerState(currentPlanner);
    tasks = state.tasks;
    hideCompletedMap = state.hideCompletedMap;
  }

  function saveState() {
    const payload = {
      tasks,
      hideCompletedMap,
    };
    const key = getStorageKeyForPlanner(currentPlanner);
    localStorage.setItem(key, JSON.stringify(payload));
    localStorage.setItem(STORAGE_PLANNER_KEY, currentPlanner);
  }

  function setPlanner(newPlanner) {
    if (!PLANNERS.includes(newPlanner)) return;
    if (newPlanner === currentPlanner) return;

    saveState();
    currentPlanner = newPlanner;
    localStorage.setItem(STORAGE_PLANNER_KEY, currentPlanner);

    const nextState = loadPlannerState(currentPlanner);
    tasks = nextState.tasks;
    hideCompletedMap = nextState.hideCompletedMap;
    const select = document.getElementById("plannerSelect");
    if (select && select.value !== currentPlanner) {
      select.value = currentPlanner;
    }
    renderAll();
  }

  /* ===== Utility ===== */

  function generateId() {
    return (
      "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    );
  }

  function normalizeDateString(str) {
    if (!str) return null;
    const d = new Date(str);
    if (Number.isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getTodayYMD() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function compareYMD(a, b) {
    if (a === b) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    return a < b ? -1 : 1;
  }

  function classifyDueDate(dueDate) {
    if (!dueDate) return { label: "No due date", className: "badge-date" };
    const today = getTodayYMD();
    const cmp = compareYMD(dueDate, today);

    if (cmp < 0) {
      return { label: `Overdue (${dueDate})`, className: "badge-overdue" };
    } else if (cmp === 0) {
      return { label: "Today", className: "badge-today" };
    } else {
      const todayDate = new Date(today);
      const due = new Date(dueDate);
      const diffMs = due - todayDate;
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays <= 3) {
        return { label: `Soon (${dueDate})`, className: "badge-soon" };
      }
      return { label: dueDate, className: "badge-date" };
    }
  }

  function formatShortTimestamp(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    const year = String(d.getFullYear()).slice(-2);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  function getFilenameTimestamp() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}${month}${day}-${hours}${minutes}`;
  }

  function getNextOrderIndex() {
    if (tasks.length === 0) return 1;
    const max = tasks.reduce(
      (acc, t) =>
        typeof t.orderIndex === "number" && t.orderIndex > acc
          ? t.orderIndex
          : acc,
      0
    );
    return max + 1;
  }

  function getPinnedTopOrderIndexForCategory(category) {
    const pinned = tasks.filter((t) => t.category === category && t.pinned);
    if (pinned.length === 0) return getNextOrderIndex();
    const min = pinned.reduce(
      (acc, t) =>
        typeof t.orderIndex === "number" && t.orderIndex < acc
          ? t.orderIndex
          : acc,
      pinned[0].orderIndex || 0
    );
    return min - 1;
  }

  /* ===== Export / Import ===== */

  function normalizeTasksForImport(rawTasks) {
    if (!Array.isArray(rawTasks)) return [];
    return rawTasks.map((task) => {
      if (!task || typeof task !== "object") return task;
      const dueRaw = task.dueDate || task.dueDateISO || null;
      const normalizedDue = dueRaw ? normalizeDateString(dueRaw) : null;
      return Object.assign({}, task, { dueDate: normalizedDue });
    });
  }

  function buildExportPayload() {
    const now = new Date();
    const exportedAtISO = now.toISOString();
    const timezoneOffsetMinutes = now.getTimezoneOffset();
    const exportedTasks = tasks.map((task) => {
      if (!task || typeof task !== "object") return task;
      const normalizedDue = task.dueDate ? normalizeDateString(task.dueDate) : null;
      return Object.assign({}, task, {
        dueDate: normalizedDue,
        dueDateISO: normalizedDue,
      });
    });

    return {
      format: "todo-export-v2",
      version: 2,
      exportedAtISO,
      exportedAt: exportedAtISO,
      timezoneOffsetMinutes,
      planner: currentPlanner,
      state: {
        tasks: exportedTasks,
        hideCompletedMap: Object.assign({}, hideCompletedMap),
      },
      // Top-level copies retained for backward compatibility with older imports
      tasks: exportedTasks,
      hideCompletedMap: Object.assign({}, hideCompletedMap),
    };
  }

  function exportToJson() {
    try {
      const payload = buildExportPayload();
      const json = JSON.stringify(payload, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const filename = `command-deck-backup-${getFilenameTimestamp()}.json`;
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: " + (err.message || "Unable to create file."));
    }
  }

  function normalizeImportedData(parsed) {
    if (Array.isArray(parsed)) {
      const mergedHide = Object.assign({}, getDefaultHideCompletedMap());
      return { tasks: normalizeTasksForImport(parsed), hideCompletedMap: mergedHide };
    }

    if (parsed && parsed.state && Array.isArray(parsed.state.tasks)) {
      const mergedHide =
        parsed.state.hideCompletedMap && typeof parsed.state.hideCompletedMap === "object"
          ? Object.assign({}, getDefaultHideCompletedMap(), parsed.state.hideCompletedMap)
          : Object.assign({}, getDefaultHideCompletedMap());
      return {
        tasks: normalizeTasksForImport(parsed.state.tasks),
        hideCompletedMap: mergedHide,
      };
    }

    if (parsed && Array.isArray(parsed.tasks)) {
      const importedHideMap =
        parsed.hideCompletedMap && typeof parsed.hideCompletedMap === "object"
          ? Object.assign({}, getDefaultHideCompletedMap(), parsed.hideCompletedMap)
          : Object.assign({}, getDefaultHideCompletedMap());
      return {
        tasks: normalizeTasksForImport(parsed.tasks),
        hideCompletedMap: importedHideMap,
      };
    }
    throw new Error("Invalid file format: expected a tasks array.");
  }

  function importFromJson(file, fileInputEl) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target && e.target.result;
        if (!text) {
          throw new Error("File is empty or unreadable.");
        }
        const parsed = JSON.parse(text);
        const normalized = normalizeImportedData(parsed);

        const confirmed = confirm(
          "Importing will replace your current board state. Continue?"
        );
        if (!confirmed) return;

        tasks = normalizeTasksCategories(
          Array.isArray(normalized.tasks) ? normalized.tasks.slice() : []
        );
        hideCompletedMap = normalizeHideCompletedMapKeys(
          normalized.hideCompletedMap || {}
        );
        saveState();
        renderAll();
      } catch (err) {
        alert("Import failed: " + (err.message || "Could not parse file."));
      } finally {
        if (fileInputEl) {
          fileInputEl.value = "";
        }
      }
    };
    reader.onerror = () => {
      alert("Import failed: Unable to read file.");
      if (fileInputEl) {
        fileInputEl.value = "";
      }
    };
    reader.readAsText(file);
  }

  /* ===== Core Operations ===== */

  function addTask(title, category, dueDate) {
    const now = Date.now();
    const normalizedCategory = normalizeCategoryId(category || "now");
    const task = {
      id: generateId(),
      title: title.trim(),
      notes: "",
      dueDate: normalizeDateString(dueDate),
      category: normalizedCategory,
      pinned: false,
      completed: false,
      createdAt: now,
      orderIndex: getNextOrderIndex(),
    };
    tasks.push(task);
    saveState();
    renderAll();
  }

  function updateTask(id, patch) {
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return;
    tasks[index] = Object.assign({}, tasks[index], patch);
    saveState();
    renderAll();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveState();
    renderAll();
  }

  function moveTaskInGroup(taskId, direction) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const category = task.category;
    const pinned = task.pinned;
    const dueDate = task.dueDate;

    // Group: same category + same pinned, and if not pinned then same due date
    let group = tasks.filter(
      (t) =>
        t.category === category &&
        !t.completed &&
        t.pinned === pinned &&
        (pinned || t.dueDate === dueDate)
    );

    if (group.length <= 1) return;

    group.sort((a, b) => {
      const oa = typeof a.orderIndex === "number" ? a.orderIndex : a.createdAt;
      const ob = typeof b.orderIndex === "number" ? b.orderIndex : b.createdAt;
      if (oa !== ob) return oa - ob;
      return a.createdAt - b.createdAt;
    });

    const idx = group.findIndex((g) => g.id === taskId);
    if (idx === -1) return;

    let swapWith = null;
    if (direction === "up" && idx > 0) {
      swapWith = group[idx - 1];
    } else if (direction === "down" && idx < group.length - 1) {
      swapWith = group[idx + 1];
    }

    if (!swapWith) return;

    const tIndex = tasks.findIndex((t) => t.id === task.id);
    const sIndex = tasks.findIndex((t) => t.id === swapWith.id);
    if (tIndex === -1 || sIndex === -1) return;

    const tOrder =
      typeof tasks[tIndex].orderIndex === "number"
        ? tasks[tIndex].orderIndex
        : tasks[tIndex].createdAt;
    const sOrder =
      typeof tasks[sIndex].orderIndex === "number"
        ? tasks[sIndex].orderIndex
        : tasks[sIndex].createdAt;

    tasks[tIndex].orderIndex = sOrder;
    tasks[sIndex].orderIndex = tOrder;

    saveState();
    renderAll();
  }

  function togglePin(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    if (task.pinned) {
      task.pinned = false;
      if (typeof task.orderIndex !== "number") {
        task.orderIndex = getNextOrderIndex();
      }
    } else {
      task.pinned = true;
      task.orderIndex = getPinnedTopOrderIndexForCategory(task.category);
    }
    saveState();
    renderAll();
  }

  function toggleCompleted(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.completed = !task.completed;
    saveState();
    renderAll();
  }

  function changeCategory(id, newCategory) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.category = normalizeCategoryId(newCategory);
    if (typeof task.orderIndex !== "number") {
      task.orderIndex = getNextOrderIndex();
    }
    saveState();
    renderAll();
  }

  function changeDueDate(id, newDate) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.dueDate = normalizeDateString(newDate);
    saveState();
    renderAll();
  }

  function changeNotes(id, newNotes) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    task.notes = newNotes;
    saveState();
    // No re-render required for simple text change
  }

  /* ===== Rendering ===== */

  function renderQuadrant(category) {
    const container = document.getElementById("quadrant-" + category);
    if (!container) return;

    container.innerHTML = "";

    let quadrantTasks = tasks.filter((t) => t.category === category);
    const hideCompleted = hideCompletedMap[category];
    if (hideCompleted) {
      quadrantTasks = quadrantTasks.filter((t) => !t.completed);
    }

    const countSpan = document.getElementById("count-" + category);
    if (countSpan) {
      countSpan.textContent = `(${quadrantTasks.length})`;
    }

    const pinnedTasks = quadrantTasks.filter((t) => t.pinned);
    const normalTasks = quadrantTasks.filter((t) => !t.pinned);

    pinnedTasks.sort((a, b) => {
      const oa = typeof a.orderIndex === "number" ? a.orderIndex : a.createdAt;
      const ob = typeof b.orderIndex === "number" ? b.orderIndex : b.createdAt;
      if (oa !== ob) return oa - ob;
      return a.createdAt - b.createdAt;
    });

    normalTasks.sort((a, b) => {
      const cmpDates = compareYMD(a.dueDate, b.dueDate);
      if (cmpDates !== 0) return cmpDates;
      const oa = typeof a.orderIndex === "number" ? a.orderIndex : a.createdAt;
      const ob = typeof b.orderIndex === "number" ? b.orderIndex : b.createdAt;
      if (oa !== ob) return oa - ob;
      return a.createdAt - b.createdAt;
    });

    if (pinnedTasks.length > 0) {
      pinnedTasks.forEach((task) => {
        container.appendChild(renderTaskCard(task));
      });
    }

    if (pinnedTasks.length > 0 && normalTasks.length > 0) {
      const divider = document.createElement("div");
      divider.className = "section-divider";
      divider.textContent = "Schedule by date";
      container.appendChild(divider);
    }

    normalTasks.forEach((task) => {
      container.appendChild(renderTaskCard(task));
    });
  }

  function renderTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    if (task.completed) {
      card.classList.add("completed");
    }
    if (task.pinned) {
      card.classList.add("pinned-card");
    }

    const header = document.createElement("div");
    header.className = "task-header";

    const checkboxWrap = document.createElement("div");
    checkboxWrap.className = "task-checkbox";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!task.completed;
    checkbox.addEventListener("change", () => toggleCompleted(task.id));
    checkboxWrap.appendChild(checkbox);

    const main = document.createElement("div");
    main.className = "task-main";

    const titleRow = document.createElement("div");
    titleRow.className = "task-title-row";

    const titleSpan = document.createElement("div");
    titleSpan.className = "task-title";
    if (task.completed) {
      titleSpan.classList.add("completed");
    }
    titleSpan.textContent = task.title || "(Untitled)";
    titleSpan.title = task.title;

    const badges = document.createElement("div");
    badges.className = "task-badges";

    const dueInfo = classifyDueDate(task.dueDate);
    const dateBadge = document.createElement("span");
    dateBadge.className = "badge " + dueInfo.className;
    dateBadge.textContent = dueInfo.label;
    badges.appendChild(dateBadge);

    if (task.pinned) {
      const pinBadge = document.createElement("span");
      pinBadge.className = "badge";
      pinBadge.textContent = "Pinned";
      badges.appendChild(pinBadge);
    }

    titleRow.appendChild(titleSpan);
    titleRow.appendChild(badges);

    const metaRow = document.createElement("div");
    metaRow.className = "task-meta-row";

    const categorySelect = document.createElement("select");
    categorySelect.innerHTML = `
            <option value="now">Now</option>
            <option value="next">Next</option>
            <option value="planned">Planned</option>
            <option value="backburner">Backburner</option>
        `;
    categorySelect.value = task.category;
    categorySelect.addEventListener("change", (e) =>
      changeCategory(task.id, e.target.value)
    );

    const dueInput = document.createElement("input");
    dueInput.type = "date";
    dueInput.value = task.dueDate || "";
    dueInput.addEventListener("change", (e) =>
      changeDueDate(task.id, e.target.value)
    );

    const controls = document.createElement("div");
    controls.className = "task-controls";

    const pinBtn = document.createElement("button");
    pinBtn.type = "button";
    pinBtn.className = "icon-btn icon-pin";
    pinBtn.textContent = "📌";
    if (task.pinned) {
      pinBtn.classList.add("active");
    }
    pinBtn.title = "Pin/unpin task";
    pinBtn.addEventListener("click", () => togglePin(task.id));

    const upBtn = document.createElement("button");
    upBtn.type = "button";
    upBtn.className = "icon-btn";
    upBtn.textContent = "▲";
    upBtn.title = "Move up";
    upBtn.addEventListener("click", () => moveTaskInGroup(task.id, "up"));

    const downBtn = document.createElement("button");
    downBtn.type = "button";
    downBtn.className = "icon-btn";
    downBtn.textContent = "▼";
    downBtn.title = "Move down";
    downBtn.addEventListener("click", () => moveTaskInGroup(task.id, "down"));

    controls.appendChild(pinBtn);
    controls.appendChild(upBtn);
    controls.appendChild(downBtn);

    metaRow.appendChild(categorySelect);
    metaRow.appendChild(dueInput);
    metaRow.appendChild(controls);

    main.appendChild(titleRow);
    main.appendChild(metaRow);

    header.appendChild(checkboxWrap);
    header.appendChild(main);

    const notesToggle = document.createElement("span");
    notesToggle.className = "task-notes-toggle";
    notesToggle.textContent = task.notes ? "Notes ▾" : "Add notes ▾";

    const notesWrapper = document.createElement("div");
    notesWrapper.className = "task-notes";
    notesWrapper.style.display = "none";

    const notesTextarea = document.createElement("textarea");
    notesTextarea.value = task.notes || "";
    notesTextarea.placeholder = "Details, context, call notes, etc.";
    notesTextarea.addEventListener("input", (e) =>
      changeNotes(task.id, e.target.value)
    );

    notesWrapper.appendChild(notesTextarea);

    notesToggle.addEventListener("click", () => {
      const isHidden = notesWrapper.style.display === "none";
      notesWrapper.style.display = isHidden ? "block" : "none";
      notesToggle.textContent = isHidden ? "Notes ▴" : "Notes ▾";
    });

    const footerRow = document.createElement("div");
    footerRow.className = "task-footer-row";

    const hint = document.createElement("span");
    hint.className = "hint";
    hint.textContent = task.pinned
      ? "Pinned: manual order"
      : "Date-sorted (use pin for priority overrides)";

    const stampWrap = document.createElement("span");
    stampWrap.className = "stamp";
    stampWrap.textContent = formatShortTimestamp(task.createdAt);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "task-delete-btn";
    deleteBtn.textContent = "delete";
    deleteBtn.addEventListener("click", () => {
      if (confirm("Delete this task?")) {
        deleteTask(task.id);
      }
    });

    const rightCluster = document.createElement("span");
    rightCluster.appendChild(stampWrap);
    rightCluster.appendChild(document.createTextNode(" "));
    rightCluster.appendChild(deleteBtn);

    footerRow.appendChild(hint);
    footerRow.appendChild(rightCluster);

    card.appendChild(header);
    card.appendChild(notesToggle);
    card.appendChild(notesWrapper);
    card.appendChild(footerRow);

    return card;
  }

  function renderAll() {
    ["now", "next", "planned", "backburner"].forEach(renderQuadrant);
    updateHideCompletedCheckboxes();
  }

  function updateHideCompletedCheckboxes() {
    document
      .querySelectorAll('input[type="checkbox"][data-hide-completed]')
      .forEach((checkbox) => {
        const cat = checkbox.getAttribute("data-hide-completed");
        if (cat && hideCompletedMap.hasOwnProperty(cat)) {
          checkbox.checked = hideCompletedMap[cat];
        }
      });
  }

  /* ===== Event Wiring ===== */

  function updateDayRail() {
    const now = new Date();
    const secondsSinceMidnight =
      now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const rawProgress = secondsSinceMidnight / 86400;
    const dayProgress = Math.min(Math.max(rawProgress, 0), 1);

    if (clockTimeEl) {
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const weekday = now.toLocaleDateString([], { weekday: "short" });
      const dateStr = `${month}-${day}-${year}`;
      const timeStr = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      clockTimeEl.textContent = `${weekday} \u00b7 ${dateStr} \u00b7 ${timeStr}`;
    }

    if (railFillEl) {
      railFillEl.style.transform = `scaleX(${dayProgress})`;
    }

    if (railMarkerEl) {
      railMarkerEl.style.left = `${dayProgress * 100}%`;
    }

    if (railPercentEl) {
      const pct = Math.floor(dayProgress * 100);
      railPercentEl.textContent = `${pct}%`;
    }
  }

  function setupDayRail() {
    clockTimeEl = document.getElementById("clockTime");
    railFillEl = document.getElementById("railFill");
    railMarkerEl = document.getElementById("railMarker");
    railPercentEl = document.getElementById("railPercent");

    if (!clockTimeEl && !railFillEl && !railMarkerEl && !railPercentEl) {
      return;
    }

    if (dayRailTimerId) {
      clearInterval(dayRailTimerId);
    }

    updateDayRail();
    dayRailTimerId = window.setInterval(updateDayRail, 1000);
  }

  function setupAddForm() {
    const form = document.getElementById("addForm");
    const titleInput = document.getElementById("newTitle");
    const catSelect = document.getElementById("newCategory");
    const dateInput = document.getElementById("newDueDate");

    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      if (!title) return;
      const category = catSelect.value || "now";
      const dueDate = dateInput.value || null;

      addTask(title, category, dueDate);

      titleInput.value = "";
      titleInput.focus();
    });
  }

  function setupHideCompleted() {
    document
      .querySelectorAll('input[type="checkbox"][data-hide-completed]')
      .forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
          const cat = e.target.getAttribute("data-hide-completed");
          if (!cat) return;
          hideCompletedMap[cat] = e.target.checked;
          saveState();
          renderAll();
        });
      });
  }

  function setupPlannerSelect() {
    const plannerSelect = document.getElementById("plannerSelect");
    if (!plannerSelect) return;
    plannerSelect.value = currentPlanner;
    plannerSelect.addEventListener("change", (e) => {
      const newPlanner = e.target.value;
      setPlanner(newPlanner);
    });
  }

  function setupImportExport() {
    const exportBtn = document.getElementById("btnExportJson");
    if (exportBtn) {
      exportBtn.addEventListener("click", exportToJson);
    }

    const importBtn = document.getElementById("btnImportJson");
    const fileInput = document.getElementById("importFileInput");
    if (importBtn && fileInput) {
      importBtn.addEventListener("click", () => {
        fileInput.value = "";
        fileInput.click();
      });
      fileInput.addEventListener("change", (e) => {
        const target = e.target;
        const file =
          target && target.files && target.files.length ? target.files[0] : null;
        if (file) {
          importFromJson(file, fileInput);
        }
      });
    }
  }

  /* ===== Init ===== */

  function init() {
    loadState();
    setupPlannerSelect();
    setupAddForm();
    setupHideCompleted();
    setupImportExport();
    setupDayRail();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
