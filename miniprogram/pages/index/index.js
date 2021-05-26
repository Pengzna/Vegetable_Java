const db = wx.cloud.database()

Page({
  data: {
    banner:[],
    fenlei:[],
    product:[],
    search:[],
    num:20,
    ss:false
  },
  // 分类跳转事件
  fenlei:function(e){
    console.log(e)
  },
  // 搜索事件
  search:function(e){
    let that = this
    db.collection('product').where({
      name:e.detail.value  //把name与输入框输入的值进行比对
    }).get({
      success:function(res){
        that.setData({
          search:res.data
        })
        console.log('搜索成功',that.data.search)
        if(that.data.search == ""){
          wx.showToast({
            title: '未找到商品',
            icon:"none"
          })
        }
      },
      fail:function(res){
        console.log('搜索失败',res)
      },
    })
  },
  onLoad: function() {
    let that = this
    db.collection('swiper').get({
      success:function(res){
        console.log('轮播图获取成功',res)
        that.setData({
          banner:res.data
        })
      },
      fail:function(res){
        console.log('轮播图获取失败',res)
      },
    })
    db.collection('fenlei').get({
      success:function(res){
        console.log('分类获取成功',res)
        that.setData({
          fenlei:res.data
        })
      },
      fail:function(res){
        console.log('分类获取失败',res)
      },
    })
    db.collection('product').get({
      success:function(res){
        console.log('商品获取成功',res)
        that.setData({
          product:res.data
        })
      },
      fail:function(res){
        console.log('商品获取失败',res)
      },
    })
  },
  onShow:function(e){
    let that = this
    db.collection('swiper').get({
      success:function(res){
        console.log('轮播图获取成功',res)
        that.setData({
          banner:res.data
        })
      },
      fail:function(res){
        console.log('轮播图获取失败',res)
      },
    })
    db.collection('fnelei').get({
      success:function(res){
        console.log('分类获取成功',res)
        that.setData({
          fenlei:res.data
        })
      },
      fail:function(res){
        console.log('分类获取失败',res)
      },
    })
    db.collection('product').get({
      success:function(res){
        console.log('商品获取成功',res)
        that.setData({
          product:res.data
        })
      },
      fail:function(res){
        console.log('商品获取失败',res)
      },
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    wx.showLoading({
      title: '刷新中！',
      duration: 1000
    })
    let old_data = that.data.product
    const db = wx.cloud.database()
    db.collection('product').skip(that.data.num)
      .get()
      .then(res => {
      // 利用concat函数连接新数据与旧数据
      // 并更新emial_nums  
        this.setData({
          product: old_data.concat(res.data),
          num:that.data.num+20
        })
        if(res.data==""){
          wx.showToast({
          icon: 'none',
          title: '已经加载完毕'
        })
        }
      })
      .catch(err => {
        console.error(err)
      })
    console.log('circle 下一页');
  },

})
