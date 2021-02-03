import {
  AppstoreFilled,
  SkinFilled,
  CalendarFilled,
  DatabaseFilled,
  HeartFilled,
  RedditSquareFilled,
  SketchCircleFilled,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  // DollarCircleOutlined,
} from "@ant-design/icons";
const menuList = [
  {
    title: "首页", // 菜单标题名称
    key: "/home", // 对应的path
    icon: <AppstoreFilled />, // 图标名称
    isPublic: true, // 公开的
  },
  {
    title: "商品",
    key: "/products",
    icon: <SkinFilled />,
    children: [
      // 子菜单列表
      {
        title: "品类管理",
        key: "/category",
        icon: <CalendarFilled />,
      },
      {
        title: "商品管理",
        key: "/productshop",
        icon: <DatabaseFilled />,
      },
    ],
  },

  {
    title: "用户管理",
    key: "/user",
    icon: <HeartFilled />,
  },
  {
    title: "角色管理",
    key: "/role",
    icon: <RedditSquareFilled />,
  },

  {
    title: "地图类",
    key: "/charts",
    icon: <SketchCircleFilled />,
    children: [
      {
        title: "iframe",
        key: "/charts/bar",
        icon: <BarChartOutlined />,
      },
      {
        title: "api(定位)",
        key: "/charts/line",
        icon: <LineChartOutlined />,
      },
      {
        title: "暂无",
        key: "/charts/pie",
        icon: <PieChartOutlined />,
      },
    ],
  },

  // {
  //   title: "订单管理",
  //   key: "/order",
  //   icon: <DollarCircleOutlined />,
  // },
];

export default menuList;
