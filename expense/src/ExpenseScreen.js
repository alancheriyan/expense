import React, { useState } from 'react';
import { Button, Typography, Row, Col } from 'antd';


const { Title } = Typography;

export const ExpenseScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Format date to "Jan 16, 2025"
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Handle date increment
  const incrementDate = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() + 1);
      return newDate;
    });
  };

  // Handle date decrement
  const decrementDate = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(prevDate.getDate() - 1);
      return newDate;
    });
  };

  return (
    <div className="container">
      <Row align="middle" justify="center" className="header-row">
        <Col>
          <Button
            type="primary"
            shape="circle"
            onClick={decrementDate}
            className="nav-button"
          >
            {'<<'}
          </Button>
        </Col>
        <Col>
          <Title level={3} className="date-display">
            {formatDate(currentDate)}
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            shape="circle"
            onClick={incrementDate}
            className="nav-button"
          >
            {'>>'}
          </Button>
        </Col>
      </Row>
    </div>
  );
};
