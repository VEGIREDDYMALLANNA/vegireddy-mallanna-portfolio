/**
 * Vegireddy Mallanna - Portfolio Interactivity Engine
 * Features: Scroll Spy, Reveal on Scroll, Interactive Skills, Project Filter,
 *           Mock Git Contribution Graph, Bangalore Clock, Contact Handler.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Antigravity Canvas Animation Setup (Disabled for Brutalist Theme)
    const canvas = document.getElementById('antigravity-canvas');
    if (canvas) {
        // Canvas is kept in HTML but animation is disabled for clean aesthetic.
        canvas.style.display = 'none';
    }

    // 0b. Theme Toggle Switcher Logic (Removed for this specific design)
    // The design is strictly minimalist cream/yellow.

    // 1. Navigation & Sticky Header Logic
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Sticky Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightNavLinks();
        toggleBackToTop();
    });

    // Mobile Toggle Menu
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('open');
            // Toggle hamburger icon animation or state
            const isOpen = navMenu.classList.contains('open');
            mobileToggle.innerHTML = isOpen 
                ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>` 
                : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>`;
            }
        });
    }

    // Scroll Spy: Highlight nav menu links on scroll
    function highlightNavLinks() {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                const targetLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
                if (targetLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    }

    // 2. Scroll Reveal Animations (Intersection Observer)
    const revealItems = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once animated, we can unobserve
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // 3. Interactive Skills Progress Bars (trigger when visible)
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillsSection = document.getElementById('skills');

    const animateSkills = () => {
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress;
        });
    };

    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    skillsObserver.unobserve(entry.target); // trigger once
                }
            });
        }, { threshold: 0.2 });
        skillsObserver.observe(skillsSection);
    }

    // 4. Project Filters Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Reset card display animation
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8) translateY(20px)';

                setTimeout(() => {
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'block';
                        // Trigger slide-in animation
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // 5. Custom GitHub Contribution Graph Generator
    const gitGrid = document.getElementById('git-grid');
    if (gitGrid) {
        const totalWeeks = 32; // fits nicely on screen
        const totalDays = 7;
        const totalCells = totalWeeks * totalDays;
        
        // Generate random activity level with bias towards light contributions
        // 0: none, 1: low, 2: medium, 3: high, 4: very high
        const getRandomLevel = () => {
            const r = Math.random();
            if (r < 0.50) return 0;
            if (r < 0.80) return 1;
            if (r < 0.92) return 2;
            if (r < 0.97) return 3;
            return 4;
        };

        const today = new Date();
        // Shift start date back by totalCells days
        const startDate = new Date();
        startDate.setDate(today.getDate() - totalCells);

        for (let i = 0; i < totalCells; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);

            const level = getRandomLevel();
            const cell = document.createElement('div');
            cell.className = 'git-cell';
            cell.style.backgroundColor = `var(--git-${level})`;

            // Format date for tooltip
            const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
            const dateStr = cellDate.toLocaleDateString('en-US', options);
            
            // Format commit counts based on levels
            let commitsText = 'No contributions';
            if (level === 1) commitsText = '1-2 contributions';
            else if (level === 2) commitsText = '3-5 contributions';
            else if (level === 3) commitsText = '6-8 contributions';
            else if (level === 4) commitsText = '9+ contributions';

            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = `${commitsText} on ${dateStr}`;
            
            cell.appendChild(tooltip);
            gitGrid.appendChild(cell);
        }
    }

    // 6. Live Time in Bangalore (UTC + 5:30)
    const timeDisplay = document.getElementById('local-time');
    
    function updateBangaloreTime() {
        if (!timeDisplay) return;
        
        const now = new Date();
        // Get UTC time
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        // Add offset for Bangalore (UTC +5.5 hours)
        const bangaloreOffset = 5.5;
        const bangaloreTime = new Date(utc + (3600000 * bangaloreOffset));

        const timeString = bangaloreTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        const dateString = bangaloreTime.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        timeDisplay.textContent = `${timeString} (${dateString})`;
    }

    if (timeDisplay) {
        updateBangaloreTime();
        setInterval(updateBangaloreTime, 1000);
    }

    // 7. Contact Form Handler (AJAX POST to FormSubmit.co)
    const contactForm = document.getElementById('contact-form');
    const formSubmitBtn = document.getElementById('form-submit');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formSubmitBtn && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // UI Feedback
            const originalBtnContent = formSubmitBtn.innerHTML;
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = `
                <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="80" stroke-dashoffset="20"></circle>
                </svg> Sending...`;
            
            formStatus.className = 'form-status';
            formStatus.style.opacity = '1';
            formStatus.textContent = '';

            // Collect Form Values
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // AJAX Request to FormSubmit.co forwarding directly to vegireddymallanna@gmail.com
            fetch('https://formsubmit.co/ajax/vegireddymallanna@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to send message.');
                }
            })
            .then(data => {
                // Show Success
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you! Your message has been sent successfully directly to Vegireddy.';
                contactForm.reset();
            })
            .catch(error => {
                // Show Error
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Oops! Something went wrong sending your message. Please try again later.';
                console.error('Email send error:', error);
            })
            .finally(() => {
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = originalBtnContent;
                
                // Fade success/error status message after 6 seconds
                setTimeout(() => {
                    formStatus.style.transition = 'opacity 1s ease';
                    formStatus.style.opacity = '0';
                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.style.opacity = '1';
                    }, 1000);
                }, 6000);
            });
        });
    }

    // 8. Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');

    function toggleBackToTop() {
        if (!backToTopBtn) return;
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
