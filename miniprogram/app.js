//app.js

App({
  onLaunch: function () {
    //云开发环境初始化
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
         env: 'cloud1-2gm89gcbba9c155c',
        traceUser: true,
      })
    
    this.shuaxin=false
    this.fenxiang="false"
    this.fxssid=""
    this.glid="9999"
    this.message=[]
    this.globalData = {}
    this.systeminfo=""
    this.loveinfo=""
    this.ssinfo={
      lovenb:"",
      plnb:"",
      looknb:""
    }
    this.userInfo={
      allow:true,
      ban:false,
      msgnb:[0,0],
      online:false,
      _openid:"",
      _id:"",
      wenzhang:[],
      message:[],
      pinglunguode:[],
      userinfo:{
        userphoto:"./images/shequ/user/user.png",
        username:"匿名用户",
        anonymous:"",
        isVIP:false,
        login:"未知",
      },
      
    }
  },
  //进入小程序就上线
  onShow(){
    //wx.cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
    var db=wx.cloud.database()
    if(this._id!=""){
      console.log("上线")
      db.collection('users').where({_openid:this._openid}).update({
        data:{
          online:true
        }
      })
    }
    else{
      console.log("error!")
    }
  },
  //不在小程序中就下线
  onHide(){
    var db=wx.cloud.database()
    if(this._id!=""){
      console.log("下线")
      db.collection('users').where({_openid:this._openid}).update({
        data:{
          online:false
        }
      })
    }
  }
})
