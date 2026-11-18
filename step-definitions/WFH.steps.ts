
import {
    Given,
    When,
    Then
} from '@cucumber/cucumber';

import { expect } from '@playwright/test';

import { CustomWorld } from '../support/world';
import { DarwinboxPage } from '../pages/DarwinboxPage';

// Open Darwinbox login page
Given(
    'I open the Darwinbox login page',
    async function (this: CustomWorld) {

        this.darwinbox = new DarwinboxPage(this.page);

        await this.darwinbox.openLoginPage();

        console.log('Darwinbox login page opened');
    }
);

// Login with credentials
When(
    'I log in with valid credentials',
    async function (this: CustomWorld) {

        const userId = process.env.DARWINBOX_USERNAME;
        const password = process.env.DARWINBOX_PASSWORD;

        if (!userId || !password) {
            throw new Error(
                'Darwinbox credentials are missing. Set environment variables.'
            );
        }

        await this.darwinbox.login(userId, password);

        console.log('Darwinbox login successful');
    }
);

// Navigate to Attendance
When(
    'I navigate to the Attendance page',
    async function (this: CustomWorld) {

        await this.darwinbox.openAttendance();

        console.log('Attendance page opened');
    }
);

// Open WFH form
Given(
    'I open the Work From Home request form',
    async function (this: CustomWorld) {

        await this.darwinbox.openWFHForm();

        console.log('WFH form opened');
    }
);

// Enter WFH details
When(
    'I enter the WFH request details',
    async function (this: CustomWorld) {

        await this.darwinbox.enterWFHDetails();

        console.log('WFH details populated');
    }
);

// Submit WFH request
When(
    'I submit the WFH request',
    async function (this: CustomWorld) {

        this.wfhStatus =
            await this.darwinbox.submitWFHRequest();

        console.log('WFH status:', this.wfhStatus);
    }
);

// Verify WFH outcome
Then(
    'the WFH request outcome should be recorded',
    async function (this: CustomWorld) {

        expect([
            'ALREADY_APPLIED_EARLIER',
            'SUBMITTED_SUCCESSFULLY'
        ]).toContain(this.wfhStatus);

        if (this.wfhStatus === 'ALREADY_APPLIED_EARLIER') {

            await this.attach(
                'ALREADY APPLIED EARLIER\n' +
                'TM-2201: Request already exists.\n' +
                'Duplicate WFH application prevented.',
                'text/plain'
            );

            console.log('TM-2201 handled successfully');

        } else {

            await this.attach(
                'WFH request submitted successfully.',
                'text/plain'
            );

            console.log('WFH request submitted successfully');
        }
    }
);
