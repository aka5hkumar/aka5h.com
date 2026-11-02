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
  const scale = Math.min((innerWidth * 0.5) / r.width, (innerHeight * 0.6) / r.height);
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

const toggle = document.querySelector(".theme-toggle");

function currentTheme() {
  if (root.dataset.theme) return root.dataset.theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  root.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch (e) {}
}

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
