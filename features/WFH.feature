
@Darwinbox @WFH
Feature: Darwinbox Work From Home Request

  As a Datamatics employee
  I want to apply for a Work From Home request
  So that my WFH request is recorded in Darwinbox

  Background:
    Given I open the Darwinbox login page
    When I log in with valid credentials
    And I navigate to the Attendance page

  Scenario: Apply WFH request or handle an existing request
    Given I open the Work From Home request form
    When I enter the WFH request details
    And I submit the WFH request
    Then the WFH request outcome should be recorded
