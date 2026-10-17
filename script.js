document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 May the Force be with you! Portfolio loaded successfully.');
    
    // 1. Smooth navigation with active section highlighting
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-list a');

    let lastCurrent = '';

    function highlightNav() {
        // A section becomes current when its top passes a line 30% down the screen.
        // (The old formula used a third of the section's height, so on phones the
        // tall About section was marked as current while still on the Home screen.)
        const line = window.innerHeight * 0.3;
        let current = sections[0].getAttribute('id');

        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= line) {
                current = section.getAttribute('id');
            }
        });

        // At the very bottom of the page, the last section (Contact) is current
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        if (atBottom) current = sections[sections.length - 1].getAttribute('id');

        if (current === lastCurrent) return;
        lastCurrent = current;

        navLinks.forEach(link => {
            const isActive = link.getAttribute('href').substring(1) === current;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.style.animation = 'pulse 0.5s ease';
                setTimeout(() => { link.style.animation = ''; }, 500);
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    
    // 2. Typing effect on main title (types once, cursor blinks with CSS)
    const mainTitle = document.querySelector('.main h1');
    const fullText = 'Wenner Nunes\nFront-End Developer';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let charIndex = 0;

    mainTitle.setAttribute('aria-label', fullText.replace('\n', ' '));

    function typeEffect() {
        const typed = fullText.substring(0, charIndex + 1).replace('\n', '<br>');
        mainTitle.innerHTML = typed + '<span class="cursor"></span>';
        charIndex++;
        if (charIndex < fullText.length) {
            setTimeout(typeEffect, 80 + Math.random() * 40);
        }
    }

    if (reduceMotion) {
        mainTitle.innerHTML = fullText.replace('\n', '<br>');
    } else {
        mainTitle.innerHTML = '<span class="cursor"></span>';
        setTimeout(typeEffect, 1000);
    }
    
    // 3. Project modal with details
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Project data (add a demo URL when the project is published)
    const projectsData = [
        {
            title: "CoffeeFlow",
            description: "Income and expense tracker I built for our coffee farm. Filter by month, create your own categories, see income vs expenses over the last 6 months in a chart, switch to dark mode, and export or import a backup file. Data is saved in the browser with LocalStorage.",
            image: "Asset/coffeeflow.jpg",
            tech: ["HTML5", "CSS3", "JavaScript", "Chart.js", "LocalStorage"],
            demo: "https://coffeeflowapp.netlify.app/",
            code: "https://github.com/WennerNunes/Coffee-Flow"
        },
        {
            title: "Household Budget Organizer",
            description: "Personal finance tool to plan a monthly budget. Set a percentage target for each category, add and delete expenses, follow progress bars and a chart of budget vs spending, and switch between light and dark themes. Everything is saved with LocalStorage.",
            image: "Asset/household-budget.jpg",
            tech: ["HTML5", "CSS3", "JavaScript", "Chart.js", "LocalStorage"],
            demo: "",
            code: "https://github.com/WennerNunes/Household-Budget-Organizer"
        },
        {
            title: "Space Login",
            description: "Login and registration system built for a freelance client, with a glass-effect interface over a space background and a simple welcome dashboard. Includes form validation and a show/hide password option. The code is shared publicly with the client's permission; the live version belongs to the client.",
            privateDemo: true,
            image: "Asset/space-login.jpg",
            tech: ["HTML5", "CSS3", "JavaScript", "Form Validation"],
            demo: "",
            code: "https://github.com/WennerNunes/Space-login-Project"
        }
    ];
    
    let lastFocused = null;

    // Add events to project cards (mouse click or Enter/Space on keyboard)
    projectCards.forEach((card, index) => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });

        card.addEventListener('click', () => {
            const project = projectsData[index];
            if (!project) return;
            
            // Fill modal with project data
            lastFocused = card;
            modal.querySelector('.modal-image').src = project.image;
            modal.querySelector('.modal-image').alt = project.title + ' screenshot';
            modal.querySelector('.modal-title').textContent = project.title;
            modal.querySelector('.modal-description').textContent = project.description;
            
            // Technologies
            const techContainer = modal.querySelector('.modal-tech');
            techContainer.innerHTML = '<h4>Technologies Used:</h4>';
            project.tech.forEach(tech => {
                const techTag = document.createElement('span');
                techTag.classList.add('tech-tag');
                techTag.textContent = tech;
                techContainer.appendChild(techTag);
            });
            
            // Links
            const demoLink = modal.querySelector('.live-demo');
            demoLink.style.display = project.demo ? '' : 'none';
            if (project.demo) demoLink.href = project.demo;
            modal.querySelector('.private-demo').style.display = project.privateDemo ? '' : 'none';
            modal.querySelector('.view-code').href = project.code;
            
            // Show modal with animation
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Add background blur effect
            document.querySelectorAll('section').forEach(section => {
                section.style.filter = 'blur(5px)';
            });

            // Move keyboard focus into the modal
            closeModal.focus();
        });
    });
    
    // Close modal
    function closeProjectModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.querySelectorAll('section').forEach(section => {
            section.style.filter = '';
        });
        // Return focus to the card that opened the modal
        if (lastFocused) lastFocused.focus();
    }
    
    closeModal.addEventListener('click', closeProjectModal);
    
    // Close modal by clicking outside or pressing ESC
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
    
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeProjectModal();
        }
    });
    
    // 5. Scroll reveal animation
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    sections.forEach(section => revealObserver.observe(section));
    
    // 6. "Work with me" button
    const comlinkBtn = document.getElementById('request-comlink');
    
    comlinkBtn.addEventListener('click', () => {
        // The link already scrolls to #contact; this adds the highlight effect
        // Smooth scroll to contact section
        document.getElementById('contact').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Highlight contact form
        const contactSection = document.getElementById('contact');
        contactSection.style.boxShadow = '0 0 40px rgba(255, 232, 31, 0.3)';
        contactSection.style.animation = 'pulse 2s ease';
        
        setTimeout(() => {
            contactSection.style.boxShadow = '';
            contactSection.style.animation = '';
        }, 2000);
    });
    
    // 7. Extra effects
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize navigation highlights
    highlightNav();
    
    // Console easter egg
    console.log('%c💻 Developed with passion by Wenner!', 
        'color: #ffe81f; font-size: 16px; font-weight: bold; text-shadow: 0 0 5px rgba(255, 232, 31, 0.5);');
});