const TIMER_STEP = 100;


class IntroTitle {
  constructor(titleElement, timer) {
    this.titleElement = titleElement;
    this.timer = timer;
    this.timerDelay = 0;
    this.lettersArray = [];

    this.init = this.init.bind(this);
    this.runAnimation = this.runAnimation.bind(this);
    this.destroyAnimation = this.destroyAnimation.bind(this);
    this.prepareText = this.prepareText.bind(this);
    this.prepareLetters = this.prepareLetters.bind(this);
    this.setLetterStyles = this.setLetterStyles.bind(this);
  }

  init() {
    this.prepareText();
    this.prepareLetters();
  }

  prepareText() {
    const wordsArray = this.titleElement.textContent.split(` `);
    console.log(wordsArray);
    this.titleElement.textContent = ``;

    wordsArray.forEach((word) => {
      const wordSpan = document.createElement(`span`);

      Array.from(word).forEach((letter) => {
        const letterSpan = document.createElement(`span`);
        letterSpan.textContent = letter;

        this.lettersArray.push(letterSpan);

        wordSpan.appendChild(letterSpan);
      });

      this.titleElement.appendChild(wordSpan);
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
    letter.style.transition = `transform ${this.timer}ms ease-in-out ${this.timerDelay}ms`;

    this.timerDelay += TIMER_STEP;
  }

  runAnimation() {
    setTimeout(() => {
      this.titleElement.classList.add(`intro__title--active`);
    }, this.timer);
  }

  destroyAnimation() {
    this.titleElement.classList.remove(`intro__title--active`);
  }
}

const introTitle = new IntroTitle(document.querySelector(`.intro__title`), 500);

export default introTitle;
