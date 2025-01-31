# auth api
-sign up
-sign in
-logout
-login

# profile api

-/profile/view
-/profile/edit


# connection api
- request/send/:status/:toUserId    (here status can only be ignored and interested)

# request api
-/request/send/:status/:toUserId
(status= ignored, interested)

-/request/review/:status/:toUserId
(status= accept, reject)


# userRouter

-GET /user/requests/recieved
-GET /user/connections
-GET /user/feed-gets you profile for other users on platform
-