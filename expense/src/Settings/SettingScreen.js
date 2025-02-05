import React from "react";
import ExpenseCategory from "./ExpenseCategory";
import { Typography, Button } from "antd";
import { auth } from "../DataAcess/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const SettingScreen = ({ categoriesCollection, onCategoriesChange }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userId");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }} className="delius-swash-caps-regular">
        Settings
      </Title>

      <ExpenseCategory data={categoriesCollection} onCategoriesChange={onCategoriesChange} />

      {/* Logout Button */}
      <Button 
        type="primary" 
        danger 
        style={{  width: "100%", padding: "10px", fontSize: "16px" }} 
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default SettingScreen;
