// miniprogram/pages/post/post.js
var util = require('../../utils/util.js');
const app=getApp()
const db = wx.cloud.database()
Page({
  data: {
    index:0,
    index2:0,
    range:["交友","兼职","互助","交易","闲谈","陪玩"],
    zilei:[["表白","捞人","求缘","同生"],["兼职"],["互动"],["出售","购买"],["闲谈"],["陪玩"]],
    niming:false,
    imgs: [],
  },
  bankuaiPickerChange(e){
    this.setData({index:e.detail.value ,index2:0})
  },
  zileiPickerChange(e){
    this.setData({ index2:e.detail.value })
  },
  /*提交表单 */
  tijiao(e){
    console.log(e.detail.value)
    var zs=this.data.imgs.length
    var ss_img=this.data.imgs
    console.log("待上传总数",zs)//取待上传图片总数
    if(zs!=0){

      // for(var i=0;i<zs;i++){
      //   var path=ss_img[i];//取当前图片路jing
      //   var time=new Date().getTime()
      //   //console.log(time)//取当前时间chuo
      //   //console.log(path)
      //   wx.cloud.uploadFile({
      //     cloudPath: "ss_img/"+time+".jpg", // 上传至云端的路径
      //     filePath: path, // 小程序临时文件路径
      //     success: res => {
      //       // 返回文件 ID
      //       console.log(i,res.fileID)

      //     },
      //     fail: console.error
      //   })
        
      // }
    }else{

    }

    // wx.cloud.uploadFile({
    //   cloudPath: "", // 上传至云端的路径
    //   filePath: ss_img[0], // 小程序临时文件路径
    //   success: res => {
    //     // 返回文件 ID
    //     console.log(res.fileID)
    //   },
    //   fail: console.error
    // })
  },
  /*开启匿名 */
  switchChange(e){
    if(e.detail.value){
      //console.log("?")
      this.setData({
        niming:true,
      })
    }else{
      this.setData({
        niming:false,
      })
    }
  },
  // 添加图片
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;
    if (imgs.length >= 9) {
      wx-wx.showToast({
        title: '最多添加九张图片哦',
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












  
  /*生命周期函数--监听页面加载*/
  onLoad: function (options) {

  },
  /*** 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {

  },
  /** 生命周期函数--监听页面显示*/
  onShow: function () {

  },
})