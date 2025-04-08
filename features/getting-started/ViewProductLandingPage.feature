@sep07
Feature: View Product Landing Page

    As a customer, I should be able to see the product landing page.

    #* AC1: The system displays the text "Cydeo Secure Checkout".
    #* AC2: The system should display the program name.
    #* AC3: Users should see a footer on the left side of the page that includes by order: 
    #*      logo, Terms and Conditions, Privacy Policy, Disclaimer, Cookie Policy
    
    #* AC4: The system displays "Need help? Contact us at enrollment@cydeo.com" in the footer on the right.
    #* AC5: The system should be compatible with both desktop and mobile devices.    

    Background:
        Given user is on the enrollment page

    Scenario: Verify secure checkout header is displayed
        Then the header should show the Cydeo logo and display "Secure checkout"

    Scenario: Verify program name visibility
        Then the program name should be visible in the product card

    Scenario: Verify footer element order and composition
        Then the left footer should contain elements in exact order:
            | Element Type | Text                 |
            | logo         | (no text returned)   |
            | link         | Terms and conditions |
            | link         | Privacy Policy       |
            | link         | Disclaimer           |
            | link         | Cookie Policy        |

    Scenario: Verify help information in footer
        Then the right footer should display "Need help? Contact us at enrollment@cydeo.com"
        And the Cydeo logo should be visible in the footer

    Scenario Outline: Verify responsive design
        When viewing the page on a "<device>" screen
        Then all key elements should remain visible and properly aligned
        Examples:
            | device  |
            | desktop |
            | mobile  |
    