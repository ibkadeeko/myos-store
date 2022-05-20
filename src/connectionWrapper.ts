import { configureENV } from './env';
import { generalLogger } from './lib';

const connectionWrapper = async (body: () => void) => {
  try {
    await configureENV();

    body();
  } catch (error) {
    generalLogger.error(`Error Starting Application: ${error.message}`);
    process.exit(1);
  }
};

export default connectionWrapper;
