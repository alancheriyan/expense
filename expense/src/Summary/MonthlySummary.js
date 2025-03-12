import React, { useState, useEffect ,lazy,Suspense} from "react";
import { Card, Row, Col,Statistic,Spin,Menu,Dropdown  } from "antd";
import {  collection, getDocs ,Timestamp,where,query} from "firebase/firestore";
import {db} from "../DataAcess/firebase"; 
import { dbSetting } from "../DataAcess/dbSetting";
import { DownOutlined } from "@ant-design/icons";
import "./homestyle.css";


const CategoryBased = lazy(() => import("./CategoryBased"));
const SavingPlanBased = lazy(() => import("./SavingCategorybased"));

const MonthlySummary = () => {
   const [user, setUser] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenses,setExpenses]=useState([]);
  const [savings,setSavings]=useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

      const expensesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setExpenses(expensesData);
  
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

  const fetchSaving = async (month) => {
    try {
      const startOfMonth = new Date(new Date().getFullYear(), month - 1, 1); // Start of month
      const endOfMonth = new Date(new Date().getFullYear(), month, 0, 23, 59, 59, 999); // End of month
  
      const startTimestamp = Timestamp.fromDate(startOfMonth);
      const endTimestamp = Timestamp.fromDate(endOfMonth);
      const expensesCollection = collection(db, dbSetting.SavingMasterTable);
  
      // Use query to combine where conditions
      const expensesQuery = query(
        expensesCollection    
      );
  
      const snapshot = await getDocs(expensesQuery);

      const expensesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSavings(expensesData);

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
    fetchIncomes(selectedMonth);
  }, [selectedMonth]);

  const handleMenuClick = (e) => {
    setSelectedMonth(parseInt(e.key) + 1); // Convert to 1-based month
  };
  

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
      setIsLoading(true);
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  
      if (storedUserInfo) {
        setUser({
          firstName: capitalizeFirstLetter(storedUserInfo.firstName),
          lastName: capitalizeFirstLetter(storedUserInfo.lastName),
        });
      }
      fetchSaving(selectedMonth);
      setIsLoading(false);

    }, []);

    const capitalizeFirstLetter = (string) => {
      return string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : "";
    };

    const menu = (
      <Menu onClick={handleMenuClick}>
      {months.map((month, index) => (
        <Menu.Item key={index}>{month}</Menu.Item>
      ))}
    </Menu>
    
      );

  return (
    <div style={{ padding: "20px" }}>
      <div className="profile-container">
        <div className="profile-text">
          <span className="greeting">Hello!</span>
          <span className="name">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
      </div>

      <div className="statistics-container">
        <span className="statistics-title">Statistics</span>
        <Dropdown overlay={menu} trigger={["click"]}>
          <span className="statistics-dropdown">
          {months[selectedMonth-1]} <DownOutlined className="dropdown-icon" />
          </span>
        </Dropdown>
      </div>
<Row gutter={[12, 12]} >
  <Col span={12} >
  <Card
        style={{
            marginTop: "10px",
            textAlign: "center",
        }}
         className="statistics-card"
        >
        <Statistic
            value={totalExpense}
            precision={2} // Show 2 decimal places
            valueStyle={{ fontSize: "18px", fontWeight: "bold", color: "#9c3939" }}
            prefix="$"
            suffix=""
            groupSeparator=","
            loading={totalExpense === undefined}
            title="Expense"
        />
        </Card>
  </Col>
  <Col span={12}>
  <Card
        style={{
            marginTop: "10px",
            textAlign: "center",
        }}
        className="statistics-card"
        >
        <Statistic
            value={totalIncome}
            precision={2} // Show 2 decimal places
            valueStyle={{ fontSize: "18px", fontWeight: "bold", color: "#0d4a0d" }}
            prefix="$"
            suffix=""
            groupSeparator=","
            loading={totalIncome === undefined}
            title="Income"
        />
        </Card>
  </Col>
</Row>

<div className="statistics-container">
 <span className="statistics-title">Top Spend</span>
 </div>

<div>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "20px" }}><Spin size="large" /></div>}>
          <CategoryBased data={expenses}  totalExpense={totalExpense}/>
        </Suspense>
        </div>
    

<div className="statistics-container">
 <span className="statistics-title">My Savings Plan</span>
 </div>

<div>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "20px" }}><Spin size="large" /></div>}>
          <SavingPlanBased data={savings}/>
        </Suspense>
        </div>

        </div>
       
  );
};

export default MonthlySummary;
