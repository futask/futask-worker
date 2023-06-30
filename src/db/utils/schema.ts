import uuid from '../../helpers/uuid';

export const ID_DEFINITION = { type: String, default: () => uuid() };
