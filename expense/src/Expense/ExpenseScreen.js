import React, { useState, useEffect } from 'react';
import {  Spin } from 'antd';
import { ExpenseList } from './ExpenseList';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToCategories } from '../redux/expensecategorySlice';
import { subscribeToPaymentTypes } from '../redux/paymentTypeSlice';
import { subscribeToexpenseDetails } from '../redux/expenseSlice';


const ExpenseScreen = ({ currentDate }) => {
  const dispatch = useDispatch();
  const { data: categories = [], loading: categoriesLoading } = useSelector(state => state.categories);
  const { data: paymentTypes = [], loading: paymentTypesLoading } = useSelector(state => state.paymentTypes);
  const { data: expensesAllList = [], loading: expensesLoading } = useSelector(state => state.expenses);
  const [expenses, setExpenses] = useState([]);
  const [isLoading,setIsLoading]=useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    const filteredExpenses = expensesAllList.filter(expense => new Date(expense.date).toDateString() === new Date(currentDate).toDateString());
    setExpenses(filteredExpenses);
    setIsLoading(false);
  }, [currentDate, expensesAllList,categories,paymentTypes]);

  useEffect(() => {
    const unsubscribeCategories = dispatch(subscribeToCategories());
    const unsubscribePayments = dispatch(subscribeToPaymentTypes());
    const unsubscribeExpenses = dispatch(subscribeToexpenseDetails());

    return () => {
      unsubscribeCategories();
      unsubscribePayments();
      unsubscribeExpenses();
    };
  }, [dispatch]);

  return (
    <div className="container">
      <div className="expense-list" style={{ marginTop: "10px" }}>
        {paymentTypesLoading || categoriesLoading || expensesLoading || isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <Spin size="large" />
          </div>
        ) : (
          <ExpenseList dataList={expenses} categories={categories} paymentTypes={paymentTypes} currentDate={currentDate}/>
        )}
      </div>
    </div>
  );
};

export default ExpenseScreen;

