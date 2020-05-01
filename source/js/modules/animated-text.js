const TIMER_STEP = 100;

export default class AnimatedText {
  constructor(element) {
    this.element = element;
    this.timerDelay = 0;
    this.lettersArray = [];

    this.init = this.init.bind(this);
    this.prepareText = this.prepareText.bind(this);
    this.prepareLetters = this.prepareLetters.bind(this);
    this.setLetterStyles = this.setLetterStyles.bind(this);
  }

  init() {
    this.prepareText();
    this.prepareLetters();
  }

  prepareText() {
    const wordsArray = this.element.textContent.split(` `);
    this.element.textContent = ``;

    wordsArray.forEach((word) => {
      const wordSpan = document.createElement(`span`);

      Array.from(word).forEach((letter) => {
        const letterSpan = document.createElement(`span`);
        letterSpan.textContent = letter;

        this.lettersArray.push(letterSpan);

        wordSpan.appendChild(letterSpan);
      });

      this.element.appendChild(wordSpan);
    });
  }

  prepareLetters() {
    const totalLetters = this.lettersArray.length;

    if (totalLetters === 0) {
      return;
    }

    for (let i = 0; i < totalLetters; i++) {
      if (i === 0 || i % 3 === 0) {
        this.setLetterStyles(this.lettersArray[i]);

        if (i + 2 < totalLetters) {
          this.setLetterStyles(this.lettersArray[i + 2]);
        }

        if (i + 1 < totalLetters) {
          this.setLetterStyles(this.lettersArray[i + 1]);
        }
      }
    }
  }

  setLetterStyles(letter) {
    letter.classList.add(`animated-letter`);
    letter.style.animationDelay = `${this.timerDelay}ms`;

    this.timerDelay += TIMER_STEP;
  }
}
