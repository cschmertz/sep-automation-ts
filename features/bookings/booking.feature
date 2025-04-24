@api
Feature: Booking API
    As an API user
    I want to manage bookings
    So that I can create, retrieve, update and delete booking records

    Background:
        Given I am authenticated with the booking API

    @get-bookings
    Scenario: Get all booking IDs
        When I request all booking IDs
        Then the API response status should be 200
        And the response should contain booking IDs

    @create-booking
    Scenario: Create a new booking
        When I create a new booking with the following details:
            | firstname       | John       |
            | lastname        | Doe        |
            | totalprice      | 100        |
            | depositpaid     | true       |
            | checkin         | 2023-01-01 |
            | checkout        | 2023-01-05 |
            | additionalneeds | Breakfast  |
        Then the API response status should be 200
        And the booking ID should be returned
        And the booking should have the following details:
            | firstname       | John       |
            | lastname        | Doe        |
            | totalprice      | 100        |
            | depositpaid     | true       |
            | checkin         | 2023-01-01 |
            | checkout        | 2023-01-05 |
            | additionalneeds | Breakfast  |

    @get-booking
    Scenario: Get booking details
        When I create a new booking with the following details:
            | firstname       | Jane       |
            | lastname        | Smith      |
            | totalprice      | 150        |
            | depositpaid     | false      |
            | checkin         | 2023-02-01 |
            | checkout        | 2023-02-05 |
            | additionalneeds | Lunch      |
        And I use the last created booking ID
        And I request booking details for ID {int}
        Then the API response status should be 200
        And the booking should have the following details:
            | firstname       | Jane       |
            | lastname        | Smith      |
            | totalprice      | 150        |
            | depositpaid     | false      |
            | checkin         | 2023-02-01 |
            | checkout        | 2023-02-05 |
            | additionalneeds | Lunch      |

    @update-booking
    Scenario: Update a booking
        When I create a new booking with the following details:
            | firstname       | Bob        |
            | lastname        | Johnson    |
            | totalprice      | 200        |
            | depositpaid     | true       |
            | checkin         | 2023-03-01 |
            | checkout        | 2023-03-05 |
            | additionalneeds | Dinner     |
        And I use the last created booking ID
        And I update booking {int} with the following details:
            | firstname       | Robert               |
            | lastname        | Johnson              |
            | totalprice      | 250                  |
            | depositpaid     | true                 |
            | checkin         | 2023-03-02           |
            | checkout        | 2023-03-07           |
            | additionalneeds | Dinner and Breakfast |
        Then the API response status should be 200
        And the booking should have the following details:
            | firstname       | Robert               |
            | lastname        | Johnson              |
            | totalprice      | 250                  |
            | depositpaid     | true                 |
            | checkin         | 2023-03-02           |
            | checkout        | 2023-03-07           |
            | additionalneeds | Dinner and Breakfast |

    @partial-update
    Scenario: Partially update a booking
        When I create a new booking with the following details:
            | firstname       | Mary       |
            | lastname        | Williams   |
            | totalprice      | 300        |
            | depositpaid     | false      |
            | checkin         | 2023-04-01 |
            | checkout        | 2023-04-05 |
            | additionalneeds | WiFi       |
        And I use the last created booking ID
        And I partially update booking {int} with the following details:
            | firstname  | Maria |
            | totalprice | 350   |
        Then the API response status should be 200
        And the booking should have the following details:
            | firstname       | Maria      |
            | lastname        | Williams   |
            | totalprice      | 350        |
            | depositpaid     | false      |
            | checkin         | 2023-04-01 |
            | checkout        | 2023-04-05 |
            | additionalneeds | WiFi       |

    @delete-booking
    Scenario: Delete a booking
        When I create a new booking with the following details:
            | firstname       | David      |
            | lastname        | Brown      |
            | totalprice      | 400        |
            | depositpaid     | true       |
            | checkin         | 2023-05-01 |
            | checkout        | 2023-05-05 |
            | additionalneeds | Spa access |
        And I use the last created booking ID
        And I delete booking {int}
        Then the API response status should be 201
        When I request booking details for ID {int}
        Then the API response status should be 404
