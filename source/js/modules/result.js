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
            width: 48,
            height: 151
          },
          tree2: {
            width: 60,
            height: 209
          }
        };

        let windowHeight = window.innerHeight;
        let windowWidth = window.innerWidth;

        const winCanvas = targetEl[0].querySelector(`#win`);
        if (winCanvas.getContext) {
          const winContext = winCanvas.getContext(`2d`);
          let winOpacity = 0;
          let backScale = 1;
          let treeTranslateY = 200;
          let planeScale = 0;
          let planeRotate = 70;
          let planeTranslateX = -200;
          let planeTranslateY = -400;
          let calfTranslateY = windowHeight / 2;
          let calfRotateAngle = 20;
          let flakeLeftTranslateY = -50;
          let flakeRightTranlateY = 20;
          let winAnimation = [];

          const rotateObject = (angle, cx, cy) => {
            winContext.translate(cx, cy);
            winContext.rotate(angle * Math.PI / 180);
            winContext.translate(-cx, -cy);
          };

          const drawWinCanvas = () => {
            winCanvas.width = windowWidth;
            winCanvas.height = windowHeight;
            winContext.clearRect(0, 0, windowWidth, windowHeight);
            winContext.save();

            winContext.globalAlpha = winOpacity;
            winContext.drawImage(backImg, Math.round(((windowWidth - sizes.back.width) / 2)) + 50, Math.round(((windowHeight - sizes.back.height) / 2)) - 50 + 100, sizes.back.width * backScale, sizes.back.height);
            winContext.drawImage(tree, Math.round(((windowWidth - sizes.tree.width) / 2) + 150), Math.round(((windowHeight - sizes.tree.height) / 2) + 125), sizes.tree.width, sizes.tree.height);
            winContext.drawImage(tree2, Math.round(((windowWidth - sizes.tree2.width) / 2) + 110), Math.round(((windowHeight - sizes.tree2.height) / 2) + 96 + treeTranslateY), sizes.tree2.width, sizes.tree2.height);
            winContext.restore();
            winContext.save();

            winContext.globalAlpha = winOpacity;
            rotateObject(planeRotate, windowWidth / 2, windowHeight / 2);
            winContext.drawImage(planeImg, Math.round(((windowWidth - sizes.plane.width) / 2) + planeTranslateX), Math.round(((windowHeight - sizes.plane.height) / 2) + planeTranslateY + 100), sizes.plane.width * (planeScale), sizes.plane.height * planeScale);
            winContext.restore();
            winContext.save();

            winContext.globalAlpha = 1;
            rotateObject(calfRotateAngle, windowWidth / 2, windowHeight / 2);
            winContext.drawImage(iceImg, Math.round((windowWidth - sizes.ice.width) / 2), Math.round((windowHeight - sizes.ice.height) / 2 + 188 + calfTranslateY), sizes.ice.width, sizes.ice.height);
            winContext.drawImage(animalImg, Math.round((windowWidth - sizes.animal.width) / 2), Math.round((windowHeight - sizes.animal.height) / 2 + 100 + calfTranslateY), sizes.animal.width, sizes.animal.height);
            winContext.restore();
            winContext.save();

            winContext.globalAlpha = winOpacity;
            winContext.drawImage(flakeLeft, Math.round(((windowWidth - sizes.flakeLeft.width) / 2) - 236), Math.round(((windowHeight - sizes.flakeLeft.height) / 2) + 100 + flakeLeftTranslateY), sizes.flakeLeft.width, sizes.flakeLeft.height);
            winContext.drawImage(flakeRight, Math.round(((windowWidth - sizes.flakeRight.width) / 2) + 212), Math.round(((windowHeight - sizes.flakeRight.height) / 2) + 100 + flakeRightTranlateY), sizes.flakeRight.width, sizes.flakeRight.height);
            winContext.restore();
          };

          window.addEventListener(`resize`, drawWinCanvas);

          const winOpacityAnimationTick = (from, to) => (progress) => {
            winOpacity = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const backScaleAnimationTick = (from, to) => (progress) => {
            backScale = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const treeTranslateYAnimationTick = (from, to) => (progress) => {
            treeTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const planeTranslateXAnimationTick = (from, to) => (progress) => {
            planeTranslateX = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const planeTranslateYAnimationTick = (from, to) => (progress) => {
            planeTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const planeScaleAnimationTick = (from, to) => (progress) => {
            planeScale = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const planeRotateAnimationTick = (from, to) => (progress) => {
            planeRotate = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const calfTranslateYAnimationTick = (from, to) => (progress) => {
            calfTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const calfRotateAnimationTick = (from, to) => (progress) => {
            calfRotateAngle = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const flakeLeftTranslateYAnimationTick = (from, to) => (progress) => {
            flakeLeftTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const flakeRightTranslateYAnimationTick = (from, to) => (progress) => {
            flakeRightTranlateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const globalWinOpacityAnimationTick = async (globalProgress) => {
            if (globalProgress >= 0 && winAnimation.indexOf(`winO`) === -1) {
              winAnimation.push(`winO`);

              animate.easing(winOpacityAnimationTick(0, 1), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawWinCanvas();
          };

          const globalTressAnimationTick = async (globalProgress) => {
            if (globalProgress >= 0 && winAnimation.indexOf(`treeA`) === -1) {
              winAnimation.push(`treeA`);

              animate.easing(treeTranslateYAnimationTick(200, 0), 2500, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawWinCanvas();
          };

          const globalPlaneAnimationTick = (globalProgress) => {
            if (globalProgress >= 0 && winAnimation.indexOf(`planeA`) === -1) {
              winAnimation.push(`planeA`);

              animate.easing(backScaleAnimationTick(0, 1.1), 2000, bezierEasing(0.00, 0.0, 0.58, 1.0));

              animate.easing(planeScaleAnimationTick(0, 1), 500, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(planeRotateAnimationTick(70, 0), 2000, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(planeTranslateXAnimationTick(planeTranslateX, 450), 2000, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(planeTranslateYAnimationTick(planeTranslateY, -150), 2000, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawWinCanvas();
          };

          const globalCalfAnimationTick = async (globalProgress) => {
            if (globalProgress >= 0 && winAnimation.indexOf(`calfT`) === -1) {
              winAnimation.push(`calfT`);

              await animate.easing(calfTranslateYAnimationTick(calfTranslateY, 0), 500, bezierEasing(0.00, 0.0, 0.58, 1.0));
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
            drawWinCanvas();
          };

          const globalLeftFlakeTransformAnimationTick = async (globalProgress) => {
            if (globalProgress === 0) {
              await animate.easing(flakeLeftTranslateYAnimationTick(flakeLeftTranslateY, 0), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));

              await animate.easing(flakeLeftTranslateYAnimationTick(flakeLeftTranslateY, -50), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));

              await animate.duration(globalLeftFlakeTransformAnimationTick, 2000);
            }

            drawWinCanvas();
          };

          const globalRightFlakeTransformAnimationTick = async (globalProgress) => {
            if (globalProgress === 0) {
              await animate.easing(flakeRightTranslateYAnimationTick(flakeRightTranlateY, 0), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));

              await animate.easing(flakeRightTranslateYAnimationTick(0, 20), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));

              await animate.duration(globalRightFlakeTransformAnimationTick, 2000);
            }

            drawWinCanvas();
          };

          let backImg = new Image();
          let tree = new Image();
          let tree2 = new Image();
          let planeImg = new Image();
          let iceImg = new Image();
          let animalImg = new Image();
          let flakeLeft = new Image();
          let flakeRight = new Image();
          let images = [
            tree,
            tree2,
            backImg,
            planeImg,
            iceImg,
            animalImg,
            flakeLeft,
            flakeRight,
          ];
          let imagesLoadCounter = 0;

          images.forEach((image) => {
            image.onload = () => {
              imagesLoadCounter = imagesLoadCounter + 1;

              if (imagesLoadCounter === images.length) {
                drawWinCanvas();

                animate.duration(globalWinOpacityAnimationTick, 1000);
                animate.duration(globalTressAnimationTick, 2500);
                animate.duration(globalPlaneAnimationTick, 3000);
                animate.duration(globalCalfAnimationTick, 5000);
                animate.duration(globalLeftFlakeTransformAnimationTick, 2000);
                animate.duration(globalRightFlakeTransformAnimationTick, 2000);
              }
            };
          });

          planeImg.src = `/img/airplane.png`;
          backImg.src = `./img/back.png`;
          tree.src = `./img/tree.png`;
          tree2.src = `./img/tree_2.png`;
          iceImg.src = `./img/ice.png`;
          animalImg.src = `./img/sea-calf-2.png`;
          flakeLeft.src = `./img/snowflake.png`;
          flakeRight.src = `./img/snowflake-r.png`;
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
