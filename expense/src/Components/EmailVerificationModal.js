import React from "react";
import { Modal, Button, Typography } from "antd";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../DataAcess/firebase";
import { useMessage } from "./MessageContext";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../DataAcess/CommonMethod";
const { Text } = Typography;

const EmailVerificationModal = ({ open, onClose }) => {
  const messageApi = useMessage();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const email = userInfo?.email || "Unknown Email";

  const handleVerify = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      messageApi.open({
        type: 'success',
        content: 'Verification email sent. Please check your inbox or spam',
      });
      handleLogout(navigate);
    }
    onClose();
  };

  return (
    <Modal
      title="Verify Your Email"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="not-now" onClick={onClose}>
          Not Now
        </Button>,
        <Button key="verify" type="primary" onClick={handleVerify}>
          Verify
        </Button>,
      ]}
    >
      <Text>Please verify your email address:</Text>
      <br />
      <Text strong>{email}</Text>
      <br />
      <Text style={{ fontSize: "12px", color: "gray" }}>
        You won't be able to access all features until your email is verified.
      </Text>
    </Modal>
  );
};

export default EmailVerificationModal;
