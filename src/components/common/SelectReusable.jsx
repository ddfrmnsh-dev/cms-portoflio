import React from "react";
import { Select } from "antd";

const SelectReusable = ({
  value,
  onChange,
  options = [],
  placeholder = "Please select",
  allowClear = true,
  loading = false,
  disabled = false,
}) => {
  console.log("cek data select", value);
  return (
    <Select
      value={value} // Mengikat value dengan Form
      onChange={onChange} // Menangani perubahan value
      placeholder={placeholder}
      allowClear={allowClear}
      loading={loading}
      disabled={disabled}
      style={{ width: "100%" }}
    >
      {options.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectReusable;
