(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  // Theme toggle
  var toggle = document.getElementById("themeToggle");
  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    try {
      localStorage.setItem("pq-theme", theme);
    } catch (e) {}
  }
  toggle.setAttribute(
    "aria-pressed",
    currentTheme() === "dark" ? "true" : "false"
  );
  toggle.addEventListener("click", function () {
    setTheme(currentTheme() === "dark" ? "light" : "dark");
  });

  // Scroll-reveal
  var revealItems = document.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    revealItems.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var alreadyVisible = rect.top < innerHeight * 0.95;
      if (alreadyVisible) return;
      var delay = parseFloat(el.getAttribute("data-delay") || "0");
      el.style.transitionDelay = delay + "ms";
      el.classList.add("reveal-pending");
      io.observe(el);
    });
  }

  // Scroll progress bar
  var bar = document.getElementById("progressBar");
  var onScroll = function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0;
    bar.style.transform = "scaleX(" + p + ")";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Custom cursor (fine pointer devices only)
  var cursor = document.getElementById("cursorDot");
  if (!reduceMotion && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var x = innerWidth / 2,
      y = innerHeight / 2,
      tx = x,
      ty = y,
      raf = null;

    cursor.style.transform =
      "translate(" + (x - 4.5) + "px," + (y - 4.5) + "px)";

    window.addEventListener(
      "mousemove",
      function (e) {
        tx = e.clientX;
        ty = e.clientY;
        if (raf === null) raf = requestAnimationFrame(loop);
      },
      { passive: true }
    );

    function loop() {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      cursor.style.transform =
        "translate(" +
        (x - cursor.offsetWidth / 2) +
        "px," +
        (y - cursor.offsetHeight / 2) +
        "px)";
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    document.querySelectorAll("a, button, [data-cursor]").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.classList.add("is-active");
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-active");
      });
    });
  }
})();
