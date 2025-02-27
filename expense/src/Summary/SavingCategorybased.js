import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToSavings } from "../redux/savingSlice";
import { Card, Progress, Tag, Spin, Empty } from "antd";
import "./SavingCategorybased.css"; // Add styles

const SavingCategoryBased = ({ data }) => {
  const dispatch = useDispatch();

  const { data: savingPlanType = [], loading: savingPlanTypeLoading } = useSelector(
    (state) => state.savingPlanType
  );

  useEffect(() => {
    const unsubscribe = dispatch(subscribeToSavings());
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  if (savingPlanTypeLoading)
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );

  // Merge savings data with plan names
  const mergedData = data.map((item) => {
    const plan = savingPlanType.find((p) => p.id === item.savingTypeId);
    return {
      ...item,
      name: plan ? plan.name : "Unknown",
      goal: plan?.goalAmount ?? null, // Set goalAmount to null if not available
      amount: item.amount ?? 0, // Ensure amount exists
    };
  });

  // Sort by highest amount
  const sortedData = mergedData.sort((a, b) => b.amount - a.amount);

  if (sortedData.length === 0) {
    return (
      <div className="empty-container">
        <Empty description="No saving plans available" />
      </div>
    );
  }

  return (
    <div className="saving-container">
      {sortedData.map((item, index) => {
        const color = ["#722ed1", "#40a9ff", "#73d13d", "#faad14", "#ff4d4f"][index % 5];
        const hasGoal = item.goal !== null && item.goal > 0;
        const percentage = hasGoal ? Math.min((item.amount / item.goal) * 100, 100) : 0;
        const statusText = hasGoal && percentage === 100 ? "Completed" : "On Track";
        const statusColor = hasGoal && percentage === 100 ? "green" : color;

        return (
          <Card key={item.savingTypeId} className="saving-card">
            <div className="card-header">
              <h3>{item.name}</h3>
              <span className="status-tag-container">
                <Tag color={statusColor} className="status-tag">{statusText}</Tag>
              </span>
            </div>
            <p className="amount">
              ${item.amount.toLocaleString()}
              {hasGoal && ` / $${item.goal.toLocaleString()}`}
            </p>
            {hasGoal && <Progress percent={percentage} showInfo={false} strokeColor={color} />}
          </Card>
        );
      })}
    </div>
  );
};

export default SavingCategoryBased;
