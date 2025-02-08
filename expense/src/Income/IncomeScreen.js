import React, { useState, useEffect } from 'react';
import { Button, Typography, Row, Col, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToIncomeTypes } from '../redux/incomeTypeSlice'; // Import the action to fetch income types
import { IncomeList } from './IncomeList';
import { fetchIncome } from '../DataAcess/DataAccess';

const { Title } = Typography;

const IncomeScreen = () => {
  const dispatch = useDispatch();
  
  // Use useSelector to get incomeType data from Redux store
  const { data: incomeTypes = [], loading: incomeTypesLoading } = useSelector(
    (state) => state.incomeTypes
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const fetchIncomeData = async (date) => {
    setLoading(true);
    try {
      const expensesData = await fetchIncome(date);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error Income load:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch income data on current date change
  useEffect(() => {
    const unsubscribe = dispatch(subscribeToIncomeTypes()); // Subscribe to real-time updates
    return () => unsubscribe(); // Cleanup on unmount
    
  }, [dispatch]); // Dependency on currentDate and dispatch

  useEffect(() => {
    fetchIncomeData(new Date(currentDate));
  }, [currentDate]);

  return (
    <div className="container">
      <Row align="middle" justify="space-between" className="header-row">
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
          <Title level={3} className="date-display delius-swash-caps-regular">
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

      <div className="expense-list" style={{ marginTop: '36px', width: '95%' }}>
        {incomeTypesLoading || loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spin size="large" />
          </div>
        ) : (
          <IncomeList
            dataList={expenses}
            currentDate={currentDate}
            categories={incomeTypes} // Pass incomeTypes to IncomeList
          />
        )}
      </div>
    </div>
  );
};

export default IncomeScreen;
