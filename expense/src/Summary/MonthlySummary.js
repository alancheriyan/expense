import React, { useState, useEffect } from "react";
import { Select, Card, Row, Col,Statistic  } from "antd";
import {  collection, getDocs ,Timestamp,where,query} from "firebase/firestore";
import {db} from "../firebase"; 
import { dbSetting } from "../dbSetting";

const { Option } = Select;

const MonthlySummary = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const fetchExpenses = async (month) => {
    try {
      const startOfMonth = new Date(new Date().getFullYear(), month - 1, 1); // Start of month
      const endOfMonth = new Date(new Date().getFullYear(), month, 0, 23, 59, 59, 999); // End of month
  
      const startTimestamp = Timestamp.fromDate(startOfMonth);
      const endTimestamp = Timestamp.fromDate(endOfMonth);
  
      const expensesCollection = collection(db, dbSetting.ExpenseTable);
  
      // Use query to combine where conditions
      const expensesQuery = query(
        expensesCollection,
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp)
      );
  
      const snapshot = await getDocs(expensesQuery);
  
      const filteredExpenses = snapshot.docs.map((doc) => doc.data());
      const total = filteredExpenses.reduce((sum, expense) => {
        const amount = parseFloat(expense.amount) || 0;
        return sum + amount;
      }, 0);
  
      setTotalExpense(total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  
  const fetchIncomes = async (month) => {
    try {
      const startOfMonth = new Date(new Date().getFullYear(), month - 1, 1); // Start of month
      const endOfMonth = new Date(new Date().getFullYear(), month, 0, 23, 59, 59, 999); // End of month
  
      const startTimestamp = Timestamp.fromDate(startOfMonth);
      const endTimestamp = Timestamp.fromDate(endOfMonth);
  
      const incomesCollection = collection(db, dbSetting.IncomeTable);
  
      // Use query to combine where conditions
      const incomesQuery = query(
        incomesCollection,
        where("date", ">=", startTimestamp),
        where("date", "<=", endTimestamp)
      );
  
      const snapshot = await getDocs(incomesQuery);
  
      const filteredIncomes = snapshot.docs.map((doc) => doc.data());
      const total = filteredIncomes.reduce((sum, income) => {
        const amount = parseFloat(income.amount) || 0;
        return sum + amount;
      }, 0);
  
      setTotalIncome(total);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };
  

  useEffect(() => {
    fetchExpenses(selectedMonth);
    fetchIncomes(selectedMonth)
  }, [selectedMonth]);

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="space-between" align="middle">
      
        <Col>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{ width: 150 }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <Option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Card
        style={{
            marginTop: "20px",
            textAlign: "center",
        }}
        >
        <Statistic
            value={totalExpense}
            precision={2} // Show 2 decimal places
            valueStyle={{ fontSize: "24px", fontWeight: "bold", color: "#9c3939" }}
            prefix="$"
            suffix=""
            groupSeparator=","
            loading={totalExpense === undefined}
            title="Total Expense"
        />
        </Card>

        <Card
        style={{
            marginTop: "20px",
            textAlign: "center",
        }}
        >
        <Statistic
            value={totalIncome}
            precision={2} // Show 2 decimal places
            valueStyle={{ fontSize: "24px", fontWeight: "bold", color: "#0d4a0d" }}
            prefix="$"
            suffix=""
            groupSeparator=","
            loading={totalIncome === undefined}
            title="Total Income"
        />
        </Card>
    </div>
  );
};

export default MonthlySummary;
