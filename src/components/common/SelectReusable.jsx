import React from "react";
import { Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
const SelectReusable = ({
  value,
  onChange,
  options = [],
  placeholder = "Please select",
  allowClear = true,
  loading = false,
  disabled = false,
  mode,
  maxCount,
}) => {
  const suffixIcon =
    mode === "multiple" && maxCount ? (
      <>
        <span>
          {value?.length || 0} / {maxCount}
        </span>
        <DownOutlined />
      </>
    ) : (
      <DownOutlined />
    );
  return (
    <Select
      mode={mode}
      value={value} // Mengikat value dengan Form
      onChange={(selected) => {
        if (mode === "multiple" && maxCount && selected.length > maxCount) {
          return; // Jika maxCount ada dan lebih dari batas, hentikan
        }
        onChange(selected);
      }}
      placeholder={placeholder}
      allowClear={allowClear}
      loading={loading}
      disabled={disabled}
      style={{ width: "100%" }}
      options={options}
      suffixIcon={suffixIcon}
    />
    // {options.map((option) => (
    //   <Select.Option key={option.value} value={option.value}>
    //     {option.label}
    //   </Select.Option>
    // ))}
  );
};

export default SelectReusable;
