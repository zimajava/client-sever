import style from './styles.module.scss';
import svgDownload from '../../assets/svg/car.svg';

const root = document.getElementById('root');

const fragment = document.createDocumentFragment();

const div = document.createElement('div');
div.innerText = 'Test';
div.setAttribute('class', style.test);

const img = document.createElement('img');
img.setAttribute('src', svgDownload);

fragment.appendChild(div);
fragment.appendChild(img);

root.appendChild(fragment);
