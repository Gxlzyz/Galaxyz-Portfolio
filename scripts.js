// ====================
// Tab-switching handler for Skills & Work sections
// ====================
document.querySelectorAll('.SkillsTabs').forEach(tabsContainer => {
  const tabs = tabsContainer.querySelectorAll('.TabButton');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.dataset.tab;
      const gridContainers = tabsContainer.parentElement.querySelectorAll('.SkillsGrid, .WorkGrid');
      gridContainers.forEach(grid => {
        grid.style.display = grid.id === targetTab ? 'flex' : 'none';
      });
    });
  });
});

// ====================
// Per-section scroll offsets
// ====================
const sectionOffsets = {
  home: 0,
  about: -80,
  skills: -60,
  work: -60,
  contact: 0
};

// ====================
// Smooth scroll helper
// ====================
function scrollToElement(element) {
  const navbarHeight = document.querySelector('.Navbar')?.offsetHeight || 0;
  const id = element.id;
  const customOffset = sectionOffsets[id] !== undefined ? sectionOffsets[id] : 0;

  const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
  const targetY = elementTop - (navbarHeight + customOffset);

  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const duration = 800; // ms
  let startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

// ====================
// Nav link click handler
// ====================
let isManuallyClicked = false;

document.querySelectorAll('.NavLinks a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      isManuallyClicked = true; // lock active highlight
      document.querySelectorAll('.NavLinks a').forEach(l => l.classList.remove('active'));
      link.classList.add('active'); // manually set active
      const target = document.querySelector(href);
      if (target) scrollToElement(target);
    }
  });
});

// ====================
// Hire Me & About Me button click handler
// ====================
const hireMeButton = document.querySelector('.MainButton'); // first MainButton is Hire Me

// Scroll to Contact on Hire Me click
if (hireMeButton) {
  hireMeButton.addEventListener('click', e => {
    e.preventDefault();
    const contactSection = document.querySelector('#contact');
    if (contactSection) scrollToElement(contactSection);
  });
}

// Scroll to About on About Me click
const aboutMeButton = document.getElementById('aboutMeButton');
if (aboutMeButton) {
  aboutMeButton.addEventListener('click', e => {
    e.preventDefault();
    const aboutSection = document.querySelector('#about');
    if (aboutSection) scrollToElement(aboutSection);
  });
}


// ====================
// Reset manual click lock after user scrolls
// ====================
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isManuallyClicked = false;
  }, 100); // short delay after user stops scrolling
});

// ====================
// Active link highlight on scroll (only if not manually clicked)
// ====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.NavLinks a');

window.addEventListener('scroll', () => {
  if (isManuallyClicked) return; // do nothing if manually clicking

  let current = '';
  const navbarHeight = document.querySelector('.Navbar')?.offsetHeight || 0;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbarHeight - 20;
    if (window.scrollY >= sectionTop) {
      current = section.id;
    }
  });

  if (current) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
});

// WORK SECTION FILTER SYSTEM - INSTANT FILTERING
document.addEventListener('DOMContentLoaded', function() {
  // Get all elements
  const projectsTab = document.querySelector('.TabButton[data-tab="projects"]');
  const assetsTab = document.querySelector('.TabButton[data-tab="assets"]');
  const filterButtons = document.querySelectorAll('#projectFilters .TabButton');
  const projectsGrid = document.getElementById('projects');
  const projectItems = document.querySelectorAll('#projects .VideoProject');

  // Initialize on load
  function initialize() {
    // Set default active states
    projectsTab.classList.add('active');
    document.querySelector('#projectFilters .TabButton[data-filter="all"]').classList.add('active');
    
    // Show all projects initially
    filterProjects('all');
  }

  // Main filtering function
  function filterProjects(category) {
    projectItems.forEach(project => {
      if (category === 'all' || project.dataset.category === category) {
        project.style.display = 'flex';
        // Force reflow/repaint for instant update
        project.offsetHeight;
      } else {
        project.style.display = 'none';
      }
    });
  }

  // Tab click handlers
  projectsTab.addEventListener('click', function() {
    projectsTab.classList.add('active');
    assetsTab.classList.remove('active');
    projectsGrid.style.display = 'flex';
    document.getElementById('assets').style.display = 'none';
    document.getElementById('projectFilters').style.display = 'flex';
    
    // Reapply current filter
    const activeFilter = document.querySelector('#projectFilters .TabButton.active');
    if (activeFilter) filterProjects(activeFilter.dataset.filter);
  });

  assetsTab.addEventListener('click', function() {
    assetsTab.classList.add('active');
    projectsTab.classList.remove('active');
    projectsGrid.style.display = 'none';
    document.getElementById('assets').style.display = 'flex';
    document.getElementById('projectFilters').style.display = 'none';
  });

  // Filter button click handlers
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Apply filter immediately
      filterProjects(this.dataset.filter);
      
      // Force refresh of projects display
      projectsGrid.style.display = 'none';
      projectsGrid.offsetHeight; // Trigger reflow
      projectsGrid.style.display = 'flex';
    });
  });

  // Initialize
  initialize();
});
