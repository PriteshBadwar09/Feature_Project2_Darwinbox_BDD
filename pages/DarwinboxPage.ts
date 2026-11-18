
import { Page, Locator, expect } from '@playwright/test';

export class DarwinboxPage {

    readonly page: Page;

    // Login locators
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;

    // Navigation locators
    readonly timeManagement: Locator;
    readonly attendance: Locator;

    // WFH locators
    readonly requestButton: Locator;
    readonly wfhOption: Locator;
    readonly clockoutMinuteHead: Locator;
    readonly clockoutMinute30: Locator;
    readonly remarks: Locator;
    readonly submitButton: Locator;

    // Result locator
    readonly duplicateWarning: Locator;

    constructor(page: Page) {

        this.page = page;

        // Login
        this.username = page.getByTestId(
            'user-login-username-input'
        );

        this.password = page.getByTestId(
            'user-login-password-input'
        );

        this.loginButton = page.getByTestId(
            'user-login-submit-btn'
        );

        // Attendance navigation
        this.timeManagement = page.getByRole('link', {
            name: 'Time Management'
        });

        this.attendance = page.getByRole('link', {
            name: 'Attendance'
        });

        // WFH form
        this.requestButton = page.getByTestId(
            'time-home-request-btn-button'
        );

        this.wfhOption = page.getByTestId(
            'time-home-request-btn-menu-item-Work From Home'
        );

        this.clockoutMinuteHead = page.getByTestId(
            'time-home-request-modal-work-from-home-clock-out-time-input-minute-head'
        );

        this.clockoutMinute30 = page.getByTestId(
            'time-home-request-modal-work-from-home-clock-out-time-input-minute-option-30'
        ).getByText('30', { exact: true });

        this.remarks = page.getByTestId(
            'time-home-request-modal-work-from-home-input-text-input'
        );

        this.submitButton = page.getByTestId(
            'time-home-request-modal-submit-btn-button'
        );

        this.duplicateWarning = page.getByText(
            /TM-2201:\s*Request already exists/i
        );
    }

    // Open Darwinbox login page
    async openLoginPage(): Promise<void> {

        await this.page.goto(
            'https://myspace-datamatics.darwinbox.com/user/login?continue=%2Fms%2Fdb%2Fhome'
        );

        await expect(this.username).toBeVisible({
            timeout: 30000
        });

        console.log('Darwinbox login page opened');
    }

    // Login with manual CAPTCHA intervention
    async login(
        userId: string,
        userPassword: string
    ): Promise<void> {

        await this.username.fill(userId);

        await this.password.fill(userPassword);

        console.log('Login credentials entered');

        await this.loginButton.click();

        console.log('Login button clicked');

        console.log(
            'If CAPTCHA appears, solve it manually in the browser.'
        );

        console.log(
            'If required, click Login manually after CAPTCHA verification.'
        );

        // Wait for successful authentication.
        // Automation continues automatically after login.
        await expect(this.timeManagement).toBeVisible({
            timeout: 180000
        });

        console.log('Darwinbox login successful');
    }

    // Navigate to Attendance
    async openAttendance(): Promise<void> {

        await this.timeManagement.click();

        await this.attendance.click();

        await expect(this.requestButton).toBeVisible({
            timeout: 30000
        });

        console.log('Attendance page opened');
    }

    // Open Work From Home form
    async openWFHForm(): Promise<void> {

        await this.requestButton.click();

        await this.wfhOption.click();

        await expect(this.submitButton).toBeVisible({
            timeout: 15000
        });

        console.log('WFH request form opened');
    }

    // Enter WFH request details
    async enterWFHDetails(): Promise<void> {

        await this.clockoutMinuteHead
            .locator('div')
            .filter({ hasText: /^00$/ })
            .click();

        await this.clockoutMinute30.click();

        await this.remarks.fill('WFH');

        await this.page.locator('#body_container')
            .first()
            .click();

        await expect(this.submitButton).toBeEnabled();

        console.log('WFH request details entered');
    }

    // Submit WFH request
    async submitWFHRequest(): Promise<string> {

        await this.submitButton.click();

        try {

            await this.duplicateWarning.waitFor({
                state: 'visible',
                timeout: 10000
            });

            console.log('Existing WFH request detected');

            return 'ALREADY_APPLIED_EARLIER';

        } catch {

            throw new Error(
                'WFH outcome could not be verified. ' +
                'TM-2201 warning was not detected. ' +
                'Success confirmation locator needs configuration.'
            );
        }
    }
}
