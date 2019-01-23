# feedback

## Topics

### /topics/:topic/articles
- GET status:200 takes sort_by query which alters the column by which data is sorted **(desc order by default)**
- GET status:400 when user provides a malformed non-int limit/p queries. E.g. '?p=hiya', '?limit=hiya'
- POST status:201 and a newly added article for that topic: created_by ----> username
- POST status:404 adding an article to a non-existent topic:

## Articles

### /articles

- GET status:200 takes sort_by query which alters the column by which data is sorted **(desc order by default)**
- GET status:200 takes a order query which changes the sort to ascending: sort_order ----> order
- GET status:400 when client uses malformed non-int limit/p queries (E.g. '?p=hiya', '?limit=hiya')

### /articles/:article_id

- GET status:200 responds with a single article object \* un-nest your article object from the array that knex returns :)
- GET status:400 URL contains an invalid article_id
- PATCH status:400 if given an invalid inc_votes
- PATCH status:200s no body responds with an unmodified article
- DELETE status:404 when given a non-existent article_id
- DELETE responds with 400 on invalid article_id

### /articles/:article_id/comments

- Could include 'article_id' in the output for each comment
- Sorts: stick to first feedback comment changing: order_by --> sort_by & sort_order --> order for consistency
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
