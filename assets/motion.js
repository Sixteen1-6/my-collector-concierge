/* ===== My CC motion: smooth scrolling, quiet reveals, and the How it works scene =====
   The scene follows one real card from the collection (inventory No. 574) as you scroll:
   1 it arrives in its toploader, 2 it is scanned front and back, 3 it leaves the toploader
   for a display slab, 4 it drops into a vault drawer.
   With prefers-reduced-motion nothing here runs and the page keeps its static layout.
   On short screens (landscape phones, heavy zoom) the scene stays off and the static steps show. */
(function () {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce.matches) return;

  const root = document.documentElement;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const mast = $("#mast");
  const mh = () => (mast ? mast.getBoundingClientRect().height : 0);

  // the frame loop runs only while something is moving (see frame() at the bottom)
  let running = false;
  const kick = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

  /* ---------- smooth scrolling (mouse and trackpad; touch keeps native scrolling) ---------- */
  let lenis = null;
  if (window.Lenis) {
    try { lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false }); } catch (e) { lenis = null; }
  }
  // only the modal and the mobile menu scroll on their own; tables and the tray must not trap the wheel
  $$("#viewer, #drawer").forEach(el => el.setAttribute("data-lenis-prevent", ""));

  const targetOf = hash => {
    if (!hash || hash.length < 2) return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); } catch (e) { return null; }
  };
  // glide to an element; if images above it change height during the glide, finish the last few pixels
  const glideTo = t => {
    const top = t.id === "top";
    lenis.scrollTo(top ? 0 : t, {
      offset: top ? 0 : -mh(), duration: 1.3,
      onComplete: () => {
        if (!top && Math.abs(t.getBoundingClientRect().top - mh()) > 1) lenis.scrollTo(t, { offset: -mh(), duration: 0.35 });
        kick();
      }
    });
    kick();
  };

  if (lenis) {
    // in-page links glide instead of jumping, keep history, and move keyboard focus with them
    document.addEventListener("click", e => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const id = a.getAttribute("href");
      const t = targetOf(id);
      if (!t) return;
      e.preventDefault();
      glideTo(t);
      if (id !== location.hash) history.pushState(null, "", id);
      if (!t.matches("a,button,input,select,textarea,[tabindex]")) t.setAttribute("tabindex", "-1");
      t.focus({ preventScroll: true });
    });
    addEventListener("popstate", () => {
      const t = targetOf(location.hash);
      lenis.scrollTo(t && t.id !== "top" ? t : 0, { offset: t && t.id !== "top" ? -mh() : 0, immediate: true });
      kick();
    });
    // deep links: settle on the section once images have their sizes
    addEventListener("load", () => {
      const t = targetOf(location.hash);
      if (t && t.id !== "top") { lenis.scrollTo(t, { offset: -mh(), immediate: true }); kick(); }
    });
    // pause while the card viewer is open
    const vw = $("#viewer");
    if (vw) new MutationObserver(() => (vw.hidden ? lenis.start() : lenis.stop())).observe(vw, { attributes: true, attributeFilter: ["hidden"] });
  }

  /* ---------- reveals ---------- */
  const revealEls = $$("main .sec-head, .about-photo, .about-copy, #services .tw-x, .close .row").filter(el => !el.closest("#how .how-pin"));
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight * 0.92) return; // already on screen at load
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  /* ---------- hero: the case photo drifts a little slower than the page ---------- */
  const heroPhoto = $(".hero-photo");
  const wide = matchMedia("(min-width: 721px)");

  /* ---------- the How it works scene ---------- */
  const tall = matchMedia("(min-height: 520px)");
  const how = $("#how"), scroller = $("#how-scroll"), stage = $("#how-stage");
  let scene = null;
  if (how && scroller && stage && tall.matches) {
    const steps = $$(".steps > li", how);
    const rail = $("#how-rail");
    const el = {
      rig: $("#st-rig"), card: $("#st-card"), beam: $("#st-beam"), top: $("#st-top"),
      slab: $("#st-slab"), glass: $("#st-glass"), label: $("#st-label"),
      drawer: $("#st-drawer"), lip: $("#st-lip"), slot: $("#st-slot"),
      stamp: $("#st-stamp"), tag: $("#st-tag"), chips: $("#st-chips"), done: $("#st-done")
    };
    // the page gets much taller here; stop the browser from "anchoring" the reader somewhere else
    root.style.overflowAnchor = "none";
    how.classList.add("is-live");
    void how.offsetHeight;
    requestAnimationFrame(() => { root.style.overflowAnchor = ""; });

    // the rail: one button per step, each jumps to that step's settled moment
    const LAND = [0.2, 0.49, 0.735, 0.99];
    const bars = steps.map((li, k) => {
      const b = document.createElement("button");
      b.type = "button";
      const h = $("h3", li), nn = String(k + 1).padStart(2, "0");
      b.setAttribute("aria-label", nn + " " + (h ? h.textContent : ""));
      b.innerHTML = "<span>" + nn + "</span><i></i>";
      b.addEventListener("click", () => {
        const y = scene.start + LAND[k] * (scene.end - scene.start);
        if (lenis) lenis.scrollTo(y, { duration: 1.1 }); else scrollTo({ top: y, behavior: "smooth" });
        kick();
      });
      rail.appendChild(b);
      return b;
    });

    scene = { start: 0, end: 1, H: 0, W: 0, cw: 0, dw: 0, k: 0.6, dy: 0, q: -1, active: -1, wc: new Map() };

    scene.measure = function () {
      root.style.setProperty("--mh", mh() + "px");
      const r = stage.getBoundingClientRect();
      scene.W = r.width; scene.H = r.height;
      // two units: the card (cw) and the vault drawer (dw), which has to fit three slabs across
      scene.cw = Math.round(Math.max(90, Math.min(scene.H * 0.36, scene.W / 2.15, 300)));
      scene.dw = Math.round(Math.max(80, Math.min(scene.cw, scene.W / 2.9)));
      stage.style.setProperty("--cw", scene.cw + "px");
      stage.style.setProperty("--dw", scene.dw + "px");
      scene.k = (scene.dw * 0.708) / (scene.cw * 1.18); // slab width to slot width
      // where the card rig has to travel to sit in the drawer's empty slot (offsets ignore transforms)
      const slotCY = el.drawer.offsetTop + el.slot.offsetTop + el.slot.offsetHeight / 2;
      const rigCY = el.rig.offsetTop + el.rig.offsetHeight / 2;
      scene.dy = slotCY - rigCY;
      scene.drawerDrop = el.drawer.offsetHeight + scene.dw * 0.1 + 24;
      const top = scroller.getBoundingClientRect().top + scrollY;
      const pinH = $(".how-pin", how).offsetHeight;
      // start a little before the stage pins, so the card is already dropping in as it arrives
      scene.start = top - mh() - pinH * 0.4;
      scene.end = top + scroller.offsetHeight - pinH - mh();
      scene.q = -1; // force a repaint
      kick();
    };

    // promote a callout to its own layer only while it is moving
    const layer = (node, on) => {
      if (scene.wc.get(node) === on) return;
      scene.wc.set(node, on);
      node.style.willChange = on ? "transform,opacity" : "auto";
    };

    scene.paint = function (q) {
      const cw = scene.cw, H = scene.H;
      const S = (a, b) => clamp((q - a) / (b - a), 0, 1);
      const inn = (a, b) => q > a && q < b;

      // 1. arrives: the toploader hangs into view, drops into place, the box is signed for
      const drop = ease(S(0, 0.14));
      const settle = S(0.2, 0.3);
      const rot = -13 * (1 - drop) - 2.5 * drop * (1 - settle);
      let ty = -(H * 0.42) * (1 - drop);
      // 4. into the vault: shrink to slot width first, then sink into the middle slot
      const sinkS = ease(S(0.775, 0.875)), sinkY = ease(S(0.8, 0.93));
      ty += scene.dy * sinkY;
      const scale = 1 - (1 - scene.k) * sinkS;
      el.rig.style.transform = "translate3d(0," + ty.toFixed(1) + "px,0) rotate(" + rot.toFixed(2) + "deg) scale(" + scale.toFixed(4) + ")";

      const st = ease(S(0.1, 0.16)), stOut = S(0.25, 0.29);
      el.stamp.style.opacity = (st * (1 - stOut)).toFixed(3);
      el.stamp.style.transform = "rotate(-7deg) scale(" + (1.5 - 0.5 * st).toFixed(3) + ")";
      layer(el.stamp, inn(0.1, 0.29));

      // 2. inventory: scan the front, turn it over, scan the back, turn it back
      const f1 = ease(S(0.345, 0.405)), f2 = ease(S(0.452, 0.48));
      el.card.style.transform = "perspective(" + Math.round(cw * 7) + "px) rotateY(" + (180 * (f1 - f2)).toFixed(2) + "deg)";
      let by = -1;
      if (q > 0.265 && q < 0.335) by = S(0.265, 0.335);
      else if (q > 0.405 && q < 0.452) by = S(0.405, 0.452);
      el.beam.style.opacity = by < 0 ? 0 : Math.sin(by * Math.PI).toFixed(3);
      if (by >= 0) el.beam.style.transform = "translate3d(0," + (by * cw * 1.411).toFixed(1) + "px,0)";
      layer(el.beam, by >= 0);
      const tg = ease(S(0.415, 0.47)), tgOut = S(0.6, 0.64);
      el.tag.style.opacity = (tg * (1 - tgOut)).toFixed(3);
      el.tag.style.transform = "translate3d(" + ((1 - tg) * -24).toFixed(1) + "px,0,0)";
      layer(el.tag, inn(0.41, 0.645));

      // 3. services: choose a display slab; the card slides out of the toploader and the slab closes around it
      const ch = ease(S(0.5, 0.545)), chOut = S(0.6, 0.635);
      el.chips.style.opacity = (ch * (1 - chOut)).toFixed(3);
      el.chips.style.transform = "translate3d(0," + ((1 - ch) * 12).toFixed(1) + "px,0)";
      el.chips.classList.toggle("picked", q > 0.555);
      layer(el.chips, inn(0.5, 0.64));
      const tl = ease(S(0.56, 0.64));
      el.top.style.opacity = (1 - S(0.585, 0.64)).toFixed(3);
      el.top.style.transform = "translate3d(0," + (tl * cw * 1.4).toFixed(1) + "px,0) rotate(" + (tl * -5).toFixed(2) + "deg)";
      const sl = ease(S(0.635, 0.7));
      el.slab.style.opacity = sl.toFixed(3);
      el.slab.style.transform = "scale(" + (1.22 - 0.22 * sl).toFixed(4) + ")";
      el.glass.style.opacity = sl.toFixed(3);
      const lb = ease(S(0.675, 0.725));
      el.label.style.opacity = lb.toFixed(3);
      el.label.style.transform = "translate3d(0," + ((1 - lb) * -cw * 0.1).toFixed(1) + "px,0)";
      layer(el.label, inn(0.67, 0.73));

      // 4. the drawer slides up to meet it
      const d = ease(S(0.745, 0.86));
      const dt = "translate3d(0," + ((1 - d) * scene.drawerDrop).toFixed(1) + "px,0)";
      el.drawer.style.transform = dt;
      el.lip.style.transform = dt;
      const dn = ease(S(0.915, 0.97));
      el.done.style.opacity = dn.toFixed(3);
      el.done.style.transform = "translate3d(0," + ((1 - dn) * 12).toFixed(1) + "px,0)";
      layer(el.done, inn(0.91, 0.975));

      // the text column and the rail
      const active = Math.min(3, Math.floor(q * 4 + 0.0001));
      if (active !== scene.active) {
        scene.active = active;
        steps.forEach((li, k) => li.classList.toggle("on", k === active));
        bars.forEach((b, k) => { b.classList.toggle("on", k === active); b.setAttribute("aria-current", k === active ? "step" : "false"); });
      }
      bars.forEach((b, k) => b.style.setProperty("--f", clamp(q * 4 - k, 0, 1).toFixed(3)));
    };

    scene.measure();
    addEventListener("resize", () => scene.measure());
    addEventListener("load", () => scene.measure());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => scene.measure());
  }

  /* ---------- the frame loop: runs while scrolling or settling, then sleeps ---------- */
  let lastY = -1, lastT = 0, clock = 0;
  function frame(t) {
    // Lenis gets a steady clock, so the first frame after a pause does not jump straight to the target
    clock += lastT ? Math.min(t - lastT, 34) : 16;
    lastT = t;
    if (lenis) lenis.raf(clock);
    const y = scrollY;
    let busy = y !== lastY;
    if (heroPhoto && busy) {
      heroPhoto.style.transform = wide.matches && y < innerHeight * 1.2 ? "translate3d(0," + (y * 0.18).toFixed(1) + "px,0)" : "";
    }
    lastY = y;
    if (scene) {
      const p = clamp((y - scene.start) / Math.max(1, scene.end - scene.start), 0, 1);
      // a little easing on top of the scroll, so the scene glides on touch screens too
      const q = scene.q < 0 ? p : scene.q + (p - scene.q) * 0.2;
      const qq = Math.abs(p - q) < 0.0004 ? p : q;
      if (qq !== scene.q) { scene.q = qq; scene.paint(qq); }
      if (qq !== p) busy = true;
    }
    if (lenis && lenis.isScrolling) busy = true;
    if (busy) requestAnimationFrame(frame);
    else { running = false; lastT = 0; }
  }
  ["wheel", "touchstart", "touchmove", "scroll", "keydown", "resize"].forEach(ev => addEventListener(ev, kick, { passive: true }));
  kick();

  // if the visitor turns on reduced motion, or the screen gets too short for the scene, reload into the right mode
  if (reduce.addEventListener) reduce.addEventListener("change", e => { if (e.matches) location.reload(); });
  if (tall.addEventListener) tall.addEventListener("change", () => location.reload());
})();
