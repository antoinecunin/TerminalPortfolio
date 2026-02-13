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
import './history';
import './finger';

export { registry } from './registry';
