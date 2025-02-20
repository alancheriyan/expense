import React, { useEffect } from "react";
import { Progress, Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToCategories } from "../redux/expensecategorySlice";

const CategoryBased = ({ data, totalExpense }) => {
  const dispatch = useDispatch();
    
  const { data: categories = [], loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    const unsubscribe = dispatch(subscribeToCategories());
    console.log("Subscribed to categories...");

    return () => {
      console.log("Unsubscribing from categories...");
      unsubscribe();
    };
  }, [dispatch]);

  const calculateCategoryStats = (data, categories, totalExpense) => {
    const categoryTotals = {};
    const unknownCategoryId = "unknown";

    const validCategories = categories.filter(
      (category) => category.name && category.name.trim() !== ""
    );

    const updatedCategories = [
      ...validCategories,
      { id: unknownCategoryId, name: "Unknown" },
    ];

    data.forEach((item) => {
      const { categoryId, amount } = item;
      const id = categoryId ? String(categoryId) : unknownCategoryId;
      categoryTotals[id] = (categoryTotals[id] || 0) + Number(amount);
    });

    return updatedCategories
      .map((category) => {
        const total = categoryTotals[category.id] || 0;
        const percentage = totalExpense > 0 ? (total / totalExpense) * 100 : 0;
        return {
          ...category,
          total,
          percentage: Math.round(percentage),
        };
      })
      .sort((a, b) => (a.id === unknownCategoryId ? -1 : b.total - a.total));
  };

  const categoryStats = calculateCategoryStats(data, categories, totalExpense)
    .filter(category => !(category.id === "unknown" && category.percentage === 0));

  const colors = ["#ff4d4f", "#40a9ff", "#73d13d", "#faad14", "#722ed1"];

  return (
    <Card style={{ overflowY: "auto", maxHeight: "250px", padding: "10px" }}>
      {categoryStats.map((category, index) => (
        <div
          key={category.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px",
            padding: "10px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Progress
            type="circle"
            percent={category.percentage}
            format={(percent) => `${percent}%`}
            strokeColor={colors[index % colors.length]}
            width={60}
          />
          <div style={{ flex: 1, marginLeft: "10px" }}>
            <h4 style={{ margin: 0, color: colors[index % colors.length] }}>{category.name}</h4>
            <p style={{ margin: 0 }}>Total Spent: ${Number(category.total).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default CategoryBased;
