var map;
var point;
var customLayer;
window.onload = init;

document.getElementById("searchBtn");
function init() {
    map = new BMap.Map("l-map");          // 创建地图实例
    point = new BMap.Point(116.403694,39.927552);  // 创建点坐标
    map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom();
    map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
    addCustomLayer();
    addResult();
}
function addCustomLayer(keyword) {
    if (customLayer) {
        map.removeTileLayer(customLayer);
    }
    customLayer=new BMap.CustomLayer({
        geotableId: 59591,
        q: '', //检索关键字
        tags: '', //空格分隔的多字符串
        filter: 'date:140404,' //过滤条件,参考http://developer.baidu.com/map/lbs-geosearch.htm#.search.nearby
    });
    map.addTileLayer(customLayer);
    customLayer.addEventListener('hotspotclick',callback);
}
function addResult() {
    var ul  = document.getElementById("resultList");
    for (var i = 0; i < 10; i++){
        var tmp = document.createElement("li");
        tmp.innerHTML = "test";
        ul.appendChild(tmp);
    }

}
function printTest()
{
    var p = document.getElementById("myTest");

}


function callback(e)//单击热点图层
{
        var customPoi = e.customPoi;//poi的默认字段
        var contentPoi=e.content;//poi的自定义字段
        var content = '<p style="width:280px;margin:0;line-height:20px;">地址：' + customPoi.address + '<br/>价格:'+contentPoi.dayprice+'元'+'</p>';
        var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
            title: customPoi.title, //标题
            width: 290, //宽度
            height: 40, //高度
            panel : "panel", //检索结果面板
            enableAutoPan : true, //自动平移
            enableSendToPhone: true, //是否显示发送到手机按钮
            searchTypes :[
                BMAPLIB_TAB_SEARCH,   //周边检索
                BMAPLIB_TAB_TO_HERE,  //到这里去
                BMAPLIB_TAB_FROM_HERE //从这里出发
            ]
        });
        var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
        searchInfoWindow.open(point);
}


document.getElementById("open").onclick = function(){
    addCustomLayer();
};

document.getElementById("close").onclick = function(){
    if (customLayer) {
        map.removeTileLayer(customLayer);
    }
};

// 创建CityList对象，并放在citylist_container节点内
var myCl = new BMapLib.CityList({container : "citylist_container", map : map});

// 给城市点击时，添加相关操作
myCl.addEventListener("cityclick", function(e) {
    // 修改当前城市显示
    document.getElementById("curCity").innerHTML = e.name;

    // 点击后隐藏城市列表
    document.getElementById("cityList").style.display = "none";
});

// 给“更换城市”链接添加点击操作
document.getElementById("curCityText").onclick = function() {
    var cl = document.getElementById("cityList");
    if (cl.style.display == "none") {
        cl.style.display = "";
    } else {
        cl.style.display = "none";
    }
};

// 给城市列表上的关闭按钮添加点击操作
document.getElementById("popup_close").onclick = function() {
    var cl = document.getElementById("cityList");
    if (cl.style.display == "none") {
        cl.style.display = "";
    } else {
        cl.style.display = "none";
    }
};