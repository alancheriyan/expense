import React, { useState, useEffect } from 'react';
import {  Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToIncomeTypes } from '../redux/incomeTypeSlice';
import { IncomeList } from './IncomeList';
import { fetchIncome } from '../DataAcess/DataAccess';


const IncomeScreen = ({currentDate}) => {
  const dispatch = useDispatch();
  
  const { data: incomeTypes = [], loading: incomeTypesLoading } = useSelector(
    (state) => state.incomeTypes
  );

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
 
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

  useEffect(() => {
    const unsubscribe = dispatch(subscribeToIncomeTypes());
    return () => unsubscribe(); 
    
  }, [dispatch]); 

  useEffect(() => {
    fetchIncomeData(new Date(currentDate));
  }, [currentDate]);

  return (
    <div>
      <div className="expense-list" style={{ marginTop: '10px'}}>
        {incomeTypesLoading || loading ? (
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
