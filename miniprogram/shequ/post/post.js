// miniprogram/pages/post/post.js
var util = require('../../utils/util.js');
const app=getApp()
const db = wx.cloud.database()
Page({
  data: {
    selected:1,
    niming:false,
    imgs: [],
    fileID:[],
    wbnr:"",
    index:[0,0],
    heji:[["互助","吐槽","其他分类"],["感想交流"]],
    sy:"0/299"
  },
  kaishixuanze(e){
    //console.log("第几列",e.detail.column)
    var data={
      index:this.data.index,
      heji:this.data.heji
    }
    switch(e.detail.column){
      case 0:
        switch(e.detail.value){
          case 0:
            data.index=[0,0];
            data.heji[1]=["感想交流"];
            break;
          case 1:
            data.index=[1,0];
            data.heji[1]=["摇人","抽象"];
            break;
          case 2:
            data.index=[2,0];
            data.heji[1]=["其他分类"];
            break;
          case 3:
            data.index=[3,0];
            data.heji[1]=["失物招领"];
            break;
        }
      case 1:
        break;
    }
    this.setData(data)
    //console.log(data)
  },
  xuanzewanbi(e){
    //console.log(e.detail.value)
    this.setData({ index:e.detail.value })
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
  //图片内容合法性检测
  async checkImg(media) {
    console.log("要检测的buffer",media)
    try {
        var res = await wx.cloud.callFunction({
          name: 'checkImg',
          data: {media}
        });
        console.log("云检测结果",res.result);
        return res.result.errCode
    } catch (err) {
        console.log("云检测错误",err);
        return 1;
    }
  },
  //图片取buffer
  async qubuffer(media){
    //console.log("图片路径",media)
    return new Promise((resolve,reject)=>{
      wx.getFileSystemManager().readFile({
        filePath: media,
        success: res => {
          //console.log("刚转换完",res.data)
          resolve(res.data)
        }
      })
    })
  },
  //图片压缩
  async yasuo(media,size,xxx){
    //media=media.replace("wxfile","https")
    console.log("要压缩的地址",media)
    return new Promise((resolve,reject)=>{
      //这是压缩式要用的获取宽高
      wx.getImageInfo({
        src: media,
        success (res) {
          //console.log(res)
          //console.log(res.width,"*",res.height)//打印原图宽高
          var width=res.width//原图宽
          var height=res.height//原图高
          var xx=xxx//最后应该设置的宽
          var yy = Math.trunc(xxx*height/width)//最后应该设置的高
          //console.log(xx,"*",yy)//打印要转换的宽高
          //下面写压缩的步骤
          //获取到画布
          var huabu=wx.createCanvasContext("huabu",this)
          //画下图片
          //console.log("画前")
          /////////////////////////
          huabu.drawImage(media,0,0,xx,yy);
          huabu.draw(true,setTimeout(function(){wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width:xx,
            height: yy,
            destWidth: xx,
            destHeight: yy,
            canvasId: 'huabu',
            fileType: 'jpg',
            quality: size,//压缩质量0-1默认0.92
            success(es) {
              console.log('压缩完了',es.tempFilePath)
              resolve(es.tempFilePath)
            }
          },this);},500))
          //console.log("画完")
          
        }
      })
    })
  },
  //图片取大小
  async qudaxiao(media){
    return new Promise((resolve,reject)=>{
      wx.getFileInfo({
        filePath: media,
        success (res) {
          //console.log("图片的",res)
          resolve(res.size)
        }
      })
    })
  },
  /*提交表单 */
  async tijiao(e){
    
    console.log(e.detail.value)
    //若未登录，直接到登录页面
    if(app.userInfo.userinfo.login==false){
      wx.switchTab({
        url: '/pages/my/wd/wd'
      })
      return
    }
    //console.log(e.detail.value)//bankuai/zilei/niming2匿名内容/niming1是否匿名/wbnr/
    var biaodan=e.detail.value//整个表单数据
    var text=biaodan.wbnr//临时text。文本内容
    
    
    if(text.length==0 && this.data.imgs.length==0){
      wx.showToast({
        title: '再多说点吧！',
        icon: 'none',
        duration: 800,
      })
      return//这个return返回，停止继续执行
    }
    //console.log("传过来：",e)
    var bankuai="交流互助"
    if(biaodan.fenlei!=null){
      switch(biaodan.fenlei[0]){
        case 0:
          bankuai="交流互助"
          break;
        case 1:
          bankuai="吐槽"
          break;
        case 2:
          bankuai="其他"
          break;
      }
    }
    var _this=this
    wx.showModal({
      title: '提示',
      content: '您即将发送此帖到“'+bankuai+'”板块？',
      showCancel:true,
      confirmText:'是',
      confirmColor:'#000000',
      cancelText:'否',
      cancelColor:'#000000',
      success (res) {
      if (res.confirm) {
        //console.log('用户点击确定')
        _this.tixing(biaodan)
        return true
      } else if (res.cancel) {
        //console.log('用户点击取消')
        return false
      }
      }
    })
    
  },
  //提醒选择的板块
  async tixing(biaodan){
    console.log("表单：",biaodan)
    var text=biaodan.wbnr//临时text。文本内容
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
    //console.log("text",text)
    wx.showLoading({
      title: '准备发送...',
      mask:true
    })
    
    if(text.length>0){
      var checkOk = await this.checkStr(text);
    }else{
      var checkOk = true
    }
    
    //开始审核文本
    if(!checkOk){ 
      wx.hideLoading({}),//审核不通过隐藏
      wx.showToast({
        title: '文本含有违法违规内容',
        icon: 'none',
        duration: 5000,
      })
      return//这个return返回，停止继续执行
    }
    
    var img=this.data.imgs//图片路径赋值给变量img

    //开始图片审核
    if(img.length!=0){
      //审核图片
      wx.showLoading({
        title: '图片处理...',
        mask:true
      })
      var media=''
      var zsl=img.length
      for(var i=0;i<zsl;i++){
        media=img[i]
        //console.log("遍历的图片源路径",media)
        //取图片的大小进行判断
        var size=await this.qudaxiao(media)
        console.log("图片的大小是",size)
        if(size>=51200){
          //超过50k需要进行压缩！！
          //console.log("超过50k需要进行压缩！！")
          // wx.showLoading({
          //   title: '图片压缩',
          //   mask:true
          // })
          media=await this.yasuo(media,0.6,300)
        }

        //验证压缩后大小
        var size=await this.qudaxiao(media)
        console.log("压缩完图片的大小是",size)
        //img.splice(i,1,media)

        //console.log(img)
        //console.log("压缩完取buffer前的路径",media)

        //console.log(media)
        //获取文件buffer
        media= await this.qubuffer(media)
        //console.log("取回转换结果",media)
        // wx.showLoading({
        //   title: "图片审核中"+(i+1).toString()+"/"+zsl.toString(),
        //   mask:true
        // })
        //console.log("审核buffer",media)
        let checkOk = await this.checkImg(media)//开始审核图片
        //console.log("checkok",checkOk)
        if(checkOk==87014||checkOk==-604102){ 
          wx.hideLoading({}),//审核不通过隐藏
          wx.showToast({
            title: '图片检测出现问题',
            icon: 'none',
            duration: 2000,
          })
          //console.log("图片违法")
          return//这个return返回，停止继续执行
        } else if(checkOk!=0){
          wx.hideLoading({}),//审核不通过隐藏
          wx.showToast({
            title: '图片检测出现问题',
            icon: 'none',
            duration: 2000,
          })
          return//这个return返回，停止继续执行
        }
      }
    }
    //所有审核通过
    //console.log("所有审核通过了")
    //定义ss_xx
    //判断 默认选择器分类[0,0]
    biaodan.fenlei=biaodan.fenlei===null?[0,0]:biaodan.fenlei
    console.log("楼主id::::",app.userInfo._id)
    var ss_xx={
      bankuai:biaodan.fenlei[0],
      zilei:biaodan.fenlei[1],
      firsttime:new Date().getTime(),//发布时间
      username:app.userInfo.userinfo.username,//签名
      userphoto:app.userInfo.userinfo.userphoto,//头像
      niming1:biaodan.niming1,//是否匿名
      nr:biaodan.wbnr,//文本
      tp:[],//图片数组！！！！！！！！！数组缺少图片
      huifunr:[],//别人的评论
      huifunb:0,//评论总数
      dianzanid:[],//别人的评论点赞
      dianzannb:0,//点赞数
      jubao:[[],0],//被举报的id合集，前面添加id，加完云函数记个数
      look:0,//记录浏览量 
      lzid:app.userInfo._id//楼主所在主体
    }
    //console.log(ss_xx)
    var zs=img.length//图片总数
    var ss_img=img
    //console.log("待上传总数",zs)//取待上传图片总数

    //上传图片
    if(zs!=0){
      wx.showLoading({
        title: '就快好了...',
        mask:true
      })
      var fileID=[]
      var js=0

      for(var i=0;i<zs;i++){
        //取图片的大小进行判断
        var path=ss_img[i];//取当前图片路jing
        
        var size=await this.qudaxiao(path)
        console.log("图片的大小是",size)
        if(size>=1048576){
          //超过1M需要进行压缩！！
          console.log("超过1M需要进行压缩！！")
          path=await this.yasuo(path,0.92,800)
        }
        var time=new Date().getTime()
        //直接拼接出云路径
        fileID[i]="cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/ss_img/"+time.toString()+".jpg"
        
        //console.log("的点点滴滴",fileID[i])
        //console.log(time)//取当前时间chuo
        wx.cloud.uploadFile({
          cloudPath: "ss_img/"+time+".jpg", // 上传至云端的路径
          filePath: path, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            //console.log("前单个！！id=",i,res.fileID)
            //fileID.push(res.fileID)//！！！！！！！对返回的云储存地址进行整合
            //console.log("合并",fileID)
            js++//记录成功获取云储存路径的图片数量
            //console.log(js)
            if(js==zs){
              ss_xx.tp=fileID//！！！说说信息中的图片写入完毕
              console.log("说说图片",fileID)
              //带图发帖！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
              this.post(ss_xx)
            }
          },
           fail: console.log("上传是不知为啥有错")
        })
      }
    }else{
      //纯文本发帖！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
      this.post(ss_xx)
    }
    
  },
  //实时获取input,写到data中储存为wbnr
  wbnr(e){
    //console.log(e.detail.value)
    var s=e.detail.value.length
    var y=s+"/"+299
    // console.log(y) 
    this.setData({
      wbnr:e.detail.value,
      sy:y
    })
  },
  //真正的上传说说
  post(ss_xx){
    
    //loading发布中
    wx.showLoading({
      title: '即将完成...',
      mask:true
    })
    //console.log("传过来",ss_xx)
    //var sjk=ss_xx.bankuai.toString()+"0"//@@@转成字符串@@@
    //添加说说记录
    db.collection('ss').add({
      data:{
        ss_xx,
        time:ss_xx.firsttime
      }
    }).then((res)=>{
       //console.log(res._id)//拿到id
      //console.log(ss_xx)

      //ss发送成功了
      //设置app跳转到首页后要刷新
      app.shuaxin=true
      wx.hideLoading({})//发布成功隐藏
      //app跳转到首页
      wx.switchTab({url:'/pages/index/index'})
      var id=res._id
      var jl={
        "time":ss_xx.firsttime,
        "nr":ss_xx.nr,
        "id":id,
        "weigui":false
      }
      if(jl.nr==''){
        jl.nr='分享了'+ss_xx.tp.length+'张图片'
      }
      
      var wenzhang=[]
      //获取之前的文章加到wenzhang
      db.collection("users").doc(app.userInfo._id).get().then((res)=>{
        wenzhang=res.data.wenzhang
        //console.log("取回的",wenzhang)
        wenzhang.push(jl)
        //记录到自己users里
        db.collection("users").doc(app.userInfo._id).update({
          data:{
            wenzhang:wenzhang
          }
        }).then((res)=>{
         
          //进行全局数据我的本地储存
          app.userInfo.wenzhang=wenzhang
          this.setData({
            imgs:[],
            wbnr:""
          })
          
        })
      })
    })
  },
  // 添加图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    var ktj=9-imgs.length
    //console.log(ktj)
    if (ktj<=0) {
      wx.showToast({
        title: '最多添加九张',
        icon: 'none',
        duration: 2000,
      })
    }else{
      wx.chooseImage({
        // count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          //console.log(tempFilePaths)
          var imgs = that.data.imgs;
          for (var i = 0; i < tempFilePaths.length; i++) {
            if (imgs.length >= 9) {
              that.setData({
                imgs: imgs
              });
              return false;
            } else {
              imgs.push(tempFilePaths[i]);
              //console.log(imgs)
            }
          }
          //imgs.push(tempFilePaths[0]);//往数组末尾添加元素
          that.setData({
            imgs: imgs
          });
        }
      });
    }
  },
  // 删除图片
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  onReady: function () {
  },
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {

  },
  /*** 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {

  },
  /** 生命周期函数--监听页面显示*/
  onShow: function () {
    this.checkred()
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