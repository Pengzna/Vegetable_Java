var app=getApp()
var db=wx.cloud.database()
var _=db.command
Page({

  data: {
    wenzhang:[{
      nr:"",
      id:"",
      total:"0"
    }],
    canshu:false,
    x:[],
    xx:[]
    
  },

  // 生命周期函数--监听页面加载
  onLoad: function (e) {
    //console.log(e.canshu)////////////////////////////////
    if(e.canshu=="fabude"){
      var wenzhang=app.userInfo.wenzhang
      var canshu=true
      
    }else{
      var wenzhang=app.userInfo.pinglunguode
      var canshu=false
      
    }
    var zs=wenzhang.length
    var x=[]
    for(var i=0;i<zs;i++){
      x[i]=0
    }

    this.setData({
      wenzhang:wenzhang,
      canshu:canshu,
      x:x,
      xx:x
    })
  },
  //删除自己的帖子
  delete(e){
    console.log(e.currentTarget.dataset.ssid)
    console.log(e.currentTarget.dataset.index)
    var that=this
    wx.showModal({
      title: '提示',
      content: '确认删除此帖？删除后无法恢复！',
      showCancel:true,
      confirmText:'确认删除',
      confirmColor:'#FF4D49',
      cancelText:'取消',
      cancelColor:'#000000',
      success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        var ssid=e.currentTarget.dataset.ssid
        var index=e.currentTarget.dataset.index
        var wenzhang=that.data.wenzhang
        wenzhang.splice(index,1);//删除指定index记录
        that.setData({
          wenzhang:wenzhang
        })
        app.userInfo.wenzhang=wenzhang
        var x=that.data.x
        x[index]=0
        that.setData({
          x:x
        })
        wx.showToast({
          title: '删除成功',
          icon:"none"
        })
        db.collection('ss').doc(ssid).get().then((res)=>{
          console.log(res.data.ss_xx.tp)//取到图片判断删图！！！！！！！
          var tp=res.data.ss_xx.tp
          if(tp.length>0){
            wx.cloud.deleteFile({fileList: tp})
          }
          
          //上面已经有了tp,直接删原帖子
          if(tp!=null&&tp!=undefined){
            db.collection('ss').doc(ssid).remove()//删了ss里面的记录
          }
          

          db.collection('users').where({
            _id:app.userInfo._id
          }).update({
            data: {
              wenzhang:_.pull({
                id:_.eq(ssid)
              })
            }
          })
        })
      } else if (res.cancel) {
      console.log('用户点击取消')
      wx.showToast({
        title: '取消删除',
        icon:'none'
      })
      }
      }
      })
  },
  //删除自己的帖子
  delete1(e){
    console.log(e.currentTarget.dataset.ssid)
    console.log(e.currentTarget.dataset.index)
    var that=this
    wx.showModal({
      title: '提示',
      content: '确认删除此条记录？',
      showCancel:true,
      confirmText:'确认删除',
      confirmColor:'#FF4D49',
      cancelText:'取消',
      cancelColor:'#000000',
      success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        var ssid=e.currentTarget.dataset.ssid
        var index=e.currentTarget.dataset.index
        var wenzhang=that.data.wenzhang
        wenzhang.splice(index,1);//删除指定index记录
        that.setData({
          wenzhang:wenzhang
        })
        app.userInfo.pinglunguode=wenzhang
        var x=that.data.x
        x[index]=0
        that.setData({
          x:x
        })
        wx.showToast({
          title: '删除成功',
          icon:"none"
        })
        db.collection('users').where({
          _id:app.userInfo._id
        }).update({
          data: {
            pinglunguode:_.pull({
              id:_.eq(ssid)
            })
          }
        })
      } else if (res.cancel) {
      console.log('用户点击取消')
      wx.showToast({
        title: '取消删除',
        icon:'none'
      })
      }
      }
      })
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    
  },
  //查看评论的说说
  chakan(ssid){
    //要查看的说说的id
    //console.log(ssid)
    var ssid=ssid.currentTarget.dataset.ssid
    //console.log(ssid)
    
    if(this.data.canshu==false){
      wx.cloud.callFunction({
        name:"look",
        data:{
          id:ssid
        }
      })
    }
    wx.navigateTo({
      url:"../plate2/plate2?id="+ssid+"&fenxiang=false&liuyan=false"
    })
    wx.cloud.callFunction({
      name:"look",
      data:{
        id:ssid,
        type:'ss'
      }
    })
  },
  //滑动删除
  change(e){
    console.log(e.detail.x)
    var x=e.detail.x
    var xx=this.data.xx
    var index=e.currentTarget.dataset.index
    //console.log("index:",index)
    var zs=this.data.wenzhang.length

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
  }
})