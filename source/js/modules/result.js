import animate from '../helpers/animate-functions';
import {BezierEasing as bezierEasing} from "../helpers/cubicBezier";
import timeFunction from '../helpers/time-functions';

export default () => {
  let showResultEls = document.querySelectorAll(`.js-show-result`);
  let results = document.querySelectorAll(`.screen--result`);

  const drawTitle = (rootElement) => {
    const targetTitle = rootElement.querySelector(`.result__title`);
    const targetTitleSvg = targetTitle.querySelector(`svg`);
    const svgClone = targetTitleSvg.cloneNode(true);
    targetTitleSvg.remove();

    const pathes = [].slice.call(svgClone.querySelectorAll(`path`));
    pathes.forEach((path) => {
      const pathLength = path.getTotalLength();

      path.setAttribute(`stroke-dashoffset`, 0);
      path.setAttribute(`stroke-dasharray`, `0 ${2 * pathLength / 6} ${pathLength / 6} ${2 * pathLength / 6} ${pathLength / 6}`);
      const animationDashArray = path.querySelector(`.anim--dasharray`);

      if (animationDashArray) {
        animationDashArray.setAttribute(`from`, `0 ${2 * pathLength / 6} ${pathLength / 6} ${2 * pathLength / 6} ${pathLength / 6}`);
        animationDashArray.setAttribute(`to`, `0 0 ${3 * pathLength / 6} 0 ${3 * pathLength / 6}`);
      }
    });

    targetTitle.appendChild(svgClone);
  };

  if (results.length) {
    for (let i = 0; i < showResultEls.length; i++) {
      showResultEls[i].addEventListener(`click`, function () {
        let target = showResultEls[i].getAttribute(`data-target`);
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        let targetEl = [].slice.call(results).filter(function (el) {
          return el.getAttribute(`id`) === target;
        });
        targetEl[0].classList.add(`screen--show`);
        targetEl[0].classList.remove(`screen--hidden`);

        drawTitle(targetEl[0]);

        const sizes = {
          ice: {
            width: 408,
            height: 167
          },
          animal: {
            width: 558,
            height: 558
          },
          flakeLeft: {
            width: 307,
            height: 307
          },
          flakeRight: {
            width: 211,
            height: 211
          },
          plane: {
            width: 120,
            height: 120
          },
          back: {
            width: 586,
            height: 324
          },
          tree: {
            width: 38,
            height: 101
          },
          tree2: {
            width: 50,
            height: 159
          }
        };

        let windowHeight = window.innerHeight;
        let windowWidth = window.innerWidth;

        const backCanvas = targetEl[0].querySelector(`#back`);
        if (backCanvas.getContext) {
          const backContext = backCanvas.getContext(`2d`);
          let backOpacity = 0;
          let backScale = 1;
          let backAnimation = [];

          const drawBackCanvas = () => {
            backCanvas.width = windowWidth;
            backCanvas.height = windowHeight;

            backContext.globalAlpha = backOpacity;

            backContext.clearRect(0, 0, windowWidth, windowHeight);

            backContext.save();

            backContext.drawImage(backImg, Math.round(((windowWidth - sizes.back.width) / 2)) + 50, Math.round(((windowHeight - sizes.back.height) / 2)) - 50 + 100, sizes.back.width * backScale, sizes.back.height);

            backContext.restore();
          };

          window.addEventListener(`resize`, drawBackCanvas);

          const backOpacityAnimationTick = (from, to) => (progress) => {
            backOpacity = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const backScaleAnimationTick = (from, to) => (progress) => {
            backScale = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const globalOpacityAnimationTick = async (globalProgress) => {
            if (globalProgress >= 0 && backAnimation.indexOf(`backO`) === -1) {
              backAnimation.push(`backO`);

              animate.easing(backOpacityAnimationTick(0, 1), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(backScaleAnimationTick(0, 1.1), 2000, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawBackCanvas();
          };

          let backImg = new Image();

          backImg.onload = () => {
            drawBackCanvas();

            animate.duration(globalOpacityAnimationTick, 2000);
          };

          backImg.src = `/img/back.png`;
        }

        const planeCanvas = targetEl[0].querySelector(`#plane`);
        if (planeCanvas.getContext) {
          const planeContext = planeCanvas.getContext(`2d`);
          let planeOpacity = 1;
          let planeScale = 1;
          let planeRotate = 70;
          let planeTranslateX = -200;
          let planeTranslateY = -400;
          let planeAnimation = [];

          const rotatePlane = (angle, cx, cy) => {
            planeContext.translate(cx, cy);
            planeContext.rotate(angle * Math.PI / 180);
            planeContext.translate(-cx, -cy);
          };

          const drawPlaneCanvas = () => {
            planeCanvas.width = windowWidth;
            planeCanvas.height = windowHeight;
            planeContext.globalAlpha = planeOpacity;

            planeContext.clearRect(0, 0, windowWidth, windowHeight);

            planeContext.save();

            rotatePlane(planeRotate, windowWidth / 2, windowHeight / 2);

            planeContext.drawImage(planeImg, Math.round(((windowWidth - sizes.plane.width) / 2) + planeTranslateX), Math.round(((windowHeight - sizes.plane.height) / 2) + planeTranslateY + 100), sizes.plane.width * (planeScale), sizes.plane.height * planeScale);

            planeContext.restore();
          };

          window.addEventListener(`resize`, drawPlaneCanvas);

          const planeTranslateXAnimationTick = (from, to) => (progress) => {
            planeTranslateX = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const planeTranslateYAnimationTick = (from, to) => (progress) => {
            planeTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const planeOpacityAnimationTick = (from, to) => (progress) => {
            planeOpacity = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const planeScaleAnimationTick = (from, to) => (progress) => {
            planeScale = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const planeRotateAnimationTick = (from, to) => (progress) => {
            planeRotate = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const globalOpacityAnimationTick = (globalProgress) => {
            if (globalProgress >= 0 && planeAnimation.indexOf(`planeO`) === -1) {
              planeAnimation.push(`planeO`);

              animate.easing(planeOpacityAnimationTick(0, 1), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawPlaneCanvas();
          };

          const globalTransformingAnimationTick = (globalProgress) => {
            if (globalProgress >= 0 && planeAnimation.indexOf(`planeT`) === -1) {
              planeAnimation.push(`planeT`);

              animate.easing(planeScaleAnimationTick(0, 1), 500, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(planeRotateAnimationTick(70, 0), 2000, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(planeTranslateXAnimationTick(planeTranslateX, 450), 2000, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(planeTranslateYAnimationTick(planeTranslateY, -150), 2000, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawPlaneCanvas();
          };

          let planeImg = new Image();

          planeImg.onload = () => {
            drawPlaneCanvas();

            animate.duration(globalOpacityAnimationTick, 1000);
            animate.duration(globalTransformingAnimationTick, 3000);
            // animate.duration(globalMovingAnimationTick, 3000);
          };

          planeImg.src = `/img/airplane.png`;
        }

        const flakesCanvas = targetEl[0].querySelector(`#snowflakes`);
        if (flakesCanvas.getContext) {
          const flakesContext = flakesCanvas.getContext(`2d`);
          let flakesOpacity = 0;
          let flakeLeftTranslateY = -50;
          let flakeRightTranlateY = 20;
          let flakesAnimation = [];

          const drawFlakesCanvas = () => {
            flakesCanvas.width = windowWidth;
            flakesCanvas.height = windowHeight;
            flakesContext.globalAlpha = flakesOpacity;

            flakesContext.clearRect(0, 0, windowWidth, windowHeight);

            flakesContext.save();

            flakesContext.drawImage(flakeLeft, Math.round(((windowWidth - sizes.flakeLeft.width) / 2) - 236), Math.round(((windowHeight - sizes.flakeLeft.height) / 2) + 100 + flakeLeftTranslateY), sizes.flakeLeft.width, sizes.flakeLeft.height);
            flakesContext.drawImage(flakeRight, Math.round(((windowWidth - sizes.flakeRight.width) / 2) + 212), Math.round(((windowHeight - sizes.flakeRight.height) / 2) + 100 + flakeRightTranlateY), sizes.flakeRight.width, sizes.flakeRight.height);

            flakesContext.restore();
          };

          window.addEventListener(`resize`, drawFlakesCanvas);

          const flakesOpacityAnimationTick = (from, to) => (progress) => {
            flakesOpacity = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const flakeLeftTranslateYAnimationTick = (from, to) => (progress) => {
            flakeLeftTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const flakeRightTranslateYAnimationTick = (from, to) => (progress) => {
            flakeRightTranlateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const globalOpacityAnimationTick = async (globalProgress) => {
            if (globalProgress >= 0 && flakesAnimation.indexOf(`flakeO`) === -1) {
              flakesAnimation.push(`flakeO`);

              animate.easing(flakesOpacityAnimationTick(0, 1), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawFlakesCanvas();
          };

          const globalLeftFlakeTransformAnimationTick = async (globalProgress) => {
            if (globalProgress === 0) {
              await animate.easing(flakeLeftTranslateYAnimationTick(flakeLeftTranslateY, 0), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));

              await animate.easing(flakeLeftTranslateYAnimationTick(flakeLeftTranslateY, -50), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));

              await animate.duration(globalLeftFlakeTransformAnimationTick, 2000);
            }

            drawFlakesCanvas();
          };

          const globalRightFlakeTransformAnimationTick = async (globalProgress) => {
            if (globalProgress === 0) {
              await animate.easing(flakeRightTranslateYAnimationTick(flakeRightTranlateY, 0), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));

              await animate.easing(flakeRightTranslateYAnimationTick(0, 20), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));

              await animate.duration(globalRightFlakeTransformAnimationTick, 2000);
            }

            drawFlakesCanvas();
          };

          let flakeLeft = new Image();
          let flakeRight = new Image();
          let images = [flakeLeft, flakeRight];
          let imagesLoadCounter = 0;

          images.forEach((image) => {
            image.onload = () => {
              imagesLoadCounter = imagesLoadCounter + 1;

              if (imagesLoadCounter === images.length) {
                drawFlakesCanvas();

                animate.duration(globalOpacityAnimationTick, 1000);
                animate.duration(globalLeftFlakeTransformAnimationTick, 2000);
                animate.duration(globalRightFlakeTransformAnimationTick, 2000);
              }
            };
          });

          flakeLeft.src = `/img/snowflake.png`;
          flakeRight.src = `/img/snowflake-r.png`;
        }

        const treesCanvas = targetEl[0].querySelector(`#trees`);
        if (treesCanvas.getContext) {
          const treeContext = treesCanvas.getContext(`2d`);
          let treesOpacity = 0;
          let treeTranslateY = 200;
          let flakesAnimation = [];

          const drawTreesCanvas = () => {
            treesCanvas.width = windowWidth;
            treesCanvas.height = windowHeight;
            treeContext.globalAlpha = treesOpacity;

            treeContext.clearRect(0, 0, windowWidth, windowHeight);

            treeContext.save();

            treeContext.drawImage(tree, Math.round(((windowWidth - sizes.tree.width) / 2) + 150), Math.round(((windowHeight - sizes.tree.height) / 2) + 125), sizes.tree.width, sizes.tree.height);
            treeContext.drawImage(tree2, Math.round(((windowWidth - sizes.tree2.width) / 2) + 110), Math.round(((windowHeight - sizes.tree2.height) / 2) + 96 + treeTranslateY), sizes.tree2.width, sizes.tree2.height);

            treeContext.restore();
          };

          window.addEventListener(`resize`, drawTreesCanvas);

          const treesOpacityAnimationTick = (from, to) => (progress) => {
            treesOpacity = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const treeTranslateYAnimationTick = (from, to) => (progress) => {
            treeTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const globalOpacityAnimationTick = async (globalProgress) => {
            if (globalProgress >= 0 && flakesAnimation.indexOf(`treeO`) === -1) {
              flakesAnimation.push(`treeO`);

              animate.easing(treesOpacityAnimationTick(0, 1), 2000, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(treeTranslateYAnimationTick(200, 0), 2500, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawTreesCanvas();
          };

          let tree = new Image();
          let tree2 = new Image();
          let images = [tree, tree2];
          let imagesLoadCounter = 0;

          images.forEach((image) => {
            image.onload = () => {
              imagesLoadCounter = imagesLoadCounter + 1;

              if (imagesLoadCounter === images.length) {
                drawTreesCanvas();

                animate.duration(globalOpacityAnimationTick, 2500);
              }
            };
          });

          tree.src = `/img/tree.png`;
          tree2.src = `/img/tree_2.png`;
        }

        // const treesCanvas = targetEl[0].querySelector(`#trees`);
        // if (treesCanvas.getContext) {
        //   const treesContext = flakesCanvas.getContext(`2d`);
        //   let treesOpacity = 0;
        //   let treeTranslateY = 200;
        //   let treesAnimation = [];

        //   const drawTreesCanvas = () => {
        //     treesCanvas.width = windowWidth;
        //     treesCanvas.height = windowHeight;
        //     treesContext.globalAlpha = treesOpacity;

        //     treesContext.clearRect(0, 0, windowWidth, windowHeight);

        //     treesContext.save();

        //     treesContext.drawImage(tree, Math.round(((windowWidth - sizes.tree.width) / 2)), Math.round(((windowHeight - sizes.tree.height) / 2)), sizes.tree.width, sizes.tree.height);
        //     treesContext.drawImage(tree2, Math.round(((windowWidth - sizes.tree2.width) / 2)), Math.round(((windowHeight - sizes.tree2.height) / 2)), sizes.tree2.width, sizes.tree2.height);

        //     treesContext.restore();
        //   };

        //   window.addEventListener(`resize`, drawTreesCanvas);

        //   const treesOpacityAnimationTick = (from, to) => (progress) => {
        //     treesOpacity = from + progress * Math.sign(to - from) * Math.abs(to - from);
        //   };

        //   const treeTranslateYAnimationTick = (from, to) => (progress) => {
        //     treeTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
        //   };

        //   const globalOpacityAnimationTick = async (globalProgress) => {
        //     if (globalProgress >= 0 && treesAnimation.indexOf(`treeO`) === -1) {
        //       treesAnimation.push(`treeO`);

        //       animate.easing(treesOpacityAnimationTick(0, 1), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));
        //     }
        //     drawTreesCanvas();
        //   };

        //   const globalTreeTransformAnimationTick = async (globalProgress) => {
        //     if (globalProgress >= 0 && treesAnimation.indexOf(`treeT`) === -1) {
        //       treesAnimation.push(`treeT`);

        //       animate.easing(treeTranslateYAnimationTick(100, 0), 2000, bezierEasing(0.00, 0.0, 0.58, 1.0));
        //     }
        //     drawTreesCanvas();
        //   };

        //   let tree = new Image();
        //   let tree2 = new Image();
        //   let images = [tree, tree2];
        //   let imagesLoadCounter = 0;

        //   images.forEach((image) => {
        //     image.onload = () => {
        //       imagesLoadCounter = imagesLoadCounter + 1;

        //       if (imagesLoadCounter === images.length) {
        //         drawTreesCanvas();

        //         animate.duration(globalOpacityAnimationTick, 1000);
        //         // animate.duration(globalTreeTransformAnimationTick, 2000);
        //       }
        //     };
        //   });

        //   tree.src = `/img/tree.png`;
        //   tree2.src = `/img/tree_2.png`;
        // }

        const calfCanvas = targetEl[0].querySelector(`#calf`);
        if (calfCanvas.getContext) {
          const calfContext = calfCanvas.getContext(`2d`);

          let calfTranslateY = windowHeight / 2;
          let calfRotateAngle = 20;

          const rotateCalf = (angle, cx, cy) => {
            calfContext.translate(cx, cy);
            calfContext.rotate(angle * Math.PI / 180);
            calfContext.translate(-cx, -cy);
          };

          const drawCalfCanvas = () => {
            calfCanvas.width = windowWidth;
            calfCanvas.height = windowHeight;

            calfContext.clearRect(0, 0, windowWidth, windowHeight);

            calfContext.save();

            rotateCalf(calfRotateAngle, windowWidth / 2, windowHeight / 2);

            calfContext.drawImage(iceImg, Math.round((windowWidth - sizes.ice.width) / 2), Math.round((windowHeight - sizes.ice.height) / 2 + 188 + calfTranslateY), sizes.ice.width, sizes.ice.height);
            calfContext.drawImage(animalImg, Math.round((windowWidth - sizes.animal.width) / 2), Math.round((windowHeight - sizes.animal.height) / 2 + 100 + calfTranslateY), sizes.animal.width, sizes.animal.height);

            calfContext.restore();
          };

          const calfTranslateYAnimationTick = (from, to) => (progress) => {
            calfTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const calfRotateAnimationTick = (from, to) => (progress) => {
            calfRotateAngle = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          let calfAnimation = [];

          const globalCalfTransformAnimationTick = (globalProgress) => {
            if (globalProgress >= 0 && calfAnimation.indexOf(`calfT`) === -1) {
              calfAnimation.push(`calfT`);

              animate.easing(calfTranslateYAnimationTick(calfTranslateY, 0), 500, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawCalfCanvas();
          };

          const globalCalfBounceAnimationTick = async (globalProgress) => {
            if (globalProgress >= 0 && calfAnimation.indexOf(`calfB`) === -1) {
              calfAnimation.push(`calfB`);

              await Promise.all([
                animate.easing(calfTranslateYAnimationTick(0, 10), 500, bezierEasing(0.42, 0.0, 0.58, 1.0)),
                animate.easing(calfRotateAnimationTick(calfRotateAngle, -5), 500, bezierEasing(0.42, 0.0, 0.58, 1.0))
              ]);
              await Promise.all([
                animate.easing(calfTranslateYAnimationTick(10, -20), 3000, timeFunction.makeEaseOut(timeFunction.bounce)),
                animate.easing(calfRotateAnimationTick(-5, 5), 3000, timeFunction.makeEaseOut(timeFunction.bounce))
              ]);
              await Promise.all([
                animate.easing(calfTranslateYAnimationTick(-20, 0), 1000, bezierEasing(0.42, 0.0, 0.58, 1.0)),
                animate.easing(calfRotateAnimationTick(5, 0), 1000, bezierEasing(0.42, 0.0, 0.58, 1.0))
              ]);
            }

            drawCalfCanvas();
          };

          window.addEventListener(`resize`, drawCalfCanvas);

          let iceImg = new Image();
          let animalImg = new Image();
          let images = [iceImg, animalImg];
          let imagesLoadCounter = 0;

          images.forEach((image) => {
            image.onload = async () => {
              imagesLoadCounter = imagesLoadCounter + 1;

              if (imagesLoadCounter === images.length) {
                drawCalfCanvas();

                await animate.duration(globalCalfTransformAnimationTick, 500);
                await animate.duration(globalCalfBounceAnimationTick, 4500);
              }
            };
          });

          iceImg.src = `/img/ice.png`;
          animalImg.src = `/img/sea-calf-2.png`;
        }
      });
    }

    let playBtn = document.querySelector(`.js-play`);
    if (playBtn) {
      playBtn.addEventListener(`click`, function () {
        [].slice.call(results).forEach(function (el) {
          el.classList.remove(`screen--show`);
          el.classList.add(`screen--hidden`);
        });
        document.getElementById(`messages`).innerHTML = ``;
        document.getElementById(`message-field`).focus();
      });
    }
  }
};
