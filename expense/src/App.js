import React, { lazy, Suspense,useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import {
  WalletOutlined,
  BarChartOutlined,
  SettingOutlined,
  BankFilled
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { fetchCategories } from "./DataAcess/DataAccess";
import './App.css';

const { Content } = Layout;

// Lazy-loaded components
const ExpenseScreen = lazy(() => import("./Expense/ExpenseScreen"));
const IncomeScreen = lazy(() => import("./Income/IncomeScreen"));
const SummaryScreen = lazy(() => import("./Summary/SummaryScreen"));
const Setting = lazy(() => import("./Settings/SettingScreen"));
const BalanceSheet = lazy(() => import("./Banking/BalanceSheet"));

const App = () => {
  const location = useLocation();
  const currentKey = location.pathname;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const categoryData = await fetchCategories();
      setCategories(categoryData);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoriesChange = (updatedCategories) => {
    setCategories(updatedCategories);
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
            <Route path="/" element={<ExpenseScreen categoriesCollection={categories}/>} />
             <Route path="/summary" element={<SummaryScreen categoriesCollection={categories} />} />
             <Route path="/settings" element={<Setting categoriesCollection={categories}  onCategoriesChange={handleCategoriesChange} />} />
             <Route path="/income" element={<IncomeScreen />} />
             <Route path="/bankings" element={<BalanceSheet />} />
          </Routes>
        </Suspense>
      </Content>
      <Menu
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
 
</Menu>
    </Layout>
  );
};

const MainApp = () => (
  <Router>
    <App />
  </Router>
);

export default MainApp;
