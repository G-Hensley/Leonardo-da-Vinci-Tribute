document.addEventListener('DOMContentLoaded', () => {
    const timelineSection = document.getElementById('timeline-section');
    const mainLine = document.querySelector('.main-line');
    const leftLines = document.querySelectorAll('.left-line');
    const rightLines = document.querySelectorAll('.right-line');
    const infoItems = document.querySelectorAll('.timeline-info');
    const duration = 30000; // Duration of the main line animation in milliseconds (30 seconds)
    let startTime = null;
    let isAnimating = false;
    let userInteracted = false;
  
    // Function to start animations
    function startTimelineAnimations() {
      if (isAnimating || userInteracted) return; // Prevent starting if already animating or user has interacted
      isAnimating = true;
      startTime = null; // Reset start time for smooth start
      mainLine.style.animationPlayState = 'running';
      leftLines.forEach(line => line.style.animationPlayState = 'running');
      rightLines.forEach(line => line.style.animationPlayState = 'running');
      infoItems.forEach(item => item.style.animationPlayState = 'running');
      requestAnimationFrame(syncScrollWithAnimation); // Start scroll synchronization
  
      // Start listening for clicks only after the animation starts
      window.addEventListener('click', stopScrollSync);
    }
  
    // Function to sync scroll with animation progress
    function syncScrollWithAnimation(timestamp) {
      if (!isAnimating || userInteracted) return; // Stop if user interacted manually
      if (!startTime) startTime = timestamp;
  
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // From 0 to 1
      const easedProgress = easeInOutQuad(progress); // Smooth easing
  
      // Calculate the target scroll position based on eased progress
      const startScroll = timelineSection.offsetTop;
      const endScroll = timelineSection.offsetTop + timelineSection.scrollHeight - window.innerHeight;
      const scrollPosition = startScroll + (endScroll - startScroll) * easedProgress;
  
      window.scrollTo({
        top: scrollPosition,
        behavior: 'auto' // Smooth scrolling control
      });
  
      // Continue animation until complete
      if (progress < 1) {
        requestAnimationFrame(syncScrollWithAnimation);
      } else {
        isAnimating = false; // End of animation
        window.removeEventListener('click', stopScrollSync); // Clean up the click listener after the animation completes
      }
    }
  
    // Ease-in-out function for smoother scrolling
    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
  
    // Intersection Observer to start the animation when the section comes into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isAnimating && !userInteracted) {
          startTimelineAnimations();
          observer.unobserve(timelineSection); // Only trigger once
        }
      });
    }, {
      threshold: 0.4 // Adjust for when 40% of the section is visible
    });
  
    // Observe the timeline section
    observer.observe(timelineSection);
  
  });
  