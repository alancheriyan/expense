import React, { useState, useEffect } from "react";
import { Form, Input, Button, Typography, DatePicker, Modal } from "antd";
import { db } from "../DataAcess/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../DataAcess/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendEmailVerification } from "firebase/auth";
import dayjs from "dayjs";
import { dbSetting } from "../DataAcess/dbSetting";
import { useMessage } from "../Components/MessageContext";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../DataAcess/CommonMethod";
const { Title } = Typography;

const Accounts = () => {
  const messageApi = useMessage();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [verifyEmailVisible,setVerifyEmailVisible]=useState(localStorage.getItem("emailVerified")||false)

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (storedUserInfo) {
     // setVerifyEmailVisible(!storedUserInfo.emailVerified);
      form.setFieldsValue({
        firstName: storedUserInfo.firstName || "",
        lastName: storedUserInfo.lastName || "",
        email: storedUserInfo.email || "",
        dob: storedUserInfo.dob ? dayjs(storedUserInfo.dob) : null,
      });
    }
  }, [form]);

  const onSave = async (values) => {
    const userid = localStorage.getItem("userId");
    if (!userid) return;
    setLoading(true);
    try {
      const updatedUser = {
        firstName: values.firstName,
        lastName: values.lastName,
        dob: values.dob ? values.dob.toISOString() : null,
        updatedOn: serverTimestamp(),
      };
      await setDoc(doc(db, dbSetting.UserTable, userid), updatedUser, { merge: true });
      localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to update profile", error);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    let newErrors = {};
    if (!oldPassword) newErrors.oldPassword = "Old password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "New passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setPasswordLoading(true);
    const user = auth.currentUser;
    if (!user || !user.email) {
      setErrors({ oldPassword: "No user is logged in." });
      setPasswordLoading(false);
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setIsModalOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (error) {
      setErrors({ oldPassword: "Wrong old Password" });
    }
    setPasswordLoading(false);
  };

  const handleVerifyEmail = async () => {
    const user = auth.currentUser;
    debugger;
    if (user) {
      try {
        await sendEmailVerification(user);
       
        messageApi.open({
          type: 'success',
          content: 'Verification email sent. Please check your inbox.',
        });
        handleLogout(navigate);
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: 'Failed to send verification email.',
        });
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <Title level={3} className="delius-swash-caps-regular">Account</Title>
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Form.Item label="First Name" name="firstName" className="delius-regular" rules={[{ required: true, message: "First name is required" }]}>
          <Input placeholder="Enter first name" className="delius-regular" />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName" className="delius-regular" rules={[{ required: true, message: "Last name is required" }]}>
          <Input placeholder="Enter last name" className="delius-regular" />
        </Form.Item>
        <Form.Item label="Date of Birth" name="dob" className="delius-regular">
          <DatePicker style={{ width: "100%" }} className="delius-regular" />
        </Form.Item>
        <Form.Item label="Email" name="email" className="delius-regular">
          <Input disabled className="delius-regular" />
        </Form.Item>
        {
          verifyEmailVisible && ( <Button type="link" onClick={handleVerifyEmail} block className="delius-regular">
          Verify Email Address
          </Button>)  
        }
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block className="delius-regular">
            Save
          </Button>
        </Form.Item>
      </Form>

      <Button type="default" onClick={() => setIsModalOpen(true)} block className="delius-regular">
        Update Password
      </Button>

      

      <Modal
        title="Update Password"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)} className="delius-regular">
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={passwordLoading} onClick={handleUpdatePassword} className="delius-regular">
            Update Password
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Old Password" validateStatus={errors.oldPassword ? "error" : ""} help={errors.oldPassword || ""} className="delius-regular">
            <Input.Password value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Enter old password" className="delius-regular" />
          </Form.Item>
          <Form.Item label="New Password" validateStatus={errors.newPassword ? "error" : ""} help={errors.newPassword || ""} className="delius-regular">
            <Input.Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="delius-regular" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Accounts;
