export default class AnimatedFrame {
  constructor(drawAnimation, fpsInterval, needTimeValue = false) {
    this.drawAnimation = drawAnimation;
    this.fpsInterval = fpsInterval;
    this.needTimeValue = needTimeValue;

    this.runFrame = this.runFrame.bind(this);
    this.runAnimation = this.runAnimation.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);
  }

  runFrame() {
    this.counterAnimationId = requestAnimationFrame(this.runFrame);

    const currentTime = Date.now();
    const elapsed = currentTime - this.previousCounterFrameTime;

    if (elapsed > this.fpsInterval) {
      this.previousCounterFrameTime = currentTime - (elapsed % this.fpsInterval);

      if (this.needTimeValue === true) {
        const timeValue = ((currentTime - this.counterStartTime) / 1000).toFixed(2);
        this.drawAnimation(timeValue);
      } else {
        this.drawAnimation();
      }
    }
  }

  runAnimation() {
    this.counterStartTime = Date.now();
    this.previousCounterFrameTime = Date.now();
    this.counterAnimationId = requestAnimationFrame(this.runFrame);
  }

  stopAnimation() {
    if (this.counterAnimationId) {
      cancelAnimationFrame(this.counterAnimationId);
    }
  }
}
