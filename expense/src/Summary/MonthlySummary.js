import React, { useState, useEffect ,lazy,Suspense} from "react";
import { Card, Row, Col,Statistic,Spin,Menu,Dropdown,Button  } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToexpenseDetails } from "../redux/expenseSlice";
import { subscribeToincomeDetails } from "../redux/incomeSlice";
import { subscribeToSavingDetails } from "../redux/savingMasterSlice";
import "./homestyle.css";


const CategoryBased = lazy(() => import("./CategoryBased"));
const CategoryBasedIncome = lazy(() => import("./CategoryBasedIncome"));
const SavingPlanBased = lazy(() => import("./SavingCategorybased"));
const Transaction = lazy(() => import("./Transaction"));

const MonthlySummary = () => {
   const [user, setUser] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [expenses,setExpenses]=useState([]);
  const [incomes,setIncomes]=useState([]);
  const [isTransactionVisible,setIsTransactionVisible]=useState(false);

  const getTotalExpense = async () => {
    try {
      const total = expenses.reduce((sum, expense) => {
        const amount = parseFloat(expense.amount) || 0;
        return sum + amount;
      }, 0);
      setTotalExpense(total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const getTotalIncome = async () => {
    try {
      const total = incomes.reduce((sum, income) => {
        const amount = parseFloat(income.amount) || 0;
        return sum + amount;
      }, 0);
      setTotalIncome(total);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

const updateExpense = (month) => {
  try {
    const currentYear = new Date().getFullYear();

    const expense = fullExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      return (
        expenseDate.getFullYear() === currentYear &&
        expenseDate.getMonth() === month - 1 // JS months are 0-indexed
      );
    });

    setExpenses(expense);
  } catch (error) {
    console.error("Error filtering expenses:", error);
  }
};

const updateIncome = (month) => {
  try {
    const currentYear = new Date().getFullYear();

    const incomes = fullIncome.filter((income) => {
      const incomeDate = new Date(income.date);

      return (
        incomeDate.getFullYear() === currentYear &&
        incomeDate.getMonth() === month - 1 // JS months are 0-indexed
      );
    });

    setIncomes(incomes);
  } catch (error) {
    console.error("Error filtering expenses:", error);
  }
};

  
    const dispatch = useDispatch();
      
    const { data: fullExpenses = [], loading: categoriesLoading } = useSelector(
      (state) => state.expenses
    );
     const { data: fullIncome = [], loading: IncomeLoading } = useSelector(
      (state) => state.incomes
    );

    const { data: savings = [], loading: savingLoading } = useSelector(
      (state) => state.savings
    );
  
  
    useEffect(() => {
      const unsubscribe = dispatch(subscribeToexpenseDetails());
      const unsubscribeIncome = dispatch(subscribeToincomeDetails());
      const unsubscribeSaving = dispatch(subscribeToSavingDetails());
 
      return () => {
        unsubscribe();
        unsubscribeIncome();
        unsubscribeSaving();
      };
    }, [dispatch]);

    useEffect(()=>{
        updateExpense(selectedMonth);
        updateIncome(selectedMonth)
    },[fullExpenses,selectedMonth,fullIncome])

    useEffect(() => {
  getTotalExpense();
  getTotalIncome();
}, [expenses,selectedMonth]); // Recalculate when Redux state changes

  const handleMenuClick = (e) => {
    setSelectedMonth(parseInt(e.key) + 1); // Convert to 1-based month
  };

  const handleViewTransaction=()=>{
    setIsTransactionVisible(!isTransactionVisible);
  }
  

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  
      if (storedUserInfo) {
        setUser({
          firstName: capitalizeFirstLetter(storedUserInfo.firstName),
          lastName: capitalizeFirstLetter(storedUserInfo.lastName),
        });
      }

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

      if(isTransactionVisible){
        return(<div>  <Suspense fallback={<div style={{ textAlign: "center", padding: "20px" }}><Spin size="large" /></div>}>
          <Transaction handleClick={handleViewTransaction} />
        </Suspense></div>)
      }

  return (
    <div 
    style={{ maxHeight: "calc(100vh - 60px)", overflowY: "auto",paddingBottom:  "70px",paddingTop:"20px",paddingLeft:"20px",paddingRight:"20px" }}
    >
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
 <span className="statistics-title">Top Earnings</span>
 
 </div>

<div>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "20px" }}><Spin size="large" /></div>}>
          <CategoryBasedIncome data={incomes}  totalExpense={totalExpense}/>
        </Suspense>
</div>

        <div className="statistics-container">
 <span className="statistics-title">Recent Transactions</span>
 <span className="statistics-dropdown">
   <Button type="link" onClick={handleViewTransaction} >
              <span className="delius-regular" style={{color:"#666"}}>View All</span>
            </Button>
            
  </span>

 </div>

 <div>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "20px" }}><Spin size="large" /></div>}>
        <Transaction displayBackButton={false} count={5}/>
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
