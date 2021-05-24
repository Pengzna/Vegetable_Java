// pages/forest.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
      userCredict : App.globalData.userCredict,
      icon:[
        "/images/myTree1.png",
        "/images/myTree2.png",
        "/images/myTree3.png"
      ],  
      isShow:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],       
      count:0,
      // check:false
  },
  onClick: function(){
    var isPlanted = 0
    var count = this.data.count
    while(isPlanted == 0 && count<=21)
    {
      var randomTree = parseInt(22 * Math.random())
      if(this.data.isShow[randomTree] == 0)
      {
        this.setData({
        [`isShow[${randomTree}]`]:1,
        })
        isPlanted=1
      }
    }
      count++
      this.setData({
        count:count
      })
    console.log("this date count is " + count)
    if(count > 30)
      console.log("there is some errors")
    this.onLoad
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {

  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})