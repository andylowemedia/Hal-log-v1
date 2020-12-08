Feature: Add to logs

Scenario: Missing Required SourceID
  Given a log body has been created without sourceId
  When a POST request is sent
  Then 400 response is received
  And message says missing sourceId

Scenario: Missing Required Url
  Given a log body has been created without url
  When a POST request is sent
  Then 400 response is received
  And message says missing url

Scenario: Missing Required Message
  Given a log body has been created without message
  When a POST request is sent
  Then 400 response is received
  And message says missing message

Scenario: Missing Required StatusId
  Given a log body has been created without statusId
  When a POST request is sent
  Then 400 response is received
  And message says missing statusId

Scenario: Missing Required Date
  Given a log body has been created without date
  When a POST request is sent
  Then 400 response is received
  And message says missing date

Scenario: Saved Article Log successfully
  Given a log body has been created
  When a POST request is sent
  Then 201 response is received
  And a matching record appears in the MySQL db
  And a matching record appears in the Elasticsearch index
