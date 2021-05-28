// miniprogram/pages/message/shouquan/shouquan.js
var app=getApp()
var db=wx.cloud.database()
Page({
  data: {
    allow:'true',
    msgnb:[0,0],
    // gao:750,
    tmplIds:['IOXeoWHeYUbuM3TJKzyPM1XR-J7iX6HIc9-YWYcYny0','9kAS4BdEjH46glaAr-wuo_qZndRNkp5Zqe3vWZbAab4']
  },

  onLoad: function (e) {
    this.setData({
      allow:app.userInfo.allow,
      msgnb:app.userInfo.msgnb,
      //gao:wx.getSystemInfoSync().windowHeight
    })
  },
  //开启或者关闭授权
  bindchange(){
    var allow=this.data.allow
    if(allow){
      allow=false
    }else{
      allow=true
    }
    this.setData({
      allow:allow
    })
    app.userInfo.allow=allow
  },
  //隐藏页面上传allow状态

  //主动授权
  allow(){
    const tmplIds=this.data.tmplIds
    var that=this
    wx.requestSubscribeMessage({
    tmplIds:tmplIds,
    success(res) {
      console.log("订阅消息API调⽤成功：",res) 
      var diyi='IOXeoWHeYUbuM3TJKzyPM1XR-J7iX6HIc9-YWYcYny0'
      var dier='9kAS4BdEjH46glaAr-wuo_qZndRNkp5Zqe3vWZbAab4'
      var msgnb=that.data.msgnb
      console.log(res[diyi],res[dier])
      if(res[diyi]=='accept'){
        //第一个模板,评论
        msgnb[0]++
      }else if(res[diyi]=='reject'){
        wx.showToast({
          title: '您拒绝了接收评论',
          icon:'none',
          duration: 1000
        })
      }
      if(res[dier]=='accept'){
        //第二个模板,回复
        msgnb[1]++
      }else if(res[dier]=='reject'){
        wx.showToast({
          title: '您拒绝了接收回复',
          icon:'none',
          duration: 1000
        })
      }
      console.log(msgnb)
      that.setData({
        msgnb:msgnb
      })
      app.userInfo.allow=true
      ////首次授权调用授权成功,下次直接进入剩余推送次数页面
      //首次授权调用
      that.setData({
        allow:'true',
        msgnb:msgnb
      })
      db.collection('users').doc(app.userInfo._id).update({
        data:{
          allow:true,
          msgnb:msgnb
        }
      })
      console.log('已经进行了第一次授权，不再出现此页面！')
     
    },
    fail(res) {
      console.log("订阅消息API调⽤失败：",res)
      var errCode=res.errCode
      if(errCode==20004){
        wx.showToast({
          title: '您拒绝接收消息',
          icon:'none'
        })
        this.turrenoff()
      }}
    })

  },
  //增加授权
  allowup(e){
    console.log("e:",e.currentTarget.dataset.index)
    var index=e.currentTarget.dataset.index
    var diyi='IOXeoWHeYUbuM3TJKzyPM1XR-J7iX6HIc9-YWYcYny0'
    var dier='9kAS4BdEjH46glaAr-wuo_qZndRNkp5Zqe3vWZbAab4'
    var tmplIds=this.data.tmplIds
    if(index==0){
      console.log("被评论")
      tmplIds=[diyi]
    }else{
      console.log("被回复")
      tmplIds=[dier]
    }
  
    var that=this
    wx.requestSubscribeMessage({
    tmplIds:tmplIds,
    success(res) {
      console.log("订阅消息API调⽤成功：",res,"up") 
      
      var msgnb=that.data.msgnb
      console.log(res[diyi],res[dier])
      if(res[diyi]=='accept'){
        //第一个模板,评论
        msgnb[0]++
      }else if(res[diyi]=='reject'){
        wx.showToast({
          title: '您拒绝了接收评论',
          icon:'none',
          duration: 1000
        })
      }
      if(res[dier]=='accept'){
        //第二个模板,回复
        msgnb[1]++
      }else if(res[dier]=='reject'){
        wx.showToast({
          title: '您拒绝了接收回复',
          icon:'none',
          duration: 1000
        })
      }

      console.log(msgnb)
      that.setData({
        msgnb:msgnb
      })
    },
    fail(res) {
      console.log("订阅消息API调⽤失败：",res)
      var errCode=res.errCode
      if(errCode==20004){
        wx.showToast({
          title: '您拒绝接收消息',
          icon:'none'
        })
        this.turrenoff()
      }
    }
    })
  },

  onReady: function () {

  },

  onShow: function () {
    //var now=new Date()//.getTime()//现在的时间
    // var hour = now.getHours();
    // console.log("现在的小时：",hour)
    
  },

  onUnload: function () {
    //加到数据库
    console.log("加到数据库")
    var msgnb=this.data.msgnb
    var allow=app.userInfo.allow
    db.collection('users').doc(app.userInfo._id).update({
      data:{
        msgnb:msgnb,
        allow:allow
      }
    })
    console.log('增加了所有授权')
  },
})