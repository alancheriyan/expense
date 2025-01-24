import React, { useState, useRef, useEffect } from "react";
import { Input, Drawer } from "antd";
import "./CustomizedSelectWithScrollList.css";

const CustomizedSelectWithScrollList = ({ data, onSelectedKeyChange,drawerText }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const scrollRef = useRef();

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const middlePoint = container.offsetHeight / 2 + container.getBoundingClientRect().top;
    const items = Array.from(container.children);

    const selectedItem = items.reduce(
      (closest, item) => {
        const rect = item.getBoundingClientRect();
        const itemMiddle = rect.top + rect.height / 2;
        const distance = Math.abs(itemMiddle - middlePoint);
        return distance < closest.distance ? { item, distance } : closest;
      },
      { item: null, distance: Infinity }
    ).item;

    if (selectedItem) {
      const newValue = selectedItem.getAttribute("data-value");
      if (newValue !== selectedValue) {
        setSelectedValue(newValue);
        const selectedKey = data.find((item) => item.name === newValue)?.key;
        if (selectedKey) onSelectedKeyChange(selectedKey);
      }
    }
  };

  const handleSelect = (key) => {
    const selectedItem = data.find((item) => item.key === key);
    if (selectedItem) {
      setSelectedValue(selectedItem.name); // Update the selected value
      onSelectedKeyChange(key); // Notify parent of the selected key
    }
    setDrawerVisible(false); // Close the drawer
  };

  const scrollToMiddle = () => {
    const container = scrollRef.current;
    if (!container || data.length === 0) return;

    const firstItem = container.children[0];
    const lastItem = container.children[container.children.length - 1];

    // Scroll to first item
    container.scrollTop = firstItem.offsetTop - (container.offsetHeight / 2 - firstItem.offsetHeight / 2);

    handleScroll(); // Trigger to highlight the correct item
  };

  useEffect(() => {
    if (drawerVisible && scrollRef.current) {
      scrollToMiddle();
    }
  }, [drawerVisible]);

  return (
    <div>
      <Input
        readOnly
        value={selectedValue}
        placeholder={drawerText}
        onClick={() => setDrawerVisible(true)} // Open the drawer
        style={{ cursor: "pointer" }}
        className="delius-regular"
      />
      <Drawer
        title={drawerText}
        placement="bottom"
        closable
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        height={300}
        style={{
          padding: 0,
          borderTopLeftRadius: "16px", // Adjust the radius as needed
          borderTopRightRadius: "16px", // Adjust the radius as needed
          overflow: "hidden", // Ensures no content spills out
        }}
      >
        <div className="custom-scroll-list-wrapper">
          <div
            className="custom-scroll-list"
            ref={scrollRef}
            onScroll={handleScroll}
          >
            {data.map((item) => (
              <div
                key={item.id}
                data-value={item.name}
                onClick={() => handleSelect(item.key)}
                className={`custom-scroll-list-item ${
                  selectedValue === item.name ? "selected" : ""
                }`}
              >
                {item.name}
              </div>
            ))}
          </div>
          <div className="highlight-indicator" />
        </div>
      </Drawer>
    </div>
  );
};

export default CustomizedSelectWithScrollList;
