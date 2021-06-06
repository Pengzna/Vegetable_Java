const  db = wx.cloud.database()
const App = getApp();
Page({
  data: {
    selected:2,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name:"",
    age:"",
    userCredict :App.globalData.userCredict,
  },
  cc:function(){
    
  },

  onLoad: function() {
    
    // 查看是否授权
    console.log("userCredict : App.globalData.userCredict is",App.globalData.userCredict,)
    this.setData({
      "userCredict" : App.globalData.userCredict
    })
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


    db.collection("users").doc(App.globalData.docId).get({
      success:function(res){
        console.log("用户信息",res.data)
        that.setData({
         userCredict:res.data.credit
        })
        console.log("hhh",userCredict)
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