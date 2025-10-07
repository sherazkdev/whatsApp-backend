
# WhatsApp Clone Backend

A fully completed WhatsApp real time chat app like api, socket.io etc. its specialy designed for personal project.


## Authors

- [@sherazkdev](https://www.github.com/sherazkdev)


## API Reference

#### Get all items

```http
  GET /api/v1/messages
```

| Route | Method     | Auth required                | Description              |
| :-------- | :------- | :------------------------- | -------------            |
| `/api/v1/messages/send-message` | `POST` |         ✅                 | send message
| `/api/v1/messages/update-message` | `PATCH` | ✅ | update any message                          |
| `/api/v1/messages/delete-message` | `PATCH` | ✅ | delete any message          |
| `/api/v1/messages/delete-user-messages` | `PATCH` | ✅ | these option for clear all chat                      |
| `/api/v1/messages/forward-message` | `POST` | ✅ |  forward message to anyone                        |
| `/api/v1/messages/send-status-message` | `POST` | ✅ | send status for example reply by status                         |
| `/api/v1/messages/send-group-message` | `POST` | ✅ | group sending message                    |
| `/api/v1/messages/update-message-seen-status` | `POST` | ✅ |    message seen status                     |

#### Get item

```http
  GET /api/items/${id}
```
| Route                                  | Method  | Auth Required | Description                              |
| :------------------------------------- | :------ | :------------ | :--------------------------------------- |
| `/api/v1/user/signIn-send-otp`         | `POST`  | ❌             | Send OTP for login                       |
| `/api/v1/user/signUp-send-otp`         | `POST`  | ❌             | Send OTP for registration                |
| `/api/v1/user/resend-otp`              | `PATCH` | ❌             | Resend OTP (after 60 mins)               |
| `/api/v1/user/sign-in`                 | `PATCH` | ❌             | Login existing user                      |
| `/api/v1/user/sign-up`                 | `PATCH` | ❌             | Register new user                        |
| `/api/v1/user/update-user-avatar`      | `PATCH` | ✅             | Update user avatar                       |
| `/api/v1/user/update-user-coverImage`  | `PATCH` | ✅             | Update user cover image                  |
| `/api/v1/user/update-user-about`       | `PATCH` | ✅             | Update user "about" info                 |
| `/api/v1/user/update-user-fullname`    | `PATCH` | ✅             | Update user full name                    |
| `/api/v1/user/block-user-toggle`       | `PATCH` | ✅             | Block or unblock a user                  |
| `/api/v1/user/sign-out-user`           | `PATCH` | ✅             | Logout current user                      |
| `/api/v1/user/search-user`             | `GET`   | ✅             | Search user by username, phone, or email |
| `/api/v1/user/user-profile/:profileId` | `GET`   | ✅             | Get profile by user ID                   |
| `/api/v1/user/all-users`               | `GET`   | ✅             | Get all users (admin access)             |
| `/api/v1/user/all-blocked-users`       | `GET`   | ✅             | Get all blocked users                    |



## Deployment

To deploy this project run

```bash
    npm install
    npm run dev || npm start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI`

`ACCESS_TOKEN_SECRET`

`ACCESS_TOKEN_EXPIRY`

`REFRESH_TOKEN_SECRET`

`REFRESH_TOKEN_EXPIRY`

`MAIL_EMAIL`

`MAIL_APP_PASSWORD`

`MAIL_APP_PASSWORD`



## Demo

Insert gif or link to demo

*