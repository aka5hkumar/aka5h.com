// aka5h.com: small progressive enhancements. The page reads fine without any of this.

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// ---------- The mark ----------

const mark = document.querySelector(".mark");
const lines = mark.querySelector(".mark__lines");

// Colored trail: a copy of the lines drawn just ahead of the originals.
const trail = lines.cloneNode(true);
trail.removeAttribute("id");
trail.setAttribute("class", "mark__trail");
lines.before(trail);

// Stagger the lines within each group (rise, fall, flat).
mark.querySelectorAll(".mark__rise, .mark__fall, .mark__flat").forEach((group) => {
  [...group.children].forEach((line, i) => line.style.setProperty("--i", i));
});

// Keep the lines the same on-screen weight at any size: stroke-width is in viewBox units
// (the viewBox is 634 wide), so scale it inversely to the mark's rendered width.
const LINE_PX = 1.4;
const markSvg = mark.querySelector("svg");
function sizeStroke() {
  const w = mark.offsetWidth; // layout width, ignores the intro transform
  if (w) markSvg.style.strokeWidth = (LINE_PX * 634) / w;
}
sizeStroke();
let resizeQueued = false;
window.addEventListener("resize", () => {
  if (resizeQueued) return;
  resizeQueued = true;
  requestAnimationFrame(() => { resizeQueued = false; sizeStroke(); });
});

function drawMark() {
  mark.classList.remove("is-drawing");
  void mark.getBoundingClientRect(); // restart the CSS animation
  mark.classList.add("is-drawing");
}

mark.addEventListener("click", () => { if (!reduceMotion) drawMark(); });


// ---------- Intro: once per tab, from the top of the page ----------

let introSeen = false;
try { introSeen = sessionStorage.getItem("introSeen") === "1"; } catch (e) {}

if (reduceMotion) {
  root.classList.add("is-ready");
} else if (introSeen || window.scrollY > 0) {
  root.classList.add("is-ready");
  drawMark();
} else {
  try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
  playIntro();
}

function playIntro() {
  root.classList.add("intro");

  // Move the mark to the middle of the screen and scale it up.
  const r = mark.getBoundingClientRect();
  // Draw it large in the middle of the screen, sized from the viewport: up to 68% of the
  // width on phones, and capped by height everywhere so it never overflows. Then it glides
  // into its place in the hero, so the drawing is always visibly bigger than where it lands.
  const target = Math.min(innerWidth * (innerWidth <= 700 ? 0.68 : 0.6), innerHeight * 0.6 * (r.width / r.height));
  const scale = Math.max(target / r.width, 1.15);
  mark.style.setProperty("--ix", innerWidth / 2 - (r.left + r.width / 2) + "px");
  mark.style.setProperty("--iy", innerHeight / 2 - (r.top + r.height / 2) + "px");
  mark.style.setProperty("--is", scale);

  drawMark();

  // Then glide it home and bring in the page.
  setTimeout(() => {
    root.classList.remove("intro");
    void mark.getBoundingClientRect(); // re-enable the transition before moving
    mark.style.setProperty("--ix", "0px");
    mark.style.setProperty("--iy", "0px");
    mark.style.setProperty("--is", "1");
    root.classList.add("is-ready");
  }, 1900);
}


// ---------- Nav border once you scroll ----------

const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();


// ---------- Theme toggle ----------
// The page follows the device's light/dark setting. The toggle overrides it until the device
// itself switches, at which point the page follows the device again.

const toggle = document.querySelector(".theme-toggle");
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
const deviceTheme = () => (darkQuery.matches ? "dark" : "light");

function currentTheme() {
  return root.dataset.theme || deviceTheme();
}

// Browser UI color (Android Chrome address bar, Safari tab bar). The <meta name="theme-color">
// tags follow the device via their media queries; a manual override pins both to the page.
const THEME_COLORS = { light: "#fafaf9", dark: "#0e0f11" };
const themeMetas = document.querySelectorAll('meta[name="theme-color"]');
function syncThemeColor() {
  themeMetas.forEach((meta) => {
    const own = meta.media.includes("dark") ? "dark" : "light";
    meta.content = THEME_COLORS[root.dataset.theme || own];
  });
}

function setTheme(theme) {
  if (theme === deviceTheme()) {
    // Same as the device: no override needed.
    delete root.dataset.theme;
    try { localStorage.removeItem("theme"); } catch (e) {}
  } else {
    root.dataset.theme = theme;
    try { localStorage.setItem("theme", JSON.stringify({ theme, device: deviceTheme() })); } catch (e) {}
  }
  syncThemeColor();
}

darkQuery.addEventListener("change", () => {
  delete root.dataset.theme;
  try { localStorage.removeItem("theme"); } catch (e) {}
  syncThemeColor();
});

syncThemeColor(); // applies a saved override on load

toggle.addEventListener("click", (event) => {
  const next = currentTheme() === "dark" ? "light" : "dark";

  // Instant switch where View Transitions aren't supported.
  if (!document.startViewTransition || reduceMotion) {
    setTheme(next);
    return;
  }

  // Otherwise the new theme grows out of the button.
  root.style.setProperty("--tx", event.clientX + "px");
  root.style.setProperty("--ty", event.clientY + "px");
  document.startViewTransition(() => setTheme(next));
});


// ---------- Scroll reveal ----------

const revealEls = document.querySelectorAll(".reveal");

// Siblings that enter together come in one after another.
revealEls.forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.setProperty("--delay", siblings.indexOf(el) * 0.06 + "s");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

revealEls.forEach((el) => observer.observe(el));


// ---------- Footer year ----------

document.querySelector(".year").textContent = new Date().getFullYear();
