import React, { useState, useEffect } from "react";
import { Button, Drawer, Input, Select, Card, Spin, Row, Col,Popconfirm } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { PlusCircleOutlined, EditOutlined,DeleteOutlined } from "@ant-design/icons";
import { subscribeToPaymentTypes } from '../redux/paymentTypeSlice';
import { subscribeToIncomeTypes } from '../redux/incomeTypeSlice';
import { subscribeToexpenseDetails } from '../redux/expenseSlice';
import { subscribeToincomeDetails } from '../redux/incomeSlice';
import { subscribeToBankingDetails, addBankingDetails, updateBankingDetails, deleteBankingDetails } from '../redux/bankingSlice';
import {getFormatedDate} from "../DataAcess/CommonMethod"

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

  const [loading,setLoading]=useState(false);
  const dispatch = useDispatch();
  const [data,setData]=useState([]);
  const { data: paymentTypes = [], loading: paymentTypesLoading } = useSelector(state => state.paymentTypes);
  const { data: tblBanking = [], loading: bankingLoading } = useSelector(state => state.bankingData);
  const { data: expenses = [] } = useSelector(state => state.expenses);
  const { data: incomes = [] } = useSelector(state => state.incomes);
  const { data: incomeTypes = [], loading: incomeTypesLoading } = useSelector(state => state.incomeTypes);

  useEffect(() => {
    const unsubscribePaymentsPromise = dispatch(subscribeToPaymentTypes());
    const unsubscribeBankingPromise = dispatch(subscribeToBankingDetails());
    const unsubscribeToexpensePromise = dispatch(subscribeToexpenseDetails());
    const unsubscribeToincomePromise = dispatch(subscribeToincomeDetails());
    const unsubscribeToincomeTypePromise = dispatch(subscribeToIncomeTypes());

    return () => {
      unsubscribePaymentsPromise();
      unsubscribeBankingPromise();
      unsubscribeToexpensePromise();
      unsubscribeToincomePromise();
      unsubscribeToincomeTypePromise();
    };
  }, [dispatch]);

  
  useEffect(() => {
    setupBankingData();
  }, [tblBanking, expenses,incomes]);
  
  
  const setupBankingData = () => {
    if (tblBanking.length === 0) return;
    setLoading(true);

    const updatedBankingData = tblBanking.map((institution) => {
      let paymentType = institution.type;
      
      const relatedExpenses = expenses.filter(
        (expense) =>
          expense.paymentTypeId === institution.paymentTypeId &&
          new Date(expense.updatedOn) >= new Date(institution.updatedOn)
      );

      const incomeTypes = institution.incomeTypes || [];
      const relatedIncome = incomes.filter(
        (income) =>
          incomeTypes.includes(income.categoryId) &&
          new Date(income.updatedOn) >= new Date(institution.updatedOn)
      );

      const totalExpenses = relatedExpenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
      const totalIncomes = relatedIncome.reduce((acc, income) => acc + Number(income.amount), 0);

      const updatedInstitution = { ...institution };
      updatedInstitution.balance = Number(updatedInstitution.balance);

      if (paymentType === 'C5IcO138DiV7gDRgyzqD') {
        updatedInstitution.balance += totalExpenses;  
      } else if (paymentType === 'NhW0yn579WguMoGpRDjU') {
        updatedInstitution.balance -= totalExpenses;  
        updatedInstitution.balance += totalIncomes;  
      }

      updatedInstitution.balance = parseFloat(Math.max(0, updatedInstitution.balance).toFixed(2));


      return updatedInstitution;  
    });

    setData(updatedBankingData);
    setLoading(false);
};

  
  
  const handleOpen = () => {
    setVisible(true);
    setEditingId(null);
    setFormData({ name: "", type: "", paymentTypeId: "", balance: "",incomeTypes:[] });
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
    setFormData({ name: "", type: "", paymentTypeId: "", balance: "",incomeTypes:[] });
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
      incomeTypes:institution.incomeTypes
    });
    setVisible(true);
  };

  if (paymentTypesLoading || bankingLoading || loading || incomeTypesLoading) {
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
          <label className="delius-regular">Link Income Type</label>
            <Select
              mode="multiple"
              placeholder="Link Income Type"
              className="delius-regular"
              value={formData.incomeTypes}
              onChange={(value) => handleChange("incomeTypes", value)}
              style={{ width: "100%" }}
              disabled={formData.type !== "NhW0yn579WguMoGpRDjU"}
            >
              {incomeTypes.map((type) => (
                <Select.Option key={type.id} value={type.id}>
                   <span className="delius-regular">{type.name}</span>
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
        <Col span={12}>
            <label className="delius-regular">Current Balance</label>
            <Input
              placeholder="Current Balance"
              type="number"
              step="0.01"
               min="0"
               inputMode="decimal"
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
        {data.map((institution) => {
          const typeName = institutionType.find((t) => t.id === institution.type)?.name || "Unknown";
          const paymentTypeName = paymentTypes.find((p) => p.id === institution.paymentTypeId)?.name || "Unknown";
          const updatedOn = getFormatedDate(institution.updatedOn)
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
                <span style={{ fontSize: 20 }} className="delius-heading ">{institution.institutionName}</span>
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
                <span style={{ color: "green",  fontSize: 16, background: "#e6f4ea", padding: "3px 6px", borderRadius: 6 }} className="delius-heading">
                  Balance: ${institution.balance}
                </span>
                <span style={{ fontSize: 14, color: "#555" }}>Type: {typeName}</span>
              </div>

              <p style={{ fontSize: 14, color: "#666", marginTop: 4 }} className="delius-regular">Linked Payment: {paymentTypeName}</p>
              <p style={{ fontSize: 14, color: "#666", marginTop: 4 }} className="delius-regular">Last Updated On: {updatedOn}</p>
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
