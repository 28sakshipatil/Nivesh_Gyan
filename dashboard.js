// Dashboard JavaScript Functionality

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    addInteractiveEffects();
    setupProgressAnimations();
});

// Initialize dashboard components
function initializeDashboard() {
    console.log('Nivesh Gyan Dashboard Initialized');
    
    // Add progress bars to modules
    addProgressBars();
    
    // Setup badge interactions
    setupBadgeInteractions();
    
    // Add hover effects to modules
    addModuleHoverEffects();
}

// Add progress bars to module list items
function addProgressBars() {
    const moduleItems = document.querySelectorAll('.section ul li');
    
    moduleItems.forEach((item, index) => {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'progress-indicator';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        // Set progress based on module status
        if (item.textContent.includes('Completed')) {
            progressBar.classList.add('completed');
            item.style.borderColor = '#00ff88';
            item.style.background = 'rgba(0, 255, 136, 0.1)';
            item.style.color = '#00ff88';
        } else if (item.textContent.includes('In Progress')) {
            progressBar.classList.add('in-progress');
            item.style.borderColor = '#ffaa00';
            item.style.background = 'rgba(255, 170, 0, 0.1)';
            item.style.color = '#ffaa00';
        } else if (item.textContent.includes('Locked')) {
            progressBar.classList.add('locked');
            item.style.borderColor = '#666666';
            item.style.background = 'rgba(102, 102, 102, 0.1)';
            item.style.color = '#888888';
            item.style.opacity = '0.7';
        }
        
        progressDiv.appendChild(progressBar);
        item.appendChild(progressDiv);
    });
}

// Setup badge interactions
function setupBadgeInteractions() {
    const badgesSection = document.querySelector('.section h3').nextElementSibling;
    
    if (badgesSection && badgesSection.tagName === 'P') {
        // Split badges and create individual badge elements
        const badgeText = badgesSection.textContent;
        const badges = badgeText.split(' | ');
        
        // Clear original content
        badgesSection.innerHTML = '';
        badgesSection.className = 'badges-container';
        
        // Create individual badge elements
        badges.forEach(badge => {
            const badgeElement = document.createElement('span');
            badgeElement.className = 'badge-item';
            badgeElement.textContent = badge.trim();
            badgesSection.appendChild(badgeElement);
        });
    }
}

// Add hover effects to modules
function addModuleHoverEffects() {
    const moduleItems = document.querySelectorAll('.section ul li');
    
    moduleItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
            this.style.boxShadow = '0 10px 25px rgba(0, 255, 136, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Add click interaction for non-locked modules
        if (!item.textContent.includes('Locked')) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                showModuleDetails(this);
            });
        }
    });
}

// Show module details on click
function showModuleDetails(moduleElement) {
    const moduleName = moduleElement.textContent;
    
    // Create alert for module interaction
    if (moduleName.includes('Completed')) {
        showAlert('success', '✅ Module completed! You can review the content anytime.');
    } else if (moduleName.includes('In Progress')) {
        showAlert('success', '⏳ Continue your learning journey! You\'re 65% complete.');
    }
}

// Setup progress animations
function setupProgressAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

// Add interactive effects
function addInteractiveEffects() {
    // Add floating animation to badges
    const badges = document.querySelectorAll('.badge-item');
    badges.forEach((badge, index) => {
        badge.style.animationDelay = `${index * 0.2}s`;
        badge.classList.add('floating-badge');
    });
    
    // Add click ripple effect
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('badge-item') || 
            e.target.tagName === 'LI' || 
            e.target.tagName === 'BUTTON') {
            createRipple(e);
        }
    });
}

// Create ripple effect
function createRipple(event) {
    const element = event.target;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(0, 255, 136, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Show alert messages
function showAlert(type, message) {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${message}
        <button class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Create alert container if it doesn't exist
function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
    `;
    document.body.appendChild(container);
    return container;
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .floating-badge {
        animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .alert {
        background: linear-gradient(145deg, #1a1a1a, #0f0f0f);
        border: 2px solid #333333;
        border-radius: 10px;
        padding: 1rem;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
    }
    
    .alert.success {
        border-color: #00ff88;
        color: #00ff88;
    }
    
    .alert.error {
        border-color: #ff4444;
        color: #ff4444;
    }
    
    .alert-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background 0.3s ease;
    }
    
    .alert-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    /* Enhanced Module Icons */
    .section ul li::before {
        content: '';
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-block;
        margin-right: 1rem;
        background: linear-gradient(45deg, #00ff88, #00cc6a);
        flex-shrink: 0;
    }
    
    .section ul li:first-child::before {
        content: '✅';
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: #000;
        font-weight: bold;
    }
    
    .section ul li:nth-child(2)::before {
        content: '⏳';
        background: linear-gradient(45deg, #ffaa00, #ff8800);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
    
    .section ul li:nth-child(3)::before {
        content: '🔒';
        background: linear-gradient(45deg, #666666, #444444);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
    }
`;

document.head.appendChild(style);

// Module interaction functions
function openModule(moduleType) {
    switch(moduleType) {
        case 'beginner':
            showAlert('success', '📚 Opening Beginner Module - Stock Market Basics');
            break;
        case 'intermediate':
            showAlert('success', '📈 Continuing Intermediate Module - Technical Analysis');
            break;
        case 'advanced':
            showAlert('error', '🔒 Complete the Intermediate Module to unlock Advanced topics');
            break;
    }
}

// Smooth scroll function
function smoothScrollTo(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add progress tracking
function trackProgress() {
    const completedModules = document.querySelectorAll('.section ul li');
    let completed = 0;
    let total = completedModules.length;
    
    completedModules.forEach(module => {
        if (module.textContent.includes('Completed')) {
            completed++;
        }
    });
    
    const progressPercentage = Math.round((completed / total) * 100);
    console.log(`Learning Progress: ${progressPercentage}%`);
    
    return progressPercentage;
}

// Dynamic content updates
function updateProgress() {
    const progress = trackProgress();
    
    // Update any progress indicators
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        if (bar.parentElement.textContent.includes('Learning Progress')) {
            bar.style.width = `${progress}%`;
        }
    });
}

// Initialize everything
setTimeout(() => {
    updateProgress();
    addInteractiveEffects();
}, 500);