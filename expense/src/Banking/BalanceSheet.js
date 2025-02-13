import React, { useEffect, useState } from "react";
import { Input, Form, Typography, Card, Empty } from "antd";
import { db } from "../DataAcess/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { dbSetting } from "../DataAcess/dbSetting";

const { Title } = Typography;

const BalanceSheet = ({ data, onBankingDataChange }) => {
    const [form] = Form.useForm();
    const [bankingData, setBankingData] = useState(data);

    useEffect(() => {
        setBankingData(data);
    }, [data]);

    const handleChange = async (id, value) => {
        const updatedBalance = Number(value);
        try {
            await updateDoc(doc(db, dbSetting.BankingTable, id), { balance: updatedBalance });
            
            // Update the local state
            const updatedData = bankingData.map(item => 
                item.id === id ? { ...item, balance: updatedBalance } : item
            );
            setBankingData(updatedData);
            
            // Notify parent component
            onBankingDataChange(updatedData);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    return (
        <div>
            <Title
                level={2}
                style={{ textAlign: "center", marginBottom: "20px", marginTop: "20px" }}
                className="delius-swash-caps-regular"
            >
                Balance Sheet
            </Title>

            {bankingData.length === 0 ? (
                <Empty
                    description={<span className="delius-regular">Balance Sheet feature coming soon</span>}
                    style={{ marginTop: "50px" }}
                />
            ) : (
                <Card style={{ maxWidth: 600, margin: "auto", padding: "20px" }}>
                    <Form form={form} layout="vertical">
                        {bankingData.map(({ id, name, balance }) => (
                            <Form.Item key={id} label={name} name={id} initialValue={balance} className="banking-label delius-regular">
                                <Input 
                                    type="number" 
                                    value={balance} 
                                    onChange={(e) => handleChange(id, e.target.value)} 
                                    className="banking-input delius-regular"
                                />
                            </Form.Item>
                        ))}
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default BalanceSheet;
