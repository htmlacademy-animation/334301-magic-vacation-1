export default () => {
  const rules = document.querySelector(`.rules`);
  const rulesTitle = document.querySelector(`.rules__title`);
  const rulesList = rules.querySelector(`.rules__list`);
  const rulesItems = [].slice.call(rulesList.querySelectorAll(`.rules__item`));
  const rulesLink = rules.querySelector(`.rules__link`);

  rulesTitle.addEventListener(`animationstart`, () => {
    rulesLink.classList.remove(`rules__link--visible`);
  });

  rulesItems[rulesItems.length - 1].addEventListener(`animationend`, () => {
    rulesLink.classList.add(`rules__link--visible`);
  });
};
