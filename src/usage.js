const commandLineUsage = require('command-line-usage');

export default () => commandLineUsage([
    {
        header: 'Create next routes',
        content: 'Generates {bold {blue Next routes}} based on a configuration file',
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'file',
                alias: 'f',
                typeLabel: '{underline file}',
                description: 'The file to process {gray {italic (default: \'routes.json\')}}',
            },
            {
                name: 'basePath',
                typeLabel: '{underline path}',
                description: 'The directory where {underline file} is present {gray {italic (default: <cwd>)}}',
            },
            {
                name: 'outputPath',
                typeLabel: '{underline path}',
                description: 'The path to output the routes directory at {gray {italic (default: <cwd>/pages/ )}}',
            },
            {
                name: 'help',
                alias: 'h',
                description: 'Prints this usage guide.',
            },
        ],
    },
]);
