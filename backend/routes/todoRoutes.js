const express = require("express");

const Todo = require("../models/Todo");

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const router = express.Router();


// GET TODOS
router.get(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const todos = await Todo.find({
        userId: req.userId
      });

      res.json(todos);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);


// ADD TODO
router.post(
  "/",
  authMiddleware,
  async (req, res) => {

    try {

      const todo = new Todo({

        text: req.body.text,

        date: req.body.date,

        time: req.body.time,

        userId: req.userId
      });

      const savedTodo = await todo.save();

      res.status(201).json(savedTodo);

    } catch (error) {

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// UPDATE TODO
router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const updatedTodo =
        await Todo.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.userId
          },
          {
            text: req.body.text,
            date: req.body.date,
            time: req.body.time
          },
          { new: true }
        );

      res.json(updatedTodo);

    } catch (error) {

      res.status(400).json({
        message: error.message
      });
    }
  }
);


// DELETE TODO
router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {

    try {

      await Todo.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
      });

      res.json({
        message: "Todo deleted"
      });

    } catch (error) {

      res.status(500).json({
        message: error.message
      });
    }
  }
);

module.exports = router;