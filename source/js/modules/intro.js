import AnimatedText from './animated-text';

const introTitle = new AnimatedText(document.querySelector(`.intro__title`), 500);
const introDate = new AnimatedText(document.querySelector(`.intro__date`), 500);

export default [introTitle, introDate];
