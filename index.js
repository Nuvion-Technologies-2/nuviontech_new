function redirectToHome() {
  window.location.href = "http://127.0.0.1:5500/index.html";
}
function redirectToProjects() {
  window.location.href = "http://127.0.0.1:5500/projects.html";
}
function redirectToDigi() {
  window.open("http://digiaarogya.com", "_blank");
}
function redirectToContact(){
  window.location.href="#contact";
}

window.addEventListener('scroll', () => {
  let value = window.scrollY;
  let navbar = document.getElementById('navbar');

  if (value > 700) 
  {
    navbar.classList.add('nav-adder');
  }
  if (value > 200) {
    navbar.style.backgroundColor = 'rgba(113, 170, 255,0.8)';
    navbar.style.backdropFilter = 'blur(10px)';
  } 
  else {
    navbar.classList.remove('nav-adder');
    navbar.style.backgroundColor = 'transparent';
    navbar.style.backdropFilter = 'blur(0px)';
  }
});

window.addEventListener('scroll', function() {
  var ccardDivs = document.querySelectorAll('.ccard');
  var windowHeight = window.innerHeight;

  ccardDivs.forEach(function(ccard, index) {
    var ccardPosition = ccard.getBoundingClientRect().top;

    // Check if the top of the ccard div is within the viewport
    if (ccardPosition < windowHeight) {
      // Calculate delay for fade-in animation based on index
      var delay = index * 0.12; // Adjust delay as needed

      // Add fade-in animation class with delay
      setTimeout(function() {
        ccard.classList.add('fade-in');
      }, delay * 1000); // Convert seconds to milliseconds
    }
  });
});


// PROJECTS
document.addEventListener("DOMContentLoaded", function() {
  const projects = document.querySelectorAll(".project");

  projects.forEach(project => {
    project.addEventListener("click", function() {
      projects.forEach(p => p.classList.remove("p-active"));
      this.classList.add("p-active");
    });
  });
});



// TEAM SLIDER
var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("team-card");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "flex";
}



function validateMobile(input) {
  // Remove any non-numeric characters
  input.value = input.value.replace(/\D/g, '');

  // Limit the input to 10 characters
  if (input.value.length > 10) {
    input.value = input.value.slice(0, 10);
  }

  // Check if input contains 'e', if so, remove it
  if (input.value.includes('e')) {
    input.value = input.value.replace('e', '');
  }
}


//LOADER
document.addEventListener("DOMContentLoaded", function() {
  const loader = document.getElementById('loader');

  loader.style.display = 'block'; // Show the loader on page load

  // After 2 seconds, hide the loader with smooth fade-out
  setTimeout(function () {
      loader.style.opacity = '0';
      setTimeout(function () {
          loader.style.display = 'none';
      }, 600);
  }, 1200);
});





//CONTACT US ANIMATION
window.addEventListener('scroll', function () {
  var fields = document.querySelectorAll('input, textarea, button');
  var form = document.querySelector('.contact-form');
  var scrollPosition = window.scrollY + window.innerHeight;
  var delay = 0;

  if (scrollPosition > form.offsetTop) {
  fields.forEach(function (field) {
    setTimeout(function () {
        field.classList.add('fade-in');
    }, delay);
    delay += 150; // Adjust delay as needed
});}
});