'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  // Determine coordinates of scroll land
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  /*
  // Btn location
  console.log(e.target.getBoundingClientRect());

  // X & Y location
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  // Viewport dimensions
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
*/
  // Scrolling
  // (left, top)
  /*
  window.scrollTo(
    // Current position + current scroll
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  );
  
  window.scrollTo({
    // Current position + current scroll
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  */

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation

/*
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

// Event delegation
// Event listener attached to parent element of all elements
// instead of on each individual element.
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// Tabbed component

// Adding event listener to parent element
tabsContainer.addEventListener('click', function (e) {
  // Targeting the button, whether btn or span is selected
  const clicked = e.target.closest('.operations__tab');

  // Ignore null value clicks
  // Guard clause
  // If statement which returns early if some condition is met
  // If we have null, falesy value, not falesy = true, return, no remaining code executed
  if (!clicked) return;

  // Deactive tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  // Deactive content
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Activate tab
  clicked.classList.add('operations__tab--active');
  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    // Change opacity of nav items not selected
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Mouseenter does not bubble, mouseover does
/*
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});
*/
// Bind returns a new function
// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////
// Sticky navigation

/*
const initialCoords = section1.getBoundingClientRect();

// Triggered when scrolling
window.addEventListener('scroll', function () {
  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

// Intersection Observer API
// Observes changes to the way that a certain target element intersect another element OR the way it intersect the viewport
/*
const obsCallback = function (entries, observer) {};

const obsOptions = {
  // Element the target is intersecting
  root: null,
  // % of intersection at which observer callback will be called
  threshold: [0, 0.2],
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotsContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions

  // Slide movement
  const goToSlide = function (slide) {
    // 0%, 100%, 200%, 300%
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Prev slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    // Remove dot
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // Add dot
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // Event handlers
  // Btn movement
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Key movement
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // Dot movement
  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();
/*
////////////////////////////////////////////
// SELECTING, CREATING & DELETING ELEMENTS

// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
// Return node list
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
// Returns live collection
// If DOM changes, this is updated
console.log(allButtons);

// Live HTML collection
console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
// .insertAdjacentHTML

// createElement
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We used cokies for improved functionality and analytics.'
message.innerHTML =
  'We used cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
// Insert into doc
// Before
// header.prepend(message);
// After
header.append(message);
// Allow element to display more than once
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    // message.parentElement.removeChild(message);
  });
*/
/*
// STYLES, ATTRIBUTES, CLASSES

// Styles
// Set as inline styles
// Property is in camel case
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// Can only view styles set inline
// Returns nothing
console.log(message.style.height);
// Returns background color
console.log(message.style.backgroundColor);

// Return style sheet values
// And automatically determined values
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = getComputedStyle(message).height + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

// Non-standard (doesn't work)
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

// Absolute version (with link)
console.log(logo.src);
// Relative version
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'd');
logo.classList.remove('c', 'd');
logo.classList.toggle('c');
logo.classList.contains('c');
// Don't use
// Overrides existing element
// Only allows one class on element
logo.className = 'Cillin';
*/
/*
// SMOOTH SCROLLING

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  // Determine coordinates of scroll land
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  // Btn location
  console.log(e.target.getBoundingClientRect());

  // X & Y location
  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  // Viewport dimensions
  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // (left, top)
  /*
  window.scrollTo(
    // Current position + current scroll
    s1coords.left + window.pageXOffset,
    s1coords.top + window.pageYOffset
  );
  
  window.scrollTo({
    // Current position + current scroll
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  */
/*
  section1.scrollIntoView({ behavior: 'smooth' });
});


// Event handlers
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListner: Great! You are reading the heading :)');

  // Removed after called
  h1.removeEventListener('mouseenter', alertH1);
};

// Can add multiple per element
h1.addEventListener('mouseenter', alertH1);

// Can only add one per element
h1.onmouseenter = function (e) {
  alert('onmouseenter: Great! You are reading the heading :)');
};
*/

/*
// EVENT PROPAGATION

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  // currentTarget === this
  console.log('LINK', e.target, e.currentTarget);

  // Stop propagation
  e.stopPropagation();
});

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('LINK', e.target, e.currentTarget);
  },
  true
  // Where this use capture parameter is et to true, the event handler will no longer listen to bubble events, but instead to capturing events
);
*/
/*
// DOM TRAVERSING

const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight'));
// Every node within h1 element: Text, comments etc.
console.log(h1.childNodes);
// Every element within h1 element
console.log(h1.children);

h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'gold';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
// Only access direct siblings: previous and next
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// Nodes
console.log(h1.previousSibling);
console.log(h1.nextSibling);

// All siblings
console.log(h1.parentElement.children);
// Making all other siblings 50% smaller
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/
