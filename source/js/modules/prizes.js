import AnimatedFrame from './animated-frame';

const FPS_INTERVAL = 1000 / 12;

class Prizes {
  constructor() {
    this.prizesIconsFiles = [];
    this.version = 0;
    this.timeouts = [];
    this.numbers = [];
    this.frames = [];

    this.init = this.init.bind(this);
    this.updatePrizeIcon = this.updatePrizeIcon.bind(this);
    this.initiatePrizes = this.initiatePrizes.bind(this);
    this.deactivatePrizes = this.deactivatePrizes.bind(this);
    this.numbersAnimation = this.numbersAnimation.bind(this);
    this.activatePrize = this.activatePrize.bind(this);
  }

  init() {
    this.numbers = [
      {
        currentValue: 1,
        finalValue: 3,
      },
      {
        currentValue: 1,
        finalValue: 7,
      },
      {
        currentValue: 11,
        finalValue: 900,
      }
    ];
    this.prizes = document.querySelector(`.prizes`);
    this.prizesItems = [].slice.call(this.prizes.querySelectorAll(`.prizes__item`));
    this.prizesIcons = [].slice.call(this.prizes.querySelectorAll(`.prizes__icon`));
    this.prizesValues = [].slice.call(this.prizes.querySelectorAll(`.prizes__value`));

    this.prizesIcons.forEach((icon) => {
      const iconImage = icon.querySelector(`img`);
      this.prizesIconsFiles.push(iconImage.src);
      iconImage.src = ``;
    });
  }

  updatePrizeIcon(iconIndex) {
    this.version += 1;

    const iconImage = this.prizesIcons[iconIndex].querySelector(`img`);
    iconImage.src = `${this.prizesIconsFiles[iconIndex]}?v=${this.version}`;
  }

  numbersAnimation(index) {
    const currentValue = this.numbers[index].currentValue;
    const finalValue = this.numbers[index].finalValue;

    let textContent = `${currentValue}`;

    while (textContent.length < `${finalValue}`.length) {
      const nbsp = String.fromCharCode(160);
      textContent = `${nbsp}${textContent}`;
    }

    this.prizesValues[index].querySelector(`strong`).textContent = textContent;
    if (currentValue === finalValue) {
      this.frames[index].stopAnimation();

      return;
    }

    if (currentValue + (Math.ceil(currentValue / 2)) < finalValue) {
      this.numbers[index].currentValue = currentValue + Math.ceil(currentValue / 2);
    }

    if (currentValue + (Math.ceil(currentValue / 2)) >= finalValue) {
      this.numbers[index].currentValue = finalValue;
    }
  }

  activatePrize(prize, prizeIndex) {
    prize.classList.add(`prizes__item--active`);
    this.updatePrizeIcon(prizeIndex);

    this.frames[prizeIndex].runAnimation();
  }

  initiatePrizes() {
    let timeout = null;
    for (let i = 0; i < this.prizesValues.length; i++) {
      this.frames.push(new AnimatedFrame(() => {
        this.numbersAnimation(i);
      }, FPS_INTERVAL));
    }

    this.prizesItems.forEach((item, index) => {
      if (index === 0) {
        this.activatePrize(item, index);

        timeout = setTimeout(() => {
          item.classList.add(`prizes__item--moved-left`);
        }, 5000);

        this.timeouts.push(timeout);
      }

      if (index === 1) {
        timeout = setTimeout(() => {
          this.activatePrize(item, index);
        }, 5500);

        this.timeouts.push(timeout);
      }

      if (index === 2) {
        timeout = setTimeout(() => {
          this.activatePrize(item, index);
        }, 8500);

        this.timeouts.push(timeout);
      }
    });
  }

  deactivatePrizes() {
    this.timeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });

    this.frames.forEach((frame) => {
      frame.stopAnimation();
    });

    this.prizesItems.forEach((item) => {
      item.classList.remove(`prizes__item--active`);
      item.classList.remove(`prizes__item--moved-left`);
    });

    this.prizesIcons.forEach((icon) => {
      const iconImage = icon.querySelector(`img`);
      iconImage.src = ``;
    });

    this.timeouts = [];
    this.frames = [];
    this.numbers = [
      {
        currentValue: 1,
        finalValue: 3,
      },
      {
        currentValue: 1,
        finalValue: 7,
      },
      {
        currentValue: 11,
        finalValue: 900,
      }
    ];
  }
}

const prizes = new Prizes();

export default prizes;
