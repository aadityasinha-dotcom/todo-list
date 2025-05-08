import React from 'react';
import TodoList from '../components/TodoList';
import { Container } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container fluid className="p-0">
      <TodoList />
    </Container>
  );
};

export default HomePage;
