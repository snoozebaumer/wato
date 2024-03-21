# wato-user
User microservice for ["What are the Odds"](https://github.com/snoozebaumer/wato).

See the gateway [wato-gateway](https://github.com/snoozebaumer/wato-gateway) for complete system setup information.

## Project setup
1. Run the following command to install all dependencies:
```
npm install
```
2. Set up a mongoDB (either local or online) and remember connection string, as well as user / password.
3. Copy the `.env.example` file and rename it to `.env`. Then fill in the required db environment variables.

## Run the project
Run the following command to start the server:
```
npm run start
```

## API Documentation
| #   | Endpoint                  | Method | Description         | Request Body          | Response Body       |
| --- | ------------------------- | ------ | ------------------- | --------------------- | ------------------- |
| 1   | `/user`                   | POST   | Create User          | `name` (string, required) | `id` (string)       |
| 2   | `/user/:id`<br>param: `id`(string, required) | GET    | Get User by ID       | -                     | `id` (string)<br>`name` (string) |

