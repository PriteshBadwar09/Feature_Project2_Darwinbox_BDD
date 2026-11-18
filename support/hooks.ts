
import {
    Before,
    After,
    Status,
    setDefaultTimeout
} from '@cucumber/cucumber';

import { chromium } from '@playwright/test';
import { CustomWorld } from './world';

// Set Cucumber timeout to 60 seconds
setDefaultTimeout(60 * 1000);

// Before scenario
Before(async function (this: CustomWorld) {

    this.browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    this.context = await this.browser.newContext();

    this.page = await this.context.newPage();

    console.log('Darwinbox browser launched');
});

// After scenario
After(async function (this: CustomWorld, scenario) {

    console.log(
        'Scenario status:',
        scenario.result?.status
    );

    if (scenario.result?.status === Status.FAILED) {

        console.error(
            'Scenario failure:',
            scenario.result?.message
        );
    }

    if (this.page && !this.page.isClosed()) {

        await this.attach(
            await this.page.screenshot({
                fullPage: true
            }),
            'image/png'
        );

        console.log('Final screenshot attached');

        // Keep browser open for 10 seconds
        await this.page.waitForTimeout(10000);
    }

    if (this.context) {
        await this.context.close();
    }

    if (this.browser) {
        await this.browser.close();
    }

    console.log('Browser closed');
});
