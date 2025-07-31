@ui @sep29
Feature: Error message for the invalid CVC number

    As a user, I want to be informed when the CVC number I enter is incorrect or too short.

    #* AC1: The Immediate error message should be thrown if the CVC number is too short or wrong. "Your card's security code is incomplete."

    Background:
        Given user is on the enrollment page
        And user has completed step one with valid information
        And user has completed step two with a valid option
        And user is on step three of the enrollment process

    Scenario: User receives error message for incomplete CVC number
        When user enters an incomplete CVC number
        And user clicks outside the CVC number field
        Then user should see the CVC error message "Your card’s security code is incomplete."