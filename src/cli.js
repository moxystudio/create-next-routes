import arg from 'arg';
import generateUsage from './usage';
import { generateRouteFiles } from './generator';

/**
 * Parses the command line arguments into application options.
 *
 * @param {Array<string>} rawArgs - The arguments from the command line.
 * @returns {Object} - Application configuration based on the command line arguments.
 */
function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--file': String,
            '-f': '--file',

            '--basePath': String,
            '--outputPath': String,
            '-t': '--outputPath',

            '--help': Boolean,
            '-h': '--help',
        },
        {
            argv: rawArgs.slice(2),
        }
    );

    const basePath = args['--basePath'] || process.cwd();
    const fileName = args['--file'] || 'routes.json';
    const file = `${basePath}/${fileName}`;
    const outputPath = args['--outputPath'] || `${basePath}/pages`;

    return {
        basePath,
        file,
        outputPath,
        showHelp: args['--help'] || false,
    };
}

/**
 * Handles interaction with the command line.
 *
 * @param {Array<string>} args - The arguments from the command line.
 * @returns {boolean} - Wether or not the program handled the input correctly.
 */
export function cli(args) {
    if (!args || args.length < 2) {
        throw new Error('No arguments specified!');
    }
    try {
        const options = parseArgumentsIntoOptions(args);

        if (options.showHelp) {
            const usage = generateUsage();

            console.log(usage);

            return true;
        }

        generateRouteFiles(options);

        return true;
    } catch (e) {
        console.error(e);

        return false;
    }
}
