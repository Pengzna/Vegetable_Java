var db=wx.cloud.database()
var app=getApp()
Page({

  data: {
    youxiang:"",
    weixin:"",
    nm:"",
    ID:""
  },
  onLoad(){
    this.huoqu()
    this.setData({
      ID:app.userInfo._id
    })
  },
  //复制邮箱
  fuzhi(e){
    //console.log(e.currentTarget.dataset.item)
    wx.setClipboardData({
      data: e.currentTarget.dataset.item,
      success (res) {
        console.log("成功")
      }
    })
  },
  //获取
  huoqu(){
    db.collection('system').where({'_id':'002'})
      .get().then((res)=>{
        console.log(res.data[0])
        this.setData({
          youxiang:res.data[0].youxiang,
          weixin:res.data[0].weixin,
          nm:res.data[0].nm
        })
      })
  }
})