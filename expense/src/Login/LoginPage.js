import React, { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../DataAcess/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { dbSetting } from "../DataAcess/dbSetting";

const { Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve user role from Firestore (tbluser)
      const userDoc = await getDoc(doc(db, dbSetting.UserTable, user.uid));
      if (userDoc.exists()) {
        localStorage.setItem("userId", user.uid);
        navigate("/"); // Redirect to Expense
      } else {
        message.error("User role not found!");
      }
    } catch (error) {
      message.error("Invalid email or password!");
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    const email = form.getFieldValue("email"); // Get the entered email
    if (!email) {
      message.warning("Please enter your email to reset the password!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      message.success("Password reset link sent to your email!");
    } catch (error) {
      message.error("Error sending reset email. Check your email address!");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5" }}>
      <Card style={{ width: 400, padding: "20px", textAlign: "center" }} title="Sign In">
        <Form form={form} name="login" onFinish={onFinish} style={{ maxWidth: 300 }}>
          <Form.Item name="email" rules={[{ required: true, type: "email", message: "Enter a valid email!" }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Enter your password!" }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>

          <Button type="link" onClick={handleForgotPassword} style={{ marginTop: "10px" }}>
            Forgot Password?
          </Button>
        </Form>

        <Text>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Text>
      </Card>
    </div>
  );
};

export default LoginPage;
