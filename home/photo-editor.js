// Choose and preview postcard photos; export them into a ZIP for static hosting.
// Everything stays in the browser until the user uploads the resulting ZIP.
(() => {
  const dialog = document.querySelector('#postcard-photo-editor');
  const openButton = document.querySelector('#edit-postcards');
  const closeButton = document.querySelector('#close-photo-editor');
  const zipInput = document.querySelector('#website-zip-input');
  const downloadButton = document.querySelector('#download-photo-site');
  const status = document.querySelector('#photo-editor-status');
  if (!dialog || !openButton || !closeButton || !zipInput || !downloadButton || !status) return;

  const photos = [
    { input: document.querySelector('#wish-photo-input'), preview: document.querySelector('#wish-photo-preview'), card: document.querySelector('.wish-picture'), filename: 'home/assets/wish-card.jpg', blob: null, url: null, revision: 0 },
    { input: document.querySelector('#story-photo-input'), preview: document.querySelector('#story-photo-preview'), card: document.querySelector('.story-picture'), filename: 'home/assets/story-card.jpg', blob: null, url: null, revision: 0 }
  ];
  const say = (message, error = false) => {
    status.textContent = message;
    status.classList.toggle('is-error', error);
  };

  openButton.addEventListener('click', () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  });
  closeButton.addEventListener('click', () => {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
    openButton.focus();
  });

  function toJpeg(file) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.onload = () => {
        try {
          // Keep the download lightweight while preserving enough detail for the postcards.
          const maxDimension = 2400;
          const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Photo conversion is not available.');
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url);
            if (blob) resolve(blob); else reject(new Error('Could not prepare this photo.'));
          }, 'image/jpeg', 0.9);
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('This photo could not be opened. Please try a JPG or PNG photo.'));
      };
      image.src = url;
    });
  }

  photos.forEach((photo) => {
    photo.input.addEventListener('change', async () => {
      const file = photo.input.files && photo.input.files[0];
      if (!file) return;
      const revision = ++photo.revision;
      if (file.size > 25 * 1024 * 1024) {
        say('Please choose a photo smaller than 25 MB.', true);
        photo.input.value = '';
        return;
      }
      say('Preparing your photo…');
      try {
        const blob = await toJpeg(file);
        if (revision !== photo.revision) return;
        if (photo.url) URL.revokeObjectURL(photo.url);
        photo.blob = blob;
        photo.url = URL.createObjectURL(blob);
        photo.preview.src = photo.url;
        photo.card.style.backgroundImage = `linear-gradient(180deg, transparent 55%, rgba(52,34,51,.34)), url("${photo.url}")`;
        say('Photo added to the preview. Select your website ZIP below to save it for everyone.');
      } catch (error) {
        if (revision !== photo.revision) return;
        photo.input.value = '';
        say(error.message || 'This photo could not be opened. Please try a JPG or PNG.', true);
      }
    });
  });

  downloadButton.addEventListener('click', async () => {
    if (!photos.some((photo) => photo.blob)) {
      say('First choose at least one postcard photo.', true);
      return;
    }
    const file = zipInput.files && zipInput.files[0];
    if (!file) {
      say('Please select the updated website ZIP you downloaded from ChatGPT.', true);
      zipInput.focus();
      return;
    }
    if (typeof JSZip === 'undefined') {
      say('The ZIP tool did not load. Please keep all website files together and reopen the page.', true);
      return;
    }
    downloadButton.disabled = true;
    say('Preparing your website ZIP…');
    try {
      const zip = await JSZip.loadAsync(file);
      const homePage = zip.file('index.html');
      const content = zip.file('home/home-content.js');
      if (!homePage || !content || !(await homePage.async('string')).includes('id="postcard-photo-editor"')) {
        throw new Error('Please choose the updated Vercel-ready ZIP from ChatGPT, not an older ZIP.');
      }
      for (const photo of photos) {
        if (photo.blob) zip.file(photo.filename, await photo.blob.arrayBuffer());
      }
      const result = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 3 } });
      const downloadUrl = URL.createObjectURL(result);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Birthday_Website_With_Photos.zip';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);
      say('Your website ZIP is ready! Upload the downloaded ZIP to Vercel to share these photos.');
    } catch (error) {
      say(error.message || 'Could not read that ZIP. Please try the updated website ZIP again.', true);
    } finally {
      downloadButton.disabled = false;
    }
  });
})();
