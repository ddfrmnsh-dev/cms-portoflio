import { ConfigProvider, Pagination } from "antd";

const PaginationReusable = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
}) => {
  // const handlePageChange = (page) => {
  //   onPageChange(page);
  // };

  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            itemActiveColorDisabled: "#ffffff",
            colorTextDisabled: "#ffffff",
            itemActiveBg: "#4F46E5",
            colorBgContainer: "#2f2f30",
            colorText: "#ffffff",
            colorBgTextActive: "#4F46E5",
            colorPrimary: "#fffff",
          },
        },
      }}
    >
      <div>
        <Pagination
          current={currentPage}
          total={totalPages}
          pageSize={pageSize}
          onChange={onPageChange}
        />
      </div>
    </ConfigProvider>
  );
};
export default PaginationReusable;
