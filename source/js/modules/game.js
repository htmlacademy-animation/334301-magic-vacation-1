import AnimatedFrame from './animated-frame';

const FPS_INTERVAL = 1000 / 24;

class Game {
  constructor() {
    this.init = this.init.bind(this);
    this.counterAnimation = this.counterAnimation.bind(this);
    this.runCounterAnimation = this.runCounterAnimation.bind(this);
    this.stopCounterAnimation = this.stopCounterAnimation.bind(this);
  }

  init() {
    this.game = document.querySelector(`.game`);
    this.gameCounter = this.game.querySelector(`.game__counter`);
    this.gameCounterSpans = [].slice.call(this.gameCounter.querySelectorAll(`span`));

    this.animatedFrame = new AnimatedFrame(this.counterAnimation, FPS_INTERVAL, true);
  }

  counterAnimation(timeValue) {
    const time = `${timeValue}`.split(`.`);
    this.gameCounterSpans[0].textContent = parseInt(time[0], 10) < 10 ? `0${time[0]}` : time[0];
    this.gameCounterSpans[1].textContent = time[1];
  }

  runCounterAnimation() {
    this.animatedFrame.runAnimation();
  }

  stopCounterAnimation() {
    this.animatedFrame.stopAnimation();
  }
}

const game = new Game();

export default game;
