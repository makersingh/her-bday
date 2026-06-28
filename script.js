// --- FORCE PAGE TO TOP ON REFRESH ---
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
window.scrollTo(0, 0);

// --- SECTION 1: BOOK OPENING ---
// Remove any old 'DOMContentLoaded' blocks and use this directly
window.onload = function() {
    const bookCover = document.getElementById('book-cover');
    const magicWorld = document.getElementById('magic-world');

    if (bookCover) {
        bookCover.onclick = function() {
            console.log("Magical reveal triggered!");
            
            // 1. Add the blur/expand class
            bookCover.classList.add('fade-out-magic');
            
            // 2. Show the magic world immediately
            if (magicWorld) {
                magicWorld.style.display = "block";
                magicWorld.style.opacity = "1";
            }

            // 3. Cleanup the book cover after 1.2 seconds
            setTimeout(function() {
                bookCover.style.display = "none";
            }, 1200); 
        };
    } else {
        console.error("Could not find book-cover element!");
    }
};

// --- NEW AESTHETIC PLAYLIST LOGIC ---
const globalAudio = document.getElementById('global-audio');
const trackRows = document.querySelectorAll('.track-row');

function playTrack(fileName, clickedRow) {
    const playBtnIcon = clickedRow.querySelector('.row-play-btn');

    // 1. If clicking the song that is ALREADY playing, just Pause it
    if (clickedRow.classList.contains('playing-now') && !globalAudio.paused) {
        globalAudio.pause();
        playBtnIcon.innerHTML = "▶";
        return;
    }
    
    // 2. If clicking the same song but it was paused, Resume it
    if (clickedRow.classList.contains('playing-now') && globalAudio.paused) {
        globalAudio.play();
        playBtnIcon.innerHTML = "⏸";
        return;
    }

    // 3. Otherwise, they clicked a NEW song! Reset all rows back to normal first
    trackRows.forEach(row => {
        row.classList.remove('playing-now');
        row.querySelector('.row-play-btn').innerHTML = "▶";
    });

    // Load the new song and play it
    globalAudio.src = fileName;
    globalAudio.play();
    
    // Light up the new row they just clicked
    clickedRow.classList.add('playing-now');
    playBtnIcon.innerHTML = "⏸";
}

// =========================================================================
// SECTION 2: THE SORTING HAT SCRIPT
// =========================================================================
const hatTextElement = document.getElementById('hat-text');
const hatAudio = document.getElementById('hat-audio'); 
const sortingPhoto = document.getElementById('sorting-photo'); 

const hatLines = [
    "Hmm... difficult. Very difficult...",
    "So much beauty, and a brilliant mind...",
    "Loyal, yes... but there is a fierce ambition here...",
    "A heart that knows exactly what it wants...",
    "I know exactly where to put you...",
    "SLYTHERIN!"
];

const sortingImages = [
    "sort1.jpg", 
    "sort2.jpg", 
    "sort3.jpg", 
    "sort4.jpg", 
    "sort5.jpg", 
    "sort6.jpg"  
];

// Your custom timestamps locked in!
const textTiming = [3300, 3300, 3500, 2500, 2500];

let hatIndex = 0;
// Make sure sortingStarted is declared at the top of your observer code!

function playSortingHat() {
    if (hatTextElement && hatIndex < hatLines.length) {
        // 1. Fade out BOTH text and image
        hatTextElement.style.opacity = 0; 
        if (sortingPhoto) sortingPhoto.style.opacity = 0; 
        
        setTimeout(() => {
            // 2. Swap text and image while invisible
            hatTextElement.innerHTML = hatLines[hatIndex]; 
            if (sortingPhoto && sortingImages[hatIndex]) {
                sortingPhoto.src = sortingImages[hatIndex];
            }
            
            // 3. Fade them back in
            hatTextElement.style.opacity = 1;
            if (sortingPhoto) sortingPhoto.style.opacity = 1;
            
            // BULLETPROOF FIX: Explicitly check for the exact word!
            // It will NEVER trigger early now.
            if (hatLines[hatIndex].includes("SLYTHERIN")) {
                
                hatTextElement.classList.add('slytherin-shout');
                
                //THE NEW MAGICAL BACKGROUND TRIGGER
                document.body.classList.add('slytherin-theme');
                
                
                setTimeout(() => { document.body.style.overflowY = 'auto'; }, 2000);
                
            } else {
                // Pull the wait time from your custom array
                let waitTime = textTiming[hatIndex] || 2000; 
                hatIndex++;
                setTimeout(playSortingHat, waitTime); 
            }
        }, 600); // 0.6s duration for the cross-fade effect
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
  // =========================================================================
// FEATURE 4: INTERACTIVE FLOATING WAND EFFECTS
// =========================================================================
document.addEventListener('mousemove', (e) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'wand-sparkle';
    sparkle.style.left = `${e.clientX}px`;
    sparkle.style.top = `${e.clientY}px`;
    
    // Slight random deviation so particles spread out beautifully
    const randomX = (Math.random() - 0.5) * 15;
    const randomY = (Math.random() - 0.5) * 15;
    sparkle.style.setProperty('--dx', `${randomX}px`);
    sparkle.style.setProperty('--dy', `${randomY}px`);

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 800);
});


// =========================================================================
// FEATURE 3: DYNAMIC SLYTHERIN THEME SHIFT INTERACTION
// =========================================================================
// Inside your existing playSortingHat() loop, update the final condition block:
// (Locate where hatIndex === hatLines.length - 1 inside your script.js and update it to match this)

            if (hatIndex === hatLines.length - 1) {
                hatTextElement.classList.add('slytherin-shout');
                
                // TRIGGER ENVIRONMENTAL SHIFT
                const magicWorld = document.getElementById('magic-world');
                if(magicWorld) magicWorld.classList.add('slytherin-theme-active');
                
                hatTextElement.style.opacity = 1;
                if (sortingPhoto) sortingPhoto.style.opacity = 1;
                
                setTimeout(() => { document.body.style.overflowY = 'auto'; }, 2000);
            }


// =========================================================================
// FEATURE 2: TRIVIA & MAP LOGIC
// =========================================================================
const triviaQuestions = [
    { q: "What is Harry Potter's position on the Gryffindor Quidditch team?", options: ["Keeper", "Chaser", "Seeker", "Beater"], answer: "Seeker" },
    { q: "Which spell is used to conjure a Patronus?", options: ["Expelliarmus", "Expecto Patronum", "Lumos", "Alohomora"], answer: "Expecto Patronum" },
    { q: "What did Harry call his owl?", options: ["Hedwig", "Errol", "Scabbers", "Fawkes"], answer: "Hedwig" } // Added a 3rd tough one!
];

// The Snape-style cheeky remarks
const cheekyRemarks = [
    "Hmph. Not entirely hopeless, I see.",
    "Acceptable. Barely.",
    "A lucky guess, no doubt.",
    "Perhaps you do have a brain after all."
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

function verifyTriviaAnswer(selectedOption) {
    const feedback = document.getElementById('trivia-feedback');
    const optsContainer = document.getElementById('quiz-options');

    if (selectedOption === triviaQuestions[currentQuizIndex].answer) {
        // Correct! Show cheeky remark
        optsContainer.style.pointerEvents = "none"; // Disable clicking twice
        const randomRemark = cheekyRemarks[Math.floor(Math.random() * cheekyRemarks.length)];
        feedback.innerText = randomRemark;
        feedback.style.opacity = 1;

        setTimeout(() => {
            feedback.style.opacity = 0;
            currentQuizIndex++;
            optsContainer.style.pointerEvents = "auto";

            if (currentQuizIndex < triviaQuestions.length) {
                loadTriviaQuestion();
            } else {
                // QUIZ COMPLETE!
                document.getElementById('quiz-question').innerText = "Voila! You indeed are a potter head. You may continue to The World of Magic.";
                optsContainer.innerHTML = "";
                
                // Wait 3.5 seconds, hide the ENTIRE section, fade in Map
                setTimeout(() => {
                    
                    // FIXED: Targeting the whole section now, not just the box
                    const triviaSection = document.getElementById('trivia-section');
                    if(triviaSection) {
                        triviaSection.classList.add('hidden-room');
                        triviaSection.classList.remove('visible-room');
                    }
                    
                    const map = document.getElementById('marauders-map');
                    if(map) {
                        map.classList.remove('hidden-room');
                        map.classList.add('visible-room');
                        // Force the screen to scroll to the map just in case!
                        map.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 3500);
            }
        }, 2000); // Wait 2 seconds before next question
    } else {
        feedback.innerText = "Incorrect. The Sorting Hat glares at you...";
        feedback.style.opacity = 1;
        setTimeout(() => feedback.style.opacity = 0, 2000);
    }
}
// =========================================================================
// FEATURE 5: ROOM NAVIGATION & HEART COLLAGE
// =========================================================================
function travelTo(roomId) {
    function returnToMap(currentRoomId) {
    // 1. Hide the room she is currently in
    const currentRoom = document.getElementById(currentRoomId);
    currentRoom.classList.remove('visible-room');
    currentRoom.classList.add('hidden-room');
    
    // 2. Show the map again
    const map = document.getElementById('marauders-map');
    map.classList.remove('hidden-room');
    map.classList.add('visible-room');
    
    // 3. Scroll her smoothly back to the top of the map
    map.scrollIntoView({ behavior: 'smooth' });
}
    // Hide the map
    document.getElementById('marauders-map').style.display = 'none';
    
    // Show the selected room
    const targetRoom = document.getElementById(roomId);
    targetRoom.style.display = 'block';
    
    // Scroll to the top of the newly opened room
    targetRoom.scrollIntoView({ behavior: 'smooth' });

    // If she clicked the Great Hall, trigger the sequential Heart animation!
    if (roomId === 'great-hall') {
        setTimeout(revealHeartCollage, 500);
    }
}

function revealHeartCollage() {
    const pics = document.querySelectorAll('.heart-pic');
    let delay = 0;
    
    pics.forEach((pic, index) => {
        setTimeout(() => {
            pic.classList.add('revealed');
            
            // Create a magical burst effect right over the photo
            createMagicalBurst(pic);
            
        }, delay);
        delay += 300; // Next photo pops up 0.3s later
    });
}

function createMagicalBurst(element) {
    const rect = element.getBoundingClientRect();
    const burst = document.createElement('div');
    burst.className = 'wand-sparkle'; // Re-using our wand sparkle CSS!
    
    // Position it dead center of the popping photo
    burst.style.left = `${rect.left + (rect.width / 2)}px`;
    burst.style.top = `${rect.top + (rect.height / 2)}px`;
    burst.style.transform = 'scale(3)'; // Make it big
    
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 800);
}

// Fire up quiz verification layout when script mounts
document.addEventListener("DOMContentLoaded", () => {
    loadTriviaQuestion();
});

// =========================================================================
// RESTORED: THE SCROLL LOCK & HAT TRIGGER (WITH SNAP ALIGNMENT)
// =========================================================================
let sortingStarted = false;

function startMagicObservers() {
    const sortingSection = document.getElementById('sorting-section');
    const bgMusic = document.getElementById('bg-music');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Lowered threshold to 0.6 so it catches it a bit earlier
            if (entry.isIntersecting && !sortingStarted) {
                sortingStarted = true;
                
                // 1. FORCE SNAP TO CENTER
                // This ensures the text and hat are perfectly centered before locking
                sortingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Wait 600ms for the smooth scroll to physically finish moving
                setTimeout(() => {
                    // 2. LOCK THE SCROLL
                    document.body.style.overflowY = 'hidden'; 
                    
                    // 3. PLAY BG MUSIC
                    if(bgMusic) bgMusic.play().catch(e => console.log("Audio play blocked"));
                    
                    // 4. START HAT AFTER DELAY
                    setTimeout(() => {
                        const hatAudio = document.getElementById('hat-audio');
                        if(hatAudio) hatAudio.play();
                        playSortingHat(); // Triggers your text/image loop
                    }, 1000);
                    
                }, 600); // The critical delay that waits for the snap to finish
            }
        });
    }, { threshold: 0.6 }); // Triggers when 60% of it is on screen

    if (sortingSection) {
        observer.observe(sortingSection);
    }
}

// Make sure the observer and trivia start when the page loads!
document.addEventListener("DOMContentLoaded", () => {
    startMagicObservers();
    loadTriviaQuestion();
});


// =========================================================================
// BULLETPROOF MAP NAVIGATION (Prevents Stacking)
// =========================================================================
const allRooms = ['marauders-map', 'slytherin-room', 'headmaster-office', 'great-hall'];

function travelTo(roomId) {
    allRooms.forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.classList.remove('visible-room');
            el.classList.add('hidden-room');
        }
    });
    
    const targetRoom = document.getElementById(roomId);
    if(targetRoom) {
        targetRoom.classList.remove('hidden-room');
        targetRoom.classList.add('visible-room');
        targetRoom.scrollIntoView({ behavior: 'smooth' });
    }

    // TRIGGER SPECIFIC ROOM ANIMATIONS
    if (roomId === 'great-hall') {
        setTimeout(revealHeartCollage, 500);
    } 
    
    if (roomId === 'headmaster-office') {
        // CALL YOUR SPECIFIC TYPEWRITER FUNCTIONS HERE
        // Assuming your functions are named typeWriter() and startSlideshow()
        if (typeof typeWriter === "function") typeWriter();
        
    }
}

function returnToMap() {
    // 1. Forcefully hide EVERY room
    allRooms.forEach(id => {
        const el = document.getElementById(id);
        if(el && id !== 'marauders-map') {
            el.classList.remove('visible-room');
            el.classList.add('hidden-room');
        }
    });
    
    // 2. Show ONLY the map
    const map = document.getElementById('marauders-map');
    if(map) {
        map.classList.remove('hidden-room');
        map.classList.add('visible-room');
        map.scrollIntoView({ behavior: 'smooth' });
    }
}
// =========================================================================
// PENSIEVE SLIDESHOW ENGINE
// =========================================================================
// --- HYBRID PENSIEVE SLIDER LOGIC ---
const memoryImages = [
    "child1.jpg", "child2.jpg", "child3.jpg", "child4.jpg", "child5.jpg",
    "teen1.jpg", "teen2.jpg", "teen3.jpg", "teen4.jpg", "teen5.jpg",
    "now1.jpg", "now2.jpg", "now3.jpg", "now4.jpg", "now5.jpg"
];

let currentMemoryIndex = 0;
let autoSlideTimer;
const specialMessage = "and the all time best...";

// FORCES the very first image to be child1.jpg when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const imgElement = document.getElementById('memory-img');
    if(imgElement) imgElement.src = memoryImages[0];
});


// Your upgraded custom typewriter function
function typeSpecialText(i) {
    const textElement = document.getElementById('special-text');
    if (!textElement) return;

    // On the very first letter, create a safe container for the text AND the cursor
    if (i === 0) {
        textElement.innerHTML = '<span id="type-content"></span><span class="blinking-cursor">|</span>';
    }

    if (i < specialMessage.length) {
        // Add letters ONLY to the text container, leaving the cursor completely alone
        document.getElementById('type-content').innerHTML += specialMessage.charAt(i);
        setTimeout(() => typeSpecialText(i + 1), 80); 
    } else {
        // Once typing finishes, wait 2.5s and cleanly hide the cursor
        setTimeout(() => {
            const cursor = document.querySelector('.blinking-cursor');
            if (cursor) cursor.style.display = 'none';
        }, 2500);
    }
}
// The main slider logic
function turnMemory(direction) {
    const imgElement = document.getElementById('memory-img');
    const textElement = document.getElementById('special-text');
    const container = document.getElementById('pensieve-frame');

    if (!imgElement || !container) return;

    // 1. Fade the current image out
    imgElement.style.opacity = 0;

    setTimeout(() => {
        // 2. Calculate the new image index
        currentMemoryIndex += direction;
        
        if (currentMemoryIndex < 0) currentMemoryIndex = memoryImages.length - 1;
        if (currentMemoryIndex >= memoryImages.length) currentMemoryIndex = 0;

        // 3. Swap the image source
        imgElement.src = memoryImages[currentMemoryIndex];

        // 4. Reset everything (kills the glow and clears the text)
        container.classList.remove('golden-border');
        textElement.style.opacity = 0;
        textElement.innerHTML = ""; // Clears the text completely
        textElement.classList.remove('typing-active'); // Removes the cursor

        // 5. THE MAGIC TRIGGER: If it's the 5th image (Index 4)
        if (currentMemoryIndex === 4) { 
            container.classList.add('golden-border');
            textElement.style.opacity = 1;
            textElement.classList.add('typing-active'); // Turns on the cursor
            typeSpecialText(0); // Starts the typewriter effect!
        }

        // 6. Fade the new image in
        imgElement.style.opacity = 1;
    }, 400); 

    // Reset the auto-timer on manual clicks
    resetAutoSlide();
}

function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
        turnMemory(1);
    }, 5000); 
}

function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
}

// Kick it off
startAutoSlide();

// --- PENSIEVE RESET FUNCTION ---
// This forces the slideshow to start at image 1 when entering the room
function resetPensieve() {
    currentMemoryIndex = 0;
    
    const imgElement = document.getElementById('memory-img');
    const textElement = document.getElementById('special-text');
    const container = document.getElementById('pensieve-frame');
    
    if(imgElement) {
        imgElement.style.opacity = 0; // Quick fade out
        setTimeout(() => {
            imgElement.src = memoryImages[0];
            imgElement.style.opacity = 1; // Fade back in on image 1
        }, 200);
    }
    
    // Clear any golden borders or old text
    if(container) container.classList.remove('golden-border');
    if(textElement) {
        textElement.style.opacity = 0;
        textElement.innerHTML = "";
    }
    
    // Restart the 5-second timer from scratch
    resetAutoSlide();
}