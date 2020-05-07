const FPS_INTERVAL = 1000 / 24;

class Game {
  constructor() {
    this.counterAnimationId = null;
    this.game = null;
    this.gameCounter = null;
    this.gameCounterSpans = [];
    this.counterStartTime = null;
    this.previousCounterFrameTime = null;

    this.init = this.init.bind(this);
    this.counterAnimation = this.counterAnimation.bind(this);
    this.runCounterAnimation = this.runCounterAnimation.bind(this);
    this.stopCounterAnimation = this.stopCounterAnimation.bind(this);
    this.drawCounterAnimation = this.drawCounterAnimation.bind(this);
  }

  init() {
    this.game = document.querySelector(`.game`);
    this.gameCounter = this.game.querySelector(`.game__counter`);
    this.gameCounterSpans = [].slice.call(this.gameCounter.querySelectorAll(`span`));
  }

  drawCounterAnimation(timeValue) {
    const time = `${timeValue}`.split(`.`);
    this.gameCounterSpans[0].textContent = parseInt(time[0], 10) < 10 ? `0${time[0]}` : time[0];
    this.gameCounterSpans[1].textContent = time[1];
  }

  counterAnimation() {
    this.counterAnimationId = requestAnimationFrame(this.counterAnimation);

    const currentTime = Date.now();
    const elapsed = currentTime - this.previousCounterFrameTime;

    if (elapsed > FPS_INTERVAL) {
      this.previousCounterFrameTime = currentTime - (elapsed % FPS_INTERVAL);

      const timeValue = ((currentTime - this.counterStartTime) / 1000).toFixed(2);
      this.drawCounterAnimation(timeValue);
    }
  }

  runCounterAnimation() {
    this.counterStartTime = Date.now();
    this.previousCounterFrameTime = Date.now();
    this.counterAnimationId = requestAnimationFrame(this.counterAnimation);
  }

  stopCounterAnimation() {
    cancelAnimationFrame(this.counterAnimationId);
  }
}

const game = new Game();

export default game;
