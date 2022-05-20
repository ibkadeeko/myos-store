import { createLogger, transports, format, Logger } from 'winston';
import { consoleFormat } from 'winston-console-format';
import { format as dateFormat } from 'date-fns';

const baseOptions = {
  file: {
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
};

const options = (component: string) => {
  return {
    combinedFile: {
      ...baseOptions.file,
      level: 'info',
      filename: `./logs/${component}/${dateFormat(new Date(), 'yyyy-MM-dd')}/app_log.log`,
    },
    errorFile: {
      ...baseOptions.file,
      level: 'error',
      filename: `./logs/${component}/${dateFormat(new Date(), 'yyyy-MM-dd')}/error_logs.log`,
    },
    console:
      process.env.NODE_ENV !== 'local'
        ? { level: 'debug', handleExceptions: true }
        : {
            level: 'debug',
            handleExceptions: true,
            format: format.combine(
              format.colorize({ all: true }),
              format.padLevels(),
              consoleFormat({
                showMeta: true,
                metaStrip: ['timestamp'],
                inspectOptions: {
                  depth: Infinity,
                  colors: true,
                  maxArrayLength: Infinity,
                  breakLength: 120,
                  compact: Infinity,
                },
              })
            ),
          },
  };
};

const env = process.env.NODE_ENV || 'development';

const createLoggerForSpecificModule = (component: string): Logger => {
  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { component },
    transports: [
      ...(['local', 'test'].includes(env) ? [] : [new transports.File(options(component).combinedFile)]),
      ...(['local', 'test'].includes(env) ? [] : [new transports.File(options(component).errorFile)]),
    ],
    exitOnError: false,
    silent: env === 'test',
  });

  logger.add(new transports.Console(options(component).console));

  return logger;
};

export default createLoggerForSpecificModule;
