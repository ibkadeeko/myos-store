import loggerCreator from './loggerCreator';

// Component names
const GENERAL = 'GENERAL';
const ROUTER = 'ROUTER';
const API_REQUEST = 'API_REQUEST';

// Logger for general application logic
export const generalLogger = loggerCreator(GENERAL);

/**
 * Logs for specific module logs
 */
export const routerResponseLogger = loggerCreator(ROUTER);
export const apiRequestLogger = loggerCreator(API_REQUEST);
