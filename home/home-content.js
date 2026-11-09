// HOME AND CAKE INTRO TEXT
// Edit only the words inside the double quotes, then save this file.
// You can type English or Hindi. Keep the quotation marks and commas.
window.HOME_TEXT = {
  introTitle: "A little birthday surprise",
  introPrompt: "Make a wish, then slice the cake.",
  introHint: "Swipe or drag across the cake.",
  introCutButton: "Or tap here to cut",
  soundOn: "Turn sound on",
  soundOff: "Mute sound",

  heroLabel: "A DAY THAT'S ALL ABOUT YOU",
  titleLine1: "For you,",
  titleLine2: "on your",
  titleLine3: "birthday",
  messageLine1: "Some people make the world a little brighter.",
  messageLine2: "Today, we all of us celebrate one of them.",
  wishButton: "Open your wish",
  storyButton: "Explore your story",
  replayButton: "Replay the birthday surprise",
  wishCardTitle: "The Wish",
  wishCardCaption: "for you",
  storyCardTitle: "The Story",
  storyCardCaption: "all your little moments"
};

// If you replace the opening MP4, choose the second just before the cake cuts.
// The visitor sees the still cake first; the video starts here after the swipe.
window.HOME_SETTINGS = { cutStartSeconds: 1 };

// Do not change the code below this line.
document.querySelectorAll('[data-home-text]').forEach((element) => {
  const value = window.HOME_TEXT[element.dataset.homeText];
  if (typeof value === 'string') element.textContent = value;
});
