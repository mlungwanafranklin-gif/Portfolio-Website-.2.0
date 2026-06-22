console.log("Script loaded successfully");
// ============================================
// PARTICLE SYSTEM
// ============================================
const canvas = document.getElementById('particles');
const ctx = canvas ? canvas.getContext('2d') : null;
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticles() {
    particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.body.getAttribute('data-theme') === 'light';
    const color = isLight ? '13, 148, 136' : '6, 182, 212';

    particles.forEach((particle, i) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${particle.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[j].x - particle.x;
            const dy = particles[j].y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${color}, ${0.1 * (1 - distance / 150)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });
    animationId = requestAnimationFrame(drawParticles);
}

function initParticles() {
    if (!canvas || !ctx) return;

    resizeCanvas();
    createParticles();

    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    drawParticles();
}

window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
});

// ============================================
// THEME TOGGLE
// ============================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) body.setAttribute('data-theme', savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        initParticles();
    });
}

// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

window.addEventListener('scroll', () => {
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
});

// ============================================
// TYPING EFFECT
// ============================================
const dynamicText = document.getElementById('dynamicText');
const words = ['Software Developer', 'Web Designer', 'UI/UX Enthusiast', 'IT Technician'];
let wordIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        dynamicText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        dynamicText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    let typeSpeed = isDeleting ? 50 : 100;
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 500;
    }
    setTimeout(typeEffect, typeSpeed);
}

// ============================================
// STATS COUNTER
// ============================================
const statNumbers = document.querySelectorAll('.stat-number');
function animateStats() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else stat.textContent = target;
        };
        updateCounter();
    });
}

const statsSection = document.querySelector('.stats');
let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            animateStats();
            statsAnimated = true;
        }
    });
}, { threshold: 0.5 });
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const revealElements = document.querySelectorAll('.skill-card, .project-card, .service-card, .about-image, .about-content, .contact-info, .contact-form-wrapper, .blog-card, .stat-item');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            if (entry.target.classList.contains('skill-card')) entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ============================================
// PROJECT FILTERING
// ============================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else card.classList.add('hidden');
        });
    });
});


// ============================================
// BACK TO TOP
// ============================================
const backToTop = document.getElementById('backToTop');
if (backToTop) {

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

}

// ============================================
// FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        console.log(data);
    });
}

// ============================================
// CURRENT YEAR
// ============================================
const yearElement = document.getElementById('year');

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ============================================
// PARALLAX
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    if (scrolled < window.innerHeight) hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    initParticles();
});

// Testimonials Slider
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.testimonial-prev');
const nextBtn = document.querySelector('.testimonial-next');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        dots[i].classList.remove('active');
    });
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    });
    
    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    });
}

const mapModal = document.getElementById("mapModal");
const openMap = document.getElementById("openMap");
const closeMap = document.getElementById("closeMap");

openMap.addEventListener("click", function(e) {
    e.preventDefault();
    mapModal.style.display = "flex";
});

closeMap.addEventListener("click", function() {
    mapModal.style.display = "none";
});

window.addEventListener("click", function(e) {
    if (e.target === mapModal) {
        mapModal.style.display = "none";
    }
});

const otherCheckbox = document.getElementById("otherCheckbox");
const otherField = document.getElementById("otherServiceField");

otherCheckbox.addEventListener("change", function () {
    if (this.checked) {
        otherField.style.display = "block";
    } else {
        otherField.style.display = "none";
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const otherCheckbox = document.getElementById("otherCheckbox");
    const otherField = document.getElementById("otherServiceField");
    const otherInput = document.getElementById("otherDetails");

    function toggleOtherField() {
        if (otherCheckbox.checked) {
            otherField.style.display = "block";
        } else {
            otherField.style.display = "none";
            otherInput.value = ""; // clears leftover text
        }
    }

    otherCheckbox.addEventListener("change", toggleOtherField);
});
