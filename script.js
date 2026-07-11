// Preloader
function preloadAssets() {
    const imagesToPreload = [
        "sorting-hat.png", "sort1.jpg", "sort2.jpg", "sort3.jpg", "sort4.jpg", "map-bg.jpg",
        "sort5.jpg", "sort6.jpg", "child1.jpg", "child2.jpg", "child3.jpg", "patronus.jpg",
        "child4.jpg", "child5.jpg", "teen1.jpg", "teen2.jpg", "teen3.jpg", 
        "teen4.jpg", "teen5.jpg", "now1.jpg", "now2.jpg", "now3.jpg", 
        "now4.jpg", "now5.jpg", "collage1.jpg", "collage2.jpg", "collage3.jpg",
        "collage4.jpg", "collage5.jpg", "collage6.jpg", "collage7.jpg",
        "collage8.jpg", "collage9.jpg", "collage10.jpg", "collage11.jpg",
        "collage12.jpg", "collage13.jpg", "collage14.jpg", "collage15.jpg"
    ];

    const audioToPreload = [
        "sorting-hat.mp3", "music1.mp3", "music2.mp3", "music3.mp3", "music.mp3"
    ];


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

// Top on refresh
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};
window.scrollTo(0, 0);


// UTILITIES 
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

function fadeAudio(audio, targetVolume, duration) {
    if (!audio) return;
    if (audio.fadeInterval) clearInterval(audio.fadeInterval);
    
    const step = 50;
    const volumeStep = (targetVolume - audio.volume) / (duration / step);
    
    audio.fadeInterval = setInterval(() => {
        let newVolume = audio.volume + volumeStep;
        
        newVolume = Math.max(0, Math.min(1, newVolume));
        audio.volume = newVolume;
        
        if ((volumeStep > 0 && audio.volume >= targetVolume) || 
            (volumeStep < 0 && audio.volume <= targetVolume)) {
            audio.volume = targetVolume;
            clearInterval(audio.fadeInterval);
        }
    }, step);
}

// Chapter-1 The Book
function openBook() {
    preloadAssets();
    const bookCover = document.getElementById('book-cover');
    const magicWorld = document.getElementById('magic-world');
    const particleLayer = document.getElementById('book-particles');
    const bgMusic = document.getElementById('bg-music');
    
    if (bgMusic) {
        bgMusic.volume = 0.6; 
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


    bookCover.classList.add('book-open-anim');

    setTimeout(() => {
        bookCover.style.display = 'none';

        if (magicWorld) {
            magicWorld.style.display = 'block';
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => magicWorld.classList.add('show-world'));
            });
            startHeroSequence();
        }
    }, 1500); 
}


// CHAPTER 2 — The first page
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

// Wand Sparkles
document.addEventListener('mousemove', (e) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'wand-sparkle';
    
    
    sparkle.style.left = `${e.pageX}px`;
    sparkle.style.top = `${e.pageY}px`;

    const randomX = (Math.random() - 0.5) * 15;
    const randomY = (Math.random() - 0.5) * 15;
    sparkle.style.setProperty('--dx', `${randomX}px`);
    sparkle.style.setProperty('--dy', `${randomY}px`);

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});

// Playlist
const globalAudio = document.getElementById('global-audio');
const trackRows = document.querySelectorAll('.track-row');

function playTrack(fileName, clickedRow) {
    let isDragging = false; 

    // 1. SLIDER EVENT LISTENER
    globalAudio.addEventListener('timeupdate', () => {
        if (!globalAudio.duration) return;
        
        const activeRow = document.querySelector('.track-row.playing-now');
        if (!activeRow) return;

        const slider = activeRow.querySelector('.track-slider');
        const timeCurrent = activeRow.querySelector('.time-current');
        const timeTotal = activeRow.querySelector('.time-total');

        if (slider && !isDragging) {
            const progressPercent = (globalAudio.currentTime / globalAudio.duration) * 100;
            slider.value = progressPercent;
        }

        if (timeCurrent) timeCurrent.innerText = formatTime(globalAudio.currentTime);
        if (timeTotal) timeTotal.innerText = formatTime(globalAudio.duration);
    });

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    document.querySelectorAll('.track-slider').forEach(slider => {
        slider.addEventListener('mousedown', () => isDragging = true);
        slider.addEventListener('touchstart', () => isDragging = true, {passive: true});

        slider.addEventListener('input', (e) => {
            if (globalAudio.duration) {
                const seekTime = (e.target.value / 100) * globalAudio.duration;
                globalAudio.currentTime = seekTime;
            }
        });

        slider.addEventListener('mouseup', () => isDragging = false);
        slider.addEventListener('touchend', () => isDragging = false);
    });
        
    // 2. PLAY/PAUSE LOGIC 
    const playBtnIcon = clickedRow.querySelector('.row-play-btn');
    const bgMusic = document.getElementById('bg-music'); 
    const floatBtn = document.getElementById('float-play-btn'); 

    // Pause if clicking the song that is ALREADY playing
    if (clickedRow.classList.contains('playing-now') && !globalAudio.paused) {
        globalAudio.pause();
        playBtnIcon.innerHTML = "▶";
        if (floatBtn) floatBtn.innerHTML = "▶"; 
        if (bgMusic) {
            bgMusic.play().catch(e => console.log(e));
            fadeAudio(bgMusic, 0.6, 1500); 
        }
        return;
    }

    // Play if clicking the song that is PAUSED 
    if (clickedRow.classList.contains('playing-now') && globalAudio.paused) {
        if (bgMusic) bgMusic.pause(); 
        globalAudio.play();
        playBtnIcon.innerHTML = "⏸";
        if (floatBtn) floatBtn.innerHTML = "⏸"; 
        return;
    }

    // 3. Playing new song
    const trackRows = document.querySelectorAll('.track-row'); // Safety definition 
    trackRows.forEach(row => {
        row.classList.remove('playing-now');
        row.querySelector('.row-play-btn').innerHTML = "▶";
    });

    if (bgMusic) bgMusic.pause(); 
    
    globalAudio.src = fileName;
    globalAudio.play();

    clickedRow.classList.add('playing-now');
    playBtnIcon.innerHTML = "⏸";

    // 4. UPDATE FLOATING PLAYER INFO WITH THE NEW SONG
    const floatSong = document.getElementById('float-song-name');
    const floatArtist = document.getElementById('float-artist-name');
    if (floatSong && floatArtist) {
        floatSong.innerText = clickedRow.querySelector('.song-name').innerText;
        floatArtist.innerText = clickedRow.querySelector('.artist-name').innerText;
    }
    if (floatBtn) floatBtn.innerHTML = "⏸";
}

// CHAPTER 3 — THE SORTING HAT 
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
    if (dimOverlay) dimOverlay.classList.remove('active'); 

    if (sortingContainer) {
        sortingContainer.classList.add('camera-shake');
        setTimeout(() => sortingContainer.classList.remove('camera-shake'), 500);
    }

    
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

// CHAPTER 4 — THE EXAMINATION CHAMBER 
const triviaQuestions = [
    { q: "What is Harry Potter's position on the Gryffindor Quidditch team?", options: ["Keeper", "Chaser", "Seeker", "Beater"], answer: "Seeker" },
    { q: "Which spell is used to conjure a Patronus?", options: ["Expelliarmus", "Expecto Patronum", "Lumos", "Alohomora"], answer: "Expecto Patronum" },
    { q: "What is the core of the Elder Wand made of?", options: ["Thestral Tail Hair", "Dragon Heartstring", "Phoenix Feather", "Unicorn Hair"], answer: "Thestral Tail Hair" }
];

// remarks for correct answers
const cheekyRemarks = [
    "Five points to Slytherin.",
    "Acceptable. Barely.",
    "A lucky guess, no doubt.",
    "Perhaps you do have a brain after all."
];

// remarks for wrong answers
const wrongRemarks = [
    "Severus Snape looks disappointed.",
    "Five points from Slytherin.",
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

// CHAPTER 5 — THE MARAUDER'S MAP 
const allRooms = ['marauders-map', 'slytherin-room', 'headmaster-office', 'great-hall'];

function travelTo(roomId) {

const floatPlayer = document.getElementById('floating-player');
    const hasActiveSong = document.querySelector('.track-row.playing-now');
    if (floatPlayer && hasActiveSong) {
        if (roomId === 'slytherin-room') {
            floatPlayer.classList.remove('active'); // Hide in playlist room
        } else {
            floatPlayer.classList.add('active');    // Show everywhere else
        }
    }

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

    const bgMusic = document.getElementById('bg-music');

    
    if (roomId === 'slytherin-room') {

        if (bgMusic) fadeAudio(bgMusic, 0, 1200); 
    } else {
        if (bgMusic && globalAudio.paused) {
            bgMusic.play().catch(e => console.log(e));
            fadeAudio(bgMusic, 0.6, 1800);
        }
    }

    if (roomId === 'great-hall') {
        setTimeout(revealHeartCollage, 500);
    }

    if (roomId === 'headmaster-office') {
        startPensieve();
    }
}

function returnToMap() {
    // 1. Show floating player if a song is playing
    const floatPlayer = document.getElementById('floating-player');
    const hasActiveSong = document.querySelector('.track-row.playing-now');
    if (floatPlayer && hasActiveSong) floatPlayer.classList.add('active');

    // 2. Grab audio locally so the button NEVER crashes
    const globalAudio = document.getElementById('global-audio');
    const bgMusic = document.getElementById('bg-music');

    // 3. Hide all other rooms
    allRooms.forEach(id => {
        if (id === 'marauders-map') return;
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('visible-room');
            el.classList.add('hidden-room');
        }
    });

    // 4. Reveal the Map
    const map = document.getElementById('marauders-map');
    if (map) {
        map.classList.remove('hidden-room');
        map.classList.add('visible-room');
        map.scrollIntoView({ behavior: 'smooth' });
        
        // 5. Resume background music if no track is playing
        if (bgMusic && globalAudio && globalAudio.paused) {
            bgMusic.play().catch(e => console.log(e));
            fadeAudio(bgMusic, 0.6, 2000);
        }
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

//Pensieve
const memoryImages = [
    "child1.jpg", "child2.jpg", "child3.jpg", "child4.jpg", "child5.jpg",
    "teen1.jpg", "teen2.jpg", "teen3.jpg", "teen4.jpg", "teen5.jpg",
    "now1.jpg", "now2.jpg", "now3.jpg", "now4.jpg", "now5.jpg"
];
const specialImageIndex = 4; // Special photo
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
                setTimeout(step, 40); 
            } else {
                el.innerHTML += '<br><br>'; 
                pIndex++;
                charIndex = 0;
                setTimeout(step, 1000); 
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

//heart collage
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
    const t3 = document.getElementById('finale-text-3');

    if (t1) {
        t1.textContent = "After all this time?";
        t1.classList.add('visible');
    }
    setTimeout(() => {
        if (t2) {
            t2.textContent = "Always...";
            t2.classList.add('visible');
        }
    }, 2200);
    setTimeout(() => {
        if (t3) {
            t3.textContent = "Happy birthday, Chikki!";
            t3.classList.add('visible');
        }
    }, 5000);
}

let sortingStarted = false;

//sorting hat 
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
                        if (hatAudio) {
                            hatAudio.play().catch(() => {});
                            
                            fadeAudio(bgMusic, 0.1, 1200);
                            
                            hatAudio.onended = () => {
                                fadeAudio(bgMusic, 0.6, 1500); 
                            };
                        }
                        playSortingHat();
                    }, 1000);
                }, 600);
            }
        });
    }, { threshold: 0.6 });

    observer.observe(sortingSection);
}


document.addEventListener('DOMContentLoaded', () => {

    const floatPlayBtn = document.getElementById('float-play-btn');
    if (floatPlayBtn) {
        floatPlayBtn.addEventListener('click', () => {
            const globalAudio = document.getElementById('global-audio');
            const activeRow = document.querySelector('.track-row.playing-now');
            const rowPlayBtn = activeRow ? activeRow.querySelector('.row-play-btn') : null;
            const bgMusic = document.getElementById('bg-music');

            if (!globalAudio.paused) {
                globalAudio.pause();
                floatPlayBtn.innerHTML = "▶";
                if (rowPlayBtn) rowPlayBtn.innerHTML = "▶";
                if (bgMusic) {
                    bgMusic.play().catch(e => console.log(e));
                    fadeAudio(bgMusic, 0.6, 1500); 
                }
            } else {
                if (bgMusic) bgMusic.pause();
                globalAudio.play();
                floatPlayBtn.innerHTML = "⏸";
                if (rowPlayBtn) rowPlayBtn.innerHTML = "⏸";
            }
        });
    }

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

// FLOATING HOGWARTS LETTERS 
const letterMessages = [
    "Awarded for surviving another year of chaos.",
    "Recognized for exceptional stubbornness.",
    "Certified Potterhead since birth.",
    "Outstanding achievement in looking cute while annoyed.",
    "Your Hogwarts Acceptance Letter (Finally)."
];

let isLetterOnCooldown = false;

window.addEventListener('scroll', () => {
    if (!isLetterOnCooldown && Math.random() < 0.10) {
        spawnFloatingLetter();

        isLetterOnCooldown = true;
        setTimeout(() => {
            isLetterOnCooldown = false;
        }, 5000);
    }
});

function spawnFloatingLetter() {
    const letter = document.createElement('div');
    letter.classList.add('floating-letter');
    const randomMsg = letterMessages[Math.floor(Math.random() * letterMessages.length)];
    letter.innerText = randomMsg;
    const currentScrollY = window.scrollY;
    const screenHeight = window.innerHeight;
    const randomViewportOffset = Math.floor(Math.random() * (screenHeight * 0.7)) + (screenHeight * 0.1);
    
    letter.style.top = `${currentScrollY + randomViewportOffset}px`;
    
    // 4. Decide if it flies from Left to Right, or Right to Left
    const flyFromLeft = Math.random() > 0.5;
    if (flyFromLeft) {
        letter.style.left = '-250px';
        letter.style.animation = 'letterFlyRight 6s linear forwards';
    } else {
        letter.style.right = '-250px';
        letter.style.animation = 'letterFlyLeft 6s linear forwards';
    }
    
    document.body.appendChild(letter);
    
    setTimeout(() => {
        letter.remove();
    }, 9000);
}

// EASTER EGG: ALOHOMORA TRIVIA BYPASS
let cheatCode = "";

window.addEventListener('keydown', (e) => {
    // Only listen if the trivia box is currently on the screen
    const triviaBox = document.querySelector('.trivia-lock-overlay');
    if (!triviaBox || triviaBox.offsetParent === null) return;

    // Build the secret word as she types
    cheatCode += e.key.toLowerCase();
    
    // Keep only the last 9 characters (the length of "alohomora")
    if (cheatCode.length > 9) {
        cheatCode = cheatCode.slice(-9);
    }
    
    // If she types the exact word, trigger the magic
    if (cheatCode === "alohomora") {
        triggerAlohomoraBypass(triviaBox);
        cheatCode = ""; // Reset the code
    }
});

function triggerAlohomoraBypass(triviaBox) {
    // 1. Add the CSS class to make the box shake and explode
    triviaBox.classList.add('alohomora-shatter');

    const heading = document.querySelector('.trivia-heading');
    const candles = document.getElementById('exam-candles');
    
    if (heading) {
        heading.style.transition = 'opacity 1s ease';
        heading.style.opacity = '0';
    }
    if (candles) {
        candles.style.transition = 'opacity 1s ease';
        candles.style.opacity = '0';
    }

    // 2. Wait for the CSS animation to finish (1.2s)
    setTimeout(() => {
        // Hide the shattered trivia box permanently
        triviaBox.style.display = 'none';
        
        // 3. Start the cinematic text sequence
        playAlohomoraSequence();
        
    }, 1200); 
}

function playAlohomoraSequence() {
    const triviaSection = document.getElementById('trivia-section');
    if (!triviaSection) return;

    // Create the invisible text container
    const textEl = document.createElement('div');
    textEl.className = 'alohomora-secret-text';
    triviaSection.appendChild(textEl);

    // sequential lines for alohomora
    const lines = [
        "Cheating?",
        "Five points from Slytherin.",
        "But since it's your birthday...",
        "Go ahead Chikki :)"
    ];

    let index = 0;

    // The loop that fades each line in and out
    function showNextLine() {
        if (index < lines.length) {
            textEl.innerText = lines[index];
            textEl.classList.add('visible');
            
            // Keep the text on screen for 2.2 seconds, then fade it out
            setTimeout(() => {
                textEl.classList.remove('visible');
                
                // Wait 800ms in darkness before showing the next line
                setTimeout(() => {
                    index++;
                    showNextLine();
                }, 800);
            }, 2200);
        } else {
            // Sequence finished. Clean up the text and travel to the map
            textEl.remove();
            returnToMap();
        }
    }

    // Start the magic
    showNextLine();
}

// EASTER EGG: LUMOS & NOX
let spellCode = "";

// 1. Create the invisible light overlay when the page loads
const lumosLight = document.createElement('div');
lumosLight.className = 'lumos-light-overlay';
document.body.appendChild(lumosLight);

// 2. Listen for her typing the spells
window.addEventListener('keydown', (e) => {
    spellCode += e.key.toLowerCase();
    
    // Keep only the last 5 characters (the length of "lumos")
    if (spellCode.length > 5) {
        spellCode = spellCode.slice(-5);
    }
    
    // Turn the light ON
    if (spellCode === "lumos") {
        lumosLight.classList.add('active');
        document.body.classList.add('lumos-cursor-active'); // Turns on the glowing wand
        spellCode = ""; 
    }
    
    // Turn the light OFF
    if (spellCode.endsWith("nox")) {
        lumosLight.classList.remove('active');
        document.body.classList.remove('lumos-cursor-active'); // Reverts to the normal wand
        spellCode = ""; 
    }
});


// EASTER EGG: MISCHIEF MANAGED (THE GRAND FINALE)
let mischiefCode = "";

window.addEventListener('keydown', (e) => {
    // Ignore spaces 
    if (e.key === " ") return;

    mischiefCode += e.key.toLowerCase();
    
    // "mischiefmanaged" is 15 characters long without the space
    if (mischiefCode.length > 15) {
        mischiefCode = mischiefCode.slice(-15);
    }
    
    if (mischiefCode === "mischiefmanaged") {
        triggerMischiefManaged();
        mischiefCode = ""; // Reset code
    }
});

function triggerMischiefManaged() {
    document.getElementById('floating-player').style.display = 'none';
    document.body.classList.add('override-blue-scrollbar');
    // 1. Fade out the music
    const bgMusic = document.getElementById('bg-music');
    const globalAudio = document.getElementById('global-audio');
    if (bgMusic && !bgMusic.paused) fadeAudio(bgMusic, 0, 3000);
    if (globalAudio && !globalAudio.paused) fadeAudio(globalAudio, 0, 3000);

    // 2. cinematic black screen
    const finaleOverlay = document.createElement('div');
    finaleOverlay.className = 'mischief-managed-overlay';
    
    // 3. final text
    const finaleText = document.createElement('div');
    finaleText.className = 'mischief-managed-text';
    finaleText.innerHTML = "<span class='hp-metallic-text'>Mischief Managed.</span><br><span style='font-size: 0.25em; color: var(--teal-silver); font-family: var(--font-display);'>Forever your partner in crime. Happy Birthday Chikki.<br>I Love You<span class='delayed-always'>Always...</span></span>";
    // 4. Attach everything to the page
    finaleOverlay.appendChild(finaleText);
    document.body.appendChild(finaleOverlay);

    finaleOverlay.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });

    // 5. Trigger the slow fade animations
    setTimeout(() => {
        finaleOverlay.classList.add('active');
    }, 100);
    
    setTimeout(() => {
        finaleText.classList.add('visible');
    }, 2500); 
}

// EXPECTO PATRONUM 
let patronusCode = "";
window.addEventListener('keydown', (e) => {
    if (e.key === " ") return;
    patronusCode += e.key.toLowerCase();
    
    if (patronusCode.length > 15) {
        patronusCode = patronusCode.slice(-15);
    }
    
    if (patronusCode === "expectopatronum") {
        triggerPatronus();
        patronusCode = ""; 
    }
});

function triggerPatronus() {
    if (document.querySelector('.patronus-overlay')) return;
    document.body.classList.add('override-blue-scrollbar');

    const floatPlayer = document.getElementById('floating-player');
    if (floatPlayer) floatPlayer.classList.remove('active');

   // 1.
    const overlay = document.createElement('div');
    overlay.className = 'patronus-overlay';
    overlay.style.top = `${window.scrollY}px`;

    // 2. 
    const container = document.createElement('div');
    container.className = 'patronus-container';

    // 3. 
    const img = document.createElement('img');
    img.src = 'patronus.jpg';
    img.className = 'patronus-img';

    // 4. 
    const text = document.createElement('div');
    text.className = 'patronus-text';
    text.innerHTML = "To cast this spell, you need a memory that shines brighter than the rest.<br><span class='patronus-highlight'>Thank you for giving me this one.</span>";

    // 5.
    container.appendChild(img);
    container.appendChild(text);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // 6.
    setTimeout(() => {
        overlay.classList.add('active');
    }, 100);

    // 7.
    setTimeout(() => {
        overlay.classList.remove('active');
        document.body.classList.remove('override-blue-scrollbar');

        const hasActiveSong = document.querySelector('.track-row.playing-now');
        if (floatPlayer && hasActiveSong) floatPlayer.classList.add('active');

        setTimeout(() => {
            overlay.remove();
        }, 2500);
    }, 8000); 
}

// Floating player override 
document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('floating-player');
    
    if (player) {
        // forces to the root of the page
        document.body.appendChild(player);
        document.body.style.perspective = 'none';
        document.body.style.transform = 'none';
        document.body.style.filter = 'none';
        document.documentElement.style.perspective = 'none';
    }
});