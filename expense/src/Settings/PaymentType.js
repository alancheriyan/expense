import React, { useEffect,useState } from "react";
import { Typography, Input, Button, message,Popconfirm,  Row, Col } from "antd";
import { PlusOutlined,MinusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToPaymentTypes, updatePaymentType, addPaymentType } from "../redux/paymentTypeSlice";

const { Title } = Typography;

const PaymentType = ({showHeading}) => {
  
   const dispatch = useDispatch();
    const { data: paymentTypes = [], loading, error } = useSelector((state) => state.paymentTypes);
    const [IsDisplayHeading,setIsDisplayHeading]= useState(true);

    useEffect(()=>{
      if(showHeading!==undefined){
        setIsDisplayHeading(showHeading);
      }
    },[])

    useEffect(() => {
      const unsubscribe = dispatch(subscribeToPaymentTypes()); // Subscribe to real-time updates
      return () => unsubscribe(); // Cleanup on unmount
    }, [dispatch]);
 
   useEffect(() => {
     if (error) {
       message.error(`Error: ${error}`);
     }
   }, [error]);
 

    const handleInputChange = (id, value) => {
      dispatch(updatePaymentType({ id, field: "name", value }));
    };
       
    const handleDeleteRow = (id) => {
      dispatch(updatePaymentType({ id, field: "status", value: false }));
    };
   
 
   const handleAddRow = () => {
     dispatch(addPaymentType());
   };

  return (
    <div>
      {IsDisplayHeading?(<Title
        style={{ marginBottom: "20px",fontSize:"10px"  }}
        className="delius-swash-caps-regular"
      >
        Payment Type
      </Title>):""}
      

      <div style={{ marginBottom: "20px" }}>
        {paymentTypes.map((paymentType) => (
          <Row key={paymentType.id} align="middle" style={{ marginBottom: "10px" }}>
            <Col flex="auto">
                <Input
                key={paymentType.id}
                value={paymentType.name}
                onChange={(e) => handleInputChange(paymentType.id, e.target.value)}
                placeholder="Enter Payment Type"
                style={{ marginBottom: "10px" }}
                className="delius-regular"
              />
            </Col>
            <Col flex="40px" style={{ textAlign: "center" }}>
                <Popconfirm
                  title="Are you sure you want to delete this Payment Type?"
                  onConfirm={() => handleDeleteRow(paymentType.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <MinusCircleOutlined
                    style={{ fontSize: 18, color: "red", cursor: "pointer" }}
                  />
                </Popconfirm>
              </Col>
          </Row>
         
        ))}
      </div>

      <Button
        type="dashed"
        onClick={handleAddRow}
        block
        icon={<PlusOutlined />}
        style={{ marginBottom: "20px" }}
      >
        <span className="delius-regular">Add Payment Type</span>
      </Button>
    </div>
  );
};

export default PaymentType;
