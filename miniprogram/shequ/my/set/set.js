var db=wx.cloud.database()
var app=getApp()
Page({

  data: {
    tx:"",
    nm:""
  },
  //更新微信头像与昵称
  GetUserInfo(xx){
    let userInfo = xx.detail.userInfo;
    app.userInfo.userinfo.name=userInfo.avatarUrl
    app.userInfo.userinfo.photo=userInfo.nickName
    db.collection('users').doc(app.userInfo._id).update({
      data:{
        'userinfo.userphoto':userInfo.avatarUrl,
        'userinfo.username':userInfo.nickName,
      }
    }).then((res)=>{
      this.setData({
        tx:userInfo.avatarUrl,
        nm:userInfo.nickName
      })
      console.log("更新成功",res)
      wx.showToast({
        title: '更新成功',
        duration: 3000
      })

    })
    
  },
  onLoad(){
    var tx=app.userInfo.userinfo.userphoto
    var nm=app.userInfo.userinfo.username
    console.log(tx)
    this.setData({
      tx:tx,
      nm:nm
    })
  }
})