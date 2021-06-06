
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  //console.log("@@@",event.userInfo.openId,event.id)
  var dzrid=event.dzrid
  const db=cloud.database()
  const _ = db.command

  if(dzrid==null||dzrid==undefined||dzrid==""){
    return
  }
  db.collection("ss").doc(event.id).get().then((res)=>{
    var dianzanid=res.data.ss_xx.dianzanid
    //var openid=res.data._openid
    //console.log("yc为：",event.yc)
    var yn=dianzanid.indexOf(dzrid)
    if(yn==-1){
      //没电
      db.collection("ss").doc(event.id).update({
        data:{
          "ss_xx.dianzanid":_.push(dzrid),
          "ss_xx.dianzannb":_.inc(1)
        }
      })
      console.log("点赞了")
      return
    }else{
      db.collection("ss").doc(event.id).update({
        data:{
          //这里要移除openid
          "ss_xx.dianzanid":_.pull(dzrid.toString()),
          "ss_xx.dianzannb":_.inc(-1)
        }
      })
      console.log("取消了")
      return
    }
   
  })

}

