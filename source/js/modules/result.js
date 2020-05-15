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

        const winSizes = {
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

        const loseSizes = {
          hole: {
            width: 171,
            height: 292,
          },
          flamingo: {
            width: 150,
            height: 150,
          },
          leaf: {
            width: 150,
            height: 150,
          },
          saturn: {
            width: 150,
            height: 150,
          },
          watermelon: {
            width: 150,
            height: 150,
          },
          flake: {
            width: 150,
            height: 150,
          },
          crocodile: {
            width: 535,
            cutWidth: 350,
            height: 170,
          },
          tear: {
            width: 39,
            height: 59,
          }
        };

        let windowHeight = window.innerHeight;
        let windowWidth = window.innerWidth;

        const loseCanvas = targetEl[0].querySelector(`#lose `);
        if (loseCanvas && loseCanvas.getContext) {
          const loseContext = loseCanvas.getContext(`2d`);
          let holeOpacity = 0;
          let holeScale = 0;
          let surroundingsScale = 0;
          let surroundingsOpacity = 1;
          let surroundingsTranslateY = 0;
          let crocodileTranslateX = 500;
          let crocodileTranslateY = 200;
          let tearScale = 0;
          let tearTranlateY = 0;
          let tearOpacity = 0;
          let loseAnimation = [];

          const scaleObject = (scaleValue, cx, cy) => {
            loseContext.translate(cx, cy);
            loseContext.scale(scaleValue, scaleValue);
            loseContext.translate(-cx, -cy);
          };

          const drawLoseCanvas = () => {
            loseCanvas.width = windowWidth;
            loseCanvas.height = windowHeight;
            loseContext.clearRect(0, 0, windowWidth, windowHeight);
            loseContext.save();

            loseContext.globalAlpha = holeOpacity;
            scaleObject(holeScale, windowWidth / 2, windowHeight / 2);
            loseContext.drawImage(hole, Math.round(((windowWidth - loseSizes.hole.width) / 2)), Math.round(((windowHeight - loseSizes.hole.height) / 2)), loseSizes.hole.width, loseSizes.hole.height);
            loseContext.restore();
            loseContext.save();

            loseContext.globalAlpha = 1;
            loseContext.drawImage(
                crocodile,
                Math.round(((windowWidth - loseSizes.crocodile.width) / 2) + crocodileTranslateX),
                Math.round(((windowHeight - loseSizes.crocodile.height) / 2) + 75 - crocodileTranslateY),
                loseSizes.crocodile.width,
                loseSizes.crocodile.height
            );
            loseContext.beginPath();
            loseContext.moveTo(windowWidth / 2, 0);
            loseContext.lineTo(windowWidth / 2, Math.round(((windowHeight - loseSizes.hole.height) / 2)));
            loseContext.bezierCurveTo(
                (windowWidth / 2) + 138, Math.round(((windowHeight - loseSizes.hole.height) / 2) + 20),
                (windowWidth / 2) + 74, Math.round(((windowHeight - loseSizes.hole.height) / 2) + 152),
                (windowWidth / 2) + 56, Math.round(((windowHeight - loseSizes.hole.height) / 2) + 147));
            loseContext.lineTo((windowWidth / 2) + (loseSizes.hole.width / 2), Math.round(((windowHeight - loseSizes.hole.height) / 2) + loseSizes.hole.height));
            loseContext.lineTo(windowWidth, windowHeight);
            loseContext.lineTo(windowWidth, 0);
            loseContext.fillStyle = `#5b4888`;
            loseContext.fill();
            loseContext.restore();
            loseContext.save();

            loseContext.globalAlpha = tearOpacity;
            scaleObject(tearScale, Math.round(((windowWidth - loseSizes.tear.width) / 2) - 43), Math.round(((windowHeight - loseSizes.tear.height) / 2) + 70));
            loseContext.drawImage(
                tear,
                Math.round(((windowWidth - loseSizes.tear.width) / 2) - 63),
                Math.round(((windowHeight - loseSizes.tear.height) / 2) + 70 + tearTranlateY),
                loseSizes.tear.width,
                loseSizes.tear.height
            );
            loseContext.restore();
            loseContext.save();

            loseContext.globalAlpha = surroundingsOpacity;
            scaleObject(surroundingsScale, windowWidth / 2, windowHeight / 2);
            loseContext.drawImage(
                flamingo,
                Math.round(((windowWidth - loseSizes.flamingo.width) / 2) - 200 * surroundingsScale),
                Math.round(((windowHeight - loseSizes.flamingo.height) / 2) - 80 * surroundingsScale + surroundingsTranslateY),
                loseSizes.flamingo.width,
                loseSizes.flamingo.height
            );
            loseContext.drawImage(
                leaf,
                Math.round(((windowWidth - loseSizes.leaf.width) / 2) + 300 * surroundingsScale),
                Math.round(((windowHeight - loseSizes.leaf.height) / 2) - 120 * surroundingsScale + surroundingsTranslateY),
                loseSizes.leaf.width, loseSizes.leaf.height
            );
            loseContext.drawImage(
                saturn,
                Math.round(((windowWidth - loseSizes.saturn.width) / 2) + 250 * surroundingsScale),
                Math.round(((windowHeight - loseSizes.saturn.height) / 2) + 180 * surroundingsScale + surroundingsTranslateY),
                loseSizes.saturn.width,
                loseSizes.saturn.height
            );
            loseContext.drawImage(
                watermelon,
                Math.round(((windowWidth - loseSizes.watermelon.width) / 2) - 350 * surroundingsScale),
                Math.round(((windowHeight - loseSizes.watermelon.height) / 2) + 130 * surroundingsScale + surroundingsTranslateY),
                loseSizes.watermelon.width,
                loseSizes.watermelon.height
            );
            loseContext.drawImage(
                flake,
                Math.round(((windowWidth - loseSizes.flake.width) / 2) + 180 * surroundingsScale),
                Math.round(((windowHeight - loseSizes.flake.height) / 2) + 20 * surroundingsScale + surroundingsTranslateY),
                loseSizes.flake.width,
                loseSizes.flake.height
            );

            loseContext.restore();
          };

          const holeOpacityAnimationTick = (from, to) => (progress) => {
            holeOpacity = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const holeScaleAnimationTick = (from, to) => (progress) => {
            holeScale = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const surroundginsOpacityAnimationTick = (from, to) => (progress) => {
            surroundingsOpacity = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const surroundginsScaleAnimationTick = (from, to) => (progress) => {
            surroundingsScale = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const surroundginsTranslateYAnimationTick = (from, to) => (progress) => {
            surroundingsTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const crocodileTranslateXAnimationTick = (from, to) => (progress) => {
            crocodileTranslateX = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const crocodileTranslateYAnimationTick = (from, to) => (progress) => {
            crocodileTranslateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const tearTranslateYAnimationTick = (from, to) => (progress) => {
            tearTranlateY = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const tearScaleAnimationTick = (from, to) => (progress) => {
            tearScale = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const tearOpacityAnimationTick = (from, to) => (progress) => {
            tearOpacity = from + progress * Math.sign(to - from) * Math.abs(to - from);
          };

          const globalHoleAnimationTick = (globalProgress) => {
            if (globalProgress >= 0 && loseAnimation.indexOf(`holeA`) === -1) {
              loseAnimation.push(`holeA`);

              animate.easing(holeOpacityAnimationTick(0, 1), 500, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(holeScaleAnimationTick(0, 1), 500, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawLoseCanvas();
          };

          const globalSurroundingsAnimationTick = async (globalProgress) => {
            if (globalProgress >= 0 && loseAnimation.indexOf(`surA`) === -1) {
              loseAnimation.push(`surA`);

              await animate.easing(surroundginsScaleAnimationTick(0, 1), 1500, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(surroundginsOpacityAnimationTick(1, 0), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(surroundginsTranslateYAnimationTick(0, windowHeight), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawLoseCanvas();
          };

          const globalCrocodileAnimationTick = (globalProgress) => {
            if (globalProgress >= 0 && loseAnimation.indexOf(`crocA`) === -1) {
              loseAnimation.push(`crocA`);

              animate.easing(crocodileTranslateXAnimationTick(500, 0), 1500, bezierEasing(0.00, 0.0, 0.58, 1.0));
              animate.easing(crocodileTranslateYAnimationTick(200, 0), 1500, bezierEasing(0.00, 0.0, 0.58, 1.0));
            }
            drawLoseCanvas();
          };

          let tearsCounter = 0;
          const globalTearAnimationTick = async (globalProgress) => {
            if (globalProgress === 0) {
              await Promise.all([
                animate.easing(tearScaleAnimationTick(0, 1), 500, bezierEasing(0.00, 0.0, 0.58, 1.0)),
                animate.easing(tearOpacityAnimationTick(0, 1), 500, bezierEasing(0.00, 0.0, 0.58, 1.0)),
              ]);

              await Promise.all([
                animate.easing(tearTranslateYAnimationTick(0, 200), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0)),
                animate.easing(tearOpacityAnimationTick(1, 0), 1000, bezierEasing(0.00, 0.0, 0.58, 1.0)),
              ]);

              tearTranlateY = 0;

              if (tearsCounter !== 1) {
                tearsCounter = 1;
                await animate.duration(globalTearAnimationTick, 1500);
              }
            }
            drawLoseCanvas();
          };

          let hole = new Image();
          let flamingo = new Image();
          let leaf = new Image();
          let saturn = new Image();
          let watermelon = new Image();
          let flake = new Image();
          let crocodile = new Image();
          let tear = new Image();
          let images = [
            hole,
            flamingo,
            leaf,
            saturn,
            watermelon,
            flake,
            crocodile,
          ];
          let imagesLoadCounter = 0;

          images.forEach((image) => {
            image.onload = async () => {
              imagesLoadCounter = imagesLoadCounter + 1;

              if (imagesLoadCounter === images.length) {
                drawLoseCanvas();

                await animate.duration(globalHoleAnimationTick, 500);
                animate.duration(globalSurroundingsAnimationTick, 2500);
                await animate.duration(globalCrocodileAnimationTick, 1500);
                animate.duration(globalTearAnimationTick, 1500);
              }
            };
          });

          hole.src = `img/key.png`;
          flamingo.src = `img/flamingo.png`;
          leaf.src = `img/leaf.png`;
          saturn.src = `img/saturn.png`;
          watermelon.src = `img/watermelon.png`;
          flake.src = `img/snowflake-lose.png`;
          crocodile.src = `img/crocodile.png`;
          tear.src = `img/drop.png`;
        }

        const winCanvas = targetEl[0].querySelector(`#win`);
        if (winCanvas && winCanvas.getContext) {
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
            winContext.drawImage(
                backImg,
                Math.round(((windowWidth - winSizes.back.width) / 2)) + 50,
                Math.round(((windowHeight - winSizes.back.height) / 2)) - 50 + 100,
                winSizes.back.width * backScale,
                winSizes.back.height
            );
            winContext.drawImage(
                tree,
                Math.round(((windowWidth - winSizes.tree.width) / 2) + 150),
                Math.round(((windowHeight - winSizes.tree.height) / 2) + 125),
                winSizes.tree.width,
                winSizes.tree.height
            );
            winContext.drawImage(
                tree2,
                Math.round(((windowWidth - winSizes.tree2.width) / 2) + 110),
                Math.round(((windowHeight - winSizes.tree2.height) / 2) + 96 + treeTranslateY),
                winSizes.tree2.width,
                winSizes.tree2.height
            );
            winContext.restore();
            winContext.save();

            winContext.globalAlpha = winOpacity;
            rotateObject(planeRotate, windowWidth / 2, windowHeight / 2);
            winContext.drawImage(
                planeImg,
                Math.round(((windowWidth - winSizes.plane.width) / 2) + planeTranslateX),
                Math.round(((windowHeight - winSizes.plane.height) / 2) + planeTranslateY + 100),
                winSizes.plane.width * (planeScale),
                winSizes.plane.height * planeScale
            );
            winContext.restore();
            winContext.save();

            winContext.globalAlpha = 1;
            rotateObject(calfRotateAngle, windowWidth / 2, windowHeight / 2);
            winContext.drawImage(
                iceImg,
                Math.round((windowWidth - winSizes.ice.width) / 2),
                Math.round((windowHeight - winSizes.ice.height) / 2 + 188 + calfTranslateY),
                winSizes.ice.width,
                winSizes.ice.height
            );
            winContext.drawImage(
                animalImg,
                Math.round((windowWidth - winSizes.animal.width) / 2),
                Math.round((windowHeight - winSizes.animal.height) / 2 + 100 + calfTranslateY),
                winSizes.animal.width,
                winSizes.animal.height
            );
            winContext.restore();
            winContext.save();

            winContext.globalAlpha = winOpacity;
            winContext.drawImage(
                flakeLeft,
                Math.round(((windowWidth - winSizes.flakeLeft.width) / 2) - 236),
                Math.round(((windowHeight - winSizes.flakeLeft.height) / 2) + 100 + flakeLeftTranslateY),
                winSizes.flakeLeft.width,
                winSizes.flakeLeft.height
            );
            winContext.drawImage(
                flakeRight,
                Math.round(((windowWidth - winSizes.flakeRight.width) / 2) + 212),
                Math.round(((windowHeight - winSizes.flakeRight.height) / 2) + 100 + flakeRightTranlateY),
                winSizes.flakeRight.width,
                winSizes.flakeRight.height
            );
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

          planeImg.src = `img/airplane.png`;
          backImg.src = `img/back.png`;
          tree.src = `img/tree.png`;
          tree2.src = `img/tree_2.png`;
          iceImg.src = `img/ice.png`;
          animalImg.src = `img/sea-calf-2.png`;
          flakeLeft.src = `img/snowflake.png`;
          flakeRight.src = `img/snowflake-r.png`;
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
