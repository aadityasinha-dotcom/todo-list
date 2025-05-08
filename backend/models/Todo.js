const mongoose = require("mongoose");
const TodoSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	status: {
		type: String,
		default: "pending",
		enum: ["pending", "done"]
	},
	priority: {
		type: String,
		default: "medium",
		enum: ["low", "medium", "high"]
	},
	date: {
		type: Date,
		default: Date.now,
	},
});
module.exports = mongoose.model("todo", TodoSchema);
