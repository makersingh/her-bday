// --- FORCE PAGE TO TOP ON REFRESH ---
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
window.scrollTo(0, 0);

// --- SECTION 1: BOOK OPENING ---
const bookCover = document.getElementById('book-cover');
const magicWorld = document.getElementById('magic-world');

if (bookCover) {
    bookCover.addEventListener('click', () => {
        bookCover.classList.add('book-open-anim');
        if (magicWorld) magicWorld.style.display = 'block';
        
        setTimeout(() => {
            if (magicWorld) magicWorld.classList.add('show-world');
        }, 50);
        
        setTimeout(() => { 
            bookCover.style.display = 'none'; 
            startMagicObservers(); 
        }, 1500);
    });
}

// --- NEW AESTHETIC MUSIC PLAYER LOGIC ---
const lauvAudio = document.getElementById('lauv-audio');
const customPlayBtn = document.getElementById('custom-play-btn');

if (customPlayBtn && lauvAudio) {
    customPlayBtn.addEventListener('click', () => {
        if (lauvAudio.paused) {
            lauvAudio.play();
            customPlayBtn.innerHTML = "⏸"; // Changes to Pause icon
            customPlayBtn.classList.add('playing');
        } else {
            lauvAudio.pause();
            customPlayBtn.innerHTML = "▶"; // Changes back to Play icon
            customPlayBtn.classList.remove('playing');
        }
    });
}

// --- SECTION 2: THE SORTING HAT SCRIPT ---
const hatTextElement = document.getElementById('hat-text');
const hatAudio = document.getElementById('hat-audio'); 

const hatLines = [
    "Hmm... difficult. Very difficult...",
    "So much beauty, and a brilliant mind...",
    "Loyal, yes... but there is a fierce ambition here...",
    "A heart that knows exactly what it wants...",
    "I know exactly where to put you...",
    "SLYTHERIN!"
];

// TIMING FOR YOUR AUDIO FILE (Milliseconds)
const textTiming = [ 3500, 3500, 3700, 2800, 2500 ];

let hatIndex = 0;
let sortingStarted = false;

function playSortingHat() {
    if (hatTextElement && hatIndex < hatLines.length) {
        hatTextElement.style.opacity = 0; 
        
        setTimeout(() => {
            hatTextElement.innerHTML = hatLines[hatIndex]; 
            
            if (hatIndex === hatLines.length - 1) {
                hatTextElement.classList.add('slytherin-shout');
                hatTextElement.style.opacity = 1;
                
                setTimeout(() => {
                    document.body.style.overflowY = 'auto'; // Unlocks screen
                }, 2000);
                
            } else {
                hatTextElement.style.opacity = 1;
                let waitTime = textTiming[hatIndex] || 3000; // Failsafe timing
                hatIndex++;
                setTimeout(playSortingHat, waitTime); 
            }
        }, 500);
    }
}

// --- SECTION 3: TIME-TURNER SLIDESHOW & TYPEWRITER ---
const memoryImages = [
    "child1.jpg", "child2.jpg", "child3.jpg", "child4.jpg", "child5.jpg",
    "teen1.jpg", "teen2.jpg", "teen3.jpg", "teen4.jpg", "teen5.jpg",
    "now1.jpg", "now2.jpg", "now3.jpg", "now4.jpg", "now5.jpg"
];

const specialImageIndex = 4; // Which photo gets the golden text?

const memoryImgElement = document.getElementById('memory-img');
const specialTextElement = document.getElementById('special-text');
const slideshowContainer = document.querySelector('.slideshow-container');
let currentImgIndex = 0;
let slideshowStarted = false; 

const specialMessage = "and the all time best...";

function typeSpecialText(i) {
    if (specialTextElement && i < specialMessage.length) {
        specialTextElement.innerHTML += specialMessage.charAt(i);
        setTimeout(() => typeSpecialText(i + 1), 80); 
    } else if (specialTextElement) {
        setTimeout(() => {
            specialTextElement.classList.remove('typing-active');
        }, 2500);
    }
}

function nextMemory() {
    if (!memoryImgElement) return; 
    
    memoryImgElement.classList.add('hidden');
    if (slideshowContainer) slideshowContainer.classList.remove('golden-frame'); 
    
    if (specialTextElement) {
        specialTextElement.innerHTML = ""; 
        specialTextElement.classList.remove('typing-active'); 
    }
    
    setTimeout(() => {
        currentImgIndex = (currentImgIndex + 1) % memoryImages.length;
        memoryImgElement.src = memoryImages[currentImgIndex];
        memoryImgElement.classList.remove('hidden');
        
        let slideDuration = 4500; 
        
        if (currentImgIndex === specialImageIndex) {
            memoryImgElement.classList.add('special-pop');
            if (slideshowContainer) slideshowContainer.classList.add('golden-frame'); 
            
            slideDuration = 7000; 
            
            setTimeout(() => {
                if (specialTextElement) {
                    specialTextElement.classList.add('typing-active');
                    typeSpecialText(0);
                }
            }, 600);
            
        } else {
            memoryImgElement.classList.remove('special-pop');
            memoryImgElement.classList.add('zooming');
        }
        
        setTimeout(nextMemory, slideDuration);
        
        setTimeout(() => {
            if (currentImgIndex !== specialImageIndex) {
                memoryImgElement.classList.remove('zooming');
            }
        }, 4000);
        
    }, 1500); 
}


// --- SECTION 4: TYPING LETTER & OBSERVERS ---
const yourMessage = "Happy Birthday, Munmun. I wanted to make something special just for you because you mean everything to me. You make every single day brighter, and I just wanted to remind you how beautiful, amazing, and deeply loved you are. I hope your day is as magical as you are.";

const typingTextElement = document.getElementById("typing-text");
let letterIndex = 0;
let isTyping = false;

function typeWriter() {
    if (typingTextElement && letterIndex < yourMessage.length) {
        typingTextElement.innerHTML += yourMessage.charAt(letterIndex);
        letterIndex++;
        setTimeout(typeWriter, 45); 
    }
}

function startMagicObservers() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            
            // 1. THE SORTING HAT TRIGGER
            if (entry.target.id === 'sorting-section' && entry.isIntersecting && !sortingStarted) {
                sortingStarted = true;
                entry.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    document.body.style.overflowY = 'hidden'; 
                    
                    // Plays the hat audio cleanly without looking for background music
                    if (hatAudio) {
                        hatAudio.play().catch(e => console.log("Audio blocked", e));
                    }
                    
                    playSortingHat(); 
                    
                }, 800); 
            }

            // 2. THE SLIDESHOW TRIGGER
            if (entry.target.classList.contains('timeline-section') && entry.isIntersecting && !slideshowStarted) {
                slideshowStarted = true;
                setTimeout(nextMemory, 4500); 
            }
            
            // 3. THE LETTER TRIGGER
            if (entry.target.id === 'letter-section' && entry.isIntersecting && !isTyping) {
                isTyping = true;
                setTimeout(typeWriter, 500); 
            }
        });
    }, { threshold: 0.5 }); 

    // Safety checks before observing
    const section1 = document.getElementById('sorting-section');
    const section2 = document.querySelector('.timeline-section');
    const section3 = document.getElementById('letter-section');
    
    if (section1) observer.observe(section1);
    if (section2) observer.observe(section2);
    if (section3) observer.observe(section3);
}
  