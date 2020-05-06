export default () => {
  let showResultEls = document.querySelectorAll(`.js-show-result`);
  let results = document.querySelectorAll(`.screen--result`);
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

        const targetTitle = targetEl[0].querySelector(`.result__title`);
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
