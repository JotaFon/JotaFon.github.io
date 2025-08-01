const { init: aosInit } = AOS;

aosInit({
    duration: 1000,
    once: true,
    offset: 100
});

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('fade-out');
    }, 1500);
});

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
  
    navbar.classList.toggle('scrolled', window.pageYOffset > 50);
});

const typewriterConfig = {
    text: "João Victor Fonseca",
    speed: 150,
    delay: 2000
};

const { text, speed, delay } = typewriterConfig;

function typeWriter(index = 0) {
    const typingElement = document.getElementById('typing-text');
  
    if (!typingElement) return;
    
    if (index < text.length) {
        typingElement.innerHTML += text.charAt(index);
        setTimeout(() => typeWriter(index + 1), speed);
    }
}

setTimeout(() => {
    const typingElement = document.getElementById('typing-text');
  
    if (typingElement) {
        typingElement.innerHTML = '';
        typeWriter();
    }
}, delay);

const particlesConfig = {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#ea580c' },
        shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
        opacity: {
            value: 0.1,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false }
        },
        size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ea580c',
            opacity: 0.1,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
        }
    },
    retina_detect: true
};

particlesJS('particles-js', particlesConfig);

const smoothScrollHandler = (e) => {
    e.preventDefault();
    const target = document.querySelector(e.currentTarget.getAttribute('href'));
    
    if (target) {
        const { offsetTop } = target;
        window.scrollTo({
            top: offsetTop - 80,
            behavior: 'smooth'
        });
    }
};

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', smoothScrollHandler);
});

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-content');
    
    if (parallax) {
        const { style } = parallax;
      
        style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

const createRipple = (e, element) => {
    const ripple = document.createElement('span');
    const { classList, appendChild } = element;
    const { clientX, clientY } = e;
    const { offsetLeft, offsetTop } = e.target;
    
    ripple.classList.add('ripple');
    appendChild(ripple);
    
    const { style } = ripple;
    style.left = `${clientX - offsetLeft}px`;
    style.top = `${clientY - offsetTop}px`;
    
    setTimeout(() => ripple.remove(), 300);
};

document.querySelectorAll('.btn, .contact-card').forEach(button => {
    button.addEventListener('click', (e) => createRipple(e, button));
});

const rippleStyles = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.3s linear;
        width: 20px;
        height: 20px;
        margin-left: -10px;
        margin-top: -10px;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const addStyles = (styles) => {
    const styleElement = document.createElement('style');
  
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
};

addStyles(rippleStyles);

const skillItems = document.querySelectorAll('.skill-item');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const { target } = entry;
            const { style } = target;
            
            setTimeout(() => {
                style.transform = 'translateY(0)';
                style.opacity = '1';
            }, index * 50);
        }
    });
});

const initializeSkillItems = () => {
    skillItems.forEach(item => {
        const { style } = item;
      
        Object.assign(style, {
            transform: 'translateY(20px)',
            opacity: '0',
            transition: 'all 0.6s ease'
        });
        skillObserver.observe(item);
    });
};

initializeSkillItems();

const colorConfig = {
    start: [10, 10, 15],
    end: [19, 19, 26]
};

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const { offsetHeight } = document.body;
    const docHeight = offsetHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;
    
    const { start: startColor, end: endColor } = colorConfig;
    
    const currentColor = startColor.map((start, i) => 
        Math.round(start + (endColor[i] - start) * scrollPercent)
    );
    
    document.body.style.background = `rgb(${currentColor.join(',')})`;
});

const konamiHandler = (() => {
    let konamiCode = [];
    const targetCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    
    return (e) => {
        const { keyCode } = e;
        konamiCode.push(keyCode);
        
        if (konamiCode.length > targetCode.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === targetCode.join(',')) {
            const { style } = document.body;
            style.animation = 'rainbow 2s ease-in-out';
            setTimeout(() => style.animation = '', 2000);
        }
    };
})();

window.addEventListener('keydown', konamiHandler);

const rainbowStyles = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;

addStyles(rainbowStyles);

const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const { target } = entry;
            const { style } = target;
            
            setTimeout(() => {
                Object.assign(style, {
                    opacity: '1',
                    transform: 'translateX(0)'
                });
            }, index * 200);
        }
    });
});

const initializeTimelineItems = () => {
    timelineItems.forEach(item => {
        const { style } = item;
      
        Object.assign(style, {
            opacity: '0',
            transform: 'translateX(-50px)',
            transition: 'all 0.8s ease'
        });
        timelineObserver.observe(item);
    });
};

initializeTimelineItems();

const contactCards = document.querySelectorAll('.contact-card');

contactCards.forEach((card, index) => {
    const { style, classList } = card;
  
    style.animationDelay = `${index * 0.2}s`;
    classList.add('floating');
});

const preloadResources = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css'
];

const createPreloadLink = (href) => {
    const link = document.createElement('link');
  
    Object.assign(link, {
        rel: 'preload',
        as: 'style',
        href
    });
    document.head.appendChild(link);
};

preloadResources.forEach(createPreloadLink);

const performanceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
  
    entries.forEach(({ entryType, name, duration }) => {
        if (entryType === 'measure') {
            console.log(`${name}: ${duration}ms`);
        }
    });
});

performanceObserver.observe({ entryTypes: ['measure'] });

window.addEventListener('load', () => {
    const { mark, measure } = performance;
  
    mark('page-load-complete');
    measure('page-load-time', 'navigationStart', 'page-load-complete');
});
