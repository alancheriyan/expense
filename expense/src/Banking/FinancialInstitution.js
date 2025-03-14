import React, { useState, useEffect } from "react";
import { Button, Drawer, Input, Select, Card, Spin, Row, Col,Popconfirm } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { PlusCircleOutlined, EditOutlined,DeleteOutlined } from "@ant-design/icons";
import { subscribeToPaymentTypes } from '../redux/paymentTypeSlice';
import { subscribeToBankingDetails, addBankingDetails, updateBankingDetails, deleteBankingDetails } from '../redux/bankingSlice';

const FinancialInstitution = () => {
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    paymentTypeId: "",
    balance: ""
  });

  const institutionType = [
    { id: "C5IcO138DiV7gDRgyzqD", name: "Credit" },
    { id: "NhW0yn579WguMoGpRDjU", name: "Debit" },
    { id: "HKYWCkRF8ic8Y1EyrRI4", name: "Savings" }
  ];

  const dispatch = useDispatch();
  const { data: paymentTypes = [], loading: paymentTypesLoading } = useSelector(state => state.paymentTypes);
  const { data: tblBanking = [], loading: bankingLoading } = useSelector(state => state.bankingData);

  useEffect(() => {
    const unsubscribePaymentsPromise = dispatch(subscribeToPaymentTypes());
    const unsubscribeBankingPromise = dispatch(subscribeToBankingDetails());

    return () => {
      unsubscribePaymentsPromise();
      unsubscribeBankingPromise();
    };
  }, [dispatch]);

  const handleOpen = () => {
    setVisible(true);
    setEditingId(null);  // Ensure it's a new entry
    setFormData({ name: "", type: "", paymentTypeId: "", balance: "" }); // Clear form
  };

  const handleClose = () => setVisible(false);

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSave = () => {
    if (editingId) {
      dispatch(updateBankingDetails({ id: editingId, data: formData }));
    } else {
      dispatch(addBankingDetails({ data: formData }));
    }
    handleClose();
    setFormData({ name: "", type: "", paymentTypeId: "", balance: "" }); // Reset form
  };

  const handleDelete  =(id)=>{
    dispatch(deleteBankingDetails( id));
  }

  const handleEdit = (institution) => {
    setEditingId(institution.id);
    setFormData({
      name: institution.institutionName,
      type: institution.type,
      paymentTypeId: institution.paymentTypeId,
      balance: institution.balance,
    });
    setVisible(true);
  };

  if (paymentTypesLoading || bankingLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="delius-regular" style={{ maxHeight: "calc(100vh - 60px)", overflowY: "auto", paddingBottom: "70px" }}>
      <Button type="default" icon={<PlusCircleOutlined />} onClick={handleOpen}>
        <span className="delius-regular">Add Financial Institution</span>
      </Button>

      <Drawer
        title={editingId ? <label className="delius-regular">Edit Financial Institution</label> : <label className="delius-regular">Add Financial Institution</label>}
        placement="bottom"
        closable
        onClose={handleClose}
        open={visible}
        style={{ borderRadius: "12px 12px 0 0" }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <label className="delius-regular">Institution Name</label>
            <Input
              placeholder="Institution Name"
              className="delius-regular"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Col>
          <Col span={12}>
            <label className="delius-regular">Type</label>
            <Select
              placeholder="Type"
              className="delius-regular"
              value={formData.type}
              onChange={(value) => handleChange("type", value)}
              style={{ width: "100%" }}
            >
              {institutionType.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                  <span className="delius-regular">{type.name}</span>
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 10 }}>
          <Col span={12}>
            <label className="delius-regular">Link Payment Type</label>
            <Select
              placeholder="Link Payment Type"
              className="delius-regular"
              value={formData.paymentTypeId}
              onChange={(value) => handleChange("paymentTypeId", value)}
              style={{ width: "100%" }}
            >
              {paymentTypes.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                   <span className="delius-regular">{type.name}</span>
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <label className="delius-regular">Current Balance</label>
            <Input
              placeholder="Current Balance"
              type="number"
              className="delius-regular"
              value={formData.balance}
              onChange={(e) => handleChange("balance", e.target.value)}
            />
          </Col>
        </Row>
        <Button type="primary" onClick={handleSave} style={{ marginTop: 15 }}>
          {editingId ? <label className="delius-regular">Update</label> : <label className="delius-regular">Save</label>}
        </Button>
      </Drawer>

      <div style={{ marginTop: 20 }}>
        {tblBanking.map((institution) => {
          const typeName = institutionType.find((t) => t.id === institution.type)?.name || "Unknown";
          const paymentTypeName = paymentTypes.find((p) => p.id === institution.paymentTypeId)?.name || "Unknown";

          return (
            <Card
              key={institution.id}
              style={{
                marginBottom: 8,
                borderRadius: 10,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                border: "none",
                padding: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14 }} className="delius-heading ">{institution.institutionName}</span>
                <div>
                    <EditOutlined style={{ cursor: "pointer", fontSize: 14, marginRight: 10 }} onClick={() => handleEdit(institution)} />
                    <Popconfirm
                      title={`Are you sure you want to delete?`}
                      onConfirm={() => handleDelete(institution.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined style={{ cursor: "pointer", fontSize: 14, color: "red" }} />
                    </Popconfirm>
              </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ color: "green",  fontSize: 12, background: "#e6f4ea", padding: "3px 6px", borderRadius: 6 }} className="delius-heading">
                  Balance: {institution.balance}
                </span>
                <span style={{ fontSize: 12, color: "#555" }}>Type: {typeName}</span>
              </div>

              <p style={{ fontSize: 12, color: "#666", marginTop: 4 }} className="delius-regular">Linked Payment: {paymentTypeName}</p>
            </Card>
          );
        })}
      </div>

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default FinancialInstitution;
