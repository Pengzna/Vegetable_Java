// pages/product_detail/product_detail.js
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    product_name:"",
    product_src:[],
    product_price:0,
    product_detail:"",
    product_num:"",
    product_xq_src:"",
    id:""
  },
 

  // 加入购物车
  into_shopping_cart:function(){
    let that = this
    db.collection('shopping_cart').where({
      product_id: that.data.id
    }).get({
      success:function(res){
        console.log(res)
        if(res.data == ""){
          db.collection('shopping_cart').add({
            data:{
            product_name:that.data.product_name,
            product_src:that.data.product_src[0],
            product_price:that.data.product_price,
            product_num:1,
            product_id:that.data.id,
            // 新增代码
            product_checked:""    
            },success:function(res){
              console.log('商品加入购物车成功',res)
              wx.showToast({
                title: '加入成功',
              })
            },fail:function(res){
              console.log('商品加入购物车失败',res)
            }
          })
        }else{
          wx.showToast({
            title: '已有这个商品',
            icon:'none'
          })
        }
      },fail:function(res){
        console.log(res)
      }
    })
  },
  // 立即购买
  buy:function(){
    let that = this
    db.collection('shopping_cart').where({
      product_id: that.data.id
    }).get({
      success:function(res){
        console.log(res)
        if(res.data == ""){
          db.collection('shopping_cart').add({
            data:{
            product_name:that.data.product_name,
            product_src:that.data.product_src[0],
            product_price:that.data.product_price,
            product_num:1,
            product_id:that.data.id,
            // 新增代码
            product_checked:"" 
            },success:function(res){
              console.log('商品加入购物车成功',res)
              wx.switchTab({
                url: '../shopping_cart/shopping_cart',
              })
            },fail:function(res){
              console.log('商品加入购物车失败',res)
            }
          })
        }else{
          wx.switchTab({
            url: '../shopping_cart/shopping_cart',
          })
        }
      },fail:function(res){
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log('产品的id已经获取到了',options.id)
    db.collection('product').doc(options.id).get({
      success:function(res){
        console.log('商品详细信息获取成功',res)
        that.setData({
          product_src:res.data.src,
          product_name:res.data.name,
          product_num:res.data.num,
          product_price:res.data.price,
          product_detail:res.data.detail,
          product_xq_src:res.data.product_xq_src,
          id:res.data._id
        })
      },fail:function(res){
        console.log('商品详细信息获取失败',res)
      }
    })
  },

})