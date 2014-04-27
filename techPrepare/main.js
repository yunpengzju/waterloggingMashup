var map;
var point;
var customLayer = null;
var page = 0;     // 当前页面
var points = [];  // 符合要求的点集
var flag = 0;  // 0为正常地图，1为热力图

$(document).ready(function() {
    map = new BMap.Map("map");          // 创建地图实例
    point = new BMap.Point(116.403694,39.927552);  // 创建点坐标
    map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
    map.enableScrollWheelZoom();
    map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
    //addCustomLayer();
    searchAction();
    $('#searchBtn').on('click', search);
    $('#switch').on('click', switchMap);
});


// 用于测试
function printTest(s)
{
    var p = document.getElementById("myTest");
    p.innerHTML = s;
}


// 执行本地搜索
function search(){
    var key = $('#keyword').val();
    searchAction(key);
}

// 执行LBS云检索，并调用renderMap函数绘制地图
// keyword为检索关键词，默认为空
// page为当前页码，默认为0
function searchAction(keyword, page) {
    page = page || 0;

    var filter = []; //过滤条件
    var url = "http://api.map.baidu.com/geosearch/v3/local?";
    $.getJSON(url, {
        'q'          : keyword, //检索关键字
        'filter'     : '',  //过滤条件
        'geotable_id': 59591,
        'ak'         : '7xfCf9eh3Gdfdf4U2UoCqNxC'  //用户ak
    },function(e) {
        var content = e.contents;
        renderMap(e);
    });

}

// 输入参数： res ： LBS云检索返回的Json数据  page： 当前查看的页面编码
// 本函数利用服务器返回的地图POI点信息绘制地图

function renderMap(res, page) {
    var content = res.contents;
    $('#mapList').html('');
    map.clearOverlays();
    points.length = 0;

    if (content.length == 0) {
        $('#mapList').append($('<p style="border-top:1px solid #DDDDDD;padding-top:10px;text-align:center;text-align:center;font-size:18px;" class="text-warning">抱歉，没有找到您想要的内涝信息，请重新查询</p>'));
        return;
    }

    $.each(content, function(i, item){
        var point = new BMap.Point(item.location[0], item.location[1]),
            marker = new BMap.Marker(point);
        points.push(point);
        var tr = $("<tr><td width='75%'><a href='www.baidu.com' target='_blank' >" + item.title + "<a/><br/>" + item.address + "</td></tr>").click(showInfo);
        $('#mapList').append(tr);;
        marker.addEventListener('click', showInfo);
        function showInfo() {
            // var content = "<img src='" + item.mainimage + "' style='width:111px;height:83px;float:left;margin-right:5px;'/>" +
            var content = "<p>名称：" + item.title + "</p>" +
                          "<p>地址：" + item.address + "</p>" ;
            //创建检索信息窗口对象
            var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
                title  : item.title,       //标题
                width  : 290,             //宽度
                panel  : "panel",         //检索结果面板
                enableAutoPan : true,     //自动平移
                searchTypes   :[
                    BMAPLIB_TAB_SEARCH,   //周边检索
                    BMAPLIB_TAB_TO_HERE,  //到这里去
                    BMAPLIB_TAB_FROM_HERE //从这里出发
                ]
            });
            searchInfoWindow.open(marker);
        };
        map.addOverlay(marker);
    });


    /**
     * 分页
     */
    var pagecount = Math.ceil(res.total / 10);
    if (pagecount > 76) {
        pagecount = 76; //最大页数76页
    }
    function PageClick (pageclickednumber) {
        pageclickednumber = parseInt(pageclickednumber);
        $("#pager").pager({ pagenumber: pageclickednumber, pagecount: pagecount, showcount: 3, buttonClickCallback: PageClick });
        searchAction(keyword, pageclickednumber -1);
    }
    $("#mapPager").pager({ pagenumber: page, pagecount: pagecount, showcount:3, buttonClickCallback: PageClick });

    map.setViewport(points);
}
// 切换当前地图，如果当前为普通地图（flag = 0） 则切换为热力图
// 反之亦然。。。切换同时修改按钮上的内容
function switchMap(){
    if (0 == flag) {
        flag = 1;
        drawHeatMap();
        $("#switch").html("普通地图");
    }
    else {
        flag = 0;
        searchAction();
        $("#switch").html("热力图");
    }
}
// 画热力图，目前尚未完成热力图参数的调试
function drawHeatMap() {
    if(!isSupportCanvas()){
        alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~');
    }
    heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
    map.addOverlay(heatmapOverlay);
    heatmapOverlay.setDataSet({data:points,max:100});
}

// 验证浏览器是否支持画布，如果不支持则无法绘制热力图
function isSupportCanvas(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}


// wait to delete
// function addCustomLayer(keyword) {
//     if (customLayer) {
//         map.removeTileLayer(customLayer);
//     }
//     customLayer=new BMap.CustomLayer({
//         geotableId: 59591,
//         q: keyword, //检索关键字
//         tags: '', //空格分隔的多字符串
//         filter: '' //过滤条件,参考http://developer.baidu.com/map/lbs-geosearch.htm#.search.nearby
//     });
//     map.addTileLayer(customLayer);
//     customLayer.addEventListener('hotspotclick',callback);
// }

// function callback(e)//单击热点图层
// {
//         var customPoi = e.customPoi;//poi的默认字段
//         var contentPoi=e.content;//poi的自定义字段
//         var content = '<p style="width:280px;margin:0;line-height:20px;">地址：' + customPoi.address + '<br/>价格:'+contentPoi.dayprice+'元'+'</p>';
//         var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
//             title: customPoi.title, //标题
//             width: 290, //宽度
//             height: 40, //高度
//             panel : "panel", //检索结果面板
//             enableAutoPan : true, //自动平移
//             enableSendToPhone: true, //是否显示发送到手机按钮
//             searchTypes :[
//                 BMAPLIB_TAB_SEARCH,   //周边检索
//                 BMAPLIB_TAB_TO_HERE,  //到这里去
//                 BMAPLIB_TAB_FROM_HERE //从这里出发
//             ]
//         });
//         var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
//         searchInfoWindow.open(point);
// }
