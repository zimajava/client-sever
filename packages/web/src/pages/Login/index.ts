import { log } from './utils';
import './styles.scss';

interface Interface {
  qwe: boolean;
}

class Class implements Interface {
  qwe: boolean;
}

const qwe = new Class();

log(qwe);
