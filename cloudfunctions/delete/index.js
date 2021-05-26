
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})


exports.main = async (event, context) => {
//以下全部data内容
  var liuyan=event._data.liuyan
  var id0=event._data.id0//lv0的id
  var id1=event._data.id1//lv1,2的id
  var time=event._data.time
  var time1=event._data.time1
  var id=event._data.id
  var ku='ss'
  if(liuyan){
    var ku='tj'
  }
//以上全部data内容

  var _=cloud.database().command
 
  if(id1==""){
    //这是删除lv0评论
    cloud.database().collection(ku).doc(id).get().then((res)=>{
      console.log("打印取到的回复",res)
      var ss_xx=res.data.ss_xx
      var total=0
      console.log("total1：",total)
      console.log("chang:",ss_xx.huifunr.length)
      if(liuyan==false){
        for(var i=0;i<ss_xx.huifunr.length;i++){
          var dd=ss_xx.huifunr[i]
          if(dd.time==time && dd.plrid==id0){
            console.log("nbbb",dd.huifunb)
  
            if(dd.huifunb==undefined){
              total=-1
            }else{
              total=dd.huifunb+1
              total=-total
            }
            console.log("total4：",total)
            break
          }
        }
      }

      console.log("执行了删除lv0:total",total)
      cloud.database().collection(ku).doc(id).update({
        data: {
          'ss_xx.huifunr':_.pull({
            'time':_.eq(time),
            'plrid':_.eq(id0)
          }),
          'ss_xx.huifunb':_.inc(total)
        }
      })
    })
    
  }else{
    //这是删除lv1，2评论
    console.log("执行了删除lv1,2")
    cloud.database().collection(ku).where({
      _id:id,
      "ss_xx.huifunr.plrid":id0,
      "ss_xx.huifunr.time":time,
    }).update({
      data: {
        'ss_xx.huifunr.$.huifunb':_.inc(-1),
        'ss_xx.huifunr.$.huifu':_.pull({
          time:_.eq(time1),
          plrid:_.eq(id1)
        }),
        'ss_xx.huifunb':_.inc(-1)
      }
    })
  }
}

