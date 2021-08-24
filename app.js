// const express = require('express');
// const app = express();
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const path = require("path");
// const cors = require("cors");
// app.use(cors(corsOptions));
// var corsOptions = {
//   origin: "*",
//   corsOptions: 200
// };

// mongoose
//   .connect(
//     "mongodb+srv://Arbaaz:zJi7Y9oK0y8FZ3GL@cluster0.simoo.mongodb.net/demoApp?retryWrites=true&w=majority",
//     { useUnifiedTopology: true, useNewUrlParser: true }
//   )
//   .then(() => {
//     console.log("Connected to database!");
//   })
//   .catch(() => {
//     console.log("Connection failed!");
//   });




// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use("/images", express.static(path.join("backend/images/")));

// require("./Routes")(app);

// // SERVER START ROUTE
// app.use((req, res, next) => {
//   res.status(200).json('Welcome To Bw Server Started.');
// });
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
// app.use(express());
// // app.use(bodyParser.urlencoded({ limit: '150mb', extended: true }))
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });


// module.exports = app;