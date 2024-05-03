# ADR1 - General Architecture Microservices

## History
Status: accepted

last update: 2024-05-03

| Date       | Version | Description                                           |
|------------|---------|-------------------------------------------------------|
| 2024-02-06 | 1.0.0   | architecture decision was proposed                    |
| 2024-02-07 | 1.1.0   | architecture decision was accepted by WEBLAB lecturer |
| 2024-05-03 | 1.1.1   | architecture decision was documented                  |

## Context
"WATO" is a proposed web application that is used to play the game [**What are the Odds?**](https://www.wikihow.com/Play-What-Are-the-Odds). It is developed as a finals project for the course "Web Programming Lab" at HSLU. It will have to contain the following features:
- creating a game as challenger
- joining a game as challengee
- setting number range as challengee
- setting number as challengee
- setting number as challenger
- displaying result for both players

Thus we have identified two main contexts:
- User-Context
- Challenge / Game Context

We now need to define the architecture of the application.

## Decision
A microservices architecture was chosen for the application. The application contains the following parts:
- Frontend: the user interface
- Gateway: routes requests to the correct service
- User-Service: saves user data
- Game-Service: saves challenge data and handles the game logic

The two services are each connected to a separate MongoDB database.

![wato-components.png](img/wato-components.png)
## Rationale
The microservices architecture mainly was chosen to gain more experience with it, but also to clearly separate the concerns of the application. The frontend is separated from the backend, which is separated into two services. This separation allows for easier scaling of the application, as the services can be scaled independently. The gateway is used to route requests to the correct service, which allows for easier scaling and maintenance of the application. In practice, a microservice architecture would make little sense in this example: the core of the application is the game service. If it isn't running, the entire application cannot be used sensibly.
## Consequences
It is barely noticable if the user service is down. The usernames of the players won't be loaded and placeholders will be used. With a monolith architecture, either the entire application would be online or down.