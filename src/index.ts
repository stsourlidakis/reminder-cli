import { parseArgs } from './utils/parseArgs';
import { validateArgs } from './utils/validateArgs';

try {
  const parsedArgs = parseArgs(process.argv.slice(2));
  validateArgs(parsedArgs);
  console.log(parsedArgs);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
