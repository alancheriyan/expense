import React from "react";
import { Progress, Card } from "antd";

const CategoryBased = ({ data, categoriesCollection, totalExpense }) => {
  // Utility function to calculate category stats
  const calculateCategoryStats = (data, categoriesCollection, totalExpense) => {
    const categoryTotals = {};
    const unknownCategoryId = "unknown";
  
    // Add the "Unknown" category to the collection if it doesn't exist
    const updatedCategories = [
      ...categoriesCollection,
      { id: unknownCategoryId, name: "Unknown" },
    ];
  
    // Sum the amounts for each category
    data.forEach((item) => {
      const { categoryId, amount } = item;
      const id = categoryId ? String(categoryId) : unknownCategoryId; // Default to "unknown" if categoryId is empty
      categoryTotals[id] = (categoryTotals[id] || 0) + Number(amount);
    });
  
    // Prepare stats with percentages and prioritize "Unknown" at the top
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
      .sort((a, b) => {
        // Always place "Unknown" at the top
        if (a.id === unknownCategoryId) return -1;
        if (b.id === unknownCategoryId) return 1;
        // For other categories, sort by total in descending order
        return b.total - a.total;
      });
  };
  
  
  // Generate statistics
  const categoryStats = calculateCategoryStats(data, categoriesCollection, totalExpense);

  // Define colors for progress circles
  const colors = [
    "#ff4d4f", // Red
    "#40a9ff", // Blue
    "#73d13d", // Green
    "#faad14", // Orange
    "#722ed1", // Purple
  ];

  return (
    <Card style={{ overflowY: "auto", maxHeight: "400px", padding: "10px" }}>
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
            className:"delius-regular"
          }}
        >
          {/* Smaller Progress Bar for Mobile */}
          <Progress
            type="circle"
            percent={category.percentage}
            format={(percent) => `${percent}%`}
            strokeColor={colors[index % colors.length]}
            width={60} // Smaller size for mobile
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
