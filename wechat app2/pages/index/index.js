// index.js
// 获取应用实例
const app = getApp()

Page({

  data: {
    message:'Here is a test.',
    checkin:true,
    course:[{id:0,name:'A'},{id:1,name:'B'},{id:2,name:'C'}],
    staffA: {firstName: 'Hulk', lastName: 'Hu'},
    staffB: {firstName: 'Shang', lastName: 'You'},
    staffC: {firstName: 'Gideon', lastName: 'Lin'}
  },
  
  onLoad() {
     
  },

  onclick() {
      console.log(this.data.message)
      this.data.message="NJUSE"
      this.setData({
        message:this.data.message
      })
  },

  changeswitch({detail}){
    this.setData({
      check:detail.value
    })
    console.log(detail)
  },

  todemo(e){
      let course =e.currentTarget.dataset.course
      wx.navigateTo({
        url: '/pages/demo/demo2?course=${coures.id}&name=${course.name}',
      })
  }
  // getUserProfile(e) {
  //   // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
  //   wx.getUserProfile({
  //     desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
  //     success: (res) => {
  //       console.log(res)
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   })
  // },
  // getUserInfo(e) {
  //   // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  //   console.log(e)
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  }
)
