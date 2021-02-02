// miniprogram/pages/index/index.js
const app=getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanggaotu:[
      'https://note.youdao.com/yws/api/personal/file/faf88801c199beb76bb281ff71e3f009?method=download&shareKey=0c239539bae6e554f8ea51634261b745&inline=true',
      'https://note.youdao.com/yws/api/personal/file/5ac62b257dbc8aeedfccf3766f10afb9?method=download&shareKey=fd432216a03ed8fbcf86ada0fb5ea124&inline=true'
    ],
    gonggaonr:[
      "第一",
      "第二",
      "iGame"
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*调用云函数登录*/ 
    wx.showLoading({
      title: '检查登录',
    })
    wx.cloud.callFunction({
      name:'login',
      data:{}
    }).then((res)=>{
      //console.log(res)
      db.collection("users").where({
        _openid:res.result.openid
      }).get().then((res)=>{
        //console.log(res.data[0]);
        app.userInfo=Object.assign(app.userInfo,res.data[0]);
        wx.hideLoading()
        if(app.userInfo._openid==""){
          /*如果没有登录信息则跳转到wd*/ 
          wx.switchTab({url:"../my/wd/wd"})
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showgonggaoxiangqing(){
    wx.navigateTo({
      url:"../index/gonggaoxiangqing/gonggaoxiangqing"
    })
  },
  tiaozhuan(){
    wx.navigateTo({
      url:"../index/gonggaoxiangqing/gonggaoxiangqing"
    })
  }
})