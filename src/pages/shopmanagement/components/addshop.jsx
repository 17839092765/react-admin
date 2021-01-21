import { Card, Form, Input, Button, Cascader, message } from "antd";
import { useEffect, useState } from "react";
import Uploadpic from "./upload";
import { BASE_IMG_URL } from "../../../utils/constants";
import { categorylist, addshopclass, editshop } from "../../../api/index";
// import { useState } from "react";
// import { SwapOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
const layout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 12,
  },
};
// const validateMessages = {
//   required: "${label} is required!",
//   types: {
//     number: "${label} 必须为数字!",
//   },
//   number: {
//     range: "${label} must be between ${min} and ${max}",
//   },
// };

export default function Addshop(props) {
  const [imgcase, setimgcase] = useState({});
  const [options, setOptions] = useState([]);
  const [title, settitle] = useState("");
  const [form] = Form.useForm();
  const [imgs, setimgs] = useState();
  // const [arr1, setarr1] = useState();
  const onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions, 99999999);
  };
  let history = useHistory();
  // useEffect(() => {
  const arr = [];
  if (props.location.state) {
    if (props.location.state.data.categoryId) {
      // onChange(props.location.state.data.pCategoryId);
      arr.push(props.location.state.data.pCategoryId);
      arr.push(props.location.state.data.categoryId);
      // setarr1(arr);
    } else {
      arr.push(props.location.state.data.pCategoryId);
      // setarr1(arr);
    }
  }
  // console.log(arr);
  // }, []);
  // arr.push(props.location.state.data.categoryId);
  // arr.push(props.location.state.data.pCategoryId);
  // // arr.reverse();
  // console.log(arr);

  // let arr = [];
  useEffect(() => {
    // console.log(props);
    if (props.location.state) {
      // console.log(props.location.state.data, 9898989898);
      settitle("修改商品");
      let user = { user: props.location.state.data };
      form.setFieldsValue(user);
      // console.log(user);
      props.location.state.data.imgs.map((item, index) => {
        return setimgs([
          {
            uid: index - 1,
            name: item,
            status: "done",
            url: BASE_IMG_URL + item,
          },
        ]);
      });
    } else {
      settitle("添加商品");
    }
    getoptions();
  }, [props, form]);

  const getoptions = async () => {
    const result = await categorylist();
    // console.log(result);
    let aa = [];
    result.data.map((item) => {
      // console.log(item);
      return aa.push({ value: item.name, label: item.name, isLeaf: false });
    });
    setOptions(aa);
  };
  useEffect(() => {
    return getoptions();
  }, []);
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    const result = await categorylist(targetOption.value, targetOption.value);
    // console.log(result.data);
    targetOption.children = [];
    if (result.data) {
      result.data.map((item) => {
        return targetOption.children.push({
          label: item.name,
          value: item.name,
        });
      });
    } else {
      targetOption.isLeaf = true;
    }
    targetOption.loading = false;
    setOptions([...options]);
  };

  const onFinish = async (values) => {
    // console.log(values);
    // console.log(imgcase);
    // console.log(options);
    if (props.location.state) {
      // console.log(props.location.state.data._id, 66666666);
      const result = await editshop({
        _id: props.location.state.data._id,
        categoryId:
          values.user.shopclass.length > 1 ? values.user.shopclass[1] : "0",
        pCategoryId: values.user.shopclass[0] || "0",
        name: values.user.name || "",
        price: values.user.price || "",
        desc: values.user.desc || "",
        status: props.location.state.data.status,
        imgs: imgcase.length > 0 ? imgcase : "",
        detail: values.user.detail || "",
      });
      // console.log(result);
      if (result.status === 0) {
        message.success(result.msg);
        history.push("/productshop");
      }
    } else {
      const result = await addshopclass({
        categoryId:
          values.user.shopclass.length > 1 ? values.user.shopclass[1] : "0",
        pCategoryId: values.user.shopclass[0] || "0",
        name: values.user.name || "",
        price: values.user.price || "",
        desc: values.user.desc || "",
        status: 1,
        imgs: imgcase.length > 0 ? imgcase : "",
        detail: values.user.detail || "",
      });
      // console.log(result);
      if (result.status === 0) {
        message.success(result.msg);
        history.replace("/productshop");
      } else {
        message.error(result.msg);
      }
    }
  };

  return (
    <Card title={title} extra="?">
      <Form
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        // validateMessages={validateMessages}
      >
        <Form.Item
          name={["user", "name"]}
          // name="name"
          label="商品名称"
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={["user", "desc"]} label="商品描述" rules={[]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name={["user", "price"]}
          label="商品价格"
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
        >
          <Input prefix="￥" suffix="RMB" />
        </Form.Item>
        <Form.Item
          name={["user", "shopclass"]}
          initialValue={arr ? arr : null}
          rules={[
            {
              required: true,
              message: "必填项",
            },
          ]}
          label="商品分类"
        >
          <Cascader
            placeholder="指定商品分类"
            options={options}
            loadData={loadData}
            onChange={onChange}
            changeOnSelect
            notFoundContent
            // suffixIcon={<SwapOutlined />}
          />
        </Form.Item>
        <Form.Item name={["user", "imgcase"]} label="商品图片">
          <Uploadpic
            getimgcase={(imgcase) => {
              setimgcase(imgcase);
            }}
            imgs={imgs}
          ></Uploadpic>
        </Form.Item>
        <Form.Item name={["user", "detail"]} label="商品详情">
          <Input.TextArea />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
