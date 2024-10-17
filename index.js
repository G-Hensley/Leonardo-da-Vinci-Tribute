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

  // Media query to stop animation if width is below 1050px
  const mediaQuery = window.matchMedia("(max-width: 1050px)");

  // Function to check if media query matches
  function handleMediaQueryChange(e) {
    if (e.matches) {
      console.log("Screen is 1050px or less: Animation stopped.");
      cancelAnimation(); // Stop animations if the media query matches
    }
  }

  // Call the function initially to check the current screen size
  handleMediaQueryChange(mediaQuery);

  // Add an event listener for when the screen is resized
  mediaQuery.addListener(handleMediaQueryChange);

  // Function to cancel the animation
  function cancelAnimation() {
    isAnimating = false;
    // Pause animations by setting `animationPlayState` to `paused`
    mainLine.style.animationPlayState = 'paused';
    leftLines.forEach(line => line.style.animationPlayState = 'paused');
    rightLines.forEach(line => line.style.animationPlayState = 'paused');
    infoItems.forEach(item => item.style.animationPlayState = 'paused');
  }

  // Function to start animations
  function startTimelineAnimations() {
    if (isAnimating || userInteracted || mediaQuery.matches) return; // Prevent starting if already animating or media query matches
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

  // Function to stop scrolling sync if user interacts
  function stopScrollSync() {
    userInteracted = true;
    isAnimating = false;
    window.removeEventListener('click', stopScrollSync); // Remove listener once it's triggered
  }

  // Intersection Observer to start the animation when the section comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isAnimating && !userInteracted && !mediaQuery.matches) {
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
