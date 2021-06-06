var db=wx.cloud.database()
var app=getApp()
var _=db.command
var utils=require('../../utils/util.js')
Page({
  //页面的初始数据
  data: {
    id:"",
    ss_xx:{},
    wbnr:"",
    _openid:"9999999",
    _id:"9999999",
    fenxiang:"false",
    //glopenid:"9999",
    glid:"9999",
    dianzan:false,
    input:"留下你的精彩评论吧",
    focus:false,
    xx:"",
    liuyan:false,
    ku:'ss'
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log(options)
    app.fxssid=options.id
    var love=options.love
    var liuyan=options.liuyan
    if(liuyan=='true'){
      console.log('留言真')
      this.setData({
        liuyan:true,
        ku:'tj'
      })
    }
    //console.log("传过来的love",love)//字符串true/false/undefined
    if(love=='true'){
      var dianzan=true
    }else if(love=='false'){
      var dianzan=false
    }else{
      var dianzan=-1
    }
    this.setData({
      fenxiang:options.fenxiang,
      dianzan:dianzan,
      id:options.id
    })
    //判断是否为分享来的！！！！！！！！！！！！！
    if(options.fenxiang=="true"){
      console.log("登录")
      /*调用云函数登录*/ 
      // wx.showLoading({
      //   title: '检查登录',
      //   mask:true
      // })
      wx.cloud.callFunction({
        name:'login',
        data:{}
      }).then((res)=>{
      //console.log(res)
        db.collection("user").where({
          _openid:res.result.openid
        }).get().then((res)=>{
          //console.log(res.data[0]);
          app.userInfo=Object.assign(app.userInfo,res.data[0]);
          var _openid=app.userInfo._openid
          // wx.hideLoading()
          if(_openid==""){
            /*如果没有登录信息则跳转到wd*/ 
            wx.showToast({
              title: '还未登录',
              icon:"none",
              duration:'1500'
            })
            app.fenxiang="true"
          }else{
            console.log("取到openid")
            this.setData({
              _openid:_openid,
              id:options.id,
              _id:app.userInfo._id
            })
            this.jiazai(options.id)
          }
        })
      })
    }else{
      var _openid=app.userInfo._openid
      this.setData({
        _openid:_openid,
        _id:app.userInfo._id
      })
      //console.log("iddd",options.id)
      this.jiazai(options.id)
    }
    
    //判断是否有了glid
    if(app.glid=="9999"){
      db.collection('system').where({'_id':'001'})
      .get().then((res)=>{
        //console.log(res.data[0].tp)
        this.setData({
          glid:res.data[0].glid
        })
        app.glid=res.data[0].glid
      })
    }else{
      this.setData({
        glid:app.glid
      })
    }
  },
  //加载对应说说id的内容
  jiazai(id){
    var ku=this.data.ku
    //console.log("哭哭哭：",ku)
    db.collection(ku).where({'_id':id}).get().then(async(res)=>{
      //console.log("加载的：",res.data[0])
      if(res.data[0]!=undefined){
        //var ss_xx=await this.read(res.data[0])//读缓存图
        var ss_xx=await this.readd(res.data[0])//处理超长名
        var dianzan=this.data.dianzan
        if(dianzan==-1 && this.data.liuyan==false ){
          //非总列表进入
          console.log("非列表进入")
          console.log("全部id",ss_xx.ss_xx.dianzanid)
          console.log(this.data._openid)
          var yn=ss_xx.ss_xx.dianzanid.indexOf(app.userInfo._id)
          console.log("非列表进入",yn)
          if(yn!=-1){
            this.setData({
              dianzan:true
            })
          }else{
            this.setData({
              dianzan:false
            })
          }
        }
        
        if(this.data.liuyan==false){
          app.ssinfo.lovenb=ss_xx.ss_xx.dianzannb
          app.ssinfo.plnb=ss_xx.ss_xx.huifunb
          app.ssinfo.looknb=ss_xx.ss_xx.look
          if(res.data[0].ss_xx.jubao[1]<10){
            this.setData({
              ss_xx:ss_xx
            })
          }else{
            this.setData({
              ss_xx:0
            })
          }
        }else{
          this.setData({
            ss_xx:ss_xx
          })
        }
        
      }else{
        this.setData({
          ss_xx:0
        })
      } 
    })
  },
  //点击跳转到详情进行阅读
  tiaozhuan(e){
    //console.log(e.currentTarget.dataset.address)
    var address=e.currentTarget.dataset.address
    var id=e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../tuijian/detail/detail?address='+address,
    })

    //添加浏览数
    wx.cloud.callFunction({
      name:"look",
      data:{
        id:id,
        type:'tj'
      }
    })
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    //console.log(e.currentTarget.dataset.tp)
    var index = e.currentTarget.dataset.tp[0];
    //所有图片
    var imgs = e.currentTarget.dataset.tp[1];
    
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  //删除评论
  changanshanchu(e){
    console.log(e)
    var _id=app.userInfo._id
    //检测是否是自己的

    if(e.currentTarget.dataset.plid1!=undefined){
      var pdwb=e.currentTarget.dataset.plid1
    }else{
      var pdwb=e.currentTarget.dataset.plid
    }

    //删除条件：1.自己发的。2.自己的帖子。3.自己是管理员
    if(pdwb!=_id && _id!=this.data.glid && _id!=this.data.ss_xx.ss_xx.lzid ){
      wx.showToast({
        title: '无权删除',
        icon:'none',
        duration: 800
      })
      return
    }

    var index1=""
    var id1=""
    var time1=""
    var jianqu=0
    if(e.currentTarget.dataset.index1!=undefined){
      //console.log("33333")
      index1=e.currentTarget.dataset.index1
      id1=e.currentTarget.dataset.id1
      
      time1=e.currentTarget.dataset.time1
    }else{
      //判断该评论下的二级评论
      var nb=e.currentTarget.dataset.huifunb
      console.log("删除",nb)
      if(nb!=undefined&&nb!=0){
        jianqu=nb
      }
    }
    var that=this
    wx.showModal({
      title: '提示',
      content: '删除后无法恢复',
      showCancel:'true',
      confirmText:'确认删除',
      confirmColor:'#FF4D49',
      cancelText:'取消',
      success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        var id=e.currentTarget.dataset.id0//这是这条l0评论的id
        //console.log("id0::",id)
        var index=e.currentTarget.dataset.index
        var ss_xx=that.data.ss_xx.ss_xx

       // console.log("删除,index1:",e.currentTarget.dataset.index1)
        if(e.currentTarget.dataset.index1==undefined){
          //这是lv0删除
          //console.log("删除lv0,index1:",index1)
          ss_xx.huifunr.splice(index,1);//删除指定index记录
        }else{
          //这是lv1，2删除
          console.log("删除lv12,index1:",index1)
          ss_xx.huifunr[index].huifu.splice(index1,1)
        }
        
        that.setData({
          "ss_xx.ss_xx":ss_xx
        })
        wx.showToast({
          title: '删除成功',
          icon:"none"
        })
        app.ssinfo.plnb=app.ssinfo.plnb-1-jianqu
        //console.log(app.ssinfo.plnb)
        var xx=that.data.ss_xx
        xx.ss_xx.huifunb=app.ssinfo.plnb
        that.setData({
          ss_xx:xx
        })
        var time=e.currentTarget.dataset.time
        //console.log("id:",that.data.id)
        var _data={
          id0:id,//这是这条lv0评论的id
          id1:id1,//这是这条lv1.2评论的id
          time:time,//这是这条lv0评论的
          time1:time1,//这是这条lv1.2评论的
          id:that.data.id,//这是这条ss的
          liuyan:that.data.liuyan,//用于云函数判断删除所在集合
        }
        console.log("id1::",id)
        console.log("id1::",id1)
        //下面云函数delete评论
        wx.cloud.callFunction({
          name: 'delete',
          data: {
          _data
          }
        })
        //判断ss是否还有自己的评论，
        var haiyou=false
        var haiyou=JSON.stringify(ss_xx.huifunr).includes(app.userInfo._id)
        //没了就删掉自己评论过的记录
        if(haiyou==false){
          db.collection('user').doc(app.userInfo._id).update({
            data: {
              pinglunguode:_.pull({
                id:_.eq(that.data.id)
              })
            }
          })
          //console.log("删")
          return
        }

      } else if (res.cancel) {
      console.log('用户点击取消')
      }
      }
    })
  },
  //文本内容合法性检测
  async checkStr(text) {
    try {
        var res = await wx.cloud.callFunction({
            name: 'checkStr',
            data: {
            text:text,
            }
        });
        //console.log(res.result.errCode);
        if (res.result.errCode == 0)
            return true;
            return false;
    } catch (err) {
        console.log(err);
        return false;
    }
  },
  //发送评论
  async fasong(){
    var openid=app.userInfo._openid
    //未登录提示
    if(openid==""){
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
          wx.switchTab({url:"../my/wd/wd"})
          return
        } else if (res.cancel) {
        console.log('用户点击取消')
        return
        }
        }
      })
      return
    }
    
    var text=this.data.wbnr
    if(text.length==0){
      wx.showToast({
        title: '没说什么',
        icon: 'none',
        duration: 800,
      })
      return
    }

    //检测账号是否被封
    var ban=app.userInfo.ban
    if(ban==true){
      wx.showToast({
        title: '账号被封！',
        icon:'none',
        duration:7000
      })
      return
    }
    console.log("是否禁言：",ban)
    //1.文本审核
    wx.showLoading({
      title: '传送中...',
      mask:true
    })
    var checkOk = await this.checkStr(text);
    //审核不通过
    if(!checkOk){ 
      wx.hideLoading({}),//审核不通过隐藏
      wx.showToast({
        title: '含有违法违规内容',
        icon: 'none',
        duration: 4000,
      })
      return//这个return返回，停止继续执行
    }
    wx.showLoading({
      title: '快送到了...',
      mask:true
    })
    //2.判断楼主与匿名
    var louzhu=false
    var niming=false
    //是楼主的话继承发帖状态
    if(app.userInfo._id==this.data.ss_xx.ss_xx.lzid ){
      //是楼主的话继承发帖状态
      louzhu=true
    }
    var pinglunguode=await this.fasongqian(app.userInfo._id)//更新了app中的userinfo判断是否评论过
    //console.log("获取到评论过的：",pinglunguode)
    var first=JSON.stringify(pinglunguode).includes(this.data.id)
    //判断是回复帖子，还是回复评
    //3.写其他数据并整合
    var pinglunnr={
      liuyan:this.data.liuyan,
      title:this.data.ss_xx.title,
      photo:app.userInfo.userinfo.userphoto,
      name:app.userInfo.userinfo.username,
      time:new Date().getTime(),//发布时间
      plrid:app.userInfo._id,//评论人我的id
      wbnr:text,
      ywnr:this.data.ss_xx.ss_xx.nr,
      louzhu:louzhu,
      niming:niming,
      ssid:this.data.id,
      lzid:this.data.ss_xx.ss_xx.lzid,
      lv:0,//表示对帖子的直接评论
      huifu:[]
    }
    if(this.data.liuyan==true){
      pinglunnr.ywnr="【推文】"+this.data.ss_xx.title
    }
    if(pinglunnr.ywnr.length==0){
      pinglunnr.ywnr='分享的'+this.data.ss_xx.ss_xx.tp.length+'张图片'
    }
    var pd=[first,"",""]//判断用，first,__openid(被评论的),__time(被评论的)
    var riqi=utils.dateFormat(pinglunnr.time,"yyyy-MM-dd hh:mm")//发送订阅消息所用日期格式
    pinglunnr.riqi=riqi
    //楼主才有此步骤，判断匿名
    var xx=this.data.xx//原回复
    //说明点击了回复按钮
    if(xx!=""){
      //说明点击了回复按钮，此时不知回复层级
      pd[1]=xx.lv0
      pd[2]=xx.time
      var lv=xx.lv//其实被回复人lv
      pinglunnr.bhfpl=xx.wbnr//被回复的评论
      pinglunnr.bhfid=xx.id
      if(lv==0){
        //console.log("0")//回复lv0
        pinglunnr.lv=1
        var index=this.data.index
        var zhankai="ss_xx.ss_xx.huifunr["+index+"].zhankai"
        //console.log(zhankai)
        this.setData({
          [zhankai]:true,
        })
      }else{
        //console.log("1")//回复lv1,lv2
        pinglunnr.lv=2
        pinglunnr.yuanname=pinglunnr.name
        pinglunnr.name=pinglunnr.name+"-》"+xx.name
      }
    }

    this.fbpl(pinglunnr,pd)//云函数上传发表
    wx.hideLoading({})
    //评论成功
    wx.showToast({
      title: '评论成功',
      icon: 'none',
      duration: 1000,
    })
    var huifunr=this.data.ss_xx.ss_xx.huifunr
    //这里本地进行判断
    app.ssinfo.plnb++
    console.log(app.ssinfo.plnb)
    var xx=this.data.ss_xx
    xx.ss_xx.huifunb=app.ssinfo.plnb
    this.setData({
      ss_xx:xx
    })
    if(pd[1]!=""){
      //这是回复别人
      var index=this.data.index
      huifunr[index].huifu.push(pinglunnr)
      huifunr[index].huifunb++
    }else{
      huifunr.push(pinglunnr)
    }
    
    this.setData({
      "ss_xx.ss_xx.huifunr":huifunr ,
      wbnr:"",
      xx:"",
      input:"留下你的精彩评论吧",
    })
    //console.log(this.data.ss_xx)
  },
  //发送前刷新内容
  async fasongqian(e){
    //console.log(e)
    return db.collection('user').doc(e).get().then((res)=>{
      //console.log(res)
      app.userInfo=res.data
      //console.log("获取评论过的",res.data)
      return res.data.pinglunguode
    })
  }, 
  //回复别人的评论1
  huifu(e){
    //console.log("index:",e.currentTarget.dataset.index)
    //console.log("index1:",e.currentTarget.dataset.index1)
    //console.log(e.currentTarget.dataset.xx)//这是评论的全部内容

    var index1=e.currentTarget.dataset.index1
    var xx=e.currentTarget.dataset.xx
    var xx1=e.currentTarget.dataset.xx1
    console.log("xx:",e.currentTarget.dataset.xx)
    console.log("xx1:",e.currentTarget.dataset.xx1)
    if(index1==undefined){
      //这是回复lv0
      var name=xx.name
      xx.id=xx.plrid
      xx.lv0=xx.plrid
    }else{
      xx.wbnr=xx1.wbnr
      xx.id=xx1.plrid
      xx.lv0=xx.plrid
      if(xx1.niming){
        xx1.name="匿名用户"
      }
      //这是回复lv1,2
      console.log("q",xx.lv)
      xx.lv=xx1.lv
      console.log("h",xx.lv)
      if(xx1.lv==1){
        var name=xx1.name
        console.log("333")
      }else{
        var name=xx1.yuanname
        console.log("444")
      }
    }

    xx.name=name//此处特殊整合信息！！！
    console.log("存下：",xx)

    //拉起键盘进行回复
    this.setData({
      input:"回复 "+name,
      focus:true,//拉起键盘
      xx:xx,
      index:e.currentTarget.dataset.index,
    })
  },
  //失去焦点，收起键盘
  //键盘收起
  shijiao(){
    var wbnr=this.data.wbnr
    if(wbnr==""){
      console.log("失去焦点，失去内容")
      this.setData({
        input:"留下你的精彩评论吧",
        xx:"",
        //xx1:0
      })
    }else{
      console.log("失去焦点，不失去内容")
    }
  },
  //展开评论
  zhankai(e){
    console.log(e.currentTarget.dataset.index)//该条评论所在数组的下表
    var index=e.currentTarget.dataset.index
    var zhankai="ss_xx.ss_xx.huifunr["+index+"].zhankai"
    //console.log(zhankai)
    this.setData({
      [zhankai]:true,
    })
  },
  //收起评论
  shouqi(e){
    console.log(e.currentTarget.dataset.index)//该条评论所在数组的下表
    var index=e.currentTarget.dataset.index
    var zhankai="ss_xx.ss_xx.huifunr["+index+"].zhankai"
    //console.log(zhankai)
    this.setData({
      [zhankai]:false,
    })
  },
  //用云函数发表评论
  async fbpl(pinglunnr,pd){
    try {
      var res = await wx.cloud.callFunction({
        name: 'fbpl',
        data: {
          pinglunnr:pinglunnr,
          pd:pd
        }
      });
      //console.log(res);
      return res.result
  } catch (err) {
    console.log(err);
    return false;
  }

  },
  //实时获取input,写到data中储存为wbnr
  wbnr(e){
    //console.log(e.detail.value)
    this.setData({
      wbnr:e.detail.value
    })
  },
  //举报帖子
  jubao(e){
    //判断是否举报过
    //console.log(e)
    var jubao=e.currentTarget.dataset.jubao//取到jubao数组
    var id=app.userInfo._id
    if(id==""){
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
          
          wx.switchTab({url:"../my/wd/wd"})
          return
        } else if (res.cancel) {
        console.log('用户点击取消')
        return
        }
        }
      })
      return
    }
    var ban=app.userInfo.ban
    if(ban==true){
      wx.showToast({
        title: '账号被封！',
        icon:'none',
        duration:7000
      })
      return
    }
    var glid=app.glid
    if(id!=glid){
      var yn=JSON.stringify(jubao[0]).includes(id)
      if(yn){
        wx.showToast({
          title: "举报过了",
          icon:"none"
        })
        return
      }
    }
    
    //console.log("云函数举报")
    var that=this
    wx.showModal({
      title: '提示',
      content: '确认举报？(恶意举报将会封号)',
      showCancel:true,
      confirmText:'确认举报',
      confirmColor:'#FF4D49',
      cancelText:'取消',
      cancelColor:'#000000',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var ssid=e.currentTarget.dataset.id//取到ssid
          var cc=that.data.ss_xx.ss_xx.nr
          if(cc.length==0){
            cc='分享的'+that.data.ss_xx.ss_xx.tp.length+'张图片'
            //pinglunnr.ywnr='分享的'+this.data.ss_xx.ss_xx.tp.length+'张图片'
          }
          console.log("cc:",cc)
          wx.cloud.callFunction({
            name:"jubao",
            data:{
              id:ssid,
              time:new Date().getTime(),//发布时间
              ywnr:cc,//这里没有判断空文本的情况！！！
              jbrid:app.userInfo._id//举报人
            }
          })
          
          //更新本地举报
          var ss_xx=that.data.ss_xx
          ss_xx.ss_xx.jubao[0].push(id)
          ss_xx.ss_xx.jubao[1]++
          console.log(ss_xx.ss_xx.jubao)
          that.setData({
            ss_xx:ss_xx
          })

          wx.showToast({
            title: '举报成功',
            icon:"none"
          })
          
        } else if (res.cancel) {console.log('用户点击取消')}
      }
    })
    /////////////////////////////////
  },
  //长名字显示处理
  async readd(e){
    var nr=e
    //先循环每一个ss
    var chang=nr.ss_xx.huifunr.length
    //判断评论!=""则进行下面
    if(chang!=0){
      var huifunr=nr.ss_xx.huifunr
      //对huifunr循环查询判断name长度超长就加。。。11个为上限
      for(var ii=0;ii<huifunr.length;ii++){
        var l=huifunr[ii].name.length
        //console.log("长命自检测3",l,huifunr[ii].name)
        //console.log("path:",path)
        if(l>11){
          console.log("改了",nr.ss_xx.huifunr[ii].name)
          nr.ss_xx.huifunr[ii].name=nr.ss_xx.huifunr[ii].name.substring(0,11)+"..."
          console.log("改了",nr.ss_xx.huifunr[ii].name)
        }
        if(huifunr[ii].huifu.length>0){
          //有回复的回复
          for(var iii=0;iii<huifunr[ii].huifu.length;iii++){
            var l=huifunr[ii].huifu[iii].name.length
            //console.log(iii,"长命自检测",l,huifunr[ii].huifu[iii].name)
            if(l>11){
              //总长度超长，如果为回复类型要截取两者name
              console.log("改了",nr.ss_xx.huifunr[ii].huifu[iii].name)
              var name=nr.ss_xx.huifunr[ii].huifu[iii].name
              var yuanname=nr.ss_xx.huifunr[ii].huifu[iii].yuanname
              var wz=name.indexOf("-》")
              //console.log(name.indexOf("-》"))
              if(wz>4){
                //需要对前面修剪
                console.log("位置",wz)
                var qian=name.substring(0,4)+"...-》"
                var hou=name.substr(wz+2,l-wz)

                console.log(qian)
                console.log(hou)
                name=qian+hou
                //加上再修剪
                if(name.length>11){
                  nr.ss_xx.huifunr[ii].huifu[iii].name=name.substring(0,11)+"..."
                }else{
                  nr.ss_xx.huifunr[ii].huifu[iii].name=name
                }

              }else{
                nr.ss_xx.huifunr[ii].huifu[iii].name=nr.ss_xx.huifunr[ii].huifu[iii].name.substring(0,11)+"..."
                console.log("改了",nr.ss_xx.huifunr[ii].huifu[iii].name)
              }
              
            }

          }
        }
      }
    }
    
    //console.log(nr)
    return nr
  },
  //用户转发
  onShareAppMessage: function () {
    return{
      title:"刚刚在低碳社区看到个帖子，真是绝了！",
      path:"/shequ/index/index?id="+this.data.id+"&fenxiang=true&liuyan="+this.data.liuyan
    }
  },
  //点赞帖子
  dianzan(e){
    //判断是否举报过
    //console.log("点赞id",e.currentTarget.dataset.dianzanid)
    //var dianzanid=e.currentTarget.dataset.dianzanid//取到dianzan数组
    var id=app.userInfo._id
    var ssid=e.currentTarget.dataset.id
    if(id==""){
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
          wx.switchTab({url:"../my/wd/wd"})
          return
        } else if (res.cancel) {
        console.log('用户点击取消')
        return
        }
        }
      })
      return
    }
    wx.cloud.callFunction({
      name:"dianzan",
      data:{
        id:ssid,
        dzrid:id//点赞人id
      }
    })
    var ss_xx=this.data.ss_xx
    if(this.data.dianzan){
      ss_xx.ss_xx.dianzannb--
      app.ssinfo.lovenb--
      this.setData({
        dianzan:false,
        ss_xx:ss_xx
      })
      app.loveinfo='false'
    }else{
      ss_xx.ss_xx.dianzannb++
      app.ssinfo.lovenb++
      this.setData({
        dianzan:true,
        ss_xx:ss_xx
      })
      app.loveinfo='true'
    }
    
  },
  //判断登录,返回true或false
async islogin(){
    var _id=this.data._id
    if(_id!=""){
      return true
    }else{
      return false
    }
  }
})