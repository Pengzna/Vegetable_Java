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
    "list": [
      {
        "pagePath": "../../shop/index/index",
        "text": "首页",
        "iconPath":"../../images/shop/sy_1.png",
        "selectedIconPath":"../../images/shop/sy_2.png"
      },
      {
        "pagePath": "../../shop/shopping_cart/shopping_cart",
        "text": "购物车",
        "iconPath":"../../images/shop/sc_1.png",
        "selectedIconPath":"../../images/shop/sc_2.png"
      },
      {
        "pagePath": "../../shop/my/my",
        "text": "我的",
        "iconPath":"../../images/shop/my_1.png",
        "selectedIconPath":"../../images/shop/my_2.png"
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
