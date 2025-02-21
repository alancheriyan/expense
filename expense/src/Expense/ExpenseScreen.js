import React, { useState, useEffect } from 'react';
import {  Spin } from 'antd';
import { ExpenseList } from './ExpenseList';
import { fetchExpenses } from '../DataAcess/DataAccess';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToCategories } from '../redux/expensecategorySlice';
import { subscribeToPaymentTypes } from '../redux/paymentTypeSlice';

const ExpenseScreen = ({currentDate}) => {
  const dispatch = useDispatch();

  const { data: categories = [], loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );
  const { data: paymentTypes = [], loading: paymentTypesLoading } = useSelector(
    (state) => state.paymentTypes
  );

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

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

      <div className="expense-list" style={{ marginTop: '10px' }}>
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
