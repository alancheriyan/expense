import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider } from "antd";
import App from "./App";
import { MessageProvider } from "./Components/MessageContext";

const MainApp = () => {
  const [theme, setTheme] = useState("#65aa6b");

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo && storedUserInfo.theme) {
      setTheme(storedUserInfo.theme);
    }
    
  }, []);

  return (
    <Router>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: theme, 
            borderRadius: 2,
          },
        }}
      >
        <MessageProvider>
          <App />
        </MessageProvider>
      </ConfigProvider>
    </Router>
  );
};

export default MainApp;
