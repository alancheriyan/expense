import React, { lazy, Suspense,useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation ,Navigate} from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import {
  WalletOutlined,
  BarChartOutlined,
  SettingOutlined,
  BankFilled
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { fetchBanking,fetchPaymentType} from "./DataAcess/DataAccess";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./DataAcess/firebase";
import './App.css';

const { Content } = Layout;

// Lazy-loaded components
const ExpenseScreen = lazy(() => import("./Expense/ExpenseScreen"));
const IncomeScreen = lazy(() => import("./Income/IncomeScreen"));
const SummaryScreen = lazy(() => import("./Summary/SummaryScreen"));
const Setting = lazy(() => import("./Settings/SettingScreen"));
const BalanceSheet = lazy(() => import("./Banking/BalanceSheet"));

const SignUpPage =lazy(() => import("./Login/SignUpPage"));
const LoginPage =lazy(() => import("./Login/LoginPage"));

const App = () => {
  const location = useLocation();
  const currentKey = location.pathname;
  const [categories, setCategories] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [incomeTypes, setIncomeTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bankingData, setBankingData] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const loaBankingData = async () => {
    setLoading(true);
    try {
      const bankingData = await fetchBanking();
      setBankingData(bankingData);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentType = async () => {
    setLoading(true);
    try {
      const paymentTypeData = await fetchPaymentType();
      setPaymentTypes(paymentTypeData);
    } catch (error) {
      console.error('Error loading Payment Type:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        localStorage.setItem("userId", currentUser.uid);
        setUserId(currentUser.uid);
     //   loadCategories();
        loaBankingData();
        loadPaymentType();
     //   loadIncomeType();
    //backupAllTables();
    //updateAllTables();
      } else {
        localStorage.removeItem("userId");
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCategoriesChange = (updatedCategories) => {
    setCategories(updatedCategories);
  };

  const handleBankingDataChange = (updatedBankingData) => {
    setBankingData(updatedBankingData);
  };

  const handlePaymentTypeChange = (updatedPaymentTypes) => {
    setPaymentTypes(updatedPaymentTypes);
  };

  const handleIncomeTypeChange = (updatedIncomeTypes) => {
    setIncomeTypes(updatedIncomeTypes);
  };

  if(loading){
    return( <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" />
              </div>)
  }
  return ( 
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Content style={{ padding: "16px", flex: 1 }}>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "20px" }}><Spin size="large" /></div>}>
          <Routes>
            {!userId ? (
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<ExpenseScreen categoriesCollection={categories} paymentTypeCollection={paymentTypes}/>} />
                <Route path="/summary" element={<SummaryScreen categoriesCollection={categories} />} />
                <Route path="/settings" element={<Setting categoriesCollection={categories}  onCategoriesChange={handleCategoriesChange} 
                paymentTypeCollection={paymentTypes} onPaymentTypeChange={handlePaymentTypeChange}  
                incomeTypeCollection={incomeTypes} onIncomeTypeChange={handleIncomeTypeChange}/>} />
                <Route path="/income" element={<IncomeScreen incomeType={incomeTypes}/>} />
                <Route path="/bankings" element={<BalanceSheet  data={bankingData}  onBankingDataChange={handleBankingDataChange} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </Suspense>
      </Content>

     {userId && ( <Menu
  theme="light"
  mode="horizontal"
  selectedKeys={[currentKey]}
  style={{
    position: "fixed",
    bottom: "10px",
    width: "100%",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    display: "flex",
    justifyContent: "space-around",
    boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)",
  }}
>
  <Menu.Item
    key="/"
    className="menu-item"
    style={{
      textAlign: "center",
      padding: "8px 16px",
    }}
  >
    <Link to="/">
    <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <WalletOutlined style={{ fontSize: "20px" }} />
        Expense
      </span>
    </Link>
  </Menu.Item>
  <Menu.Item
    key="/income"
    className="menu-item"
    style={{
      textAlign: "center",
      padding: "8px 16px",
    }}
  >
    <Link to="/income">
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <WalletOutlined style={{ fontSize: "20px" }} />
        Income
      </span>
    </Link>
  </Menu.Item>
  <Menu.Item
    key="/summary"
    className="menu-item"
    style={{
      textAlign: "center",
      padding: "8px 16px",
    }}
  >
    <Link to="/summary">
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BarChartOutlined style={{ fontSize: "20px" }} />
        Summary
      </span>
    </Link>
  </Menu.Item>


  <Menu.Item
    key="/bankings"
    className="menu-item"
    style={{
      textAlign: "center",
      padding: "8px 16px",
    }}
  >
    <Link to="/bankings">
    <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BankFilled style={{ fontSize: "20px" }} />
        Banking
      </span>
    </Link>
  </Menu.Item>

  <Menu.Item
    key="/settings"
    className="menu-item"
    style={{
      textAlign: "center",
      padding: "8px 16px",
    }}
  >
    <Link to="/settings">
    <span style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <SettingOutlined style={{ fontSize: "20px" }} />
        Settings
      </span>
    </Link>
  </Menu.Item>
 
</Menu>)

     } 
     
    </Layout>
  );
};

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;
