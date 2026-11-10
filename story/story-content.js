// STORY PAGE TEXT
// Change the words inside the double quotes. Keep the quotes and commas.
// For a new line inside a chapter, type \n where you want the line break.
// You can write the story in English or Hindi.
window.STORY_TEXT = {
  pageTitle1: "The little things",
  pageTitle2: "become the big things.",
  pageIntro1: "A little place to keep the moments, memories,",
  pageIntro2: "and magic that make this story yours.",
  exploreButton: "Explore the story",

  filmTitle1: "A little film,",
  filmTitle2: "just for you.",
  videoTitle: "A place for your story",
  videoSubtitle: "Your favourite moments belong here.",
  videoReady: "A little film, just for you.",

  chaptersTitle1: "All the little",
  chaptersTitle2: "chapters.",
  chaptersSubtitle: "The best stories are made of moments, not pages.",
  chapter1Title: "The beginning",
  chapter1Text: "Every story starts somewhere. Yours is one worth celebrating.",
  chapter2Title: "The little moments",
  chapter2Text: "All the laughs, conversations, and everyday moments that somehow mean everything.",
  chapter3Title: "The pages ahead",
  chapter3Text: "Here’s to more adventures, more memories, and many more moments to celebrate.",
  endingLine1: "A favourite place for all of us",
  endingLine2: "right here with you."
};

// Do not change the code below this line.
document.querySelectorAll('[data-story-text]').forEach((element) => {
  const value = window.STORY_TEXT[element.dataset.storyText];
  if (typeof value === 'string') element.textContent = value;
});
