const surpriseButton = document.querySelector('.surprise-button');
const surpriseNote = document.querySelector('#surprise-note');
if (surpriseButton && surpriseNote) {
  surpriseButton.addEventListener('click', () => {
    const willOpen = surpriseNote.hidden;
    surpriseNote.hidden = !willOpen;
    surpriseButton.setAttribute('aria-expanded', String(willOpen));
    const label = surpriseButton.querySelector('.surprise-label');
    if (label) label.textContent = willOpen ? (window.WISH_TEXT?.surpriseCloseButton || 'A little less') : (window.WISH_TEXT?.surpriseButton || 'One more little thing');
  });
}
