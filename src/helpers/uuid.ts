import { nanoid } from 'nanoid';

export default () => nanoid().replace(/[-_]/g, 'F');
