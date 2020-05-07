import throttle from 'lodash/throttle';
import game from './game';
import prizes from './prizes';

const STORY_SCREEN_ID = 1;
const PRIZES_SCREEN_ID = 2;
const GAME_SCREEN_ID = 4;

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.activeScreen = 0;
    this.previousScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChenged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChenged();
    this.changePageDisplay();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChenged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    this.changePageDisplay();
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    const previousScreen = Array.from(this.screenElements).findIndex((screen) => screen.classList.contains(`active`));

    if (previousScreen === STORY_SCREEN_ID && this.activeScreen === PRIZES_SCREEN_ID) {
      this.screenElements[previousScreen].querySelector(`.screen__background`).classList.add(`screen__background--scaled`);

      setTimeout(() => {
        this.screenElements.forEach((screen) => {
          screen.classList.add(`screen--hidden`);
          screen.classList.remove(`active`);
        });

        this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
        this.screenElements[this.activeScreen].classList.add(`active`);
        prizes.initiatePrizes();
      }, 1000);

      return;
    }

    if (this.activeScreen === PRIZES_SCREEN_ID && previousScreen !== STORY_SCREEN_ID) {
      prizes.initiatePrizes();
    } else {
      prizes.deactivatePrizes();
    }

    this.screenElements.forEach((screen, index) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);

      if (index === STORY_SCREEN_ID) {
        this.screenElements[index].querySelector(`.screen__background`).classList.remove(`screen__background--scaled`);
      }
    });

    if (this.activeScreen === GAME_SCREEN_ID) {
      game.runCounterAnimation();
    } else {
      game.stopCounterAnimation();
    }

    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    this.screenElements[this.activeScreen].classList.add(`active`);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }
}
