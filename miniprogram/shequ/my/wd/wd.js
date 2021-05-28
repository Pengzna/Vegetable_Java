// miniprogram/pages/wd/wd.js
const app=getApp()
const db = wx.cloud.database()
Page({
  data: {
    selected:3,
    userphoto:"../../../images/shequ/user/user.png",
    username:"ly",
    anonymous:"ss",
    login:"未知",
    isVIP:false,
    wenzhang:[],
    message:[],
    fenxiang:"false"
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
          allow:true,
          ban:false,
          msgnb:[0,0],
          online:true,
          wenzhang:[],
          message:[],
          pinglunguode:[],
          weiguinb:0,
          userinfo:{
            userphoto:userInfo.avatarUrl,
            username:userInfo.nickName,
            anonymous:"",
            isVIP:false,
            login:true,
          },
          
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
          if(app.fenxiang=="true"){
            app.fenxiang=="false"
            wx.navigateTo({
              url:"../../plate2/plate2?id="+app.fxssid+"&fenxiang=false"
            })
          }
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
        db.collection("users").where({_openid:app.userInfo._openid}).get().then((res)=>{
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
            if(app.fenxiang=="true"){
              app.fenxiang=="false"
              wx.navigateTo({
                url:"/pages/plate2/plate2?id="+app.fxssid+"&fenxiang=false"
              })
            }
          }else{
            this.setData({
              login:false
            })
            app.userInfo.userinfo=Object.assign(app.userInfo.userinfo,{login:false})
            /*付给app下的登录状态为false*/
            wx.showToast({
              title: '还未授权登录',
              icon: 'none',
              duration: 2000,
            })
          }  
        })
      });
    }
  },
  //查看我的头像
  chakantouxiang(){
    var url=app.userInfo.userinfo.userphoto
    wx.previewImage({
      urls: [url],
    })
  },
  /**生命周期函数--监听页面加载*/
  onLoad: function () {
    this.weidengluchongshi()
  },
  /* 生命周期函数--监听页面显示*/
  onShow: function () {
    this.checkred()
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
  
  /** 页面相关事件处理函数--监听用户下拉动作*/
  onPullDownRefresh: function () {

    var _id=app.userInfo._id
    db.collection('users').doc(_id).get().then((res)=>{
      console.log("取到信息",res.data)
      this.setData({
        userphoto:res.data.userinfo.userphoto,
        username:res.data.userinfo.username,
        anonymous:res.data.userinfo.anonymous,
        isVIP:res.data.userinfo.isVIP,
        login:res.data.userinfo.login,
        wenzhang:res.data.wenzhang,
        message:res.data.message,
      })
      app.userInfo=res.data
      wx.stopPullDownRefresh({})
      wx.showToast({
        title: '刷新成功',
        icon:'none',
        duration:800
      })
    })
  },
  //刷新消息红点(用于更新非tabar页面未设置的红点)
  checkred(){
    var weidu=app.message.length
    if(weidu!=0){
      //有未读
      wx.setTabBarBadge({
        index: 3,
        text: weidu.toString()
      })
    }else{
      wx.removeTabBarBadge({index: 3})
    }
  },
})