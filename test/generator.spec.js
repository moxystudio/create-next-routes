import { generateRouteFiles } from '../src/generator';
import fs from 'fs-extra';
import chalk from 'chalk';
import * as structureCreator from '../src/structure-creator';

jest.mock('fs');
jest.mock('chalk');

let createStructureSpy;

describe('Generate Route Files', () => {
    beforeEach(() => {
        console.log = jest.fn();
        console.error = jest.fn();

        fs.readJson = jest.fn(() => ({}));
        fs.emptyDir = jest.fn();
        fs.ensureDir = jest.fn();
        fs.outputFile = jest.fn();

        chalk.green = (s) => s;

        createStructureSpy = jest.spyOn(structureCreator, 'createStructure');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('when the route has one route with only one level', () => {
        beforeEach(async () => {
            fs.readJson = jest.fn(() => ({
                app: {
                    src: 'www/app',
                },
            }));

            await generateRouteFiles({ file: 'x', outputPath: 'op' });
        });

        it('should clean the directory and ensure it exists', () => {
            expect(fs.emptyDir).toHaveBeenCalledWith('op');
            expect(fs.ensureDir).toHaveBeenCalledWith('op');
        });

        it('should generate the structure with one page and no sub pages', () => {
            expect(createStructureSpy).toHaveBeenCalledWith('/app', 'www/app', 'op');
            expect(createStructureSpy).toHaveBeenCalledTimes(1);
        });

        it('should create only one file', () => {
            expect(fs.outputFile).toHaveBeenCalledWith('op/app.js',
            `// Automatically generated with create-next-routes
export { default } from '../www/app';
`);
            expect(fs.outputFile).toHaveBeenCalledTimes(1);
        });
    });

    describe('when the route has two routes with only one level', () => {
        beforeEach(async () => {
            fs.readJson = jest.fn(() => ({
                app: {
                    src: 'www/app',
                },
                cool: {
                    src: 'www/routing-system',
                },
            }));

            await generateRouteFiles({ file: 'x', outputPath: 'another-path' });
        });

        it('should clean the directory and ensure it exists', () => {
            expect(fs.emptyDir).toHaveBeenCalledWith('another-path');
            expect(fs.ensureDir).toHaveBeenCalledWith('another-path');
        });

        it('should generate the structure with two pages and no sub pages', () => {
            expect(createStructureSpy).nthCalledWith(1, '/app', 'www/app', 'another-path');
            expect(createStructureSpy).nthCalledWith(2, '/cool', 'www/routing-system', 'another-path');
            expect(createStructureSpy).toHaveBeenCalledTimes(2);
        });

        it('should create only two files', () => {
            expect(fs.outputFile).nthCalledWith(1, 'another-path/app.js',
            `// Automatically generated with create-next-routes
export { default } from '../www/app';
`
            );

            expect(fs.outputFile).nthCalledWith(2, 'another-path/cool.js',
            `// Automatically generated with create-next-routes
export { default } from '../www/routing-system';
`
            );

            expect(fs.outputFile).toHaveBeenCalledTimes(2);
        });
    });

    describe('when the route has one route with two levels', () => {
        beforeEach(async () => {
            fs.readJson = jest.fn(() => ({
                english: {
                    children: [
                        { app: { src: 'www/app' } },
                    ],
                },
            }));

            await generateRouteFiles({ file: 'x', outputPath: 'op' });
        });

        it('should clean the directory and ensure it exists', () => {
            expect(fs.emptyDir).toHaveBeenCalledWith('op');
            expect(fs.ensureDir).toHaveBeenCalledWith('op');
        });

        it('should generate the structure with one page and one parent', () => {
            expect(createStructureSpy).toHaveBeenCalledWith('/english/app', 'www/app', 'op');
            expect(createStructureSpy).toHaveBeenCalledTimes(1);
        });

        it('should create only one file', () => {
            expect(fs.outputFile).toHaveBeenCalledWith('op/english/app.js',
            `// Automatically generated with create-next-routes
export { default } from '../../www/app';
`);
            expect(fs.outputFile).toHaveBeenCalledTimes(1);
        });
    });

    describe('when the route has two routes with different levels', () => {
        beforeEach(async () => {
            fs.readJson = jest.fn(() => ({
                app: {
                    src: 'wwe/raw',
                },
                english: {
                    children: [
                        { app: { src: 'www/app' } },
                    ],
                },
            }));

            await generateRouteFiles({ file: 'x', outputPath: 'op' });
        });

        it('should clean the directory and ensure it exists', () => {
            expect(fs.emptyDir).toHaveBeenCalledWith('op');
            expect(fs.ensureDir).toHaveBeenCalledWith('op');
        });

        it('should generate the structure with two pages', () => {
            expect(createStructureSpy).toHaveBeenNthCalledWith(1, '/app', 'wwe/raw', 'op');
            expect(createStructureSpy).toHaveBeenNthCalledWith(2, '/english/app', 'www/app', 'op');
            expect(createStructureSpy).toHaveBeenCalledTimes(2);
        });

        it('should create two files', () => {
            expect(fs.outputFile).toHaveBeenNthCalledWith(1, 'op/app.js',
            `// Automatically generated with create-next-routes
export { default } from '../wwe/raw';
`);

            expect(fs.outputFile).toHaveBeenNthCalledWith(2, 'op/english/app.js',
`// Automatically generated with create-next-routes
export { default } from '../../www/app';
`);
            expect(fs.outputFile).toHaveBeenCalledTimes(2);
        });
    });

    describe('when the route has routes with three levels', () => {
        beforeEach(async () => {
            fs.readJson = jest.fn(() => ({
                app: {
                    src: 'wwe/raw',
                },
                english: {
                    children: [
                        {
                            app: {
                                src: 'www/app',
                                children: [
                                    {
                                        appSon: {
                                            src: 'www/app/son',
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            }));

            await generateRouteFiles({ file: 'x', outputPath: 'op' });
        });

        it('should clean the directory and ensure it exists', () => {
            expect(fs.emptyDir).toHaveBeenCalledWith('op');
            expect(fs.ensureDir).toHaveBeenCalledWith('op');
        });

        it('should generate the structure with two pages', () => {
            expect(createStructureSpy).toHaveBeenNthCalledWith(1, '/app', 'wwe/raw', 'op');
            expect(createStructureSpy).toHaveBeenNthCalledWith(2, '/english/app', 'www/app', 'op');
            expect(createStructureSpy).toHaveBeenNthCalledWith(3, '/english/app/appSon', 'www/app/son', 'op');
            expect(createStructureSpy).toHaveBeenCalledTimes(3);
        });

        it('should create two files', () => {
            expect(fs.outputFile).toHaveBeenNthCalledWith(1, 'op/app.js',
            `// Automatically generated with create-next-routes
export { default } from '../wwe/raw';
`);

            expect(fs.outputFile).toHaveBeenNthCalledWith(2, 'op/english/app.js',
`// Automatically generated with create-next-routes
export { default } from '../../www/app';
`);

            expect(fs.outputFile).toHaveBeenNthCalledWith(3, 'op/english/app/appSon.js',
`// Automatically generated with create-next-routes
export { default } from '../../../www/app/son';
`);
            expect(fs.outputFile).toHaveBeenCalledTimes(3);
        });
    });

    // Error handling

    it('should inform the user gracefully when it fails to read the file', async () => {
        fs.readJson = jest.fn(() => {
            throw new Error('file fail');
        });

        await generateRouteFiles({ file: 'x' });

        expect(console.error).toHaveBeenCalledWith('Error trying to read the x file!');
    });

    it('should inform the user when it fails to clean the directory', async () => {
        fs.emptyDir = () => {
            throw new Error('clean directory fail');
        };

        fs.readJson = () => ({
            app: {
                src: 'www/app',
            },
        });

        await generateRouteFiles({ file: 'x', outputPath: 'xx' });

        expect(console.error).toHaveBeenCalledWith('Error trying to read the x file!');
    });
});
