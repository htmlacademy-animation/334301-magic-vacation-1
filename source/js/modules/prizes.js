
class Prizes {
  constructor() {
    this.prizes = null;
    this.prizesItems = [];
    this.prizesIcons = [];
    this.prizesIconsFiles = [];
    this.version = 0;
    this.timeouts = [];

    this.init = this.init.bind(this);
    this.updatePrizeIcon = this.updatePrizeIcon.bind(this);
    this.initiatePrizes = this.initiatePrizes.bind(this);
    this.deactivatePrizes = this.deactivatePrizes.bind(this);
  }

  init() {
    this.prizes = document.querySelector(`.prizes`);
    this.prizesItems = [].slice.call(this.prizes.querySelectorAll(`.prizes__item`));
    this.prizesIcons = [].slice.call(this.prizes.querySelectorAll(`.prizes__icon`));

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

  initiatePrizes() {
    let timeout = null;

    this.prizesItems.forEach((item, index) => {
      if (index === 0) {
        this.updatePrizeIcon(index);
        item.classList.add(`prizes__item--active`);

        timeout = setTimeout(() => {
          item.classList.add(`prizes__item--moved-left`);
        }, 5000);
      }

      if (index === 1) {
        timeout = setTimeout(() => {
          item.classList.add(`prizes__item--active`);
          this.updatePrizeIcon(index);
        }, 5500);
      }

      if (index === 2) {
        timeout = setTimeout(() => {
          item.classList.add(`prizes__item--active`);
          this.updatePrizeIcon(index);
        }, 8500);
      }
    });

    this.timeouts.push(timeout);
  }

  deactivatePrizes() {
    this.timeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });

    this.prizesItems.forEach((item) => {
      item.classList.remove(`prizes__item--active`);
      item.classList.remove(`prizes__item--moved-left`);
    });

    this.prizesIcons.forEach((icon) => {
      const iconImage = icon.querySelector(`img`);
      iconImage.src = ``;
    });
  }
}

const prizes = new Prizes();

export default prizes;
