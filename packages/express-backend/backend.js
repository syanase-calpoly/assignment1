// backend.js
//username: 21smyanase
//password: 1o3THhyIrNMBfJ3L
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userServices from "./services/user-service.js";


dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

const app = express();
const port = 8000;
app.use(cors());



  
  // const findUserByName = (name) => {
  //   return users["users_list"].filter(
  //     (user) => user["name"] === name
  //   );
  // };

  // const findUserByNameAndJob = (name, job) => {
  //   return users["users_list"].filter(
  //     (user) => user["name"] === name && user["job"] === job
  //   );
  // }; 

  // const addUser = (user) => {
  //   user.id = generateRandomId();
  //   users["users_list"].push(user);
  //   return user;
  // };

  // const findUserById = (id) =>
  //   users["users_list"].find((user) => user["id"] === id);
  
  // const deleteUser = (user) => {
  //   const index = users["users_list"].indexOf(user);
  
  //   if (index > -1) {
  //     users["users_list"].splice(index, 1); 
  //   }
  // }

  const generateRandomId = () => {
    return Math.random().toString().slice(2,8);
  };


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  
  userServices.getUsers(name, job)
    .then((result) => {
      res.send({ users_list : result });
    })
    .catch((error) => {
      res.status(500).send("Error getting users");
      console.error(error);
    });
 
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; 
    userServices.findUserById(id)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
    });
  });

  app.get("/users/:name/:job", (req, res) => {
    const name = req.params["name"]; 
    const job = req.params["job"]; 

    userServices.getUsers(name, job)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
    });

  });



  
  
  app.post("/users", (req, res) => {
    const userToAdd = req.body;
    userServices.addUser(userToAdd)
    .then(result => {
      res.status(201).send(result);
    })
    .catch(error => {
      console.error(error);
    });
  });

  

  app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; 
    userServices.deleteUserById(id)
    .then(result => {
      if (result == undefined) { 
        res.status(404).send("Resource not found.");
      } else {
        res.send(result);
      }
    })
    .catch(error => {
      console.error(error);
    });
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});