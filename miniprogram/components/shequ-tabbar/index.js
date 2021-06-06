// components/tabbar/index.js
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
        "pagePath": "/shequ/index/index",
        "iconPath": "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/shequ/tabBar/zhuye0.png",
        "selectedIconPath": "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/shequ/tabBar/zhuye1.png",
        "text": "主页"
      },
      
      {
        "pagePath": "/shequ/post/post",
        "text": "发布",
        "iconPath": "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/shequ/tabBar/add0.png",
        "selectedIconPath": "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/shequ/tabBar/add1.png"
      },
      {
        "pagePath": "/shequ/message/xiaoxi/xiaoxi",
        "text": "消息",
        "iconPath": "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/shequ/tabBar/xiaoxi0.png",
        "selectedIconPath": "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/shequ/tabBar/xiaoxi1.png"
      },
      {
        "pagePath": "/shequ/my/wd/wd",
        "text": "我的",
        "iconPath": "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/shequ/tabBar/wode0.png",
        "selectedIconPath": "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/shequ/tabBar/wode1.png"
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
