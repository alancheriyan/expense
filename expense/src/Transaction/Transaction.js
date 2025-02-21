import React, { useState,  lazy, Suspense } from 'react';
import { Button, Typography, Row, Col, Spin, Segmented ,theme} from 'antd';

const { Title } = Typography;
const ExpenseScreen = lazy(() => import('../Expense/ExpenseScreen'));
const IncomeScreen = lazy(() => import('../Income/IncomeScreen'));
const SavingScreen = lazy(() => import('../Saving/SavingScreen'));

const Transaction = () => {

  const { token } = theme.useToken();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactionType, setTransactionType] = useState('Expense');

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

      <Row justify="center" style={{ marginTop: '16px' }}>
       <Segmented
          options={['Expense', 'Income', 'Saving']}
          value={transactionType}
          onChange={(value) => setTransactionType(value)}
          className="custom-segmented"
        />
      </Row>

      <div>
        <Suspense fallback={<Spin size="large" />}>
          {transactionType === 'Expense' && <ExpenseScreen currentDate={currentDate} />}
          {transactionType === 'Income' && <IncomeScreen currentDate={currentDate} />}
          {transactionType === 'Saving' && <SavingScreen currentDate={currentDate} />}
        </Suspense>
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
