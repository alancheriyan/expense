import React from "react";
import ExpenseCategory from "./ExpenseCategory";
import { Typography } from "antd";
const { Title } = Typography;

const SettingScreen=({categoriesCollection,onCategoriesChange})=>{
    return(<div style={{ padding: "20px" }}>
         <Title
        level={2}
        style={{ textAlign: "center", marginBottom: "20px" }}
        className="delius-swash-caps-regular"
      >
        Settings
      </Title>

     <ExpenseCategory data={categoriesCollection} onCategoriesChange={onCategoriesChange}/></div>)
}

export default SettingScreen;