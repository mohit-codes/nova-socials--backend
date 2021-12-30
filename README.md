# Nova Socials Backend

Backend repository for social media web app using ExpressJS connected to MongoDB through Mongoose.
- password encrypted.
- Authentication with JWT token.
- Instant encrypted messaging with Socket.io

## List of API endpoints

### Users

- POST /users/login - Takes username and password as a parameter and returns JWT.
- POST /users/signup - Providing name, username, password, and email would add a new user into the database.
- POST /users/follow - Take targetId(followed user) and sourceId(following user).
- POST /users/unfollow - Take targetId(followed user) and sourceId(following user).
- GET /users/:userId - fetch single user info.
- GET /users/feed/:userId - fetch user feed.
- GET /users/followers - fetch user followers.
- GET /users/following - fetch user following.
- GET /users/get-user-posts - fetch user posts.
- PUT /users/update/:userId - update user profile info.
- GET /users/notifications/:userId - fetch list of user notifications.
- GET /users/search - Search users by name or username.
- GET /users/chats/:userId - fetches user's chat recipient list.
- GET /users/get-recently-joined-users/:userId - fetches recently joined users.

### Messages (Socket listeners and emitters)  

- POST messages/get_messages - takes userId and receiverId and fetches encrypted messages.
- DELETE messages/:messageId - delete message by Id.
- POST messages/delete-chat - takes senderId and recipientId and delete all messages and remove recipient from user chats.
- "connectUser" listener - take user's name and emit array of online users to all connected users listening on event "onlineUsers"
- "startMessage" listener - take senderId and receiverEmail to add receiver to recipient list.
- "sendMessage" listener - take sender object, receiver object and message
  -  emit "newRecipient" event with message info if receiver is not present already in sender's chat list.
  -  else emit message info to receiver and sender by event "message".

### Posts

- POST /posts/new - Takes author(userId), content to create new post.
- POST /posts/like - Takes postId and userId.
- POST /posts/unlike - Takes postId and userId.
- POST /posts/comment - Takes postId, userId and comment.
- DELETE /posts/comment/:commentId - delete comment.
- GET /posts/:postId - fetch single post.
- DELETE /posts/delete/:postId - delete post.
- GET /posts/likes/:postId - fetch list of users liked the post.
- GET /posts/comments/:posts - fetch comments of posts.
- PUT /posts/update-post - Takes postId and content and updates post content.