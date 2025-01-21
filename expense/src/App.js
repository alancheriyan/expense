import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  WalletOutlined,
  BarChartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { ExpenseScreen } from "./ExpenseScreen";

const { Content } = Layout;

const Summary = () => <div>Summary Content</div>;
const Setting = () => <div>Setting Content</div>;
const Income = () => <div>Income Content</div>;

const App = () => {
  const location = useLocation();
  const currentKey = location.pathname;

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Content style={{ padding: "16px", flex: 1 }}>
        <Routes>
          <Route path="/" element={<ExpenseScreen />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/income" element={<Income />} />

        </Routes>
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
