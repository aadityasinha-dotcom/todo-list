import axios from "axios";
const BASE_URL = !import.meta.env.PROD ? "http://localhost:8080/api/todos" : "/api/todos";

// Get all todos
export const getAllTodos = async () => {
    try {
        const { data } = await axios.get(BASE_URL);
        return data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to fetch todos";
    }
};

// Create a new todo
export const createTodo = async (todoData) => {
    try {
        const { data } = await axios.post(BASE_URL, todoData);
        return data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to create todo";
    }
};

// Update a todo
export const updateTodo = async (id, todoData) => {
    try {
        const { data } = await axios.put(`${BASE_URL}/${id}`, todoData);
        return data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to update todo";
    }
};

// Toggle todo status
export const toggleTodoStatus = async (id) => {
    try {
        const { data } = await axios.put(`${BASE_URL}/${id}/toggle`);
        return data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to toggle todo status";
    }
};

// Delete a todo
export const deleteTodo = async (id) => {
    try {
        const { data } = await axios.delete(`${BASE_URL}/${id}`);
        return data;
    } catch (error) {
        throw error.response?.data?.msg || "Failed to delete todo";
    }
};
