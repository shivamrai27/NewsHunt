## MERN Stack Project: News Hunt: Advanced Backend Project
News Hunt is a sophisticated backend project designed to deliver high-performance news data through a robust API. This project focuses exclusively on backend development, incorporating advanced concepts to enhance efficiency, reliability, and scalability.
Some Features:

-   🌟 Tech stack: Postgres for Database and Prisma as ODM and Express Js as backend. Further Redis and BullMQ is used
-   🎃 API Caching: Implements caching strategies to reduce server load and improve response times, ensuring a faster and more efficient user experience.
-   👾 API Rate Limiting: Protects the API from abuse and ensures fair usage by controlling the number of requests a client can make within a specified time period.
-   🚀 Pagination: Facilitates efficient data retrieval and navigation through large datasets by breaking the content into manageable pages.
-   👌 Logging: Employs advanced logging techniques to monitor and debug the application, enhancing maintainability and performance tracking.
-   🐞 BullMQ: Ensures efficient task management and processing by using a message queue system for handling background jobs and tasks


### Setup .env file

```js
PORT=...
MONGO_DB_URI=...
JWT_SECRET=..
NODE_ENV=...
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```
