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
    const db = wx.cloud.database()
    this.shuaxin=false
    this.fenxiang="false"
    this.fxssid=""
    this.glid="9999"
    this.message=[]
    
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
    //初始化用户数据库，没有则加（初始变量有openId和credit），有则读取（将credit读到全局变量中）
    db.collection("users").where({openId:this.globalData.openId
    }).get().then(
      res=>{
        if(res.data.length == 0)
        {
          // console.log("该用户不存在，新建用户记录")
          db.collection("users").add(
            {
              data:{
                name:"这是一个积分初始为0的家伙",
                openId:this.globalData.openId,
                credit:0 ,
                isForestShow:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                
              }
            }
          )
          console.log(res)
        }
        else{
          // console.log("该用户已存在，改为读取数据")
          // console.log("用户当前积分是" + res.data[0].credit)
          this.globalData.userCredict = res.data[0].credit
          // console.log("程序当前积分是" + this.globalData.userCredict)
          this.globalData.docId = res.data[0]._id
          console.log(res)
          console.log("the docId is " + this.globalData.docId)
        }
      }
    )
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
  },

  globalData : {
    userInfo:null,
    userCredict:0,
    openId : "openid16",
    countOfQue: 1 ,
    docId:""
}
})
