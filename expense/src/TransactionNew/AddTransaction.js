import React, { useEffect, useState } from "react";
import { Form, Input, Button, Drawer, Radio, Select, Checkbox, message, Popconfirm } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { db } from "../DataAcess/firebase";
import { collection, addDoc, serverTimestamp,Timestamp,doc,updateDoc,deleteDoc } from "firebase/firestore";
import { dbSetting } from "../DataAcess/dbSetting";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToIncomeTypes } from '../redux/incomeTypeSlice';
import { subscribeToexpenseDetails } from '../redux/expenseSlice';
import { subscribeToincomeDetails } from '../redux/incomeSlice';
import { subscribeToCategories } from '../redux/expensecategorySlice';
import { subscribeToPaymentTypes } from '../redux/paymentTypeSlice';
import { subscribeToSavings } from '../redux/savingSlice';

const { Option } = Select;

const AddTransaction = ({currentDate,editData = null, onClose}) => {
  const dispatch = useDispatch();
  
  const { data: paymentTypes = [] } = useSelector((state) => state.paymentTypes);
  const { data: expenseCategory = [] } = useSelector((state) => state.categories);
  const { data: incomeTypes = [] } = useSelector((state) => state.incomeTypes);
  const { data: savingTypes = [] } = useSelector((state) => state.savingPlanType);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [form] = Form.useForm();

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    form.resetFields();
    onClose?.();
  };

  const handleTransactionTypeChange = (e) => {
    setTransactionType(e.target.value);
    form.resetFields();
  };

  useEffect(() => {
    if (editData) {
      setTransactionType(editData.type);
      form.setFieldsValue({
        ...editData,
        categoryId: editData.categoryId || editData.savingTypeId || editData.categoryId,
      });
      setDrawerVisible(true);
    }
  }, [editData]);

  const saveTransaction = async (clearAfterSave = false) => {
    try {
      const values = await form.validateFields();
      let collectionName = "";
      const currentDateTimestamp = Timestamp.fromDate(currentDate);
      if (transactionType === "expense") collectionName = dbSetting.ExpenseTable;
      else if (transactionType === "income") collectionName = dbSetting.IncomeTable;
      else if (transactionType === "saving") collectionName = dbSetting.SavingMasterTable;



      if (editData?.id) {
        const docData = {
          ...values,
          userId:userId,
          updatedOn: serverTimestamp(),
        };
        const docRef = doc(db, collectionName, editData.id);
        await updateDoc(docRef, docData);
      } else {
        const docData = {
          ...values,
          date:currentDateTimestamp,
          userId:userId,
          createdOn: serverTimestamp(),
        };
        await addDoc(collection(db, collectionName), docData);
      }
      message.success("Transaction saved successfully");

      if (clearAfterSave) {
        form.resetFields();
      } else {
        closeDrawer();
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      message.error("Failed to save transaction");
    }
  };

  useEffect(() => {
    dispatch(subscribeToPaymentTypes());
    dispatch(subscribeToCategories());
    dispatch(subscribeToexpenseDetails());
    dispatch(subscribeToincomeDetails());
    dispatch(subscribeToIncomeTypes());
    dispatch(subscribeToSavings());
  
  }, [dispatch]);

  const deleteTransaction = async () => {
    try {
      if (!editData?.id) return;
  
      let collectionName = "";
      if (transactionType === "expense") collectionName = dbSetting.ExpenseTable;
      else if (transactionType === "income") collectionName = dbSetting.IncomeTable;
      else if (transactionType === "saving") collectionName = dbSetting.SavingMasterTable;
  
      const docRef = doc(db, collectionName, editData.id);
      await deleteDoc(docRef);
      message.success("Transaction deleted successfully");
      closeDrawer();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      message.error("Failed to delete transaction");
    }
  };
  
  

  return (
    <div>
      <Button type="dashed" onClick={openDrawer} block icon={<PlusOutlined />}>
        <span className="delius-regular">Add Transaction</span>
      </Button>

      <Drawer
        title={
          <Radio.Group
            disabled={editData?.id?true:false}
            value={transactionType}
            onChange={handleTransactionTypeChange}
            buttonStyle="solid"
            style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}
          >
            <Radio.Button value="expense" style={{ borderRadius: "8px" }}>Expense</Radio.Button>
            <Radio.Button value="income" style={{ borderRadius: "8px" }}>Income</Radio.Button>
            <Radio.Button value="saving" style={{ borderRadius: "8px" }}>Saving</Radio.Button>
          </Radio.Group>
        }
        placement="bottom"
        onClose={closeDrawer}
        open={drawerVisible}
        height="75%"
        bodyStyle={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px", padding: "24px" }}
      >
        <Form layout="vertical" form={form} 
        initialValues={{ avoidable: false,comments:"" }}>
          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: "Please enter the amount" }]}
          >
            <Input type="number" style={{ borderRadius: "8px" }} />
          </Form.Item>

          {transactionType === "expense" && (
            <>
              <Form.Item
                name="categoryId"
                label="Expense Category"
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select placeholder="Select Expense Category" style={{ borderRadius: "8px" }}>
                  {expenseCategory.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="paymentTypeId"
                label="Payment Type"
                rules={[{ required: true, message: "Please select payment type" }]}
              >
                <Select placeholder="Select Payment Type" style={{ borderRadius: "8px" }}>
                  {paymentTypes.map((pay) => (
                    <Option key={pay.id} value={pay.id}>
                      {pay.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="comments" label="Comments">
                <Input.TextArea rows={2} style={{ borderRadius: "8px" }} />
              </Form.Item>

              <Form.Item name="avoidable" valuePropName="checked">
                <Checkbox>Avoidable?</Checkbox>
              </Form.Item>
            </>
          )}

          {transactionType === "income" && (
            <>
              <Form.Item
                name="categoryId"
                label="Income Category"
                rules={[{ required: true, message: "Please select income type" }]}
              >
                <Select placeholder="Select Income Type" style={{ borderRadius: "8px" }}>
                  {incomeTypes.map((income) => (
                    <Option key={income.id} value={income.id}>
                      {income.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="comments" label="Comments">
                <Input.TextArea rows={2} style={{ borderRadius: "8px" }} />
              </Form.Item>
            </>
          )}

          {transactionType === "saving" && (
            <>
            <Form.Item
                name="savingTypeId"
                label="Saving Category"
                rules={[{ required: true, message: "Please select income type" }]}
              >

                <Select placeholder="Select Saving Type" style={{ borderRadius: "8px" }}>
                  {savingTypes.map((savings) => (
                    <Option key={savings.id} value={savings.id}>
                      {savings.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
            </>
          )}
        </Form>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <Button
            type="primary"
            onClick={() => saveTransaction(false)}
            style={{ marginRight: 8, borderRadius: "8px" }}
          >
            {editData?.id ?"Update":"Save"}
          </Button>
          {editData?.id ? (
            <Popconfirm
              title="Are you sure you want to delete this transaction?"
              onConfirm={deleteTransaction}
              okText="Yes"
              cancelText="No"
            >
              <Button danger style={{ marginRight: 8, borderRadius: "8px" }}>
                Delete
              </Button>
            </Popconfirm>
          ) : (
            <>
             <Button
              type="dashed"
              onClick={() => saveTransaction(true)}
              style={{ marginRight: 8, borderRadius: "8px" }}
            >
              Save & New
            </Button>
             <Button
             danger
             onClick={() => form.resetFields()}
             style={{ borderRadius: "8px" }}
           >
             Clear
           </Button>
            </>
           
          )}
         
        </div>
      </Drawer>
    </div>
  );
};

export default AddTransaction;
