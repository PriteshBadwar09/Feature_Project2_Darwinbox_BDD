
import {
    World,
    IWorldOptions,
    setWorldConstructor
} from '@cucumber/cucumber';

import {
    Browser,
    BrowserContext,
    Page
} from '@playwright/test';

import { DarwinboxPage } from '../pages/DarwinboxPage';

export class CustomWorld extends World {

    browser!: Browser;

    context!: BrowserContext;

    page!: Page;

    darwinbox!: DarwinboxPage;

    wfhStatus!: string;

    constructor(options: IWorldOptions) {
        super(options);
    }
}

setWorldConstructor(CustomWorld);
