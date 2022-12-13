import App from './app';
import 'modern-normalize/modern-normalize.css';
import './style.css';
import "@fontsource/red-hat-mono/300.css"

const $root = document.querySelector<HTMLDivElement>('#app')!;
const app = new App($root);
app.initialize();

function tick(time: DOMHighResTimeStamp) {
  app.render(time);
  window.requestAnimationFrame(tick);
}

window.addEventListener('load', () => {
  window.requestAnimationFrame(tick);
});