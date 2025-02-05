import React, { useState, useRef, useEffect } from "react";
import { Input, Drawer } from "antd";
import "./CustomizedSelectWithScrollList.css";

const CustomizedSelectWithScrollList = ({
  data,
  onSelectedKeyChange,
  drawerText,
  defaultValue,
}) => {
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
        const selectedKey = data.find((item) => item.name === newValue)?.id;
        if (selectedKey) onSelectedKeyChange(selectedKey);
      }
    }
  };

  const handleSelect = (key) => {
    const selectedItem = data.find((item) => item.key === key);
    if (selectedItem) {
      setSelectedValue(selectedItem.name);
      onSelectedKeyChange(key);
    }
    setDrawerVisible(false);
  };

  const scrollToSelectedItem = () => {
    const container = scrollRef.current;
    if (!container || data.length === 0) return;

    const selectedName = data.find((item) => item.id === defaultValue)?.name;
    setSelectedValue(selectedName);

    const selectedItem = Array.from(container.children).find(
      (child) => child.getAttribute("data-value") === selectedName
    );

    if (selectedItem) {
      container.scrollTop =
        selectedItem.offsetTop -
        (container.offsetHeight / 2 - selectedItem.offsetHeight / 2);
    }
  };

  useEffect(() => {
    if (drawerVisible && scrollRef.current) {
      scrollToSelectedItem();
    }
  }, [drawerVisible]);

  useEffect(() => {
    const selectedName = data.find((item) => item.id === defaultValue)?.name;
    if (selectedName) setSelectedValue(selectedName);
  }, [defaultValue]);

  return (
    <div>
      <Input
        readOnly
        value={selectedValue}
        placeholder={drawerText}
        onClick={() => setDrawerVisible(true)}
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
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          overflow: "hidden",
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
                onClick={() => handleSelect(item.id)}
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
