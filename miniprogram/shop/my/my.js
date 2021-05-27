const  db = wx.cloud.database()

Page({
  data: {
    selected:2,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name:"",
    age:""
  },
  cc:function(){
    
  },

  onLoad: function() {
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  submit:function(e){
    console.log(e)
    let that=this
    db.collection('user').add({
      data:{
        name:e.detail.value.name,
        age:e.detail.value.age
      }
    })
  },
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  },
  address:function(e){
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success () {
              wx.chooseAddress({
                success (res) {
                  console.log(res)
                }
              })
            }
          })
        }else{
          wx.authorize({
            scope: 'scope.address',
            success () {
              wx.chooseAddress({
                success (res) {
                  console.log(res)
                }
              })
            }
          })
        }
      }
    })
  }
  

  
})