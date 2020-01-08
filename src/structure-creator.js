import fs from 'fs-extra';

/** Creates files and fills their content with the entry point.
 *
 * @param {string} routePath - The path of the file with "/" as the directory indicator.
 * @param {string} routeEntryPoint - The path for the source code entry point.
 * @param {string} outputPath - The base path to output all files.
 * @returns {string} - Path of the file created.
 */
export async function createStructure(routePath, routeEntryPoint, outputPath) {
    const filePath = `${outputPath}${routePath}.js`;

    const numberOfAscendingFolders = routePath.split('/').length - 1;
    const basePath = new Array(numberOfAscendingFolders)
    .fill('..')
    .join('/');

    const fileContent =
`// Automatically generated with create-next-routes
export { default } from '${basePath}/${routeEntryPoint}';
`;

    await fs.outputFile(filePath, fileContent);

    return filePath;
}
