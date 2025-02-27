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

    return () => {
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
      .filter(category => !(category.id === "unknown" && category.percentage === 0))
      .sort((a, b) => (a.id === unknownCategoryId ? -1 : b.total - a.total));
  };

  const categoryStats = calculateCategoryStats(data, categories, totalExpense);
  const colors = ["#ff4d4f", "#40a9ff", "#73d13d", "#faad14", "#722ed1"];

  return (
    <Card style={{ overflowX: "auto", whiteSpace: "nowrap", padding: "10px" }} className="statistics-card statistics-card-category">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: "10px",
        }}
        
      >
        {categoryStats.map((category, index) => (
          <div
            key={category.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "150px", // Ensures the width adjusts
              padding: "10px",
              borderRight: "2px solid #f0f0f0",
              whiteSpace: "normal", // Allows wrapping of text if needed
            }}
          >
            <Progress
              type="circle"
              percent={category.percentage}
              format={(percent) => `${percent}%`}
              strokeColor={colors[index % colors.length]}
              width={60}
            />
            <h4
              style={{
                margin: "10px 0 5px",
                color: colors[index % colors.length],
                wordWrap: "break-word", // Prevents long names from overflowing
                textAlign: "center", // Center-align the text
              }}
            >
              {category.name}
            </h4>
            <p style={{ margin: 0, fontSize: "14px" }}>
              Total : ${Number(category.total).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CategoryBased;
