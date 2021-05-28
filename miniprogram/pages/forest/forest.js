// pages/forest.js
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */

  data: {
      userCredict : App.globalData.userCredict,
      icon:[
        "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/forest/myTree1.png",
        "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/forest/myTree2.png",
        "cloud://cloud1-2gm89gcbba9c155c.636c-cloud1-2gm89gcbba9c155c-1305562989/forest/myTree3.png"
      ],  
      isShow:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],       
      count:0,
      openId:wx.getStorageSync('openid')
      // check:false
  },
  onClick: function(){
    
    var isPlanted = 0
    var count = this.data.count
    var app = getApp()
    var credit = this.data.userCredict
    console.log("this.data.userCredict is " + this.data.userCredict)

    //如果时第一次进入，docId == “” ，则进行获取docid
    if(app.globalData.docId == "")
    {
      const db = wx.cloud.database()
      var getapp = getApp()
      db.collection("users").where({openId:this.data.openId
      }).get().then(
        res=>{
          console.log(res)
          getapp.globalData.docId = res.data[0]._id
          console.log("the docId is " + getapp.globalData.docId)
        }
      )   
    }
    //实现消耗积分种树
    if(this.data.userCredict > 0)
    {
      while(isPlanted == 0 && count<=21)
      {
        var randomTree = parseInt(22 * Math.random())
        if(this.data.isShow[randomTree] == 0)
        {
          this.setData({
          [`isShow[${randomTree}]`]:1,
          })
          isPlanted=1
        }
      }
    count++
    credit--
    this.setData(
      {
        count:count,
        "userCredict":credit
      }
    )
    app.globalData.userCredict--
    console.log("after this.data.userCredict is " + this.data.userCredict)
    console.log("app.globalData.userCredict is " + app.globalData.userCredict)
    }
    else
    {
      wx.showToast({
        title: '您的积分不足',
        icon:'error'

      })
      
    }
    //进行数据更新
    var db2 = wx.cloud.database()
            db2.collection("users").doc(app.globalData.docId).update(
                {
                    data:{
                        credit:app.globalData.userCredict,
                        isForestShow:this.data.isShow
                    }
                }
            )
            console.log("成功更新")
    
    this.onLoad
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //onLoad中将数据库中树的种植情况的数组赋给本地的data
  onLoad: function (options) {
    const db = wx.cloud.database()
    var getapp = getApp()
    console.log(this.data.openid)
    db.collection("users").where({openId:this.data.openId
    }).get().then(
      res=>{
        this.setData({
            isShow : res.data[0].isForestShow          
        })
      }
    )   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var app = getApp()
    this.setData({
      userCredict:app.globalData.userCredict
    })
  },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {

  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {

  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {

  // },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})