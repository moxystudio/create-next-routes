import { cli } from '../src/cli';
import { generateRouteFiles } from '../src/generator';
import usage from '../src/usage';

jest.mock('../src/generator');
jest.mock('../src/usage');

describe('CLI', () => {
    beforeEach(() => {
        process.cwd = jest.fn();
        process.cwd.mockReturnValue('/cool-path');

        console.log = jest.fn();
        console.error = jest.fn();
        usage.mockReturnValue('Usage: cool');
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fail when passing NO arguments', () => {
        expect(() => cli()).toThrow(/No arguments specified/);
    });

    it('should fail when passing ONE argument', () => {
        const victimArgs = ['arg'];

        expect(() => cli(victimArgs)).toThrow(/No arguments specified/);
    });

    it('should run the cli with the defaults when passing TWO arguments', () => {
        const victimArgs = ['arg', 'arg2'];

        cli(victimArgs);

        expect(generateRouteFiles).toHaveBeenCalledWith({
            basePath: '/cool-path',
            file: '/cool-path/routes.json',
            outputPath: '/cool-path/pages',
            showHelp: false,
        });
    });

    it('should print the help usage when its requested', () => {
        const victimArgs = ['arg', 'arg2', '--help'];

        cli(victimArgs);
        expect(usage).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('Usage: cool');
    });

    it('should throw an error when setting a different file but forgot to specify it', () => {
        const victimArgs = ['arg', 'arg2', '--file'];

        cli(victimArgs);
        expect(console.error).toHaveBeenCalledWith(new Error('Option requires argument: --file'));
    });

    it('should set the file correctly when setting a different file', () => {
        const victimArgs = ['arg', 'arg2', '--file', 'potato.json'];

        cli(victimArgs);
        expect(generateRouteFiles).toHaveBeenCalledWith({
            basePath: '/cool-path',
            file: '/cool-path/potato.json',
            outputPath: '/cool-path/pages',
            showHelp: false,
        });
    });

    it('should throw an error when setting a different basePath but forgot to specify it', () => {
        const victimArgs = ['arg', 'arg2', '--basePath'];

        cli(victimArgs);
        expect(console.error).toHaveBeenCalledWith(new Error('Option requires argument: --basePath'));
    });

    it('should set the file correctly when setting a different basePath', () => {
        const victimArgs = ['arg', 'arg2', '--basePath', '/potato-bag'];

        cli(victimArgs);
        expect(generateRouteFiles).toHaveBeenCalledWith({
            basePath: '/potato-bag',
            file: '/potato-bag/routes.json',
            outputPath: '/potato-bag/pages',
            showHelp: false,
        });
    });

    it('should throw an error when setting a different outputPath but forgot to specify it', () => {
        const victimArgs = ['arg', 'arg2', '--outputPath'];

        cli(victimArgs);
        expect(console.error).toHaveBeenCalledWith(new Error('Option requires argument: --outputPath'));
    });

    it('should set the file correctly when setting a different outputPath', () => {
        const victimArgs = ['arg', 'arg2', '--outputPath', '/potato-bag'];

        cli(victimArgs);
        expect(generateRouteFiles).toHaveBeenCalledWith({
            basePath: '/cool-path',
            file: '/cool-path/routes.json',
            outputPath: '/potato-bag',
            showHelp: false,
        });
    });

    describe('when parsing arguments fails', () => {
        beforeEach(() => {
            process.cwd = () => {
                throw new Error('damn');
            };
        });

        it('should fail gracefully', () => {
            const victimArgs = ['arg', 'arg2'];

            cli(victimArgs);

            expect(console.error).toHaveBeenCalledWith(new Error('damn'));
        });

        it('should return false', () => {
            const victimArgs = ['arg', 'arg2'];

            const victimResult = cli(victimArgs);

            expect(victimResult).toBe(false);
        });
    });
});
