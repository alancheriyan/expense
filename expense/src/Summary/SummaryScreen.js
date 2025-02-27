import React, { lazy, Suspense } from "react";
import {  Spin } from "antd";

const MonthlySummary = lazy(() => import("./MonthlySummary"));

const SummaryScreen = () => {

  return (
    <div>
    <Suspense fallback={<div style={{  padding: "20px" }}><Spin size="large" /></div>}>
              <MonthlySummary/>
            </Suspense>
   
    </div>
  );
};


export default SummaryScreen;