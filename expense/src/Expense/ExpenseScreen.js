import React, { useState, useEffect } from 'react';
import { Button, Typography, Row, Col, Spin } from 'antd';
import { ExpenseList } from './ExpenseList';
import { fetchExpenses } from '../DataAcess/DataAccess';
import { useSelector, useDispatch } from 'react-redux';
import {subscribeToCategories } from '../redux/expensecategorySlice';
import {subscribeToPaymentTypes } from '../redux/paymentTypeSlice';


const { Title } = Typography;

const ExpenseScreen = () => {
  const dispatch = useDispatch();
  
  const { data: categories = [], loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );
  const { data: paymentTypes = [], loading: paymentTypesLoading } = useSelector(
    (state) => state.paymentTypes
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  
  const [loading, setLoading] = useState(false);


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

 

    const fetchExpenseData = async (date) => {
      setLoading(true);
      try {
        const expensesData = await fetchExpenses(date);
        setExpenses(expensesData);
      } catch (error) {
        console.error('Error expense load:', error);
      } finally {
        setLoading(false);
      }
    };


    useEffect(() => {
      fetchExpenseData(new Date(currentDate));
    }, [currentDate]);

    useEffect(() => {
      const unsubscribeCategories = dispatch(subscribeToCategories());
      const unsubscribePayments = dispatch(subscribeToPaymentTypes());
  
      return () => {
        unsubscribeCategories();
        unsubscribePayments(); // ✅ Properly unsubscribing
      };
    }, [dispatch]);

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
        {paymentTypesLoading || categoriesLoading || loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spin size="large" />
          </div>
        ) : (
          <ExpenseList
            dataList={expenses}
            currentDate={currentDate}
            categories={categories}
            paymentTypes={paymentTypes}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseScreen;