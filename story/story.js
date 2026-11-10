// The Story film is fixed for this birthday website.
// Add the final MP4 as story/assets/our-story.mp4 and redeploy; visitors cannot replace it.
const video = document.querySelector('#memory-video');
const placeholder = document.querySelector('#video-placeholder');
const statusText = document.querySelector('#video-status');

if (video && placeholder && statusText) {
  video.addEventListener('loadedmetadata', () => {
    video.hidden = false;
    placeholder.hidden = true;
    statusText.textContent = 'A little film, made especially for you.';
  });

  video.addEventListener('error', () => {
    video.hidden = true;
    placeholder.hidden = false;
    statusText.textContent = 'Your birthday film will appear here soon.';
  });
}
