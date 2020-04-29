export default () => {
  const bodyElement = document.querySelector(`body`);

  window.addEventListener(`load`, () => {
    bodyElement.classList.add(`loaded`);
  });
};
