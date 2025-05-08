const express = require("express");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const Todo = require("../models/Todo");

// @route       GET api/todos
// @desc        Get all todos
// @access      Public
router.get("/", async (req, res) => {
	try {
		const todos = await Todo.find().sort({
			date: -1,
		});
		res.json(todos);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// @route       POST api/todos
// @desc        Add new Todo
// @access      Public
router.post(
	"/",
	check("title", "Title is required").not().isEmpty(),
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { title, description, priority, user } = req.body;
		try {
			const newTodo = new Todo({
				user,
				title,
				description,
				priority,
				status: "pending" // Default status
			});
			const todo = await newTodo.save();
			res.json(todo);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

// @route       PUT api/todos/:id
// @desc        Update Todo
// @access      Public
router.put("/:id", async (req, res) => {
	const { title, description, priority, status } = req.body;
	// Build todo object
	const todoFields = {};
	if (title) todoFields.title = title;
	if (description) todoFields.description = description;
	if (priority) todoFields.priority = priority;
	if (status) todoFields.status = status;
	
	try {
		let todo = await Todo.findById(req.params.id);
		if (!todo) {
			return res.status(404).json({ msg: "Todo not found" });
		}
		
		todo = await Todo.findByIdAndUpdate(
			req.params.id,
			{
				$set: todoFields,
			},
			{ new: true }
		);
		res.json(todo);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// @route       PUT api/todos/:id/toggle
// @desc        Toggle Todo status (pending/done)
// @access      Public
router.put("/:id/toggle", async (req, res) => {
	try {
		let todo = await Todo.findById(req.params.id);
		if (!todo) {
			return res.status(404).json({ msg: "Todo not found" });
		}
		
		// Toggle status
		const newStatus = todo.status === "pending" ? "done" : "pending";
		
		todo = await Todo.findByIdAndUpdate(
			req.params.id,
			{
				$set: { status: newStatus },
			},
			{ new: true }
		);
		res.json(todo);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// @route       Delete api/todos/:id
// @desc        Delete Todo
// @access      Public
router.delete("/:id", async (req, res) => {
	try {
		let todo = await Todo.findById(req.params.id);
		if (!todo) {
			return res.status(404).json({ msg: "Todo not found" });
		}
		
		await Todo.findByIdAndRemove(req.params.id);
		res.json({ msg: "Todo removed" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
