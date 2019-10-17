import fs from 'fs-extra';
import chalk from 'chalk';

import { createStructure } from './structure-creator';
import buildRoutes from './routes';

/**
 * Remove duplicated objects from array.
 *
 * @param {Array<Object>} array - The array to be filtered.
 * @returns {Array<Object>} - Array of objects with no duplicated values.
 */
const removeDuplicatedObjectsFromArray = (array) =>
    array.filter((element, index) =>
        index === array.findIndex((obj) =>
            JSON.stringify(obj) === JSON.stringify(element)));

/**
 * Generates route files based on a <file> configuration into an <outputPath> folder.
 *
 * @param {Object} config - Configuration for the generator.
 * @param {string} config.file - The file to read the config from.
 * @param {string} config.outputPath - The directory to output the files into.
 * @returns {boolean} - If the files were generated or not.
 */
export async function generateRouteFiles({ file, outputPath }) {
    console.log(`Reading data from ${file}`);

    try {
        const routesData = await fs.readJson(file);

        const routesWithPossibleDuplicates = Object.keys(routesData).reduce((prev, curr) =>
            buildRoutes(prev, curr, routesData)
        , []);

        const routes = removeDuplicatedObjectsFromArray(routesWithPossibleDuplicates);

        try {
            await fs.emptyDir(outputPath);
            await fs.ensureDir(outputPath);
        } catch (e) {
            console.error(`Failed trying to empty ${outputPath}!`);
            throw e;
        }

        console.log(`Outputting files into ${outputPath}`);
        console.log('');

        for (const route of routes) {
            const routePath = Object.keys(route)[0];

            const filePath = await createStructure(routePath, route[routePath], outputPath);

            console.log(`${chalk.green('+')} ${filePath}`);
        }

        console.log();
        console.log(`Outputted ${routes.length} files successfully into ${outputPath}`);

        return true;
    } catch (e) {
        console.error(`Error trying to read the ${file} file!`);
        console.error(e);
    }
}
