Feature: Search for logs

Scenario: List Logs
  Given the list page is accessed
  Then a 200 response will be received
  And success is true
  And count returns 10 records

Scenario: List Logs with a limit of 5
  Given the list page is accessed with limit of 5
  Then a 200 response will be received
  And success is true
  And count returns 5 records