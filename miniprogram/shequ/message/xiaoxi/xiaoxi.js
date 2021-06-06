var app=getApp()
var db=wx.cloud.database()
Page({
  data: {
    selected:2,
    message:[],
    id:999,
    allow:false,
    msgnb:[],
    animationData: {},
    x:[],
    xx:[]
  },
  onLoad(){
    this.donghua()
  },
  //刷新消息页面
  shuaxin(){
    var message=app.message
    var zs=message.length
    var x=[]
    for(var i=0;i<zs;i++){
      x[i]=0
    }
    this.setData({
      message:message,
      x:x,
      xx:x
    })
    wx.stopPullDownRefresh({})
  },  
  //查看评论的说说
  chakan(e){
    //要查看的说说的id
    console.log("e:",e)
    var ssid=e.currentTarget.dataset.ssid
    var id=e.currentTarget.dataset.id
    var liuyan=e.currentTarget.dataset.liuyan
    console.log("id:::",id)
    //console.log(ssid)
    this.setData({
      id:id
    })
    
    //删除消息记录
    db.collection("user").doc(app.userInfo._id)
    .update({
      data:{
        message:db.command.pull({
          "id":db.command.eq(id)//这里不知道行不
        })
      }
    }).then((res)=>{
      console.log("删消息（已读）",res)
    })
    wx.navigateTo({
      url:"../../plate2/plate2?liuyan="+liuyan+"&id="+ssid
    })
  },
  //授权消息推送
  shouquan(){
    var id=app.userInfo._id
    if(id!=""){
      wx.navigateTo({
        url: '../shouquan/shouquan',
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '登录后才可进行此操作！是否进行授权登录？',
        showCancel:true,
        confirmText:'是',
        confirmColor:'#000000',
        cancelText:'否',
        cancelColor:'#FF4D49',
        success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.switchTab({url:"../../my/wd/wd"})
          return
        } else if (res.cancel) {
        console.log('用户点击取消')
        return
        }
        }
      })
    }
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    this.shuaxin()
    this.checkred()
    this.allow()
    
  },
  //动画
  donghua(){
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })

    this.animation = animation
    var next=true

    setInterval(
      function(){
        if(next){
          animation.translateY(3).step()
          next=false
        }else{
          animation.translateY(-3).step()
          next=true
        }
    
        this.setData({
          animationData:animation.export()
        })
      }.bind(this),500
    )
    

  },
  //更新授权状态
  allow(){
    this.setData({
      allow:app.userInfo.allow,
      msgnb:app.userInfo.msgnb,
    })
  },
  //刷新消息红点(用于更新非tabar页面未设置的红点)
  checkred(){
    var message=app.message
    var id=this.data.id
    var weidu=app.message.length
    
    if(weidu!=0){
      if(id!=999){
        for(var i=0;i<message.length;i++){
          if(message[i]==id){
            weidu--
            break
          }
        }
      }
      //有未读
      console.log("xiaoxiye")
      wx.setTabBarBadge({
        index: 3,
        text: weidu.toString()
      })
    }else{
      wx.removeTabBarBadge({index: 3})
    }
  },
  //滑动删除
  change(e){
    console.log(e.detail.x)
    var x=e.detail.x
    var xx=this.data.xx
    var index=e.currentTarget.dataset.index
    var zs=this.data.message.length
    if(xx[index]==0 && x<-37.5){
      xx[index]=-75
    }else if(xx[index]==-75 && x>-37.5){
      xx[index]=0
    }
    for(var i=0;i<zs;i++){
      if(i!=index){
        xx[i]=0
      }else{
        console.log("indexqq:",index,i)
      }
    }
    this.setData({
      xx:xx
    })
    
  },
  change1(e){
    var x=this.data.xx
    this.setData({
      x:x
    })
  },
  //删除消息
  delete(e){
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.index)
    console.log(e.currentTarget.dataset.ssid)
    var id=e.currentTarget.dataset.id
    var index=e.currentTarget.dataset.index
    //删除users里的message记录
    //删除消息记录
    var message=this.data.message

    db.collection("user").doc(app.userInfo._id)
    .update({
      data:{
        message:db.command.pull({
          "id":db.command.eq(id)//这里不知道行不
        })
      }
    }).then((res)=>{
      console.log("删消息（已读）",res)
    })

    //把本地改一下
    
    message.splice(index,1)
    var zs=message.length
    var x=[]
    for(var i=0;i<zs;i++){
      x[i]=0
    }

    this.setData({
      message:message,
      x:x,
      xx:x
    })
  },
  //移动回弹
  huitan(){
    var message=this.data.message
    var zs=message.length
    var x=[]
    for(var i=0;i<zs;i++){
      x[i]=0
    }
    this.setData({
      x:x,
      xx:x
    })
    console.log("回弹")
  },
  //刷新1
  shuaxin1(){
    wx.showToast({
      title: '刷新了...',
      icon:'none',
      duration:500
    })
    this.shuaxin()
  },
  //下拉动作-刷新
  onPullDownRefresh: function () {
    this.shuaxin1()
  },
  //
})