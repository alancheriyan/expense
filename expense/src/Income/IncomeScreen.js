import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToIncomeTypes } from '../redux/incomeTypeSlice';
import { subscribeToincomeDetails } from '../redux/incomeSlice';
import { IncomeList } from './IncomeList';

const IncomeScreen = ({ currentDate }) => {
  const dispatch = useDispatch();

  const { data: incomeTypes = [], loading: incomeTypesLoading } = useSelector(
    (state) => state.incomeTypes
  );
  const { data: incomeAllList = [], loading: incomeLoading } = useSelector(
    (state) => state.incomes
  );

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const filteredExpenses = incomeAllList.filter(
      (expense) => new Date(expense.date).toDateString() === new Date(currentDate).toDateString()
    );
    setExpenses(filteredExpenses);
  }, [currentDate, incomeAllList]);

  useEffect(() => {
    const unsubscribeIncomeTypes = dispatch(subscribeToIncomeTypes());
    const unsubscribeIncomeDetails = dispatch(subscribeToincomeDetails());
    
    return () => {
      unsubscribeIncomeTypes();
      unsubscribeIncomeDetails();
    };
  }, [dispatch]);

  return (
    <div>
      <div className="expense-list" style={{ marginTop: '10px' }}>
        {incomeTypesLoading || incomeLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spin size="large" />
          </div>
        ) : (
          <IncomeList
            dataList={expenses}
            currentDate={currentDate}
            categories={incomeTypes}
          />
        )}
      </div>
    </div>
  );
};

export default IncomeScreen;
