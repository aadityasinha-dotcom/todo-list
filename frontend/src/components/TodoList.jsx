import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col, ListGroup, Badge, Modal } from "react-bootstrap";
import { getAllTodos, createTodo, updateTodo, toggleTodoStatus, deleteTodo } from "../services/todoService";
import toast from "react-hot-toast";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getAllTodos();
      setTodos(data);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const newTodo = await createTodo(formData);
      setTodos([newTodo, ...todos]);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
      });
      setShowAddModal(false);
      toast.success("Todo added successfully!");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTodo = await updateTodo(currentTodo._id, formData);
      setTodos(todos.map((todo) => (todo._id === currentTodo._id ? updatedTodo : todo)));
      setShowEditModal(false);
      toast.success("Todo updated successfully!");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleEditClick = (todo) => {
    setCurrentTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
    });
    setShowEditModal(true);
  };

  const handleToggleStatus = async (id) => {
    try {
      const updatedTodo = await toggleTodoStatus(id);
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      toast.success("Status toggled successfully!");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error(error);
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add New Todo
          </Button>
        </Col>
      </Row>

      {todos.length === 0 ? (
        <div className="text-center py-5">
          <h4>No todos found. Add a new one to get started!</h4>
        </div>
      ) : (
        <ListGroup>
          {todos.map((todo) => (
            <ListGroup.Item
              key={todo._id}
              className="d-flex justify-content-between align-items-center"
              variant={todo.status === "done" ? "light" : ""}
            >
              <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  checked={todo.status === "done"}
                  onChange={() => handleToggleStatus(todo._id)}
                  className="me-3"
                />
                <div>
                  <div className={todo.status === "done" ? "text-decoration-line-through" : ""}>
                    <strong>{todo.title}</strong>
                  </div>
                  {todo.description && <div className="text-muted small">{todo.description}</div>}
                  <Badge bg={getPriorityBadgeVariant(todo.priority)} className="me-2">
                    {todo.priority}
                  </Badge>
                  <Badge bg={todo.status === "done" ? "success" : "secondary"}>
                    {todo.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditClick(todo)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Add Todo Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTodo}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter todo title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description (optional)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Todo
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Todo Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter todo title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description (optional)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select name="priority" value={formData.priority} onChange={handleInputChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status || (currentTodo?.status || "pending")}
                onChange={handleInputChange}
              >
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Todo
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TodoList;
