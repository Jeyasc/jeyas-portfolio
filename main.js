/**
 * MAIN.JS - Professional Portfolio Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
    initTypewriter();
    initScrollReveal();
    initSpaceCanvas();
    initMobileMenu();
});

function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    
    if(menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

/* =========================================
   TYPEWRITER EFFECT (ROLES)
   ========================================= */
function initTypewriter() {
    const roles = [
        "Space Technology Enthusiast",
        "Remote Sensing Specialist",
        "Earth Observation Data",
        "Aerospace Interventions"
    ];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeElement = document.getElementById("typewriter");
    const typingDelay = 50;
    const erasingDelay = 30;
    const newRoleDelay = 2000; // Time to wait before deleting

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typeElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? erasingDelay : typingDelay;

        // If word is completely typed
        if (!isDeleting && charIndex === currentRole.length) {
            speed = newRoleDelay;
            isDeleting = true;
        } 
        // If word is completely deleted
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500; // Pause before typing new word
        }

        setTimeout(type, speed);
    }

    setTimeout(type, 1000); // Initial delay
}

/* =========================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================= */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");

    const revealOptions = {
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });
}

/* =========================================
   SPACE CANVAS PARTICLE SYSTEM (AMBIENT LAYER)
   ========================================= */
function initSpaceCanvas() {
    const canvas = document.getElementById("space-canvas");
    const ctx = canvas.getContext("2d");

    let width, height;
    let stars = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }

    class Star {
        constructor(isMoving) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 1.5 + 0.3; // slightly larger for visibility
            this.isMoving = isMoving;
            
            if (this.isMoving) {
                // Moving stars drift slowly
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3 + 0.1;
            } else {
                this.speedX = 0;
                this.speedY = 0;
            }
            
            // Bright white stars
            this.alpha = Math.random() * 0.8 + 0.2;
            this.alphaChange = (Math.random() - 0.5) * 0.03; // slower twinkle
        }

        update() {
            if (this.isMoving) {
                this.x += this.speedX;
                this.y -= this.speedY; 
                
                // Wrap around edges gracefully
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
            }
            
            // Twinkle effect
            this.alpha += this.alphaChange;
            if (this.alpha <= 0.1 || this.alpha >= 1) {
                this.alphaChange = -this.alphaChange;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            // fillRect is significantly more performant for thousands of stars than arc
            ctx.fillRect(this.x, this.y, this.radius * 2, this.radius * 2);
        }
    }

    function initStars() {
        stars = [];
        // Dense starfield (roughly 5-10x more stars than before)
        const numStars = Math.floor((width * height) / 250); 
        for (let i = 0; i < numStars; i++) {
            // 50% stars are moving, 50% are stationary
            const isMoving = Math.random() > 0.5;
            stars.push(new Star(isMoving));
        }
    }

    function animate() {
        // Render a deep indigo space background so it's not pitch black
        ctx.fillStyle = 'rgba(8, 10, 22, 1)'; 
        ctx.fillRect(0, 0, width, height);

        stars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    resize();
    animate();
}
