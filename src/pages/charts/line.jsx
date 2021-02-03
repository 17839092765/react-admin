import { useEffect, useState } from "react";
import { getpostion } from "../../api/index";
import store from "../../store";
// import { Map, Marker, InfoWindow } from "react-amap";
const AMap = window.AMap;
// const mapKey = "63f2a2a297971a375d76bb2295481955"; //需要自己去高德官网上去申请
export default function Line() {
  const [position, setposition] = useState();
  const [type, settype] = useState();
  const [clickpostion, setclickpostion] = useState();
  const [postioncase, setpositioncase] = useState(
    "由于众多浏览器已不再支持非安全域的定位请求，为保位成功率和精度，请升级您的站点到HTTPS"
  );
  // console.log(AMap);
  useEffect(() => {
    function aaa() {
      if (AMap) {
        var map = new AMap.Map("container", {
          zoom: 1,
          resizeEnable: true,
        });
        AMap.plugin("AMap.Geolocation", function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：5s
            buttonPosition: "RB", //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, //定位成功后是否自动调整地图视野到定位点
            city: "010", // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          });
          map.addControl(geolocation);
          //为地图注册click事件获取鼠标点击出的经纬度坐标
          map.on("click", function (e) {
            // document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
            // console.log(e);
            setclickpostion("" + e.lnglat);
          });
          geolocation.getCurrentPosition(function (status, result) {
            if (status === "complete") {
              onComplete(result);
            } else {
              onError(result);
            }
          });
        });

        //解析定位结果
        async function onComplete(data) {
          // document.getElementById("status").innerHTML = "定位成功";
          // var str = [];
          // console.log(data.position);
          // console.log(data.accuracy);
          // console.log("a" + data.position, 88);
          setposition("定位结果：" + data.position);
          settype("定位类别：" + data.location_type);
          const result = await getpostion("" + data.position);
          // console.log(result);
          if (result.regeocode.formatted_address) {
            setpositioncase(result.regeocode.formatted_address);
            store.dispatch({
              type: "getCity",
              data: result.regeocode.addressComponent.district,
            });
          }
          // str.push("定位结果：" + data.position);
          // str.push("定位类别：" + data.location_type);
          // if (data.accuracy) {
          //   str.push("精度：" + data.accuracy + " 米");
          // } //如为IP精确定位结果则没有精度信息
          // str.push("是否经过偏移：" + (data.isConverted ? "是" : "否"));
          // document.getElementById("result").innerHTML = str.join("<br>");
        }
        //解析定位错误信息
        function onError(data) {
          // document.getElementById("status").innerHTML = "定位失败";
          // document.getElementById("result").innerHTML =
          //   "失败原因排查信息:" + data.message;
        }
        //为地图注册click事件获取鼠标点击出的经纬度坐标
        // map.on("click", function (e) {
        //   document.getElementById("lnglat").value =
        //     e.lnglat.getLng() + "," + e.lnglat.getLat();
        // });
      }
    }

    aaa();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "80vh" }}>
      <div id="container" style={{ width: "100%", height: "100%" }}></div>
      <div
        style={{
          width: "300px",
          height: "50px",
          position: "absolute",
          top: "10px",
          right: "20px",
        }}
      >
        <h4>{"定位成功"}</h4>
        <hr />
        <p>{position}</p>
        <p>{type}</p>
        <hr />
        <p>{postioncase}</p>
      </div>
      <div style={{ position: "absolute", bottom: "10px", right: "50px" }}>
        <h4>左击获取经纬度：</h4>
        <div>
          <p>{clickpostion}</p>
          {/* <input type="text" value={} /> */}
        </div>
      </div>
    </div>

    // <div style={{ width: "100%", height: "100%" }}>
    //   <div style={{ width: "100%", height: "100%" }}>
    //     <Map plugins={["ToolBar", "Scale"]} amapkey={mapKey} zoom={15}></Map>
    //     <InfoWindow
    //     // position={}
    //     // visible={true}
    //     // isCustom={false}
    //     // // content={html}
    //     // size={this.state.size}
    //     // offset={this.state.offset}
    //     // events={this.windowEvents}
    //     />
    //   </div>
    // </div>
  );
}
