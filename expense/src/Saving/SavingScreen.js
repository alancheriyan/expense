import React, { useState, useEffect } from 'react';
import {  Spin } from 'antd';
import { SaveList } from './SaveList';
import { fetchSavings } from '../DataAcess/DataAccess';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToSavings } from '../redux/savingSlice';

const SavingScreen = ({currentDate}) => {
  const dispatch = useDispatch();

  const { data: savingType = [], loading: savingTypeLoading } = useSelector(
    (state) => state.savingPlanType
  );


  //const [currentDate, setCurrentDate] = useState(new Date());
  const [savings, setSavings] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchSavingData = async (date) => {
    setLoading(true);
    try {
      const savingData = await fetchSavings(date);
      setSavings(savingData);
    } catch (error) {
      console.error('Error expense load:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavingData(new Date(currentDate));
  }, [currentDate]);

  useEffect(() => {
    const unsubscribesavings = dispatch(subscribeToSavings());
    return () => {
      unsubscribesavings();

    };
  }, [dispatch]);

  return (
    <div className="container">

      <div className="expense-list" style={{ marginTop: '10px' }}>
        { savingTypeLoading || loading ? (
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
          <SaveList
            dataList={savings}
            currentDate={currentDate}
            savingType={savingType}
          />
        )}
      </div>
    </div>
  );
};

export default SavingScreen;
