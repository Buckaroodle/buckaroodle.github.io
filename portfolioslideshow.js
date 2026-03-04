// A global object to store the slide index for each slideshow
const slideIndexes = {};

// Function to initialize all slideshows on page load
function initializeSlideshows() {
  const slideshows = document.getElementsByClassName('slideshow-container');
  for (let i = 0; i < slideshows.length; i++) {
    const id = slideshows[i].id;
    if (id) {
      slideIndexes[id] = 1; // Initialize the slide index for each slideshow to 1
      showSlides(1, id); // Show the first slide of each slideshow
    }
  }
}

// Call the initialization function when the page loads
window.onload = initializeSlideshows;

// Thumbnail image controls
function currentSlide(n, slideshowId) {
  showSlides(slideIndexes[slideshowId] = n, slideshowId);
}

function showSlides(n, slideshowId) {
  let i;
  const slideshow = document.getElementById(slideshowId);
  if (!slideshow) return;

  const slides = slideshow.getElementsByClassName("mySlides");
  // Use the ID to get the correct dot container
  const dotsContainer = document.getElementById(`dots-${slideshowId}`); 
  const dots = dotsContainer.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndexes[slideshowId] = 1;
  }
  if (n < 1) {
    slideIndexes[slideshowId] = slides.length;
  }

  // Hide all slides and remove active class from dots for the specific slideshow
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    slides[i].classList.add("hidden-slide");
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  // Display the current slide and add active class to its dot
  slides[slideIndexes[slideshowId] - 1].style.display = "block";
  slides[slideIndexes[slideshowId] - 1].classList.remove("hidden-slide");
  dots[slideIndexes[slideshowId] - 1].className += " active";
}

function filterProjects(category, button) {
    // 1. Handle Button Scaling/Active Class
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // 2. Filter Projects
    const projects = document.querySelectorAll('.project');
    
    projects.forEach(project => {
        // Reset animation by removing and re-adding if necessary
        project.style.display = 'none'; 
        
        if (project.classList.contains(category)) {
            project.style.display = 'block';
        }
    });
}

// Set default view to 'Finished' on page load
window.addEventListener('DOMContentLoaded', () => {
    const defaultBtn = document.querySelector('.tab-btn.active');
    if (defaultBtn) {
        filterProjects('Finished', defaultBtn);
    }
});