
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  var jbrid=event.jbrid
  const db=cloud.database()
  const _ = db.command

  //先看数据库中举报数加完是否达到
  db.collection("ss").doc(event.id).get().then((res)=>{
    var total=res.data.ss_xx.jubao[1]
    var lzid=res.data.ss_xx.lzid
    if(total>9){
      return
    }
    if(total<=8){
      //加完小于等于九，可以直接加
      db.collection("ss").doc(event.id).update({
        data:{
          "ss_xx.jubao.0":_.push(jbrid),
          "ss_xx.jubao.1":_.inc(1)
        }
      })
      return
    }else{
      db.collection("ss").doc(event.id).update({
        data:{
          "ss_xx.jubao.0":_.push(jbrid),
          "ss_xx.jubao.1":_.inc(1),
          //清空评论
          'ss_xx.huifunr':[],
          'ss_xx.huifunb':0
        }
      })
      db.collection('user').doc(lzid).get().then((res)=>{
        var weiguinb=res.data.weiguinb
        console.log("weiguinb:",weiguinb)
        //发消息被举报了
        if(weiguinb>5){
          //违规超过5次封号
          db.collection('user').where({
            '_id':lzid,
            'wenzhang.id':event.id
          }).update({
            data: {
              'message':_.push({
                type:'jubao',
                time:event.time,
                ssid:event.id,
                plnr:event.ywnr,
                name:"帖子被封：",
                id:event.id+event.time,
                liuyan:false
              }),
              'wenzhang.$.weigui':true,
              weiguinb:_.inc(1),
              ban:true
              // 表示将 done 字段置为 true
              // 'wenzhang.$.unread':_.inc(1),
            }
          })
          return
        }else{
          db.collection('user').where({
            '_id':lzid,
            'wenzhang.id':event.id
          }).update({
            data: {
              'message':_.push({
                type:'jubao',
                time:event.time,
                ssid:event.id,
                plnr:event.ywnr,
                name:"帖子被封：",
                id:event.id+event.time,
                liuyan:false
              }),
              'wenzhang.$.weigui':true,
              weiguinb:_.inc(1)
              // 表示将 done 字段置为 true
              // 'wenzhang.$.unread':_.inc(1),
            }
          })
          return
        }
        
      })
      
    }
  })

}

