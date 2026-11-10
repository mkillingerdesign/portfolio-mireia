/* ==========================================================================
   Mireia Killinger — Portfolio · Interacciones
   Funciona con GSAP + ScrollTrigger + Lenis si están disponibles y
   degrada con elegancia (IntersectionObserver) si no cargan.
   ========================================================================== */

(() => {
    "use strict";

    const doc = document.documentElement;
    const body = document.body;
    const hasGSAP = typeof window.gsap !== "undefined";
    const hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isHome = body.classList.contains("page-home");
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
    const lerp = (a, b, n) => a + (b - a) * n;
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    doc.classList.remove("no-js");
    doc.classList.add("js");

    if (hasST) gsap.registerPlugin(ScrollTrigger);

    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } },
        sget(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
        sset(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
    };

    /* ---------- Tema ---------- */
    const themeBtn = $(".theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const next = doc.dataset.theme === "light" ? "dark" : "light";
            doc.dataset.theme = next;
            store.set("theme", next);
            themeBtn.setAttribute("aria-label", next === "light" ? "Activar modo oscuro" : "Activar modo claro");
        });
    }

    /* ---------- Scroll suave (Lenis) ---------- */
    let lenis = null;
    if (!reduced && typeof window.Lenis !== "undefined") {
        lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        if (hasST) {
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        } else {
            const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
            requestAnimationFrame(raf);
        }
    }

    const scrollToTarget = (target) => {
        if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        else if (typeof target === "number") window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
        else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    };

    /* ---------- Menú móvil ---------- */
    const menuBtn = $(".menu-btn");
    const closeMenu = () => {
        body.classList.remove("menu-open");
        if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
        if (lenis) lenis.start();
    };
    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            const open = !body.classList.contains("menu-open");
            body.classList.toggle("menu-open", open);
            menuBtn.setAttribute("aria-expanded", String(open));
            if (lenis) open ? lenis.stop() : lenis.start();
        });
        document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    }

    /* ---------- Anclas internas ---------- */
    $$('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const id = a.getAttribute("href");
            if (id.length < 2) return;
            const target = $(id);
            if (!target) return;
            e.preventDefault();
            closeMenu();
            scrollToTarget(id === "#top" ? 0 : target);
        });
    });

    /* ---------- Transición entre páginas ---------- */
    const veil = $(".page-transition");
    const leave = (href) => {
        if (!veil || reduced) { window.location.href = href; return; }
        veil.style.transformOrigin = "50% 100%";
        if (hasGSAP) {
            gsap.fromTo(veil, { yPercent: 100 }, {
                yPercent: 0, duration: 0.75, ease: "expo.inOut",
                onComplete: () => { window.location.href = href; }
            });
        } else {
            veil.classList.add("is-entering");
            setTimeout(() => { window.location.href = href; }, 300);
        }
    };
    $$("a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
        if (a.target === "_blank" || /^https?:\/\//.test(href) || /\.pdf$/i.test(href)) return;
        if (!/\.html(#.*)?$/.test(href) && href !== "../" && href !== "./") return;
        a.addEventListener("click", (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            leave(a.href);
        });
    });
    window.addEventListener("pageshow", (e) => {
        if (e.persisted && veil) {
            if (hasGSAP) gsap.set(veil, { yPercent: 100 });
            veil.classList.remove("is-entering");
        }
    });

    /* ---------- Reloj ---------- */
    const clocks = $$("[data-clock]");
    if (clocks.length) {
        const fmt = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });
        const tick = () => clocks.forEach((c) => { c.textContent = fmt.format(new Date()); });
        tick();
        setInterval(tick, 15000);
    }

    /* ---------- Header: ocultar al bajar, barra de progreso ---------- */
    const header = $(".header");
    const progress = $(".progress");
    let lastY = 0;
    const onScroll = () => {
        const y = window.scrollY;
        const max = doc.scrollHeight - window.innerHeight;
        if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        if (header && !body.classList.contains("menu-open")) {
            header.classList.toggle("is-hidden", y > lastY && y > 300);
        }
        lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- Cursor personalizado ---------- */
    const cursor = $(".cursor");
    const dot = $(".cursor-dot");
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    if (cursor && dot && finePointer) {
        body.classList.add("has-cursor");
        const label = $(".cursor__label", cursor);
        const pos = { x: mouse.x, y: mouse.y };
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
        }, { passive: true });
        const loop = () => {
            pos.x = lerp(pos.x, mouse.x, 0.18);
            pos.y = lerp(pos.y, mouse.y, 0.18);
            cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
            requestAnimationFrame(loop);
        };
        loop();
        document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
        document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));
        document.addEventListener("mouseover", (e) => {
            const withLabel = e.target.closest("[data-cursor]");
            const link = e.target.closest("a, button, .chip");
            if (withLabel) {
                label.textContent = withLabel.dataset.cursor;
                cursor.classList.add("is-label");
                cursor.classList.remove("is-hover");
            } else {
                cursor.classList.remove("is-label");
                cursor.classList.toggle("is-hover", !!link);
            }
        });
    }

    /* ---------- Magnéticos ---------- */
    if (finePointer && !reduced) {
        $$(".magnetic").forEach((el) => {
            const strength = parseFloat(el.dataset.strength || "0.35");
            el.addEventListener("mousemove", (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * strength;
                const y = (e.clientY - r.top - r.height / 2) * strength;
                if (hasGSAP) gsap.to(el, { x, y, duration: 0.6, ease: "power3.out" });
                else el.style.transform = `translate(${x}px, ${y}px)`;
            });
            el.addEventListener("mouseleave", () => {
                if (hasGSAP) gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
                else el.style.transform = "";
            });
        });
    }

    /* ---------- Split de texto en caracteres ---------- */
    const splitChars = (el) => {
        const walk = (node) => {
            Array.from(node.childNodes).forEach((child) => {
                if (child.nodeType === 3) {
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach((part) => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
                        const w = document.createElement("span");
                        w.className = "char-word";
                        Array.from(part).forEach((ch) => {
                            const s = document.createElement("span");
                            s.className = "char";
                            s.textContent = ch;
                            w.appendChild(s);
                        });
                        frag.appendChild(w);
                    });
                    child.replaceWith(frag);
                } else if (child.nodeType === 1) {
                    walk(child);
                }
            });
        };
        el.setAttribute("aria-label", el.textContent.trim().replace(/\s+/g, " "));
        walk(el);
        $$(".char", el).forEach((c) => c.setAttribute("aria-hidden", "true"));
        return $$(".char", el);
    };

    /* ---------- Reveal genérico ---------- */
    const revealEls = $$("[data-reveal]");
    // Los elementos recortados con clip-path no "intersectan": se observa su contenedor.
    const revealMap = new Map();
    const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
            if (!en.isIntersecting) return;
            (revealMap.get(en.target) || []).forEach((el) => {
                const d = el.dataset.delay;
                if (d) el.style.transitionDelay = d + "s";
                el.classList.add("is-in");
            });
            io.unobserve(en.target);
        });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach((el) => {
        const watch = el.dataset.reveal === "clip" ? el.parentElement : el;
        if (!revealMap.has(watch)) revealMap.set(watch, []);
        revealMap.get(watch).push(el);
        io.observe(watch);
    });

    /* ---------- Títulos que entran letra a letra al hacer scroll ---------- */
    const scrollTitles = $$("[data-split-scroll]");
    const hasGradient = (line) => !!line.querySelector(".serif");
    scrollTitles.forEach((el) => {
        if (reduced || !hasGSAP) return;
        $$(".line-mask > span", el).forEach((line) => {
            const chars = hasGradient(line) ? [line] : splitChars(line);
            gsap.set(chars, { yPercent: 110 });
            const run = () => gsap.to(chars, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.022 });
            if (hasST) ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: run });
            else run();
        });
    });

    /* ---------- Intro de página (hero) ---------- */
    const heroChars = [];
    $$("[data-split-intro] .line-mask > span").forEach((line) => {
        if (line.querySelector(".serif")) heroChars.push(line);
        else heroChars.push(...splitChars(line));
    });
    if (hasGSAP && !reduced) {
        gsap.set(heroChars, { yPercent: 115 });
        gsap.set("[data-intro]", { y: 30, opacity: 0 });
    }

    const playIntro = () => {
        body.classList.remove("is-loading");
        if (!hasGSAP || reduced) return;
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to(heroChars, { yPercent: 0, duration: 1.4, stagger: 0.035 }, 0)
          .to("[data-intro]", { y: 0, opacity: 1, duration: 1.2, stagger: 0.08 }, 0.35);
        if (hasST) ScrollTrigger.refresh();
    };

    /* ---------- Preloader (home) / revelado de velo (subpáginas) ---------- */
    const preloader = $(".preloader");
    if (preloader && hasGSAP && !reduced) {
        const count = $(".preloader__count", preloader);
        const letters = $$(".preloader__name span", preloader);
        const quick = store.sget("visited") === "1";
        store.sset("visited", "1");
        const counter = { v: 0 };
        const tl = gsap.timeline();
        tl.to(letters, { yPercent: -105, duration: 0.9, ease: "expo.out", stagger: 0.03 }, 0)
          .to(counter, {
              v: 100, duration: quick ? 0.7 : 1.7, ease: "power2.inOut",
              onUpdate: () => { count.textContent = String(Math.round(counter.v)).padStart(3, "0"); }
          }, 0)
          .to(letters, { yPercent: -210, duration: 0.6, ease: "expo.in", stagger: 0.02 })
          .to(preloader, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.2")
          .add(playIntro, "-=0.55")
          .set(preloader, { display: "none" });
    } else {
        if (preloader) preloader.style.display = "none";
        if (veil && hasGSAP && !reduced) {
            gsap.set(veil, { yPercent: 0 });
            gsap.to(veil, { yPercent: -100, duration: 0.9, ease: "expo.inOut", delay: 0.05, onComplete: () => gsap.set(veil, { yPercent: 100 }) });
            gsap.delayedCall(0.35, playIntro);
        } else {
            if (veil) veil.classList.remove("is-entering");
            playIntro();
        }
    }

    /* ---------- Rotador de palabras ---------- */
    const rotator = $(".rotator__list");
    if (rotator) {
        const items = $$("span", rotator);
        let i = 0;
        if (items.length > 1 && !reduced) {
            rotator.appendChild(items[0].cloneNode(true));
            const step = () => {
                i++;
                rotator.style.transition = "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)";
                rotator.style.transform = `translateY(${-i * 1.2}em)`;
                if (i === items.length) {
                    setTimeout(() => {
                        rotator.style.transition = "none";
                        rotator.style.transform = "translateY(0)";
                        i = 0;
                    }, 820);
                }
            };
            setInterval(step, 2200);
        }
    }

    /* ---------- Estela de imágenes en el hero ---------- */
    const trail = $(".hero__trail");
    if (trail && finePointer && !reduced) {
        const srcs = (trail.dataset.images || "").split(",").map((s) => s.trim()).filter(Boolean);
        const pool = srcs.map((src) => {
            const img = new Image();
            img.src = src;
            img.alt = "";
            img.decoding = "async";
            trail.appendChild(img);
            return img;
        });
        const hero = trail.parentElement;
        let idx = 0, last = { x: 0, y: 0 }, z = 1;
        hero.addEventListener("mousemove", (e) => {
            const r = hero.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            if (Math.hypot(x - last.x, y - last.y) < 110) return;
            last = { x, y };
            const img = pool[idx % pool.length];
            idx++;
            img.style.zIndex = z++;
            const w = img.offsetWidth || 200, h = img.offsetHeight || 250;
            if (hasGSAP) {
                gsap.killTweensOf(img);
                gsap.fromTo(img,
                    { x: x - w / 2, y: y - h / 2, opacity: 1, scale: 0.6, rotate: gsap.utils.random(-12, 12) },
                    { scale: 1, duration: 0.6, ease: "expo.out" });
                gsap.to(img, { opacity: 0, scale: 0.85, y: `+=${60}`, duration: 0.9, delay: 0.55, ease: "power3.in" });
            } else {
                img.style.transform = `translate(${x - w / 2}px, ${y - h / 2}px)`;
                img.style.opacity = 1;
                setTimeout(() => { img.style.opacity = 0; }, 600);
            }
        });
    }

    /* ---------- Marquee con velocidad dependiente del scroll ---------- */
    $$(".marquee").forEach((mq) => {
        const track = $(".marquee__track", mq);
        const group = $(".marquee__group", track);
        if (!track || !group) return;
        track.appendChild(group.cloneNode(true)).setAttribute("aria-hidden", "true");
        let x = 0, dir = mq.dataset.dir === "right" ? 1 : -1, boost = 0, prevY = window.scrollY;
        const base = parseFloat(mq.dataset.speed || "0.6");
        const loop = () => {
            const y = window.scrollY;
            const dy = y - prevY;
            prevY = y;
            if (Math.abs(dy) > 0.5) dir = (dy > 0 ? -1 : 1) * (mq.dataset.dir === "right" ? -1 : 1);
            boost = lerp(boost, Math.min(Math.abs(dy) * 0.35, 14), 0.1);
            const w = group.offsetWidth;
            x += (base + boost) * dir;
            if (x <= -w) x += w;
            if (x > 0) x -= w;
            track.style.transform = `translate3d(${x}px,0,0)`;
            if (!reduced) requestAnimationFrame(loop);
        };
        loop();
    });

    /* ---------- Frase que se ilumina palabra a palabra ---------- */
    $$("[data-words]").forEach((el) => {
        const wrapWords = (node) => {
            Array.from(node.childNodes).forEach((child) => {
                if (child.nodeType === 3) {
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach((part) => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                        const s = document.createElement("span");
                        s.className = "word";
                        s.textContent = part;
                        frag.appendChild(s);
                    });
                    child.replaceWith(frag);
                } else if (child.nodeType === 1) {
                    wrapWords(child);
                }
            });
        };
        wrapWords(el);
        const words = $$(".word", el);
        if (reduced) return;
        if (hasST) {
            gsap.to(words, {
                opacity: 1, ease: "none", stagger: 0.1,
                scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true }
            });
        } else {
            words.forEach((w) => { w.style.opacity = 1; });
        }
    });

    /* ---------- Contadores ---------- */
    $$("[data-count]").forEach((el) => {
        const end = parseInt(el.dataset.count, 10);
        const obs = new IntersectionObserver(([en]) => {
            if (!en.isIntersecting) return;
            obs.disconnect();
            if (reduced) { el.textContent = end; return; }
            const t0 = performance.now(), dur = 1600;
            const step = (t) => {
                const p = clamp((t - t0) / dur, 0, 1);
                el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
                if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }, { threshold: 0.6 });
        obs.observe(el);
    });

    /* ---------- Parallax simple ---------- */
    if (hasST && !reduced) {
        $$("[data-speed]").forEach((el) => {
            const s = parseFloat(el.dataset.speed);
            gsap.fromTo(el, { yPercent: -s * 10 }, {
                yPercent: s * 10, ease: "none",
                scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
            });
        });
    }

    /* ---------- Índice de áreas con vista previa flotante ---------- */
    const preview = $(".hover-preview");
    if (preview && finePointer) {
        const imgs = $$("img", preview);
        const pos = { x: 0, y: 0, cx: 0, cy: 0 };
        let active = false, raf = null, cycle = null;
        const move = () => {
            pos.cx = lerp(pos.cx, pos.x, 0.12);
            pos.cy = lerp(pos.cy, pos.y, 0.12);
            const rot = clamp((pos.x - pos.cx) * 0.08, -12, 12);
            preview.style.transform = `translate3d(${pos.cx - preview.offsetWidth / 2}px, ${pos.cy - preview.offsetHeight / 2}px, 0) rotate(${rot}deg) scale(${active ? 1 : 0.6})`;
            raf = requestAnimationFrame(move);
        };
        const show = (key) => {
            const set = imgs.filter((im) => im.dataset.key === key);
            let k = 0;
            const paint = () => imgs.forEach((im) => im.classList.toggle("is-active", im === set[k % set.length]));
            paint();
            clearInterval(cycle);
            cycle = setInterval(() => { k++; paint(); }, 700);
        };
        $$(".index-row").forEach((row) => {
            row.addEventListener("mouseenter", (e) => {
                active = true;
                pos.x = pos.cx = e.clientX;
                pos.y = pos.cy = e.clientY;
                show(row.dataset.key);
                preview.style.transition = "opacity .3s";
                preview.style.opacity = 1;
                if (!raf) move();
            });
            row.addEventListener("mousemove", (e) => { pos.x = e.clientX; pos.y = e.clientY; });
            row.addEventListener("mouseleave", () => {
                active = false;
                preview.style.opacity = 0;
                clearInterval(cycle);
            });
        });
    }

    /* ---------- Scroll horizontal fijado (proyectos destacados) ---------- */
    const showcase = $(".showcase");
    if (showcase && hasST && !reduced) {
        const track = $(".showcase__track", showcase);
        const mm = gsap.matchMedia();
        mm.add("(min-width: 861px)", () => {
            const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
            const tween = gsap.to(track, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                    trigger: showcase,
                    start: "top top",
                    end: () => "+=" + distance(),
                    pin: true,
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                    anticipatePin: 1
                }
            });
            $$(".card__media img", track).forEach((img) => {
                gsap.fromTo(img, { xPercent: -6 }, {
                    xPercent: 6, ease: "none",
                    scrollTrigger: { trigger: img.closest(".card"), containerAnimation: tween, start: "left right", end: "right left", scrub: true }
                });
            });
            const bar = $(".showcase__bar i", showcase);
            if (bar) {
                ScrollTrigger.create({
                    trigger: showcase, start: "top top", end: () => "+=" + distance(),
                    onUpdate: (self) => { bar.style.transform = `scaleX(${self.progress})`; }
                });
            }
        });
    }

    /* ---------- Playground de herramientas arrastrables ---------- */
    const playground = $(".playground");
    if (playground) {
        const stickers = $$(".sticker", playground);
        let zTop = 10;
        const place = () => {
            const W = playground.clientWidth, H = playground.clientHeight;
            stickers.forEach((s, i) => {
                const w = s.offsetWidth, h = s.offsetHeight;
                const cols = Math.max(2, Math.floor(W / 190));
                const col = i % cols, row = Math.floor(i / cols);
                const rows = Math.ceil(stickers.length / cols);
                const x = clamp((col + 0.5) * (W / cols) - w / 2 + (Math.random() - 0.5) * 50, 8, W - w - 8);
                const y = clamp(70 + (row + 0.5) * ((H - 90) / rows) - h / 2 + (Math.random() - 0.5) * 30, 50, H - h - 8);
                s._x = x; s._y = y; s._r = (Math.random() - 0.5) * 24;
                s.style.transform = `translate(${x}px, ${y}px) rotate(${s._r}deg)`;
            });
        };
        place();
        window.addEventListener("resize", () => { clearTimeout(place._t); place._t = setTimeout(place, 200); });

        if (hasGSAP && !reduced) {
            gsap.set(stickers, { opacity: 0 });
            const drop = () => {
                stickers.forEach((s, i) => {
                    gsap.fromTo(s, { opacity: 0, y: -300 }, {
                        opacity: 1, y: 0, duration: 1.2, delay: i * 0.06, ease: "bounce.out",
                        onUpdate: function () {
                            const dy = gsap.getProperty(s, "y");
                            s.style.transform = `translate(${s._x}px, ${s._y + dy}px) rotate(${s._r}deg)`;
                        }
                    });
                });
            };
            const o = new IntersectionObserver(([en]) => { if (en.isIntersecting) { o.disconnect(); drop(); } }, { threshold: 0.35 });
            o.observe(playground);
        }

        stickers.forEach((s) => {
            let sx, sy, ox, oy, vx = 0, lastX = 0;
            s.addEventListener("pointerdown", (e) => {
                e.preventDefault();
                s.setPointerCapture(e.pointerId);
                s.classList.add("is-dragging");
                s.style.zIndex = ++zTop;
                sx = e.clientX; sy = e.clientY; ox = s._x; oy = s._y; lastX = e.clientX;
                if (lenis) lenis.stop();
            });
            s.addEventListener("pointermove", (e) => {
                if (!s.classList.contains("is-dragging")) return;
                const W = playground.clientWidth, H = playground.clientHeight;
                s._x = clamp(ox + e.clientX - sx, 0, W - s.offsetWidth);
                s._y = clamp(oy + e.clientY - sy, 0, H - s.offsetHeight);
                vx = e.clientX - lastX; lastX = e.clientX;
                const r = s._r + clamp(vx * 1.5, -25, 25);
                s.style.transform = `translate(${s._x}px, ${s._y}px) rotate(${r}deg)`;
            });
            const end = () => {
                if (!s.classList.contains("is-dragging")) return;
                s.classList.remove("is-dragging");
                s._r = clamp(s._r + vx, -30, 30);
                s.style.transition = "transform .6s cubic-bezier(.16,1,.3,1), box-shadow .3s, scale .3s";
                s.style.transform = `translate(${s._x}px, ${s._y}px) rotate(${s._r}deg)`;
                setTimeout(() => { s.style.transition = ""; }, 620);
                if (lenis) lenis.start();
            };
            s.addEventListener("pointerup", end);
            s.addEventListener("pointercancel", end);
        });

        const shuffle = $("[data-shuffle]");
        if (shuffle) {
            shuffle.addEventListener("click", () => {
                stickers.forEach((s) => { s.style.transition = "transform .9s cubic-bezier(.16,1,.3,1)"; });
                place();
                setTimeout(() => stickers.forEach((s) => { s.style.transition = ""; }), 950);
            });
        }
    }

    /* ---------- Acordeón de experiencia ---------- */
    $$(".job").forEach((job) => {
        const btn = $(".job__head", job);
        btn.addEventListener("click", () => {
            const open = !job.classList.contains("is-open");
            $$(".job.is-open").forEach((j) => {
                if (j !== job) { j.classList.remove("is-open"); $(".job__head", j).setAttribute("aria-expanded", "false"); }
            });
            job.classList.toggle("is-open", open);
            btn.setAttribute("aria-expanded", String(open));
            if (hasST) setTimeout(() => ScrollTrigger.refresh(), 750);
        });
    });

    /* ---------- Tarjetas con brillo e inclinación ---------- */
    $$(".edu-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const r = card.getBoundingClientRect();
            const mx = e.clientX - r.left, my = e.clientY - r.top;
            card.style.setProperty("--mx", mx + "px");
            card.style.setProperty("--my", my + "px");
            if (!reduced && finePointer) {
                const rx = ((my / r.height) - 0.5) * -6, ry = ((mx / r.width) - 0.5) * 6;
                card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            }
        });
        card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });

    /* ---------- Barras de idiomas ---------- */
    $$(".lang").forEach((l) => {
        const o = new IntersectionObserver(([en]) => {
            if (en.isIntersecting) { l.classList.add("is-in"); o.disconnect(); }
        }, { threshold: 0.6 });
        o.observe(l);
    });

    /* ---------- Texto gigante de contacto que se desliza ---------- */
    if (hasST && !reduced) {
        $$("[data-slide-x]").forEach((el) => {
            const amt = parseFloat(el.dataset.slideX);
            gsap.fromTo(el, { xPercent: amt }, {
                xPercent: -amt, ease: "none",
                scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
            });
        });
    }

    /* ---------- Copiar email ---------- */
    const toast = $(".toast");
    $$("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const text = btn.dataset.copy;
            let ok = false;
            try { await navigator.clipboard.writeText(text); ok = true; } catch (e) { ok = false; }
            if (toast) {
                toast.textContent = ok ? "Email copiado ✦ " + text : text;
                toast.classList.add("is-visible");
                clearTimeout(toast._t);
                toast._t = setTimeout(() => toast.classList.remove("is-visible"), 2600);
            }
        });
    });

    /* ---------- Carrusel de fundido ---------- */
    $$(".fader").forEach((fader) => {
        const imgs = $$("img", fader);
        const dotsWrap = $(".fader__dots", fader);
        const countEl = $(".fader__count", fader);
        let i = 0, timer = null;
        const dots = imgs.map((_, k) => {
            const b = document.createElement("button");
            b.type = "button";
            b.setAttribute("aria-label", `Ver imagen ${k + 1}`);
            b.addEventListener("click", (e) => { e.stopPropagation(); go(k); });
            if (dotsWrap) dotsWrap.appendChild(b);
            return b;
        });
        const go = (k) => {
            i = (k + imgs.length) % imgs.length;
            imgs.forEach((im, n) => im.classList.toggle("is-active", n === i));
            dots.forEach((d, n) => {
                d.classList.remove("is-active");
                if (n === i) { void d.offsetWidth; d.classList.add("is-active"); }
            });
            if (countEl) countEl.textContent = `${String(i + 1).padStart(2, "0")} / ${String(imgs.length).padStart(2, "0")}`;
            clearTimeout(timer);
            if (!reduced) timer = setTimeout(() => go(i + 1), 4500);
        };
        go(0);
    });

    /* ---------- Vídeos con botón de reproducción ---------- */
    $$(".video-tile").forEach((tile) => {
        const video = $("video", tile);
        const play = $(".video-tile__play", tile);
        if (!video || !play) return;
        play.addEventListener("click", () => {
            $$(".video-tile.is-playing video").forEach((v) => { if (v !== video) v.pause(); });
            video.controls = true;
            video.play();
        });
        video.addEventListener("play", () => tile.classList.add("is-playing"));
        video.addEventListener("pause", () => { if (video.currentTime === 0 || video.ended) tile.classList.remove("is-playing"); });
        video.addEventListener("ended", () => tile.classList.remove("is-playing"));
    });

    /* ---------- Lightbox con navegación ---------- */
    const lb = $(".lightbox");
    if (lb) {
        const lbImg = $(".lightbox__img", lb);
        const lbCap = $(".lightbox__caption", lb);
        const lbCount = $(".lightbox__count", lb);
        let items = [], index = 0, opener = null;

        const render = () => {
            const it = items[index];
            lbImg.classList.remove("is-ready");
            const img = new Image();
            img.onload = () => {
                lbImg.src = it.src;
                lbImg.alt = it.alt;
                requestAnimationFrame(() => lbImg.classList.add("is-ready"));
            };
            img.src = it.src;
            lbCap.textContent = it.caption || it.alt || "";
            lbCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
        };
        const open = (group, start) => {
            items = group;
            index = start;
            render();
            lb.classList.add("is-open");
            lb.setAttribute("aria-hidden", "false");
            if (lenis) lenis.stop();
            body.style.overflow = "hidden";
            $(".lightbox__close", lb).focus();
        };
        const close = () => {
            lb.classList.remove("is-open");
            lb.setAttribute("aria-hidden", "true");
            if (lenis) lenis.start();
            body.style.overflow = "";
            if (opener) opener.focus();
        };
        const step = (d) => { index = (index + d + items.length) % items.length; render(); };

        $$("[data-lightbox]").forEach((tile) => {
            tile.addEventListener("click", () => {
                const groupName = tile.dataset.lightbox;
                const groupTiles = $$(`[data-lightbox="${groupName}"]`);
                const group = [];
                let start = 0;
                groupTiles.forEach((t) => {
                    if (t === tile) start = group.length;
                    const cap = t.dataset.caption || "";
                    $$("img", t).forEach((im) => {
                        if (im.closest(".tile__flip-hint")) return;
                        group.push({ src: im.dataset.full || im.currentSrc || im.src, alt: im.alt, caption: cap });
                    });
                });
                opener = tile;
                open(group, start);
            });
        });

        $(".lightbox__close", lb).addEventListener("click", close);
        $(".lightbox__prev", lb).addEventListener("click", () => step(-1));
        $(".lightbox__next", lb).addEventListener("click", () => step(1));
        $(".lightbox__stage", lb).addEventListener("click", (e) => { if (e.target === e.currentTarget) close(); });
        document.addEventListener("keydown", (e) => {
            if (!lb.classList.contains("is-open")) return;
            if (e.key === "Escape") close();
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
        });
        let tx = null;
        lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
        lb.addEventListener("touchend", (e) => {
            if (tx === null) return;
            const dx = e.changedTouches[0].clientX - tx;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            tx = null;
        });
    }


    /* ---------- Estilo digital: luces, brillo y vídeos ---------- */

    // Las luces del fondo se desplazan un poco con el ratón.
    const mesh = $(".mesh");
    if (mesh && finePointer && !reduced) {
        const m = { x: 0, y: 0, cx: 0, cy: 0 };
        window.addEventListener("mousemove", (e) => {
            m.x = (e.clientX / window.innerWidth - 0.5) * 40;
            m.y = (e.clientY / window.innerHeight - 0.5) * 40;
        }, { passive: true });
        const meshLoop = () => {
            m.cx = lerp(m.cx, m.x, 0.04);
            m.cy = lerp(m.cy, m.y, 0.04);
            mesh.style.transform = `translate3d(${m.cx}px, ${m.cy}px, 0)`;
            requestAnimationFrame(meshLoop);
        };
        meshLoop();
    }

    // Brillo que sigue al ratón dentro de las superficies de cristal.
    const spotSel = ".ai-card, .index-row, .job, .edu-card, .skill-group, .lang, .social, .stat, .showcase__end, .profile, .tile__media, .card__media, .feature";
    $$(spotSel).forEach((el) => {
        el.classList.add("spot");
        el.addEventListener("pointermove", (e) => {
            const r = el.getBoundingClientRect();
            el.style.setProperty("--mx", (e.clientX - r.left) + "px");
            el.style.setProperty("--my", (e.clientY - r.top) + "px");
        });
    });

    // Tarjeta de perfil con inclinación 3D.
    $$("[data-tilt]").forEach((el) => {
        if (!finePointer || reduced) return;
        el.addEventListener("mousemove", (e) => {
            const r = el.getBoundingClientRect();
            const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
            const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
            el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    // Vídeos de las tarjetas: se reproducen al pasar el ratón (o al verse, en móvil).
    $$("[data-hover-video]").forEach((card) => {
        const v = $("video", card);
        if (!v) return;
        const play = () => { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); };
        if (finePointer) {
            card.addEventListener("mouseenter", play);
            card.addEventListener("mouseleave", () => v.pause());
        } else if (!reduced) {
            const o = new IntersectionObserver(([en]) => { en.isIntersecting ? play() : v.pause(); }, { threshold: 0.6 });
            o.observe(card);
        }
    });

    /* ---------- Refrescar tras cargar imágenes ---------- */
    window.addEventListener("load", () => { if (hasST) ScrollTrigger.refresh(); });
})();
