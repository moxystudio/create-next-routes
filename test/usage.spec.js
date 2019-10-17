import usage from '../src/usage';
import cmd from 'command-line-usage';

jest.mock('command-line-usage');
describe('Help Usage', () => {
    beforeEach(() => {

    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should generate the command line usage', () => {
        usage();

        expect(cmd).toHaveBeenCalledWith(expect.any(Array));
    });
});
