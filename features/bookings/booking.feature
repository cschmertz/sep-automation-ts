# features/api/booking.feature
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
        When I create a new booking with valid details
        Then the API response status should be 200
        And the booking ID and details should be returned
