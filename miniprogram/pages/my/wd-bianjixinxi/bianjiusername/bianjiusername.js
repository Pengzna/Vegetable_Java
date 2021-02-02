// miniprogram/pages/my/wd-bianjixinxi/bianjiusername/bianjiusername.js
const app=getApp()
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:""
  },
  shuju(ev){
    console.log(ev.detail.value)
    this.setData({
      username:ev.detail.value
    })
  },
  tijiao(){
    wx.showLoading({
      title: '提交中',
    })
    //console.log(this.data.username)
    if(this.data.username!=""){
      /*此时可以上传了 */
      let username=this.data.username
      db.collection("users").doc(app.userInfo._id).update({
        data:{
          userinfo:{username:username}
        }
      }).then((res)=>{
        wx.hideLoading({})
        wx.showToast({
          title: '修改成功',
        })
        app.userInfo.userinfo.username=username
        wx.navigateBack({delta: 1})
      })
    }else{
      wx.showToast({
        title: '签名不能为空',
      })
    }
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
  onShow: function () {
    this.setData({
      username:app.userInfo.userinfo.username
    })
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

  }
})