// Place an MP4 named our-story.mp4 in story/assets to show it for everyone.
// The picker below is a temporary, private preview on the current device only.
const video = document.querySelector('#memory-video');
const placeholder = document.querySelector('#video-placeholder');
const fileInput = document.querySelector('#video-file');
const statusText = document.querySelector('#video-status');
let previewUrl = null;
let hasPickedVideo = false;
if (video && placeholder && fileInput && statusText) {
  video.addEventListener('loadedmetadata', () => {
    video.hidden = false;
    placeholder.hidden = true;
    statusText.textContent = hasPickedVideo ? (window.STORY_TEXT?.videoPreviewReady || 'Your video is ready to play. This preview stays on this device.') : (window.STORY_TEXT?.videoReady || 'A little film, just for you.');
  });
  video.addEventListener('error', () => {
    if (hasPickedVideo) {
      video.hidden = true;
      placeholder.hidden = false;
      statusText.textContent = window.STORY_TEXT?.videoError || 'This video could not be played. Try an MP4 or WebM file.';
    }
  });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    hasPickedVideo = true;
    previewUrl = URL.createObjectURL(file);
    video.src = previewUrl;
    video.load();
  });
  window.addEventListener('pagehide', () => { if (previewUrl) URL.revokeObjectURL(previewUrl); });
}
