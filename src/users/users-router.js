const path = require("path");
const express = require("express");
const xss = require("xss");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
  id: user.id,
  fullname: xss(user.fullname),
  username: xss(user.username),
  nickname: xss(user.nickname),
  date_created: user.date_created
});

usersRouter
  .route("/")
  .get((req, res, next) => {
    const knextInstance = req.app.get("db");
    UsersService.getAllUsers(knextInstance)
      .then(users => {
        res.json(users.map(serializeUser));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { fullname, username, nickname, password } = req.body;
    const newUser = { fullname, username };

    for (const [key, value] of Object.entries(newUser)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    newUser.nickname = nickname;
    newUser.password = password;

    UsersService.insertUser(req.app.get("db"), newUser)
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serialUser(user));
      })
      .catch(next);
  });

usersRouter
  .router("/:user_id")
  .all((req, res, next) => {
    UsersService.getById(req.app.get("db"), req.params.user_id)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            error: { message: `User doesn't exist` }
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { fullname, username, password, nickname } = req.body;
    const userToUpdate = { fullname, username, password, nickname };

    const numberOfValues = Object.values(userToupdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'fullname', 'username', 'password' or 'nickname'`
        }
      });
    UsersService.updateUser(req.app.get("db"), req.params.user_id, userToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });
