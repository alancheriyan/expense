import React, { useEffect,useState } from "react";
import { Typography, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToIncomeTypes, updateIncomeType, addIncomeType } from "../redux/incomeTypeSlice";

const { Title } = Typography;

const IncomeType = ({showHeading}) => {
  const dispatch = useDispatch();
  const { data: incomeTypes = [], loading, error } = useSelector((state) => state.incomeTypes);
  const [IsDisplayHeading,setIsDisplayHeading]= useState(true);

  useEffect(() => {
    const unsubscribe = dispatch(subscribeToIncomeTypes()); // Subscribe to real-time updates
    return () => unsubscribe(); // Cleanup on unmount
  }, [dispatch]);

  const handleInputChange = (id, value) => {
    dispatch(updateIncomeType({ id, name: value }));
  };

  const handleAddRow = () => {
    dispatch(addIncomeType());
  };

    useEffect(()=>{
        if(showHeading!==undefined){
          setIsDisplayHeading(showHeading);
        }
    },[])

  return (
    <div>
      {IsDisplayHeading?(<Title style={{ marginBottom: "20px", fontSize: "10px" }} className="delius-swash-caps-regular">
        Income Type
      </Title>):""}
      

      {/* Wrap the content in Spin to show a loading state */}
     
        <div style={{ marginBottom: "20px" }}>
          {incomeTypes.map((incomeType) => (
            <Input
              key={incomeType.id}
              value={incomeType.name}
              onChange={(e) => handleInputChange(incomeType.id, e.target.value)}
              placeholder="Enter Income Type"
              style={{ marginBottom: "10px" }}
              className="delius-regular"
            />
          ))}
        </div>
      

      <Button
        type="dashed"
        onClick={handleAddRow}
        block
        icon={<PlusOutlined />}
        style={{ marginBottom: "20px" }}
      >
        <span className="delius-regular">Add Income Type</span>
      </Button>
    </div>
  );
};

export default IncomeType;
