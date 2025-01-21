import React, { useState, useEffect } from 'react';
import { Button, Typography, Row, Col, Spin } from 'antd';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase'; // Adjust the import based on your firebase.js file
import { ExpenseList } from './ExpenseList';
import { dbSetting } from './dbSetting';
import "./App.css"

const { Title } = Typography;

export const ExpenseScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
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

  // Fetch expenses from Firestore
  const fetchExpenses = async (date) => {
    setLoading(true);
    try {
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const expensesQuery = query(
        collection(db, dbSetting.ExpenseTable),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay))
      );

      const querySnapshot = await getDocs(expensesQuery);

      const expensesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(new Date(currentDate));
  }, [currentDate]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const categorysQuery = query(collection(db, dbSetting.CategoryTable));

      const querySnapshot = await getDocs(categorysQuery);

      const categoryData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoryData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, []);

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
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Spin size="large" />
          </div>
        ) : (
          <ExpenseList
            dataList={expenses}
            currentDate={currentDate}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
};
