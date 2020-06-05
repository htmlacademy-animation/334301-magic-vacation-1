class CanvasFrame {
  constructor() {
    this.renderFunctions = [];

    this.addRender = this.addRender.bind(this);
    this.runFrame = this.runFrame.bind(this);
    this.stopFrame = this.stopFrame.bind(this);
  }

  addRender(newRender) {
    this.renderFunctions.push(newRender);
  }

  runFrame(time) {
    if (this.renderFunctions.length > 0) {
      this.renderFunctions.forEach((render) => {
        render(time);
      });
    }

    this.canvasFrameID = requestAnimationFrame(this.runFrame);
  }

  stopFrame() {
    if (this.canvasFrameID) {
      cancelAnimationFrame(this.canvasFrameID);
    }
  }
}

const canvasFrame = new CanvasFrame();
canvasFrame.runFrame();

export default canvasFrame;
