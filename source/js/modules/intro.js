import AnimatedText from './animated-text';

const introTitle = new AnimatedText(document.querySelector(`.intro__title`));
const introDate = new AnimatedText(document.querySelector(`.intro__date`));

export default [introTitle, introDate];
