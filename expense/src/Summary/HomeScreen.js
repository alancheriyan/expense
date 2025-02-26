import React, { useEffect, useState } from "react";
import { Spin, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./homestyle.css";

const HomeScreen = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(""); // Default will be set in useEffect

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

    // Set default month to the current month
    const currentMonthIndex = new Date().getMonth();
    setSelectedMonth(months[currentMonthIndex]);

    setIsLoading(false);
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : "";
  };

  const handleMenuClick = (e) => {
    setSelectedMonth(months[e.key]); // Update the selected month dynamically
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {months.map((month, index) => (
        <Menu.Item key={index}>{month}</Menu.Item>
      ))}
    </Menu>
  );

  if (isLoading) {
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="profile-container">
        <div className="profile-text">
          <span className="greeting">Hello!</span>
          <span className="name">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="statistics-container">
        <span className="statistics-title">Statistics</span>
        <Dropdown overlay={menu} trigger={["click"]}>
          <span className="statistics-dropdown">
            {selectedMonth} <DownOutlined className="dropdown-icon" />
          </span>
        </Dropdown>
      </div>
    </div>
  );
};

export default HomeScreen;
