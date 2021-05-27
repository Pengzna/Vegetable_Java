// components/shoping-tabbar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    selected: {
      type: Number,
      default:0
    }
  },  

  /**
   * 组件的初始数据
   */
  data: {
    selected:0,
    "selectedColor": "red",
    "list": [
      {
        "pagePath": "/miniprogram/shop/index/index",
        "iconPath": "../../images/shop/home.png",
        "selectedIconPath": "../../images/shop/home-o.png",
        "text": "首页"
      },
      {
        "pagePath": "../../shop/goodslist/index",
        "iconPath": "../../images/shop/category.png",
        "selectedIconPath": "../../images/shop/category-o.png",
        "text": "商品详情"
      },
 
      {
        "pagePath": "../../shop/user/index",
        "iconPath": "../../images/shop/my.png",
        "selectedIconPath": "../../images/shop/my-o.png",
        "text": "我的"
      }
    ]
  },


  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      let data = e.currentTarget.dataset
      let url = data.path
      wx.redirectTo({
        url
      })
    }
  }
})
