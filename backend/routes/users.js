const express = require("express");
const jwt = require('jsonwebtoken');
const Router = express.Router();
const mysqlConnection = require("../connection");
const config = require('../config.json');

//Get All Users
Router.get("/", (req, res) => {
    mysqlConnection.query("SELECT * from users", (err, rows, fields) => {
        if (!err) {
            res.status(200).send(rows);
        }
        else {
            console.log(err);
        }
    });
});

//Get One User
Router.get("/:userId", (req, res) => {
    const id = req.params.userId;
    mysqlConnection.query(`SELECT * from users WHERE userId = ${mysqlConnection.escape(id)}`, (err, rows, fields) => {
        if (!err) {
            res.status(200).send(rows);
        }
        else {
            console.log(err);
        }
    });
});

//Delete One User
Router.delete("/delete/:userId", (req, res) => {
    const id = req.params.userId;
    mysqlConnection.query(`DELETE from users where userId = ${mysqlConnection.escape(id)};`, (err, rows, fields) => {
        if (!err) {
            res.status(200).send(rows);
        }
        else {
            console.log(err);
        }
    });
});

//Password
Router.put("/:userId/update-password", (req, response) => {
    const userId = req.params.userId;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    mysqlConnection.query(`SELECT * from users WHERE userId = ${mysqlConnection.escape(userId)}`, (err, res) => {
        const user = res[0];
        if (password === user.password) {
            mysqlConnection.query(`UPDATE users SET password = ? Where userId = ?`, [newPassword, userId], (err, resinfo) => {
                response.send({ error: false, message: 'Your password has been updated successfully.'});
            }
        );
        } else {
            response.send({ error: true, message: 'Your current password is wrong!'});
        }
    });
 });

//Edit User
Router.put("/edit/:userId", (req, res) => {
    const user = req.body;
    const id = req.params.userId;
    mysqlConnection.query(`UPDATE users SET ? Where userId = ${mysqlConnection.escape(id)}`, user, (err, rows, fields) => {
        if (!err) {
            res.status(200).send(rows);
        }
        else {
            console.log(err);
        }
    });
});

//Authenticate User
Router.post("/auth", (req, res) => {
    const user = req.body;
    let response = res;
    mysqlConnection.query(`SELECT * from users WHERE username = ${mysqlConnection.escape(user.username)}`, user, (err, res) => {
        if (!err) {
            if (res.length < 1) {
                response.send(400, 'Wrong username or password');
            } else {
                let pw = res[0].password;
                if (user.password === pw) {
                    const token = jwt.sign({ sub: res[0].userId }, config.secret);
                    response.send({
                        ...res[0],
                        token
                    });
                } else {
                    response.send(400, 'Wrong username or password');
                }
            }
        }
        else {
            response.send(400, 'Wrong username or password');
            console.log(err);
        }
    });
});

//Register User
Router.post("/register", (req, res) => {
    const user = req.body;
    let response = res;
    mysqlConnection.query(`SELECT * from users WHERE username = ${mysqlConnection.escape(user.username)}`, user, (err, res) => {
        if (!err) {
            if (res.length < 1) {
                mysqlConnection.query('INSERT INTO users SET ?', user, (err, res) => {
                    if (!err) {
                        response.status(200).send({ message: 'User successfully registered' })
                    }
                    else {
                        response.status(400).send({ message: 'User is not registered' });
                        throw err;
                    }
                });
            }
            else {
                response.status(400).send({ message: 'User already exists, try different Username' })
            }
        }
        else {
            console.log(err);
            response.status(400).send({ message: 'User already exists, try different Username' })
        }
    });
});

module.exports = Router;