// miniprogram/pages/wd/wd.js
const app=getApp()
const db = wx.cloud.database()
Page({
  data: {
    userphoto:"/images/user/未登录头象.png",
    username:"梦之泪伤",
    anonymous:"",
    login:"未知",
    isVIP:false,
    wenzhang:[],
    message:[],
  },
  /*这是用户授权登录向数据库提交 */
  GetUserInfo(xx){
    let userInfo = xx.detail.userInfo;
    //console.log(userInfo)
    if(!this.data.login&&userInfo){
      wx.showLoading({
        title: '登陆中',
      })
      db.collection('users').add({
        data:{
          userinfo:{
            userphoto:userInfo.avatarUrl,
            username:userInfo.nickName,
            anonymous:"",
            isVIP:false,
            login:true,
          },
          wenzhang:[],
          message:[],
        }
      }).then((res)=>{
        db.collection('users').doc(res._id).get().then((res)=>{
          app.userInfo=Object.assign(app.userInfo,res.data);
          //console.log(res.data);
          wx.hideLoading()
          this.setData({
            userphoto:app.userInfo.userinfo.userphoto,
            username:app.userInfo.userinfo.username,
            anonymous:app.userInfo.userinfo.anonymous,
            isVIP:app.userInfo.userinfo.isVIP,
            login:true,
            wenzhang:app.userInfo.wenzhang,
            message:app.userInfo.message,
          })
          wx.showToast({
            title: '登陆成功！',
          })
        })
      })
    }
  },
   /*未登录下的重试 */
  weidengluchongshi(){
    let logined=app.userInfo.userinfo.login;
    //console.log(app.userInfo);
    if(logined!=true){
      /*若不是登录状态调用云函数登录*/ 
      wx.showLoading({
        title: '尝试登录',
      })
      wx.cloud.callFunction({
        name:'login',
        data:{}
      }).then((res)=>{
        //console.log(res.result.openid)
        db.collection("users").where({
          _openid:res.result.openid
        }).get().then((res)=>{
          //console.log(res);
          app.userInfo=Object.assign(app.userInfo,res.data[0]);
          if(app.userInfo.userinfo.login==true){
            /*如果有登录信息则加载*/ 
            this.setData({
              userphoto:app.userInfo.userinfo.userphoto,
              username:app.userInfo.userinfo.username,
              anonymous:app.userInfo.userinfo.anonymous,
              isVIP:app.userInfo.userinfo.isVIP,
              login:app.userInfo.userinfo.login,
              wenzhang:app.userInfo.wenzhang,
              message:app.userInfo.message,
            })
            wx.hideLoading()
          }else{
            this.setData({
              login:false
            })
            app.userInfo.userinfo=Object.assign(app.userInfo.userinfo,{login:false})
            /*付给app下的登录状态为false*/
            wx.showToast({
              title: '还未授权登录',
            })
          }
        })
      });
    }
  },

  /**生命周期函数--监听页面加载*/
  onLoad: function () {
    this.weidengluchongshi()
  },
  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    this.setData({
      userphoto:app.userInfo.userinfo.userphoto,
      username:app.userInfo.userinfo.username,
      anonymous:app.userInfo.userinfo.anonymous,
      isVIP:app.userInfo.userinfo.isVIP,
      login:app.userInfo.userinfo.login,
      wenzhang:app.userInfo.wenzhang,
      message:app.userInfo.message,
    })
  },
  
  /** 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {
  },
  
  /** 生命周期函数--监听页面卸载 */
  onUnload: function () {

  },
  /** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {

  },
})