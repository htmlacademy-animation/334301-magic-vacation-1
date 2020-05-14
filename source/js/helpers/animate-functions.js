export default {
  duration: (render, duration) => new Promise((resolve) => {
    let start = Date.now();
    (function loop() {
      let p = Date.now() - start;
      if (p > duration) {
        render(duration);
        resolve();
      } else {
        requestAnimationFrame(loop);
        render(p);
      }
    }());
  }),

  progress: (render, duration) => new Promise((resolve) => {
    let start = Date.now();
    (function loop() {
      let p = (Date.now() - start) / duration;
      if (p > 1) {
        render(1);
        resolve();
      } else {
        requestAnimationFrame(loop);
        render(p);
      }
    }());
  }),

  easing: (render, duration, easing) => new Promise((resolve) => {
    let start = Date.now();
    (function loop() {
      let p = (Date.now() - start) / duration;
      if (p > 1) {
        render(1);
        resolve();
      } else {
        requestAnimationFrame(loop);
        render(easing(p));
      }
    }());
  }),
};
