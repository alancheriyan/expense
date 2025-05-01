import React, { useState } from 'react';
import { Button, Typography, Row, Col,  theme } from 'antd';
import AddTransaction from "./AddTransaction"
import TransactionList from "./TransactionList"
import TransactionTotal from './TransactionTotal';

const { Title } = Typography;

const Transaction = () => {
  const { token } = theme.useToken();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [editTransaction, setEditTransaction] = useState(null);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateShort = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const prevDate = new Date(currentDate);
  prevDate.setDate(currentDate.getDate() - 1);

  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);


  return (
    <div className="container">
      {/* Fixed Header (Date & Segmented Control) */}
      <div className="fixed-header">
        <Row align="middle" justify="space-between" className="header-row">
          <Col>
            <Button
              type="primary"
              shape="round"
              onClick={() => setCurrentDate(prevDate)}
              className="nav-button"
              style={{ fontSize: '10px' }}
            >
              {`< ${formatDateShort(prevDate)}`}
            </Button>
          </Col>
          <Col>
            <Title level={3} className="date-display delius-swash-caps-regular">
              {formatDate(currentDate)}
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              shape="round"
              onClick={() => setCurrentDate(nextDate)}
              className="nav-button"
              style={{ fontSize: '10px' }}
            >
              {`${formatDateShort(nextDate)} >`}
            </Button>
          </Col>
        </Row>

      </div>
      <div style={{width:'100%'}}>
        <TransactionTotal  currentDate={currentDate}/>
        <div className="scrollable-content"  style={{ maxHeight: "calc(100vh - 60px)", overflowY: "auto",paddingBottom: "100px"}}>
              <TransactionList currentDate={currentDate} onEditTransaction={(transaction) => setEditTransaction(transaction)}/>
              <AddTransaction currentDate={currentDate} editData={editTransaction}
              onClose={() => setEditTransaction(null)}/>
            </div>
      </div>
     

      <style>
        {`
          :root {
            --primary-color: ${token.colorPrimary};
          }
         
        `}
      </style>
    </div>
  );
};

export default Transaction;
