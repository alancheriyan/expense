import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainApp  from './App';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));

const handleSelectedKeyChange = (key) => {
  console.log(key);
};
root.render(
  <React.StrictMode>
   {/*  <CustomizedSelectWithScrollList  data={IncomeCategory} onSelectedKeyChange={handleSelectedKeyChange} drawerText="Select Category"/> */}
   <MainApp/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
