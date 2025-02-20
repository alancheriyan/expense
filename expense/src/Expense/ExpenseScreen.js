import React, { useState, useEffect } from 'react';
import { Button, Typography, Row, Col, Spin } from 'antd';
import { ExpenseList } from './ExpenseList';
import { fetchExpenses } from '../DataAcess/DataAccess';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToCategories } from '../redux/expensecategorySlice';
import { subscribeToPaymentTypes } from '../redux/paymentTypeSlice';

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

  const formatDateShort = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Get previous and next day labels
  const prevDate = new Date(currentDate);
  prevDate.setDate(currentDate.getDate() - 1);

  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);

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
  }, [currentDate, paymentTypes]);

  useEffect(() => {
    const unsubscribeCategories = dispatch(subscribeToCategories());
    const unsubscribePayments = dispatch(subscribeToPaymentTypes());

    return () => {
      unsubscribeCategories();
      unsubscribePayments();
    };
  }, [dispatch]);

  return (
    <div className="container">
      <Row align="middle" justify="space-between" className="header-row">
        <Col>
          <Button
            type="primary"
            shape="round"
            onClick={() => setCurrentDate(prevDate)}
            className="nav-button"
            style={{fontSize:"10px"}}
          >
            {`< ${formatDateShort(prevDate)}`}
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
            shape="round"
            onClick={() => setCurrentDate(nextDate)}
            className="nav-button"
            style={{fontSize:"10px"}}
          >
            {`${formatDateShort(nextDate)} >`}
          </Button>
        </Col>
      </Row>

      <div className="expense-list" style={{ marginTop: '36px', width: '95%' }}>
        {paymentTypesLoading || categoriesLoading || loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
            }}
          >
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
