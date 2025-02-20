import React, { lazy, Suspense,useState,useEffect } from "react";
import { Routes, Route, Link, useLocation ,Navigate,useNavigate} from "react-router-dom";
import { Layout, Menu, Spin } from "antd";
import {
  WalletOutlined,
  BarChartOutlined,
  SettingOutlined,
  BankFilled
} from "@ant-design/icons";
import "antd/dist/reset.css";
import { fetchBanking} from "./DataAcess/DataAccess";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./DataAcess/firebase";
import packageJson from '../package.json';
import { handleLogout } from "./DataAcess/CommonMethod";
import EmailVerificationModal from "./Components/EmailVerificationModal";
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
  const navigate = useNavigate();
  const location = useLocation();
  const currentKey = location.pathname;
  const [loading, setLoading] = useState(false);
  const [bankingData, setBankingData] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [showModal, setShowModal] = useState(false);

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



  useEffect(() => {
    const storedVersion = localStorage.getItem("appVersion");
    const currentVersion = packageJson.version;
    if(storedVersion){
      if (storedVersion !== currentVersion){
        handleLogout(navigate);
      }
    }
    else{
      localStorage.setItem("appVersion", currentVersion);
    }
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        localStorage.setItem("userId", currentUser.uid);
        setUserId(currentUser.uid);
        loaBankingData();
        if (!currentUser.emailVerified) {
          setShowModal(true);
        }
        

    //backupAllTables();
    //updateAllTables();
      } else {
        localStorage.removeItem("userId");
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);


  const handleBankingDataChange = (updatedBankingData) => {
    setBankingData(updatedBankingData);
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
                <Route path="/" element={<ExpenseScreen />} />
                <Route path="/summary" element={<SummaryScreen  />} />
                <Route path="/settings" element={<Setting />} />
                <Route path="/income" element={<IncomeScreen />} />
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
     {userId && <EmailVerificationModal open={showModal} onClose={() => setShowModal(false)} />}
     
    </Layout>
  );
};



export default App;
