import React, { useEffect, useState } from "react";
import { Row, Col, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { subscribeToexpenseDetails } from '../redux/expenseSlice';
import { subscribeToincomeDetails } from '../redux/incomeSlice';
import { subscribeToSavingDetails } from '../redux/savingMasterSlice';

const { Title } = Typography;

const TransactionTotal = ({currentDate}) => {
  const dispatch = useDispatch();

  const { data: expenses = [] } = useSelector((state) => state.expenses);
  const { data: incomes = [] } = useSelector((state) => state.incomes);
  const { data: savings = [] } = useSelector((state) => state.savings);

  const [totalAmount, setTotalAmount] = useState(0);
  const [incomeTotalAmount, setIncomeTotalAmount] = useState(0);
  const [savingsTotal, setsavingsTotal] = useState(0);

  const [isSavingTotalVisible, setIsSavingTotalVisible] = useState(false);
  const [isExpenseTotalVisible, setIsExpenseTotalVisible] = useState(false);
  const [isIncomeTotalVisible, setIsIncomeTotalVisible] = useState(false);


  useEffect(() => {
    dispatch(subscribeToexpenseDetails());
    dispatch(subscribeToincomeDetails());
    dispatch(subscribeToSavingDetails());
  }, [dispatch]);

  useEffect(() => {
    const total = expenses
      .filter(expense => new Date(expense.date).toDateString() === new Date(currentDate).toDateString())
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  
    const incomeTotal = incomes
      .filter(income => new Date(income.date).toDateString() === new Date(currentDate).toDateString())
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  
    const savingTotal = savings
      .filter(saving => new Date(saving.date).toDateString() === new Date(currentDate).toDateString())
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  
    setTotalAmount(total);
    setIncomeTotalAmount(incomeTotal);
    setsavingsTotal(savingTotal);
  
    setIsExpenseTotalVisible(total > 0);
    setIsIncomeTotalVisible(incomeTotal > 0);
    setIsSavingTotalVisible(savingTotal > 0);
  }, [expenses, incomes, savings, currentDate]);
  

  return (
    <Row style={{ marginTop: "10px" }} justify="center">
      <Col>
        <Row gutter={[16, 8]} justify="center">
          {isExpenseTotalVisible?(<Col>
            <Title level={5} className="delius-regular" style={{ fontSize: 12, color: "rgb(156, 57, 57)" }}>
              Expense: {totalAmount.toFixed(2)} CAD
            </Title>
          </Col>):""}

          {isIncomeTotalVisible?( <Col>
            <Title level={5} className="delius-regular" style={{ fontSize: 12, color: "rgb(13, 74, 13)" }}>
              Income: {incomeTotalAmount.toFixed(2)} CAD
            </Title>
          </Col>):""}
          {isSavingTotalVisible?( <Col>
            <Title level={5} className="delius-regular" style={{ fontSize: 12, color: "rgb(0, 23, 110)" }}>
              Saving: {savingsTotal.toFixed(2)} CAD
            </Title>
          </Col>):""}
        </Row>
      </Col>
    </Row>
  );
};

export default TransactionTotal;
