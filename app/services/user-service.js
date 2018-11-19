'use strict';
const { User } = require('../../domain/entities');
const Json = require('../responses/users');

module.exports = class Users {
  constructor(router) {
    this.router = router;
  }

  expose() {
    this.findUsersList();
    this.createUser();
    this.findUser();
    this.updateUser();
    this.deleteUser();
  }

  findUsersList() {
    this.router.get('/users', async (req, res) => {
      try {
        const users = await User.findAll().map(user => Json.format(user))
        res.status(200).json({data: users})
      }
      catch (err) {
        res.status(500).json(err)
      }
    });
  }

  createUser() {
    this.router.post('/users', async (req, res) => {
      try {
        const user = await User.create(req.body)
        res.status(200).json({data: Json.format(user)})
      }
      catch (err) {
        res.status(500).json(err)
      }
    });
  }

  findUser() {
    this.router.get('/users/:id', async (req, res) => {
      try {
        const user = await User.find({ where: { id: req.params.id } })
        if (user) {
          res.status(200).json({data: Json.format(user)});
        }
        else {
          res.status(404).json({ message: 'Didn’t find anything here!' });
        }
      }
      catch (err) {
        res.status(500).json(err)
      }
    });
  }

  updateUser() {
    this.router.put('/users/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updates = req.body;
        
        const user = await User.find({ where: { id: id } })

        if (user) {
          User.update(updates, { where: { id: id } })
          res.status(200).json({
            type: 'User',
            message: 'User ' + id + ' was updated with success!'
          });
        }

        else {
          res.status(404).json({ message: 'Didn’t find anything here!' });
        }
      }
      catch (err){
        res.status(500).json(err);
      }
    });
  }

  deleteUser() {
    this.router.delete('/users/:id', async (req, res) => {
      try {
        const id = req.params.id;

        let deleted = await User.destroy({ where: { id: id } })

        if (deleted) {
          res.json({type: 'User', message: 'User ' + id + ' was deleted with success!' });
        }
        else {
          res.status(404).json({ message: 'Didn’t find anything here!' });
        }
      }
      catch (err){
        res.status(500).json(err);
      }
    });
  }

};