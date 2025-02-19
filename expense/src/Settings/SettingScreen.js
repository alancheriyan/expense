import React, { useState, Suspense } from "react";
import { Typography, Button, Card, Divider, Row, Col, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { handleLogout } from "../DataAcess/CommonMethod";

// Lazy loading the components
const ExpenseCategory = React.lazy(() => import("./ExpenseCategory"));
const PaymentType = React.lazy(() => import("./PaymentType"));
const IncomeType = React.lazy(() => import("./IncomeType"));
const Account =React.lazy(() => import("./Accounts"));
const { Title } = Typography;

const SettingScreen = ({ categoriesCollection, onCategoriesChange, paymentTypeCollection, onPaymentTypeChange, incomeTypeCollection, onIncomeTypeChange }) => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(null);


  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Back Button (visible when a component is selected) */}
      {activeComponent && (
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => setActiveComponent(null)} 
          style={{ position: "absolute", top: 35, left: 30, fontSize: "18px" }}
        />
      )}

      {/* Show the title only when settings screen is visible */}
      {!activeComponent && (
        <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }} className="delius-swash-caps-regular">
          Settings
        </Title>
      )}

      {/* Show the settings card when no component is selected */}
      {!activeComponent && (
        <Card>
          <Row>
          <Col span={24} onClick={() => setActiveComponent("Accounts")} style={{ cursor: "pointer" }}>
              <span className="delius-regular">Accounts</span>
              <ArrowRightOutlined style={{ float: "right", fontSize: "18px" }} />
            </Col>
            <Divider />
            <Col span={24} onClick={() => setActiveComponent("ExpenseCategory")} style={{ cursor: "pointer" }}>
              <span className="delius-regular">Expense Category</span>
              <ArrowRightOutlined style={{ float: "right", fontSize: "18px" }} />
            </Col>
            <Divider />
            <Col span={24} onClick={() => setActiveComponent("PaymentType")} style={{ cursor: "pointer" }}>
              <span className="delius-regular">Payment Type</span>
              <ArrowRightOutlined style={{ float: "right", fontSize: "18px" }} />
            </Col>
            <Divider />
            <Col span={24} onClick={() => setActiveComponent("IncomeType")} style={{ cursor: "pointer" }}>
              <span className="delius-regular">Income Type</span>
              <ArrowRightOutlined style={{ float: "right", fontSize: "18px" }} />
            </Col>
          </Row>
        </Card>
      )}

      {/* Show selected component and hide settings */}
      {activeComponent && (
        <Suspense fallback={<Spin tip="Loading..." />}>
          {activeComponent === "Accounts" && (
            <div style={{ marginTop: "50px" }}>
              <Account />
            </div>
          )}
          {activeComponent === "ExpenseCategory" && (
            <div style={{ marginTop: "50px" }}>
              <ExpenseCategory data={categoriesCollection} onCategoriesChange={onCategoriesChange} />
            </div>
          )}
          {activeComponent === "PaymentType" && (
            <div style={{ marginTop: "50px" }}>
              <PaymentType data={paymentTypeCollection} onPaymentTypeChange={onPaymentTypeChange} />
            </div>
          )}
          {activeComponent === "IncomeType" && (
            <div style={{ marginTop: "50px" }}>
              <IncomeType dataset={incomeTypeCollection} onIncomeTypeChange={onIncomeTypeChange} />
            </div>
          )}
        </Suspense>
      )}

      {/* Logout Button only appears if no component is selected */}
      {!activeComponent && (
        <Button 
          type="primary" 
          danger 
          style={{ width: "100%", padding: "10px", fontSize: "16px", marginTop: "20px" }} 
          onClick={() => handleLogout(navigate)}
          className="delius-regular"
        >
          Logout
        </Button>
      )}
    </div>
  );
};

export default SettingScreen;
