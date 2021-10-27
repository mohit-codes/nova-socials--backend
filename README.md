# Twitter-Clone

Backend repository for social media web app using ExpressJS connected to MongoDB through Mongoose.
- password encrypted.
- Authentication with JWT token.

## List of API endpoints

### Users

- POST /users/login - Takes username and password as a parameter and returns JWT.
- POST /users/signup - Providing name, username, password, and email would add a new user into the database.
- POST /users/follow - Take targetId(followed user) and sourceId(following user).
- GET /users/:userId - fetch single user info.
- GET /users/feed/:userId - fetch user feed.
- GET /users/followers/:userId - fetch user followers (_id name username). 
- GET /users/following/:userId - fetch user following (_id name username). 
- GET /users/get-user-posts/:userId - fetch user posts.
- PUT /users/update/:userId - update user profile info.
- GET /users/notifications/:userId - fetch list of user notifications.
  
### Posts

- POST /posts/new - Takes author(userId), content to create new post.
- POST /posts/like - Takes postId and userId.
- POST /posts/unlike - Takes postId and userId.
- DELETE /posts/:postId - delete post.
- GET /posts/likes/:postId - fetch list of users liked the post.
- GET /posts/comments/:posts - fetch comments of posts.
