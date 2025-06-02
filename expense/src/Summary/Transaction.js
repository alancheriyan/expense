import React, {useState, useEffect } from "react";
import { Typography, Button, Card, Row, Col, Spin,Menu,Dropdown,Empty   } from "antd";
import {  ArrowLeftOutlined,DownOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { subscribeToIncomeTypes } from '../redux/incomeTypeSlice';
import { subscribeToexpenseDetails } from '../redux/expenseSlice';
import { subscribeToincomeDetails } from '../redux/incomeSlice';
import { subscribeToCategories } from '../redux/expensecategorySlice';
import { subscribeToPaymentTypes } from '../redux/paymentTypeSlice';
import {getFormatedDate} from "../DataAcess/CommonMethod"
import "./homestyle.css";

const { Text } = Typography;

const Transaction = ({ handleClick,displayBackButton=true,count=0 }) => {
  const dispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const { data: paymentTypes = [], loading: paymentTypesLoading } = useSelector((state) => state.paymentTypes);
  const { data: expenseCategory = [], loading: expenseCategoryLoading } = useSelector((state) => state.categories);
  const { data: expenses = [], loading: expenseLoading } = useSelector((state) => state.expenses);
  const { data: incomes = [], loading: incomesLoading } = useSelector((state) => state.incomes);
  const { data: incomeTypes = [], loading: incomeTypesLoading } = useSelector((state) => state.incomeTypes);

  useEffect(() => {
    const unsubscribePaymentsPromise = dispatch(subscribeToPaymentTypes());
    const unsubscribeToCategoriesPromise = dispatch(subscribeToCategories());
    const unsubscribeToExpensePromise = dispatch(subscribeToexpenseDetails());
    const unsubscribeToIncomePromise = dispatch(subscribeToincomeDetails());
    const unsubscribeToIncomeTypePromise = dispatch(subscribeToIncomeTypes());

    return () => {
      unsubscribePaymentsPromise();
      unsubscribeToCategoriesPromise();
      unsubscribeToExpensePromise();
      unsubscribeToIncomePromise();
      unsubscribeToIncomeTypePromise();
    };
  }, [dispatch]);


  const CreateTransactionInfo = () => {

    let transactions = [
      ...expenses
        .filter((expense) => expense.amount?.trim() && new Date(expense.date).getMonth() + 1 === selectedMonth)
        .map((expense) => ({
          ...expense,
          type: "expense",
          categoryName: expenseCategory.find((cat) => cat.id === expense.categoryId)?.name || "Unknown",
          paymentTypeName: paymentTypes.find((pay) => pay.id === expense.paymentTypeId)?.name || "Unknown",
        })),
      ...incomes
        .filter((income) => income.amount?.trim() && new Date(income.date).getMonth() + 1 === selectedMonth)
        .map((income) => ({
        ...income,
        type: "income",
        incomeTypeName: incomeTypes.find((inc) => inc.id === income.categoryId)?.name || "Unknown",
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (transactions.length === 0) {
        return <Empty />;
      }
      else  if (count > 0) {
        transactions = transactions.slice(0, count);
      }

    return transactions.map((transaction) => (
      <Card key={transaction.id} style={{ marginBottom: 10,borderRadius: 10, boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <span className="delius-heading">{transaction.type === "expense" ? transaction.categoryName : transaction.incomeTypeName}</span>
            <br />
            {transaction.type === "expense" && <Text type="secondary" className="delius-regular">{transaction.paymentTypeName}</Text>}
          </Col>
          <Col style={{ textAlign: "right" }}>
            <Text style={{ color: transaction.type === "expense" ? "rgb(156, 57, 57)" : "rgb(13, 74, 13)" ,paddingRight:"15px"}} className="delius-heading">
              ${transaction.amount}
            </Text>
            <br />
            <Text type="secondary" className="delius-regular">{getFormatedDate(transaction.date)}</Text>
          </Col>
        </Row>
      </Card>
    ));
  };

  const handleMenuClick = (e) => {
    setSelectedMonth(parseInt(e.key) + 1);
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const menu = (
    <Menu onClick={handleMenuClick}>
      {months.map((month, index) => (
        <Menu.Item key={index}>{month}</Menu.Item>
      ))}
    </Menu>
  );

  if (paymentTypesLoading || expenseCategoryLoading || expenseLoading || incomeTypesLoading || incomesLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: displayBackButton? "70px":"0px" }}>
     {displayBackButton && (<div ><Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleClick}
        style={{ position: "absolute", top: 35, left: 30, fontSize: "18px" }}
      />
      <div className="statistics-container" style={{marginTop:"65px"}}>
       <span className="statistics-title"></span>
        <Dropdown overlay={menu} trigger={["click"]}>
          <span className="statistics-dropdown">
            {months[selectedMonth - 1]} <DownOutlined className="dropdown-icon" />
          </span>
        </Dropdown>
      </div>
      </div>)} 
       
      <div style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto", padding: "0 16px" }}>{CreateTransactionInfo()}</div>
    
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Transaction;
