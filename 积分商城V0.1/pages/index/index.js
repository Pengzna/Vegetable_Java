// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {


    swiperList:
    [{
      goods_id:"0",
      image_src:"https://z3.ax1x.com/2021/05/20/go190J.jpg",
      goods_name:"瓶盖灯" ,
      navigator_url: "/pages/goods_detail/index?goods_id={{item.goods_id}}"
    },
    {
      goods_id:"1",
      image_src:"https://z3.ax1x.com/2021/05/20/gouV4f.jpg",
      goods_name:"手提袋",
      navigator_url: "/pages/goods_detail/index?{{item.goods_id}}"
    },
    {
      goods_id:"2",
      image_src:"https://z3.ax1x.com/2021/05/20/goum8S.jpg",
      goods_name:"线圈车",
      navigator_url: "/pages/goods_detail/index?{{item.goods_id}}"
    }
  ],
  catesList:[{
    name:"二手电子设备",
    image_src:"https://z3.ax1x.com/2021/05/20/gT8Fjf.png"
  },
  {name:"二手工艺品",
  image_src:"https://z3.ax1x.com/2021/05/20/gT8igP.png"

  },
{
  name:"二手衣物",
  image_src:"https://z3.ax1x.com/2021/05/20/gT8P3t.png"
}],






floorList: [
  {
      "floor_title": {
          "name": "时尚女装",
          "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor01_title.png"
      },
      "product_list": [
          {
              "name": "优质服饰",
              "image_src": "https://z3.ax1x.com/2021/05/20/go190J.jpg",
              "image_width": "232",
              "open_type": "navigate",
              "navigator_url": "/pages/goods_list/index?query=服饰"
          },
          
      ]
  },
  {
      "floor_title": {
          "name": "户外活动",
          "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor02_title.png"
      },
      "product_list": [
          {
              "name": "勇往直前",
              "image_src": "https://z3.ax1x.com/2021/05/20/go190J.jpg",
              "image_width": "232",
              "open_type": "navigate",
              "navigator_url": "/pages/goods_list/index?query=户外"
          },
         
      ]
  },
  {
      "floor_title": {
          "name": "箱包配饰",
          "image_src": "https://api-hmugo-web.itheima.net/pyg/pic_floor03_title.png"
      },
      "product_list": [
          {
              "name": "清新气质",
              "image_src": "https://z3.ax1x.com/2021/05/20/go190J.jpg",
              "image_width": "232",
              "open_type": "navigate",
              "navigator_url": "/pages/goods_list?query=饰品"
          },
      ]
  }
]
}
}
)