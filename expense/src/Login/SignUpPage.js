import React, { useState } from 'react';
import { Form, Input, Button, Card, message  } from 'antd';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../DataAcess/firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { dbSetting } from '../DataAcess/dbSetting';
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
    
  const onFinish = async (values) => {
    const { firstName, lastName, email, password, confirmPassword, role } = values;
   
    if (password !== confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    
   

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in Firestore (tbluser)
      await setDoc(doc(db, dbSetting.UserTable, user.uid), {
        firstName,
        lastName,
        email,
        role: role || "user",
        createdAt: serverTimestamp(), // Use Firebase timestamp
        emailVerified: false,
        setupProfile:false
      });


      // Redirect after showing message
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      localStorage.setItem("userId", userCredential.user.uid);
      localStorage.setItem("setupProfile", "false");
      navigate("/setup"); // Redirect to home or another page after signup

    } catch (error) {
      message.error(error.message);;
    }

    setLoading(false);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400, padding: '20px', textAlign: 'center' }} title="Sign Up">
        <Form form={form} name="signup" onFinish={onFinish} style={{ maxWidth: 300 }}>
          <Form.Item name="firstName" rules={[{ required: true, message: 'Enter your first name!' }]}>
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item name="lastName" rules={[{ required: true, message: 'Enter your last name!' }]}>
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, type: "email", message: 'Enter a valid email!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Enter a password!' }, { min: 6, message: 'At least 6 characters' }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item name="confirmPassword" dependencies={['password']} hasFeedback rules={[{ required: true, message: 'Confirm your password!' }, ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) return Promise.resolve();
              return Promise.reject('Passwords do not match!');
            },
          })]}>
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>Sign Up</Button>
        </Form>
      </Card>
    </div>
  );
};

export default SignUpPage;
