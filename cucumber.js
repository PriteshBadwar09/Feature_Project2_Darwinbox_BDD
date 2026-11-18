
module.exports = {
    default: {
        paths: [
            'features/**/*.feature'
        ],

        requireModule: [
            'dotenv/config',
            'ts-node/register'
        ],

        require: [
            'support/hooks.ts',
            'step-definitions/**/*.ts'
        ],

        format: [
            'progress',
            'allure-cucumberjs/reporter'
        ],

        formatOptions: {
            resultsDir: 'allure-results'
        },

        parallel: 1
    }
};
