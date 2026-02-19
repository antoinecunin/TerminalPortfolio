// Command registration — import order doesn't matter,
// each file self-registers into the registry.
import './help';
import './clear';
import './filesystem';
import './whoami';
import './man';
import './uname';
import './env';
import './grep';
import './find';
import './history';
import './finger';
import './ssh';
import './exit';
import './xdg-open';
import './wget';
import './sudo';

export { registry } from './registry';
