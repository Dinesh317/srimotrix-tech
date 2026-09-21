/* SRIMOTRIX Tech — progressive enhancement only.
   The page is fully readable and navigable with this file blocked. */
(function () {
  "use strict";

  var root = document.documentElement;

  /* --- Theme toggle ---------------------------------------------------
     The stored choice is applied by the inline script in <head> so there
     is no flash. With no stored choice, CSS follows the OS setting, which
     is why this button starts hidden — it only appears once we know it
     can actually do something. */
  var toggle = document.getElementById("theme-toggle");
  var query = window.matchMedia("(prefers-color-scheme: dark)");

  function activeTheme() {
    return root.dataset.theme || (query.matches ? "dark" : "light");
  }

  function describe() {
    var next = activeTheme() === "dark" ? "light" : "dark";
    var text = "Switch to " + next + " theme";
    toggle.setAttribute("aria-label", text);
    toggle.setAttribute("title", text);
  }

  if (toggle) {
    toggle.hidden = false;
    describe();

    toggle.addEventListener("click", function () {
      var next = activeTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* private mode — the choice just will not persist */
      }
      describe();
    });

    // Relabel if the OS flips while the visitor is still on system default.
    query.addEventListener("change", function () {
      if (!root.dataset.theme) describe();
    });
  }

  /* --- Contact form ---------------------------------------------------
     There is no form backend, so the submit is turned into a prefilled
     mail draft rather than a POST that would 404. Replace this whole
     block once a real endpoint exists. */
  var form = document.getElementById("contact-form");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var data = new FormData(form);
      var name = (data.get("name") || "").trim();
      var from = (data.get("email") || "").trim();
      var body = (data.get("message") || "").trim() + "\n\n--\n" + name + "\n" + from;

      window.location.href =
        "mailto:srimotrix.india@gmail.com?subject=" +
        encodeURIComponent("Project enquiry from " + name) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  /* --- Footer year ---------------------------------------------------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* --- Scroll progress hairline --------------------------------------- */
  var progress = document.getElementById("progress");
  var queued = false;

  function update() {
    queued = false;
    var scrollable = document.body.scrollHeight - window.innerHeight;
    var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
  }

  function onScroll() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  }

  if (progress) {
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }
})();
