// Language Switcher
const switcher = document.getElementById("languageSwitcher");
if (switcher) {
  switcher.addEventListener("change", () => {
    const lang = switcher.value;
    document.querySelectorAll("[data-en]").forEach(el => {
      el.innerText = el.getAttribute(`data-${lang}`);
    });
  });
}

// Animated Counter for Stats
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    updateCounter();
  });
}

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.3,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animate stats when about section comes into view
      if (entry.target.classList.contains('about-section')) {
        animateCounters();
      }
      
      // Animate service cards
      if (entry.target.classList.contains('services-section')) {
        const serviceCards = entry.target.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
          setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease forwards';
            card.style.opacity = '1';
          }, index * 100);
        });
      }
    }
  });
}, observerOptions);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set initial state for service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
  });
  
  // Observe sections for animations
  const aboutSection = document.querySelector('.about-section');
  const servicesSection = document.querySelector('.services-section');
  
  if (aboutSection) observer.observe(aboutSection);
  if (servicesSection) observer.observe(servicesSection);
  
  // Add smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add active state to navigation based on scroll position
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Add particle effect on hover for service cards
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', createParticles);
    card.addEventListener('mouseleave', removeParticles);
  });
});

// Particle effect functions
function createParticles(e) {
  const card = e.currentTarget;
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: #00ff88;
      border-radius: 50%;
      pointer-events: none;
      animation: particleFloat 2s ease-out forwards;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      z-index: 1;
    `;
    card.appendChild(particle);
    
    setTimeout(() => particle.remove(), 2000);
  }
}

function removeParticles(e) {
  const particles = e.currentTarget.querySelectorAll('.particle');
  particles.forEach(particle => particle.remove());
}

// Add CSS for particle animation
const style = document.createElement('style');
style.textContent = `
  @keyframes particleFloat {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-100px) scale(0);
    }
  }
  
  .service-card {
    position: relative;
  }
`;
document.head.appendChild(style);