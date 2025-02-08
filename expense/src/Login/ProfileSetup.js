import React, { useState, useEffect, Suspense } from "react";
import { Steps, Button, Typography, Spin, Row, Col } from "antd";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../DataAcess/firebase"; // Import firebase setup (update with correct paths)
import { dbSetting } from "../DataAcess/dbSetting";

const { Title, Text } = Typography;
const { Step } = Steps;

const ExpenseCategory = React.lazy(() => import("../Settings/ExpenseCategory"));
const PaymentType = React.lazy(() => import("../Settings/PaymentType"));
const IncomeType = React.lazy(() => import("../Settings/IncomeType"));

const ProfileSetup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null); // State to store user info
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    // Check if 'setupProfile' is already true in localStorage
    const isProfileSetup = localStorage.getItem("setupProfile") === "true";
    if (isProfileSetup) {
      navigate("/"); // Redirect to home if profile setup is already done
    } else {
      // Fetch user info here if needed
      const userInfo = localStorage.getItem("user"); // Get the user from localStorage
      if (userInfo) {
        setUser(JSON.parse(userInfo)); // Parse the user info properly
      }
    }
  }, [navigate]);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    // Update Firestore to set 'setupProfile' to true
    if (user) {
      try {
        await setDoc(doc(db, dbSetting.UserTable, user.uid), {
          setupProfile: true,
        }, { merge: true });
        
        // Save to localStorage to prevent redirection on page refresh
        localStorage.setItem("setupProfile", "true");
        
        // Redirect to the home page
        navigate("/");
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <Suspense fallback={<Spin size="large" />}>
              <ExpenseCategory />
            </Suspense>
            <p className="delius-regular">You can skip this now and modify it later.</p>
            <p className="delius-regular">eg: Utilities, Entertainment, Rent</p>
          </div>
        );
      case 1:
        return (
          <div>
            <Suspense fallback={<Spin size="large" />}>
              <PaymentType />
            </Suspense>
            <p className="delius-regular">You can skip this now and modify it later.</p>
            <p className="delius-regular">eg: Debit Card, Line of Credit, Cash</p>
          </div>
        );
      case 2:
        return (
          <div>
            <Suspense fallback={<Spin size="large" />}>
              <IncomeType />
            </Suspense>
            <p className="delius-regular">You can skip this now and modify it later.</p>
            <p className="delius-regular">eg: Pay cheque</p>
          </div>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <div style={{ width: "80%", margin: "auto", padding: "20px" }}>
      <Title level={2} className="delius-swash-caps-regular">Profile Setup</Title>

      <Steps current={currentStep}>
        <Step title="Select Categories" className="delius-regular"/>
        <Step title="Choose Payment Types" className="delius-regular"/>
        <Step title="Set Income Type" className="delius-regular"/>
      </Steps>

      <div style={{ marginTop: 20 }}>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <div>{renderStepContent(currentStep)}</div>
        )}
      </div>

      <Row justify="space-between" style={{ marginTop: 20 }}>
        <Col>
          <Button onClick={handlePrevious} disabled={currentStep === 0} className="delius-regular">
            Previous
          </Button>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={currentStep === 2 ? handleFinish : handleNext} // If last step, call handleFinish
            disabled={isLoading }
            className="delius-regular"
          >
            {currentStep === 2 ? "Finish" : "Next"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileSetup;
