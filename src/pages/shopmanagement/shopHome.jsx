import { Card, Input, Button, Table, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { lookshopcase, changestatus } from "../../api";
import { BASE_IMG_URL } from "../../utils/constants";
const { Option } = Select;
export default function ShopHome() {
  let history = useHistory();
  const [searchType, setsearchType] = useState("productName");
  const [searchName, setsearchName] = useState("");
  const [dataSource, setdataSource] = useState([]);
  const [loading, setloading] = useState();
  const [total, settotal] = useState(0);
  // const [isonline, setisline] = useState("已上架");
  const [pageNum] = useState(1);
  const [statuspageNum, setstatuspageNum] = useState(1);
  // const [updefaultData, setupdefaultData] = useState();

  useEffect(() => {
    // other code
    getProducts(pageNum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum]);

  // 获取商品分类
  const getProducts = async (num) => {
    // console.log(num);
    setloading(true);
    setstatuspageNum(num);
    let pageNum = num;
    // const { searchName, searchType } = this.state;
    let result;
    if (searchName) {
      // 说明我要进行搜索;
      result = await lookshopcase({
        pageNum,
        pageSize: 3,
        searchName,
        searchType,
      });
    } else {
      // 说明展示
      result = await lookshopcase({ pageNum, pageSize: 3 });
    }
    // console.log(result);
    if (result.status === 0) {
      const { list, total } = result.data;
      setdataSource(list);
      settotal(total);
      setloading(false);
      // message.success(result.msg, 1);
      // this.setState({
      //   products: list,
      //   total, //设置total可以分页
      // });
    }
  };
  // const getProducts = () => {
  //   console.log(searchType, searchName);
  // };

  const addshop = () => {
    history.push("/productshop/addshop");
  };
  const goUpShop = (data) => {
    // console.log(data);
    // setupdefaultData(data);
    history.push({
      pathname: "/productshop/addshop",
      state: { data },
    });
  };
  const title = (
    <span>
      <Select
        style={{ width: "150px" }}
        value={searchType}
        onChange={(value) => setsearchType(value)}
      >
        <Option value="productName">按名称搜索</Option>
        <Option value="productDesc">按描述搜索</Option>
      </Select>
      <Input
        type="text"
        style={{ width: "150px", margin: "0 10px" }}
        value={searchName}
        onChange={(e) => setsearchName(e.target.value)}
      />
      <Button onClick={() => getProducts(1)} type="primary">
        搜索
      </Button>
    </span>
  );
  const extra = (
    <Button onClick={addshop} type="primary">
      添加
    </Button>
  );
  const changeline = async (data) => {
    // console.log(data);
    if (data.status === 1) {
      const result = await changestatus({ _id: data._id, status: 2 });
      // console.log(result);
      if (result.status === 0) {
        getProducts(statuspageNum);
        message.success(result.msg);
      }
      // data.status = 2;
    } else {
      const result = await changestatus({ _id: data._id, status: 1 });
      console.log(result);
      // data.status = 1;
      if (result.status === 0) {
        getProducts(statuspageNum);
        message.success(result.msg);
      }
    }
  };
  const columns = [
    {
      width: 150,

      title: "商品名称",
      dataIndex: "name",
    },
    {
      title: "图片",
      dataIndex: "imgs",
      width: 300,
      render: (imgs) => {
        return (
          <img
            style={{
              border: "4px solid #000",
              borderRadius: "10px",
              width: "100%",
              padding: "2px",
            }}
            alt="img"
            src={BASE_IMG_URL + (imgs[0] ? imgs[0] : "moren.jpg")}
          ></img>
        );
      },
    },
    {
      title: "商品描述",
      dataIndex: "desc",
    },
    {
      title: "价格",
      dataIndex: "price",
      render: (price) => {
        return "￥" + price;
      },
    },

    {
      width: 100,
      title: "状态",
      render: (data) => {
        return (
          <span>
            <h1>{data.status === 1 ? "在售" : "已下架"}</h1>
            <Button onClick={() => changeline(data)} type="primary">
              {data.status === 1 ? "下架?" : "上架?"}
            </Button>
          </span>
        );
      },
    },
    {
      width: 130,
      title: "操作",
      render: (data) => {
        return (
          <>
            <Button type="link">详情</Button>
            <Button onClick={() => goUpShop(data)} type="link">
              修改
            </Button>
          </>
        );
      },
    },
  ];
  return (
    <Card title={title} extra={extra}>
      <Table
        rowKey="_id"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          total,
          defaultCurrent: pageNum,
          defaultPageSize: 3,
          onChange: getProducts,
        }}
      />
    </Card>
  );
}
