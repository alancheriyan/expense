import React, {useEffect } from "react";
import { Typography, Card, Row, Col, Spin,Empty } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { subscribeToIncomeTypes } from '../redux/incomeTypeSlice';
import { subscribeToexpenseDetails } from '../redux/expenseSlice';
import { subscribeToincomeDetails } from '../redux/incomeSlice';
import { subscribeToCategories } from '../redux/expensecategorySlice';
import { subscribeToPaymentTypes } from '../redux/paymentTypeSlice';
import { subscribeToSavings } from '../redux/savingSlice';
import { subscribeToSavingDetails } from '../redux/savingMasterSlice';

import {EditOutlined} from "@ant-design/icons"
import "../Summary/homestyle.css";

const { Text } = Typography;

const Transaction = ({currentDate,onEditTransaction  }) => {
  const dispatch = useDispatch();

  const { data: paymentTypes = [], loading: paymentTypesLoading } = useSelector((state) => state.paymentTypes);
  const { data: expenseCategory = [], loading: expenseCategoryLoading } = useSelector((state) => state.categories);
  const { data: expenses = [], loading: expenseLoading } = useSelector((state) => state.expenses);
  const { data: incomes = [], loading: incomesLoading } = useSelector((state) => state.incomes);
  const { data: incomeTypes = [], loading: incomeTypesLoading } = useSelector((state) => state.incomeTypes);
  const { data: savingTypes = [], loading: savingTypesLoading } = useSelector((state) => state.savingPlanType);
  const { data: savings = [], loading: savingsLoading } = useSelector((state) => state.savings);

  useEffect(() => {
    dispatch(subscribeToPaymentTypes());
    dispatch(subscribeToCategories());
    dispatch(subscribeToexpenseDetails());
    dispatch(subscribeToincomeDetails());
    dispatch(subscribeToIncomeTypes());
    dispatch(subscribeToSavings());
    dispatch(subscribeToSavingDetails());
  
  }, [dispatch]);


  const CreateTransactionInfo = () => {
    let transactions = [
      ...expenses
        .filter((expense) => expense.amount?.trim() && new Date(expense.date).toDateString() === new Date(currentDate).toDateString())
        .map((expense) => ({
          ...expense,
          type: "expense",
          categoryName: expenseCategory.find((cat) => cat.id === expense.categoryId)?.name || "Unknown",
          paymentTypeName: paymentTypes.find((pay) => pay.id === expense.paymentTypeId)?.name || "Unknown",
        })),
      ...incomes
        .filter((income) => income.amount?.trim() && new Date(income.date).toDateString() === new Date(currentDate).toDateString())
        .map((income) => ({
        ...income,
        type: "income",
        incomeTypeName: incomeTypes.find((inc) => inc.id === income.categoryId)?.name || "Unknown",
      })),
      ...savings
        .filter((saving) => saving.amount?.trim() && new Date(saving.date).toDateString() === new Date(currentDate).toDateString())
        .map((saving) => ({
        ...saving,
        type: "saving",
        incomeTypeName: savingTypes.find((sav) => sav.id === saving.savingTypeId)?.name || "Unknown",
      })),
    ].sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

    if (transactions.length === 0) {
        return <Empty />;
      }

      return transactions.map((transaction) => (
        <Card
          key={transaction.id}
          style={{
            marginBottom: 10,
            borderRadius: 10,
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Row justify="space-between" align="middle" gutter={[8, 8]}>
            <Col xs={12} sm={16}>
              <span className="delius-heading">
                {transaction.type === "expense"
                  ? transaction.categoryName
                  : transaction.incomeTypeName}
              </span>
              <br />
              {transaction.type === "expense" && (
                <Text type="secondary" className="delius-regular">
                  {transaction.paymentTypeName}
                </Text>
              )}
            </Col>
      
            <Col
              xs={10}
              sm={7}
              style={{ textAlign: "right" }}
            >
              <Text
                style={{
                  color:
                    transaction.type === "expense"
                      ? "rgb(156, 57, 57)"
                      : "rgb(13, 74, 13)",
                  paddingRight: "10px",
                }}
                className="delius-heading"
              >
                ${Number(transaction.amount || 0).toFixed(2)}
              </Text>
            </Col>
      
            <Col xs={2} sm={1} style={{ textAlign: "right" }}>
              <EditOutlined
                onClick={() => onEditTransaction(transaction)}
                style={{ cursor: "pointer" }}
              />
            </Col>
          </Row>
        </Card>
      ));
      
  };


  if (paymentTypesLoading || expenseCategoryLoading || expenseLoading || incomeTypesLoading || incomesLoading || savingsLoading || savingTypesLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div >

      <div >{CreateTransactionInfo()}</div>
    
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Transaction;
