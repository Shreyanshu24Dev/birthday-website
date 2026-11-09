// WISH PAGE TEXT
// Change the words inside the double quotes. Keep the quotes and commas.
// For a new line inside a message, type \n where you want the line break.
// English and Hindi text are both supported.
window.WISH_TEXT = {
  pageTitle1: "On your day,",
  pageTitle2: "and every day.",
  pageSubtitle: "A birthday wish from all of us to you.",
  photoCaption: "here’s to a wonderful day",

  letterGreeting: "Happy birthday!",
  letterParagraph1: "Today, all of us are celebrating you and the many wonderful things that make you who you are.",
  letterParagraph2: "May your day be filled with laughter, thoughtful surprises, and time with the people who care about you.",
  letterParagraph3: "Here’s to a year of good health, exciting opportunities, big dreams, and plenty of reasons to smile. We’re all cheering you on!",
  signoff: "With warm wishes,",
  signature: "from all of us",
  surpriseButton: "One more little thing",
  surpriseCloseButton: "A little less",
  surpriseMessage: "You make this day special simply by being you. Enjoy every moment!",

  notesTitle1: "For the moments",
  notesTitle2: "in between.",
  notesSubtitle: "Three little notes to open whenever you need them.",
  note1Title: "you need a smile",
  note1Message: "I hope you find a hundred little reasons to smile today. You deserve every one.",
  note2Title: "you doubt yourself",
  note2Message: "Take a breath. You are capable of more than you know, and I believe in you.",
  note3Title: "you need a reminder",
  note3Message: "You matter to the people around you, exactly as you are."
};

// Do not change the code below this line.
document.querySelectorAll('[data-wish-text]').forEach((element) => {
  const value = window.WISH_TEXT[element.dataset.wishText];
  if (typeof value === 'string') element.textContent = value;
});
