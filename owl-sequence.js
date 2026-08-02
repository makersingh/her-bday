/* ============================================================
   HOGWARTS ACCEPTANCE LETTER — Cinematic Sequence Logic
   Uses GSAP + MotionPathPlugin for all major animations.
   ============================================================ */

(function () {
    'use strict';

    // ── State ──
    let sequenceActive = false;
    let idleTimelines = [];
    let dustInterval = null;
    let sealParticleInterval = null;
    let audioCtx = null;

    // ══════════════════════════════════════════
    //  WEB AUDIO — Procedural sound effects
    // ══════════════════════════════════════════

    function getAudioCtx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }

    /** Soft wind ambience (filtered white noise, fades in/out over ~4 s) */
    function playWindSound() {
        try {
            const ctx = getAudioCtx();
            const len = ctx.sampleRate * 4;
            const buf = ctx.createBuffer(1, len, ctx.sampleRate);
            const d = buf.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.02;
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const lp = ctx.createBiquadFilter();
            lp.type = 'lowpass'; lp.frequency.value = 350;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0, ctx.currentTime);
            g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);
            g.gain.linearRampToValueAtTime(0, ctx.currentTime + 3.8);
            src.connect(lp); lp.connect(g); g.connect(ctx.destination);
            src.start(); src.stop(ctx.currentTime + 4);
        } catch (e) { /* silent fail */ }
    }

    /** Short wax-crack percussive burst */
    function playWaxCrack() {
        try {
            const ctx = getAudioCtx();
            const t = ctx.currentTime;
            // Noise burst
            const len = ctx.sampleRate * 0.15;
            const buf = ctx.createBuffer(1, len, ctx.sampleRate);
            const d = buf.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1);
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const hp = ctx.createBiquadFilter();
            hp.type = 'highpass'; hp.frequency.value = 1800;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.25, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            src.connect(hp); hp.connect(g); g.connect(ctx.destination);
            src.start(); src.stop(t + 0.15);
        } catch (e) { /* silent fail */ }
    }

    /** Paper rustle (bandpass filtered noise) */
    function playPaperRustle() {
        try {
            const ctx = getAudioCtx();
            const t = ctx.currentTime;
            const len = ctx.sampleRate * 0.4;
            const buf = ctx.createBuffer(1, len, ctx.sampleRate);
            const d = buf.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1);
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const bp = ctx.createBiquadFilter();
            bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 0.5;
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.04, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            src.connect(bp); bp.connect(g); g.connect(ctx.destination);
            src.start(); src.stop(t + 0.4);
        } catch (e) { /* silent fail */ }
    }

    // ══════════════════════════════════════════
    //  PARTICLE SYSTEMS
    // ══════════════════════════════════════════

    /** Creates a single golden dust mote that floats upward */
    function spawnDust(container) {
        const p = document.createElement('div');
        p.className = 'owl-dust-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = (60 + Math.random() * 40) + '%';
        container.appendChild(p);
        gsap.fromTo(p,
            { opacity: 0, scale: 0 },
            {
                opacity: 0.3 + Math.random() * 0.5,
                scale: 0.5 + Math.random() * 1.2,
                y: -(60 + Math.random() * 100),
                x: (Math.random() - 0.5) * 80,
                duration: 2 + Math.random() * 2.5,
                ease: 'none',
                onComplete: () => p.remove()
            }
        );
    }

    function startDust(container) {
        dustInterval = setInterval(() => spawnDust(container), 160);
    }
    function stopDust() { clearInterval(dustInterval); dustInterval = null; }

    /** Tiny golden spark near the wax seal on hover */
    function spawnSealParticle(container) {
        const p = document.createElement('div');
        p.className = 'seal-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        container.appendChild(p);
        gsap.fromTo(p, { opacity: 0, scale: 0 }, {
            opacity: 0.8, scale: 1,
            y: -(10 + Math.random() * 25),
            x: (Math.random() - 0.5) * 25,
            duration: 0.7,
            ease: 'power1.out',
            onComplete: () => p.remove()
        });
    }

    /** Sparkle on owl hover */
    function spawnOwlSparkle(owlEl) {
        const s = document.createElement('div');
        s.className = 'owl-sparkle';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 80 + '%';
        owlEl.appendChild(s);
        gsap.fromTo(s, { opacity: 0, scale: 0 }, {
            opacity: 1, scale: 1.5,
            y: -(10 + Math.random() * 18),
            duration: 0.55,
            ease: 'power1.out',
            onComplete: () => s.remove()
        });
    }

    // ══════════════════════════════════════════
    //  MUSIC VOLUME HELPERS
    // ══════════════════════════════════════════

    function lowerMusic(vol) {
        ['bg-music', 'global-audio'].forEach(id => {
            const a = document.getElementById(id);
            if (a && !a.paused) gsap.to(a, { volume: vol, duration: 1.5 });
        });
    }
    function restoreMusic() {
        const bg = document.getElementById('bg-music');
        const gl = document.getElementById('global-audio');
        if (bg && !bg.paused) gsap.to(bg, { volume: 0.3, duration: 1.5 });
        if (gl && !gl.paused) gsap.to(gl, { volume: 1.0, duration: 1.5 });
    }

    // ══════════════════════════════════════════
    //  SCENE BUILDERS — Each returns a GSAP tl
    // ══════════════════════════════════════════

    /* ─────── Scene 1: Magical Pause ─────── */
    function buildPause() {
        const tl = gsap.timeline();
        const dust = document.getElementById('owl-dust-container');
        tl.add(() => { lowerMusic(0.1); playWindSound(); })
          .to({}, { duration: 0.2 })            // brief hush (faster)
          .add(() => startDust(dust))
          .to({}, { duration: 0.3 });            // let a few motes appear (faster)
        return tl;
    }

    /* ─────── Scene 2 + 5: Owl Entrance (curved MotionPath + wing flap + envelope swing) ─────── */
    function buildEntrance() {
        const tl = gsap.timeline();
        const owl = document.getElementById('owl-container');
        const wL  = document.getElementById('owl-wing-left');
        const wR  = document.getElementById('owl-wing-right');
        const env = document.getElementById('owl-envelope-attached');

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const cx = vw / 2 - 80;
        const cy = vh / 2 - 110;

        // Set SVG transform origins at shoulder joints
        gsap.set(wL, { svgOrigin: '70 130' });
        gsap.set(wR, { svgOrigin: '130 130' });

        // Start owl off-screen top-right, small
        gsap.set(owl, { x: vw + 120, y: -160, scale: 0.3, rotation: -12, opacity: 1 });

        // Wing flapping sub-timeline (repeats during flight)
        const flap = gsap.timeline({ repeat: 5 });
        flap.to(wL, { rotation: -28, duration: 0.18, ease: 'power2.out' }, 0)
            .to(wR, { rotation: 28,  duration: 0.18, ease: 'power2.out' }, 0)
            .to(wL, { rotation: 12,  duration: 0.22, ease: 'power2.in' },  0.18)
            .to(wR, { rotation: -12, duration: 0.22, ease: 'power2.in' },  0.18)
            .to(wL, { rotation: 0,   duration: 0.12 }, 0.40)
            .to(wR, { rotation: 0,   duration: 0.12 }, 0.40);

        // Envelope pendulum swing during flight
        const swing = gsap.timeline({ repeat: 7 });
        swing.to(env, { rotation: 10,  duration: 0.25, ease: 'sine.inOut' })
             .to(env, { rotation: -10, duration: 0.25, ease: 'sine.inOut' })
             .to(env, { rotation: 0,   duration: 0.15, ease: 'sine.out'   });

        // Curved flight path (MotionPathPlugin)
        tl.to(owl, {
            motionPath: {
                path: [
                    { x: vw * 0.65, y: vh * 0.12 },
                    { x: vw * 0.45, y: vh * 0.28 },
                    { x: cx, y: cy }
                ],
                curviness: 1.5
            },
            scale: 1, rotation: 0,
            duration: 1.4,
            ease: 'power2.out'
        }, 0)
        .add(flap, 0)
        .add(swing, 0);

        return tl;
    }

    /* ─────── Scene 3: Background Blur ─────── */
    function buildBlur() {
        const tl = gsap.timeline();
        const bd = document.getElementById('owl-blur-backdrop');
        // GSAP can't directly tween backdrop-filter, so we toggle a CSS variable
        tl.to(bd, {
            backgroundColor: 'rgba(0,0,0,0.45)',
            duration: 0.8,
            ease: 'power2.out',
            onStart: () => {
                bd.style.backdropFilter = 'blur(12px)';
                bd.style.webkitBackdropFilter = 'blur(12px)';
                bd.style.transition = 'backdrop-filter 0.8s ease, -webkit-backdrop-filter 0.8s ease';
            }
        });
        return tl;
    }

    /* ─────── Scene 4: Owl Idle (looping) ─────── */
    function startIdle() {
        const owl = document.getElementById('owl-container');
        const wL  = document.getElementById('owl-wing-left');
        const wR  = document.getElementById('owl-wing-right');
        const head = document.getElementById('owl-head');
        const lidL = document.getElementById('owl-lid-left');
        const lidR = document.getElementById('owl-lid-right');
        const feat = document.getElementById('owl-chest-feathers');
        const env  = document.getElementById('owl-envelope-attached');

        // Gentle hover float
        const f1 = gsap.timeline({ repeat: -1, yoyo: true });
        f1.to(owl, { y: '+=10', duration: 1.6, ease: 'sine.inOut' });
        idleTimelines.push(f1);

        // Slow wing pulse every ~2.5 s
        const f2 = gsap.timeline({ repeat: -1, repeatDelay: 2.2 });
        f2.to(wL, { rotation: -10, duration: 0.45, ease: 'sine.inOut' }, 0)
          .to(wR, { rotation: 10,  duration: 0.45, ease: 'sine.inOut' }, 0)
          .to(wL, { rotation: 0,   duration: 0.45, ease: 'sine.inOut' }, 0.45)
          .to(wR, { rotation: 0,   duration: 0.45, ease: 'sine.inOut' }, 0.45);
        idleTimelines.push(f2);

        // Occasional head turn
        const f3 = gsap.timeline({ repeat: -1, repeatDelay: 2.5 });
        f3.to(head, { rotation: 8, duration: 0.7, ease: 'power1.inOut' })
          .to(head, { rotation: 0, duration: 0.5, ease: 'power1.inOut', delay: 0.8 })
          .to(head, { rotation: -6, duration: 0.6, ease: 'power1.inOut', delay: 1.2 })
          .to(head, { rotation: 0, duration: 0.4, ease: 'power1.inOut', delay: 0.6 });
        idleTimelines.push(f3);

        // Eye blink
        const f4 = gsap.timeline({ repeat: -1, repeatDelay: 2.5 + Math.random() * 2 });
        f4.to([lidL, lidR], { attr: { ry: 10 }, duration: 0.08, ease: 'power2.in' })
          .to([lidL, lidR], { attr: { ry: 0 },  duration: 0.12, ease: 'power2.out' });
        idleTimelines.push(f4);

        // Feather micro-rustle
        const f5 = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.8 });
        f5.to(feat, { x: 0.5, y: 0.3, duration: 0.9, ease: 'sine.inOut' });
        idleTimelines.push(f5);

        // Envelope gentle pendulum while owl hovers
        const f6 = gsap.timeline({ repeat: -1, yoyo: true });
        f6.to(env, { rotation: 6, duration: 1.3, ease: 'sine.inOut' })
          .to(env, { rotation: -6, duration: 1.3, ease: 'sine.inOut' });
        idleTimelines.push(f6);
    }

    function stopIdle() {
        idleTimelines.forEach(t => t.kill());
        idleTimelines = [];
    }

    /* ─────── Scene 6: Owl Click → release envelope & fly away ─────── */
    function buildRelease() {
        const tl = gsap.timeline();
        const owl = document.getElementById('owl-container');
        const env = document.getElementById('owl-envelope-attached');
        const envScene = document.getElementById('envelope-scene');
        const wL = document.getElementById('owl-wing-left');
        const wR = document.getElementById('owl-wing-right');

        tl.add(() => stopIdle())

          // Envelope detaches — drops down and fades
          .to(env, { y: 60, opacity: 0, duration: 0.7, ease: 'power1.in' }, 0)

          // Show the presentation envelope (enlarged, center)
          .add(() => { envScene.style.display = 'flex'; }, 0.5)
          .fromTo(envScene, { opacity: 0, scale: 0.25 }, {
              opacity: 1, scale: 1,
              duration: 1, ease: 'back.out(1.2)'
          }, 0.5)

          // Owl departure — big flap then fly up-left
          .to(wL, { rotation: -35, duration: 0.14 }, 0.7)
          .to(wR, { rotation: 35,  duration: 0.14 }, 0.7)
          .to(wL, { rotation: 15,  duration: 0.18 }, 0.84)
          .to(wR, { rotation: -15, duration: 0.18 }, 0.84)
          .to(owl, {
              x: -250, y: -350, scale: 0.15, opacity: 0,
              duration: 2, ease: 'power2.in'
          }, 0.8);

        return tl;
    }

    /* ─────── Scene 7a: Envelope flip (front → back) ─────── */
    function buildFlip() {
        const tl = gsap.timeline({ paused: true });
        tl.add(() => playPaperRustle())
          .to('#envelope-3d', { rotateY: 180, duration: 1.4, ease: 'power2.inOut' });
        return tl;
    }

    /* ─────── Scene 7b: Wax seal crack → flap open → letter reveal ─────── */
    function buildCrack() {
        const tl = gsap.timeline({ paused: true });
        const seal = document.getElementById('wax-seal');
        const sealBox = document.getElementById('wax-seal-container');
        const flap = document.getElementById('envelope-flap');
        const envScene = document.getElementById('envelope-scene');
        const letScene = document.getElementById('letter-scene');

        tl.add(() => playWaxCrack())

          // Seal pops and fragments
          .to(seal, { scale: 1.2, duration: 0.08, ease: 'power4.out' })
          .to(seal, { scale: 0, opacity: 0, rotation: 25, duration: 0.35, ease: 'power2.in' })
          .add(() => spawnSealFragments(sealBox), 0.08)

          // Flap unfolds
          .to(flap, { rotateX: 180, duration: 1.1, ease: 'power2.inOut' }, 0.5)
          .add(() => playPaperRustle(), 1.4)

          // Envelope shrinks away
          .to(envScene, { scale: 0.25, opacity: 0, duration: 0.7, ease: 'power2.in' }, 1.8)
          .add(() => { envScene.style.display = 'none'; })

          // Letter appears — starts slightly folded/rotated, then straightens
          .add(() => { letScene.style.display = 'flex'; })
          .fromTo(letScene, { opacity: 0, scale: 0.6, rotation: -2.5 }, {
              opacity: 1, scale: 1, rotation: 0,
              duration: 1.3, ease: 'power3.out'
          })
          .add(() => startLetterIdle());

        return tl;
    }

    /** Wax seal fragment explosion */
    function spawnSealFragments(container) {
        for (let i = 0; i < 7; i++) {
            const f = document.createElement('div');
            f.style.cssText =
                'position:absolute;left:50%;top:50%;width:12px;height:12px;' +
                'background:#6b1515;border-radius:30% 70% 50% 50%;pointer-events:none;';
            container.appendChild(f);
            const a = (i / 7) * 360 * Math.PI / 180;
            gsap.to(f, {
                x: Math.cos(a) * (50 + Math.random() * 35),
                y: Math.sin(a) * (50 + Math.random() * 35),
                rotation: Math.random() * 360,
                opacity: 0, scale: 0.3,
                duration: 0.55, ease: 'power2.out',
                onComplete: () => f.remove()
            });
        }
    }

    /** Letter paper gentle idle effects */
    function startLetterIdle() {
        const paper = document.getElementById('letter-paper');
        const dustC = document.getElementById('letter-dust-container');

        const s1 = gsap.timeline({ repeat: -1, yoyo: true });
        s1.to(paper, { rotation: 0.25, y: '+=3', duration: 2.5, ease: 'sine.inOut' });
        idleTimelines.push(s1);

        // Occasional dust around letter
        const intv = setInterval(() => {
            if (!sequenceActive) { clearInterval(intv); return; }
            const p = document.createElement('div');
            p.className = 'owl-dust-particle';
            p.style.left = (25 + Math.random() * 50) + '%';
            p.style.top  = (25 + Math.random() * 50) + '%';
            dustC.appendChild(p);
            gsap.fromTo(p, { opacity: 0, scale: 0 }, {
                opacity: 0.4, scale: 0.9,
                y: -(20 + Math.random() * 35),
                x: (Math.random() - 0.5) * 35,
                duration: 2, ease: 'none',
                onComplete: () => p.remove()
            });
        }, 450);
    }

    // ══════════════════════════════════════════
    //  CLOSE SEQUENCE — Reverse everything
    // ══════════════════════════════════════════
    function buildClose() {
        const tl = gsap.timeline();
        const letScene = document.getElementById('letter-scene');
        const envScene = document.getElementById('envelope-scene');
        const owl      = document.getElementById('owl-container');
        const envAtt   = document.getElementById('owl-envelope-attached');
        const bd       = document.getElementById('owl-blur-backdrop');
        const overlay  = document.getElementById('owl-sequence-overlay');
        const seal     = document.getElementById('wax-seal');
        const flap     = document.getElementById('envelope-flap');

        tl.add(() => { stopIdle(); stopDust(); })

          // Letter folds away
          .to(letScene, { scale: 0.45, opacity: 0, rotation: 2, duration: 0.7, ease: 'power2.in' })
          .add(() => { letScene.style.display = 'none'; gsap.set(letScene, { clearProps: 'all' }); })

          // Envelope reappears
          .add(() => {
              envScene.style.display = 'flex';
              gsap.set(envScene, { scale: 1, opacity: 1 });
          })
          .to(flap, { rotateX: 0, duration: 0.7, ease: 'power2.inOut' })
          .to(seal, { scale: 1, opacity: 1, rotation: 0, duration: 0.45, ease: 'back.out(1.4)' })
          .to('#envelope-3d', { rotateY: 0, duration: 0.9, ease: 'power2.inOut' })
          .to(envScene, { scale: 0.15, opacity: 0, duration: 0.5, ease: 'power2.in' })
          .add(() => { envScene.style.display = 'none'; })

          // Owl returns from left, grabs envelope, flies away
          .add(() => {
              gsap.set(owl, { x: -220, y: window.innerHeight / 2 - 100, scale: 0.35, opacity: 1 });
              gsap.set(envAtt, { opacity: 1, y: 0, rotation: 0 });
          })
          .to(owl, { x: window.innerWidth / 2 - 80, y: window.innerHeight / 2 - 100, scale: 0.75, duration: 0.9, ease: 'power2.out' })
          .to({}, { duration: 0.25 })
          .to(owl, { x: window.innerWidth + 250, y: -250, scale: 0.12, opacity: 0, duration: 1.4, ease: 'power2.in' })

          // Remove blur
          .to(bd, {
              backgroundColor: 'rgba(0,0,0,0)',
              duration: 0.7, ease: 'power2.out',
              onStart: () => {
                  bd.style.backdropFilter = 'blur(0px)';
                  bd.style.webkitBackdropFilter = 'blur(0px)';
              }
          }, '-=0.6')
          .add(() => restoreMusic(), '-=0.7')
          .add(() => {
              overlay.style.display = 'none';
              sequenceActive = false;
              document.body.style.overflow = '';
          });

        return tl;
    }

    // ══════════════════════════════════════════
    //  INTERACTION WIRING
    // ══════════════════════════════════════════

    function wireOwlInteraction() {
        const owl = document.getElementById('owl-container');
        let clicked = false;
        let sparkleIntv = null;

        function onEnter() {
            if (clicked) return;
            gsap.to(owl, { scale: 1.1, duration: 0.3, ease: 'power1.out' });
            owl.style.cursor = 'pointer';
            sparkleIntv = setInterval(() => spawnOwlSparkle(owl), 180);
        }
        function onLeave() {
            if (clicked) return;
            gsap.to(owl, { scale: 1, duration: 0.3, ease: 'power1.out' });
            clearInterval(sparkleIntv); sparkleIntv = null;
        }
        function onClick() {
            if (clicked) return;
            clicked = true;
            owl.removeEventListener('mouseenter', onEnter);
            owl.removeEventListener('mouseleave', onLeave);
            owl.removeEventListener('touchstart', onClick);
            clearInterval(sparkleIntv);
            owl.style.cursor = 'default';

            const rel = buildRelease();
            rel.play();
            rel.eventCallback('onComplete', wireEnvelopeInteraction);
        }

        owl.addEventListener('mouseenter', onEnter);
        owl.addEventListener('mouseleave', onLeave);
        owl.addEventListener('click', onClick, { once: true });
        owl.addEventListener('touchstart', onClick, { once: true, passive: true });
    }

    function wireEnvelopeInteraction() {
        const front = document.querySelector('.envelope-front');
        const back  = document.querySelector('.envelope-back');
        front.style.cursor = 'pointer';
        // Back face shouldn't capture clicks until flipped
        back.style.pointerEvents = 'none';
        front.addEventListener('click', function () {
            front.style.cursor = 'default';
            const flip = buildFlip();
            flip.play();
            flip.eventCallback('onComplete', () => {
                // After flip: front is now hidden, disable its pointer-events
                // and enable the back face so the seal is clickable
                front.style.pointerEvents = 'none';
                back.style.pointerEvents = 'auto';
                wireSealInteraction();
            });
        }, { once: true });
    }

    function wireSealInteraction() {
        const sealBox = document.getElementById('wax-seal-container');
        const particles = document.getElementById('seal-particles');

        sealBox.addEventListener('mouseenter', () => {
            sealParticleInterval = setInterval(() => spawnSealParticle(particles), 100);
        });
        sealBox.addEventListener('mouseleave', () => {
            clearInterval(sealParticleInterval); sealParticleInterval = null;
        });
        sealBox.addEventListener('click', () => {
            clearInterval(sealParticleInterval); sealParticleInterval = null;
            const crack = buildCrack();
            crack.play();
        }, { once: true });
    }

    // ══════════════════════════════════════════
    //  MASTER ENTRY POINT
    // ══════════════════════════════════════════

    window.startOwlSequence = function () {
        if (sequenceActive) return;

        // Play once per session
        if (sessionStorage.getItem('owlPlayed')) return;
        sessionStorage.setItem('owlPlayed', '1');

        sequenceActive = true;
        const overlay = document.getElementById('owl-sequence-overlay');
        if (!overlay) return;

        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';

        gsap.registerPlugin(MotionPathPlugin);

        // ── Master timeline — chains every scene ──
        const master = gsap.timeline();
        master.add(buildPause())
              .add(buildEntrance())
              .add(() => { wireOwlInteraction(); }) // Allow clicking immediately as it lands
              .add(buildBlur(), '-=0.5')
              .add(() => { startIdle(); });
    };

    // ── Close button ──
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('owl-close-btn');
        if (btn) btn.addEventListener('click', () => buildClose().play());
    });

})();
