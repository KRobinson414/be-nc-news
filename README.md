# feedback

### /articles/:article_id
??? - PATCH status:400 if given an invalid inc_votes
??? - PATCH status:200s no body responds with an unmodified article

### /articles/:article_id/comments
- GET responds with 404 for a non-existent article_id
- GET responds with 400 for an invalid article_id
- POST requests: created_by ---> username different in our tests
- POST responds with a 404 when given a non-existent article id
- POST responds with a 400 when given an invalid article id

### /articles/:article_id/comments/:comment_id

- PATCH responds with a 400 if given an invalid inc_votes
- PATCH with no body responds with an unmodified comment and status **200**
- DELETE responds with 404 if given a non-existent article_id
- DELETE responds with 404 if given a non-existent comment_id
- invalid methods respond with 405
