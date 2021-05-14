// pages/demo/demo2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        id:0,
        name:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (id,name) {
      this.setData({
        id:id,
        name:name,
      })
  },

  goback(){
      wx.navigateTo({
        url: '/pages/index/index',
      })
  },
})