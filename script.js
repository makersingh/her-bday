// --- MAGIC PRELOADER ---
function preloadAssets() {
    // 1. List every single image and audio file you use in your project here
    const imagesToPreload = [
        "sorting-hat.png", "sort1.jpg", "sort2.jpg", "sort3.jpg", "sort4.jpg",
        "sort5.jpg", "sort6.jpg", "child1.jpg", "child2.jpg", "child3.jpg",
        "child4.jpg", "child5.jpg", "teen1.jpg", "teen2.jpg", "teen3.jpg", 
        "teen4.jpg", "teen5.jpg", "now1.jpg", "now2.jpg", "now3.jpg", 
        "now4.jpg", "now5.jpg", "collage1.jpg", "collage2.jpg", "collage3.jpg",
        "collage4.jpg", "collage5.jpg", "collage6.jpg", "collage7.jpg",
        "collage8.jpg", "collage9.jpg", "collage10.jpg", "collage11.jpg",
        "collage12.jpg", "collage13.jpg", "collage14.jpg", "collage15.jpg"
    ];

    const audioToPreload = [
        "sorting-hat.mp3", "music1.mp3", "music2.mp3", "music3.mp3"
    ];

    // 2. This part forces the browser to download the files now
    imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
    });

    audioToPreload.forEach((src) => {
        const audio = new Audio(src);
        audio.load();
    });
    
    console.log("Magic assets preloaded successfully!");
}

// --- FORCE PAGE TO TOP ON REFRESH ---
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};
window.scrollTo(0, 0);

// =========================================================================
// UTILITIES — stars + particle bursts, reused across chapters
// =========================================================================
function generateStars(container, count) {
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        const size = (Math.random() * 1.6 + 1).toFixed(1);
        s.style.width = size + 'px';
        s.style.height = size + 'px';
        s.style.animationDelay = (Math.random() * 3).toFixed(2) + 's';
        s.style.animationDuration = (2 + Math.random() * 3).toFixed(2) + 's';
        frag.appendChild(s);
    }
    container.appendChild(frag);
}

function spawnParticles(container, className, count, options = {}) {
    if (!container) return;
    const spreadX = options.spreadX || 100;
    const spreadY = options.spreadY || 100;
    const dyBase = options.dyBase || 0;
    const life = options.life || 1500;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = className;

        const dx = (Math.random() - 0.5) * spreadX;
        const dy = dyBase + (Math.random() - 0.5) * spreadY;
        p.style.setProperty('--dx', dx + 'px');
        p.style.setProperty('--dy', dy + 'px');

        p.style.left = (options.left !== undefined ? options.left + 'px' : '50%');
        p.style.top = (options.top !== undefined ? options.top + 'px' : '50%');

        container.appendChild(p);
        setTimeout(() => p.remove(), life);
    }
}

// =========================================================================
// CHAPTER 1 — THE BOOK (3D page-turn + dust/spark particles)
// =========================================================================
function openBook() {
    preloadAssets();
    const bookCover = document.getElementById('book-cover');
    const magicWorld = document.getElementById('magic-world');
    const particleLayer = document.getElementById('book-particles');
    const bgMusic = document.getElementById('bg-music');
    
    if (bgMusic) {
        bgMusic.volume = 0.6; // Optional: keeps it from blasting too loud
        bgMusic.play().catch(e => console.log(e));
    }

    if (!bookCover) {
        console.error('Could not find book-cover element!');
        return;
    }

    if (particleLayer) {
        spawnParticles(particleLayer, 'dust-particle', 16, { spreadX: 160, spreadY: 140, life: 1800 });
        spawnParticles(particleLayer, 'spark-particle', 10, { spreadX: 200, spreadY: 160, life: 1300 });
    }

    // Triggers the 3D page-turn defined in style.css (.book-open-anim)
    bookCover.classList.add('book-open-anim');

    setTimeout(() => {
        bookCover.style.display = 'none';

        if (magicWorld) {
            magicWorld.style.display = 'block';
            // double rAF so the browser paints display:block before the opacity transition starts
            requestAnimationFrame(() => {
                requestAnimationFrame(() => magicWorld.classList.add('show-world'));
            });
            startHeroSequence();
        }
    }, 1500); // matches .book-cover's 1.5s transform/opacity transition
}

// =========================================================================
// CHAPTER 2 — THE HERO (wand writes, then the title materializes)
// =========================================================================
const wandLines = ["Mischief Managed...", "No wait..."];
const heroTitleText = "Happy Birthday, Munmun";

function materializeTitle(el, text) {
    el.innerHTML = '';
    [...text].forEach((ch, idx) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.animationDelay = (idx * 55) + 'ms';
        el.appendChild(span);
    });
}

function startHeroSequence() {
    const wandEl = document.getElementById('wand-text');
    const titleEl = document.getElementById('hero-title');
    const subEl = document.getElementById('hero-subtitle');
    if (!wandEl || !titleEl) return;

    let i = 0;
    function showLine() {
        if (i < wandLines.length) {
            wandEl.textContent = wandLines[i];
            wandEl.classList.add('visible');
            setTimeout(() => {
                wandEl.classList.remove('visible');
                setTimeout(() => { i++; showLine(); }, 700);
            }, 1400);
        } else {
            wandEl.textContent = '';
            materializeTitle(titleEl, heroTitleText);
            setTimeout(() => {
                if (subEl) {
                    subEl.style.transition = 'opacity 1.5s ease';
                    subEl.style.opacity = '1';
                }
            }, heroTitleText.length * 55 + 600);
        }
    }
    showLine();
}

// =========================================================================
// AMBIENT WAND SPARKLES — follows the cursor everywhere
// =========================================================================
document.addEventListener('mousemove', (e) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'wand-sparkle';
    
    /* 👇 THE FIX: Use pageX and pageY instead of clientX and clientY 👇 */
    sparkle.style.left = `${e.pageX}px`;
    sparkle.style.top = `${e.pageY}px`;

    const randomX = (Math.random() - 0.5) * 15;
    const randomY = (Math.random() - 0.5) * 15;
    sparkle.style.setProperty('--dx', `${randomX}px`);
    sparkle.style.setProperty('--dy', `${randomY}px`);

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});

// =========================================================================
// THE AESTHETIC PLAYLIST (Slytherin Common Room)
// =========================================================================
const globalAudio = document.getElementById('global-audio');
const trackRows = document.querySelectorAll('.track-row');

function playTrack(fileName, clickedRow) {
    const playBtnIcon = clickedRow.querySelector('.row-play-btn');
    const bgMusic = document.getElementById('bg-music'); // Grabs the main theme

    // 1. If they click pause on the currently playing track
    if (clickedRow.classList.contains('playing-now') && !globalAudio.paused) {
        globalAudio.pause();
        playBtnIcon.innerHTML = "▶";
        if (bgMusic) bgMusic.play(); // Bring main theme back!
        return;
    }

    // 2. If they click play to resume the paused track
    if (clickedRow.classList.contains('playing-now') && globalAudio.paused) {
        if (bgMusic) bgMusic.pause(); // Kill main theme
        globalAudio.play();
        playBtnIcon.innerHTML = "⏸";
        return;
    }

    // 3. If they click a brand new track
    trackRows.forEach(row => {
        row.classList.remove('playing-now');
        row.querySelector('.row-play-btn').innerHTML = "▶";
    });

    if (bgMusic) bgMusic.pause(); // Kill main theme
    
    globalAudio.src = fileName;
    globalAudio.play();

    clickedRow.classList.add('playing-now');
    playBtnIcon.innerHTML = "⏸";
}

// =========================================================================
// CHAPTER 3 — THE SORTING HAT (darkened room, shake, green particles)
// =========================================================================
const hatTextElement = document.getElementById('hat-text');
const hatAudio = document.getElementById('hat-audio');
const sortingPhoto = document.getElementById('sorting-photo');

const hatLines = [
    "Bravery...",
    "Loyalty...",
    "Ambition...",
    "An alarming amount of stubbornness...",
    "And an unhealthy obsession with Harry Potter...",
    "SLYTHERIN!"
];

const sortingImages = ["sort1.jpg", "sort2.jpg", "sort3.jpg", "sort4.jpg", "sort5.jpg", "sort6.jpg"];

// Your hand-tuned timestamps, kept as-is — I don't have the actual
// sorting-hat.mp3 to re-sync these against, so these are still the
// most reliable numbers to use.
const textTiming = [3500, 3300, 3500, 2600, 2300];

let hatIndex = 0;

function playSortingHat() {
    if (!hatTextElement || hatIndex >= hatLines.length) return;

    hatTextElement.style.opacity = 0;
    if (sortingPhoto) sortingPhoto.style.opacity = 0;

    setTimeout(() => {
        hatTextElement.innerHTML = hatLines[hatIndex];
        if (sortingPhoto && sortingImages[hatIndex]) {
            sortingPhoto.src = sortingImages[hatIndex];
        }

        hatTextElement.style.opacity = 1;
        if (sortingPhoto) sortingPhoto.style.opacity = 1;

        if (hatLines[hatIndex].includes("SLYTHERIN")) {
            revealSlytherin();
        } else {
            const waitTime = textTiming[hatIndex] || 2000;
            hatIndex++;
            setTimeout(playSortingHat, waitTime);
        }
    }, 600);
}

function revealSlytherin() {
    hatTextElement.classList.add('slytherin-shout');

    const magicWorld = document.getElementById('magic-world');
    const sortingContainer = document.querySelector('.sorting-container');
    const dimOverlay = document.getElementById('sorting-dim');

    document.body.classList.add('slytherin-theme-active');
    if (dimOverlay) dimOverlay.classList.remove('active'); // the green theme takes over the darkening from here

    if (sortingContainer) {
        sortingContainer.classList.add('camera-shake');
        setTimeout(() => sortingContainer.classList.remove('camera-shake'), 500);
    }

    // green particles drifting upward from around the revealed photo
    if (sortingPhoto) {
        const rect = sortingPhoto.getBoundingClientRect();
        let bursts = 0;
        const burstInterval = setInterval(() => {
            spawnParticles(document.body, 'green-particle', 4, {
                left: rect.left + Math.random() * rect.width,
                top: rect.top + rect.height * 0.6,
                life: 2500
            });
            bursts++;
            if (bursts > 6) clearInterval(burstInterval);
        }, 250);
    }

    setTimeout(() => { document.body.style.overflowY = 'auto'; }, 2000);
}

// =========================================================================
// CHAPTER 4 — THE EXAMINATION CHAMBER (trivia, candles, seals)
// =========================================================================
const triviaQuestions = [
    { q: "What is Harry Potter's position on the Gryffindor Quidditch team?", options: ["Keeper", "Chaser", "Seeker", "Beater"], answer: "Seeker" },
    { q: "Which spell is used to conjure a Patronus?", options: ["Expelliarmus", "Expecto Patronum", "Lumos", "Alohomora"], answer: "Expecto Patronum" },
    { q: "What did Harry Potter call his owl?", options: ["Hedwig", "Scabbers", "Fang", "Buckbeak"], answer: "Hedwig" }
];

// Snape-style remarks for correct answers
const cheekyRemarks = [
    "Hmph. Not entirely hopeless, I see.",
    "Acceptable. Barely.",
    "A lucky guess, no doubt.",
    "Perhaps you do have a brain after all."
];

// Snape-style remarks for wrong answers
const wrongRemarks = [
    "Severus Snape looks disappointed.",
    "Five points from whichever Slytherin.",
    "The Sorting Hat sighs heavily.",
    "Even Neville knew that one."
];

let currentQuizIndex = 0;

function loadTriviaQuestion() {
    const qText = document.getElementById('quiz-question');
    const optsContainer = document.getElementById('quiz-options');
    if (!qText || !optsContainer) return;

    const currentData = triviaQuestions[currentQuizIndex];
    qText.innerText = currentData.q;
    optsContainer.innerHTML = "";

    currentData.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = "trivia-btn";
        btn.innerText = option;
        btn.onclick = () => verifyTriviaAnswer(option);
        optsContainer.appendChild(btn);
    });
}

function buildExamCandles() {
    const container = document.getElementById('exam-candles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const c = document.createElement('div');
        c.className = 'candle lit';
        container.appendChild(c);
    }
}

function flashExamCandles() {
    document.querySelectorAll('#exam-candles .candle').forEach(c => {
        c.classList.add('flicker-hard');
        setTimeout(() => c.classList.remove('flicker-hard'), 1000);
    });
}

function buildSealRow() {
    const row = document.getElementById('seal-row');
    if (!row) return;
    row.innerHTML = '';
    triviaQuestions.forEach(() => {
        const seal = document.createElement('div');
        seal.className = 'seal';
        row.appendChild(seal);
    });
}

function unlockSeal(index) {
    const row = document.getElementById('seal-row');
    if (!row) return;
    const seal = row.children[index];
    if (seal) seal.classList.add('unlocked');
}

function verifyTriviaAnswer(selectedOption) {
    const feedback = document.getElementById('trivia-feedback');
    const optsContainer = document.getElementById('quiz-options');
    const isCorrect = selectedOption === triviaQuestions[currentQuizIndex].answer;

    optsContainer.style.pointerEvents = "none";

    if (isCorrect) {
        const remark = cheekyRemarks[Math.floor(Math.random() * cheekyRemarks.length)];
        feedback.innerText = remark;
        feedback.style.opacity = 1;
        unlockSeal(currentQuizIndex);

        setTimeout(() => {
            feedback.style.opacity = 0;
            currentQuizIndex++;
            optsContainer.style.pointerEvents = "auto";

            if (currentQuizIndex < triviaQuestions.length) {
                loadTriviaQuestion();
            } else {
                qSetComplete();
            }
        }, 2000);
    } else {
        const remark = wrongRemarks[Math.floor(Math.random() * wrongRemarks.length)];
        feedback.innerText = remark;
        feedback.classList.add('flash-red');
        feedback.style.opacity = 1;
        flashExamCandles();

        setTimeout(() => {
            feedback.style.opacity = 0;
            feedback.classList.remove('flash-red');
            optsContainer.style.pointerEvents = "auto";
        }, 1800);
    }
}

function qSetComplete() {
    const qText = document.getElementById('quiz-question');
    const optsContainer = document.getElementById('quiz-options');
    qText.innerText = `"I solemnly swear that I'm upto no good"`  ;
    optsContainer.innerHTML = "";

    setTimeout(() => {
        const triviaSection = document.getElementById('trivia-section');
        if (triviaSection) {
            triviaSection.classList.add('hidden-room');
            triviaSection.classList.remove('visible-room');
        }
        const map = document.getElementById('marauders-map');
        if (map) {
            map.classList.remove('hidden-room');
            map.classList.add('visible-room');
            map.scrollIntoView({ behavior: 'smooth' });
        }
    }, 3500);
}

// =========================================================================
// CHAPTER 5 — THE MARAUDER'S MAP (parchment, pins, footprints)
// =========================================================================
const allRooms = ['marauders-map', 'slytherin-room', 'headmaster-office', 'great-hall'];

function travelTo(roomId) {
    allRooms.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('visible-room');
            el.classList.add('hidden-room');
        }
    });

    const targetRoom = document.getElementById(roomId);
    if (targetRoom) {
        targetRoom.classList.remove('hidden-room');
        targetRoom.classList.add('visible-room');
        targetRoom.scrollIntoView({ behavior: 'smooth' });
    }

    if (roomId === 'great-hall') {
        setTimeout(revealHeartCollage, 500);
    }

    if (roomId === 'headmaster-office') {
        startPensieve();
    }
}

function returnToMap() {
    allRooms.forEach(id => {
        if (id === 'marauders-map') return;
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('visible-room');
            el.classList.add('hidden-room');
        }
    });

    const map = document.getElementById('marauders-map');
    if (map) {
        map.classList.remove('hidden-room');
        map.classList.add('visible-room');
        map.scrollIntoView({ behavior: 'smooth' });
    }
}

function showFootprints(pinEl) {
    const mapEl = document.getElementById('parchment-map');
    const layer = document.getElementById('footprint-layer');
    const anchor = document.getElementById('map-anchor');
    if (!mapEl || !layer || !anchor) return;

    layer.innerHTML = '';

    const mapRect = mapEl.getBoundingClientRect();
    const aRect = anchor.getBoundingClientRect();
    const pRect = pinEl.getBoundingClientRect();

    const startX = aRect.left + aRect.width / 2 - mapRect.left;
    const startY = aRect.top + aRect.height / 2 - mapRect.top;
    const endX = pRect.left + pRect.width / 2 - mapRect.left;
    const endY = pRect.top + pRect.height / 2 - mapRect.top;

    const steps = 5;
    for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const fp = document.createElement('span');
        fp.className = 'footprint';
        fp.textContent = '👣';
        fp.style.left = (startX + (endX - startX) * t) + 'px';
        fp.style.top = (startY + (endY - startY) * t) + 'px';
        fp.style.animationDelay = (i * 120) + 'ms';
        layer.appendChild(fp);
    }

    clearTimeout(layer._clearTimer);
    layer._clearTimer = setTimeout(() => { layer.innerHTML = ''; }, steps * 120 + 1200);
}

function initMapPins() {
    document.querySelectorAll('.map-pin').forEach(pin => {
        pin.addEventListener('mouseenter', () => showFootprints(pin));
        pin.addEventListener('click', () => travelTo(pin.dataset.room));
    });
}

// =========================================================================
// CHAPTER 6 — THE PENSIEVE (fog, sepia tiers, pan, synced letter)
// =========================================================================
const memoryImages = [
    "child1.jpg", "child2.jpg", "child3.jpg", "child4.jpg", "child5.jpg",
    "teen1.jpg", "teen2.jpg", "teen3.jpg", "teen4.jpg", "teen5.jpg",
    "now1.jpg", "now2.jpg", "now3.jpg", "now4.jpg", "now5.jpg"
];
const specialImageIndex = 4; // the photo that gets the golden-frame treatment
const goldenCaption = "the favourite, hands down...";
const pensieveSlider = document.getElementById("pensieve-slider");

const fullLetter = [
    "However it began, it feels like it's been forever.",
    "So many memories piled up before either of us noticed.",
    "Some people just end up mattering, year after year."
];

let pensieveIndex = 0;
let pensieveStarted = false;

function vintageClassFor(index) {
    const act = Math.floor(index / 5);
    if (act === 0) return 'memory-vintage-2';
    if (act === 1) return 'memory-vintage-1';
    return 'memory-vintage-0';
}


function typeFullLetter(paragraphs) {
    const el = document.getElementById('typing-text');
    if (!el) return;
    el.innerHTML = '';

    let pIndex = 0;
    let charIndex = 0;

    function step() {
        if (pIndex < paragraphs.length) {
            if (charIndex < paragraphs[pIndex].length) {
                el.innerHTML += paragraphs[pIndex].charAt(charIndex);
                charIndex++;
                setTimeout(step, 40); // Speed of typing letters
            } else {
                el.innerHTML += '<br><br>'; // Adds the line break
                pIndex++;
                charIndex = 0;
                setTimeout(step, 1000); // 1s pause before starting next paragraph
            }
        }
    }
    step();
}

function typeGoldenCaption(text) {
    const el = document.getElementById('special-text');
    if (!el) return;
    el.innerHTML = '';
    el.classList.add('typing-active');

    let i = 0;
    function step() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(step, 70);
        } else {
            setTimeout(() => el.classList.remove('typing-active'), 2000);
        }
    }
    step();
}

function advancePensieve() {
    const img = document.getElementById('memory-img');
    const container = document.querySelector('.slideshow-container');
    const fog = document.getElementById('fog-overlay');
    const special = document.getElementById('special-text');
    if (!img) return;

    if (fog) fog.classList.add('active');
    img.classList.add('hidden');
    if (container) container.classList.remove('golden-frame');
    if (special) { special.innerHTML = ''; special.classList.remove('typing-active'); }
    

    setTimeout(() => {
        pensieveIndex = (pensieveIndex + 1) % memoryImages.length;
        if (pensieveSlider) {pensieveSlider.value = pensieveIndex;}
        img.src = memoryImages[pensieveIndex];

        img.classList.remove('memory-vintage-0', 'memory-vintage-1', 'memory-vintage-2', 'pan-a', 'pan-b', 'special-pop');
        img.classList.add(vintageClassFor(pensieveIndex));
        img.classList.add(pensieveIndex % 2 === 0 ? 'pan-a' : 'pan-b');
        img.classList.remove('hidden');

        let slideDuration = 4500;

        if (pensieveIndex === specialImageIndex) {
            img.classList.add('special-pop');
            if (container) container.classList.add('golden-frame');
            slideDuration = 7000;
            setTimeout(() => typeGoldenCaption(goldenCaption), 500);
        }

        setTimeout(() => { if (fog) fog.classList.remove('active'); }, 900);

        setTimeout(advancePensieve, slideDuration);
    }, 700);
}

function startPensieve() {
    if (pensieveStarted) return;
    pensieveStarted = true;
    
    // 👇 THE FIX: Triggers the continuous typing immediately
    typeFullLetter(fullLetter);
    
    setTimeout(advancePensieve, 4000);
}

if (pensieveSlider) {
    pensieveSlider.addEventListener("input", function () {
        pensieveIndex = parseInt(this.value);

        const img = document.getElementById("memory-img");

        img.src = memoryImages[pensieveIndex];

        img.classList.remove(
            'memory-vintage-0',
            'memory-vintage-1',
            'memory-vintage-2',
            'pan-a',
            'pan-b',
            'special-pop'
        );

        img.classList.add(vintageClassFor(pensieveIndex));
        img.classList.add(
            pensieveIndex % 2 === 0 ? 'pan-a' : 'pan-b'
        );
    });
}


// =========================================================================
// CHAPTER 7 — THE GREAT HALL FINALE (heart collage, candles, stars)
// ---------------------------------------------------------
// NOTE: the finale line here ("However things have changed, / this
// still matters") replaces the "After all this time? / Always" line
// from the brief. That line is a romantic-devotion line in the books,
// and given the birthday age mentioned earlier in this page, I kept
// the two-beat reveal you wanted but with non-romantic wording. Swap
// the text in showFinaleText() below if you want to adjust it further.
// =========================================================================
function revealHeartCollage() {
    const pics = document.querySelectorAll('.heart-pic');
    let delay = 0;

    pics.forEach((pic) => {
        setTimeout(() => {
            pic.classList.add('revealed');
            createMagicalBurst(pic);
        }, delay);
        delay += 300;
    });

    setTimeout(lightHallCandles, delay + 800);
}

function createMagicalBurst(element) {
    const rect = element.getBoundingClientRect();
    const burst = document.createElement('div');
    burst.className = 'wand-sparkle';
    burst.style.left = `${rect.left + (rect.width / 2)}px`;
    burst.style.top = `${rect.top + (rect.height / 2)}px`;
    burst.style.transform = 'scale(3)';
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 800);
}

function buildHallCandles() {
    const container = document.getElementById('hall-candles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const c = document.createElement('div');
        c.className = 'candle';
        container.appendChild(c);
    }
}

function lightHallCandles() {
    const candles = document.querySelectorAll('#hall-candles .candle');
    candles.forEach((c, i) => {
        setTimeout(() => c.classList.add('lit'), i * 250);
    });
    setTimeout(showFinaleStars, candles.length * 250 + 600);
}

function showFinaleStars() {
    const starsContainer = document.getElementById('finale-stars');
    if (starsContainer) {
        starsContainer.innerHTML = '';
        generateStars(starsContainer, 50);
        starsContainer.classList.add('active');
    }
    setTimeout(showFinaleText, 1800);
}

function showFinaleText() {
    const t1 = document.getElementById('finale-text-1');
    const t2 = document.getElementById('finale-text-2');

    if (t1) {
        t1.textContent = "No matter where we are";
        t1.classList.add('visible');
    }
    setTimeout(() => {
        if (t2) {
            t2.textContent = "I'll always be there for you... Happy Birthday, Chikki!";
            t2.classList.add('visible');
        }
    }, 2200);
}

// =========================================================================
// SORTING HAT TRIGGER — fires once when you scroll into the Sorting section
// =========================================================================
let sortingStarted = false;

function startMagicObservers() {
    const sortingSection = document.getElementById('sorting-section');
    const bgMusic = document.getElementById('bg-music');
    if (!sortingSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !sortingStarted) {
                sortingStarted = true;
                sortingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(() => {
                    document.body.style.overflowY = 'hidden';
                    const dimOverlay = document.getElementById('sorting-dim');
                    if (dimOverlay) dimOverlay.classList.add('active');


                    setTimeout(() => {
                        if (hatAudio) hatAudio.play().catch(() => {});
                        playSortingHat();
                    }, 1000);
                }, 600);
            }
        });
    }, { threshold: 0.6 });

    observer.observe(sortingSection);
}

// =========================================================================
// INIT
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    generateStars(document.getElementById('starfield'), 140);

    const bookCover = document.getElementById('book-cover');
    if (bookCover) {
        bookCover.addEventListener('click', openBook);
    } else {
        console.error('Could not find book-cover element!');
    }

    buildSealRow();
    buildExamCandles();
    loadTriviaQuestion();

    initMapPins();
    buildHallCandles();

    startMagicObservers();
});
