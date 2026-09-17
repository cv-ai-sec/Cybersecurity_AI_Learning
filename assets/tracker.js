(function () {
  const STORAGE_KEY = "llm-security-labs-progress";

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage unavailable (e.g. private browsing) - progress just won't persist.
    }
  }

  function updateProgress() {
    const boxes = Array.from(document.querySelectorAll(".module input[type=checkbox]"));
    const done = boxes.filter((b) => b.checked).length;
    const total = boxes.length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById("progress-fill").style.width = pct + "%";
    document.getElementById("progress-label").textContent =
      done + " / " + total + " modules complete (" + pct + "%)";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const state = loadState();
    const boxes = document.querySelectorAll(".module input[type=checkbox]");

    boxes.forEach((box) => {
      const id = box.dataset.moduleId;
      if (state[id]) {
        box.checked = true;
        box.closest(".module").classList.add("done");
      }

      box.addEventListener("change", () => {
        state[id] = box.checked;
        box.closest(".module").classList.toggle("done", box.checked);
        saveState(state);
        updateProgress();
      });
    });

    updateProgress();
  });
})();
