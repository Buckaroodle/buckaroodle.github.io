var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length} ;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
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
        // This triggers the logic to show ONLY 'Finished' and hide the rest
        filterProjects('Finished', defaultBtn);
    }
});