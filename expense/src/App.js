import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import {
  WalletOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";

const { Content } = Layout;

// Lazy-loaded components
const ExpenseScreen = lazy(() => import("./ExpenseScreen"));
const IncomeScreen = lazy(() => import("./IncomeScreen"));
const SummaryScreen = lazy(() => import("./Summary/SummaryScreen"));
//const Setting = lazy(() => import("./Setting"));

const App = () => {
  const location = useLocation();
  const currentKey = location.pathname;

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Content style={{ padding: "16px", flex: 1 }}>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "20px" }}><Spin size="large" /></div>}>
          <Routes>
            <Route path="/" element={<ExpenseScreen />} />
             <Route path="/summary" element={<SummaryScreen />} />
           {/* <Route path="/setting" element={<Setting />} /> */}
            <Route path="/income" element={<IncomeScreen />} />
          </Routes>
        </Suspense>
      </Content>
      <Menu
        theme="light"
        mode="horizontal"
        selectedKeys={[currentKey]}
        style={{
          position: "fixed",
          bottom: 0,
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
          icon={<WalletOutlined />}
          style={{
            borderRadius: "50%",
            textAlign: "center",
            padding: "8px 16px",
          }}
        >
          <Link to="/">Expense</Link>
        </Menu.Item>
        <Menu.Item
          key="/income"
          icon={<WalletOutlined />}
          style={{
            borderRadius: "50%",
            textAlign: "center",
            padding: "8px 16px",
          }}
        >
          <Link to="/income">Income</Link>
        </Menu.Item>
        <Menu.Item
          key="/summary"
          icon={<BarChartOutlined />}
          style={{
            borderRadius: "50%",
            textAlign: "center",
            padding: "8px 16px",
          }}
        >
          <Link to="/summary">Summary</Link>
        </Menu.Item>
        <Menu.Item
          key="/setting"
          icon={<SettingOutlined />}
          style={{
            borderRadius: "50%",
            textAlign: "center",
            padding: "8px 16px",
          }}
        >
          <Link to="/setting">Setting</Link>
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
