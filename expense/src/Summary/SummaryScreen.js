import React, { lazy, Suspense } from "react";
import { Tabs, Typography, Spin } from "antd";

const MonthlySummary = lazy(() => import("./MonthlySummary"));
const YearlySummary = lazy(() => import("./YearlySummary"));

const { Title } = Typography;

const SummaryScreen = () => {
  const items = [
    {
      key: "1",
      label: <span className="delius-regular">Monthly Summary</span>,
      children: (
        <Suspense fallback={<div style={{ textAlign: "center", padding: "20px" }}><Spin size="large" /></div>}>
          <MonthlySummary />
        </Suspense>
      ),
    },
    {
      key: "2",
      disabled:true,
      label: <span className="delius-regular">Yearly Summary</span>,
      children: (
        <Suspense fallback={<div style={{ textAlign: "center", padding: "20px" }}><Spin size="large" /></div>}>
          <YearlySummary />
        </Suspense>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Title
        level={2}
        style={{ textAlign: "center", marginBottom: "20px" }}
        className="delius-swash-caps-regular"
      >
        Summary
      </Title>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};


export default SummaryScreen;