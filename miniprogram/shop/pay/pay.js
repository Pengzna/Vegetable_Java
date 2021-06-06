// pages/pay/pay.js
const util = require('../../utils/util.js')
const  db = wx.cloud.database()
const _ = db.command
const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:[],
    money:0,
    name:"",
    phone_number:"",
    address:"",
    beizhu:"",
    jifen:[],
    userCredict : App.globalData.userCredict,
    openId:wx.getStorageSync('openid'),
  },
  // 备注
  beizhu:function(e){
    let that = this
    console.log(e)
    that.setData({
      beizhu:e.detail.value
    })
  },
  // 结算
  pay:function(e){
    let that = this
    console.log(e)
    var credit = this.data.userCredict
    let sum=this.data.money
    
    console.log("this.data.userCredict is " + this.data.userCredict)
    if(sum>credit){
      wx.showToast({
        title: '您的积分不足，可前往知识竞赛页面赚取积分',
        icon:"none"
      })
    }

      if(sum<=credit){
        credit=credit-sum
        App.globalData.userCredict=credit

        console.log("now the credit is",App.globalData.userCredict)
        console.log("now the docId is",App.globalData.docId)
        db.collection("users").doc(App.globalData.docId).update(
          {
              data:{
                  credit:App.globalData.userCredict,
              } ,success:function(res){
                that.setData({
                  "userCredict" : App.globalData.userCredict
                })
                var getapp = getApp()
                console.log("商城端数据更新成功 now the userCredit is",data.userCredict)
              },fail:function(res){
                console.log("商城端数据未同步到数据库上")
              }
          }
      )

        if(that.data.name!==""&&that.data.address!==""&&that.data.phone_number!==""){
          db.collection('order').add({
            data:{
              name:that.data.name,
              phone_number:that.data.phone_number,
              address:that.data.address,
              beizhu:that.data.beizhu,
              money:that.data.money,
              product:that.data.product,
              product_state:"送货中"
            },success:function(res){
                  console.log('下单成功',res)
                  wx.cloud.callFunction({
                    name:"product_delet",
                    data:{
                    },
                    success:function(res){
                      console.log('购物车删除成功',res)
                      for(var i= 0;i<that.data.product.length;i++){
                        wx.cloud.callFunction({
                          name:"inc_product_num",
                          data:{
                            product_id:that.data.product[i].product_id
                          },success:function(res){
                            console.log('商品销量自加成功',res)
                          }
                        })
                      }
                      wx.reLaunch({
                        url: '../shopping_cart/shopping_cart',
                      })
                    },fail:function(res){
                      console.log('购物车删除失败',res)
                    }
                  })
                },fail:function(res){
                  console.log('下单失败',res)
                }
              })
        }else{
          wx.showToast({
            title: '地址信息有误',
            icon:"none"
          })
        }
      }
       
    }
   
    
  ,
  // 选择地址
  address:function(e){
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success () {
              wx.chooseAddress({
                success (res) {
                  console.log(res)
                  that.setData({
                    name:res.userName,
                    phone_number:res.telNumber,
                    address:res.provinceName+res.cityName+res.countyName+res.detailInfo
                  })
                }
              })
            }
          })
        }else{
          wx.openSetting({
            success (res) {
              console.log(res.authSetting)
            }
          })
        }
      }
    })
  },
  // 计算金额
  get_money_sum() {
    let that = this
    let money_sum = 0
    for(var x = 0;x<that.data.product.length;x++){
      money_sum=money_sum+(that.data.product[x].product_num*that.data.product[x].product_price)
    }
    that.setData({
      money:money_sum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    db.collection('shopping_cart').where({
      product_checked:"true"
    }).get({
      success:function(res){
        console.log('获取商品成功',res)
        that.setData({
          product:res.data
        })
        that.get_money_sum()
      }
    })
  
    that.setData({
      "userCredict" : App.globalData.userCredict
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})