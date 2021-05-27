// 使用了 async await 语法
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-5gwueugxee955e70',
})


const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const ap = cloud.getWXContext()
  try {
    return await db.collection('shopping_cart').where({
      _openid:ap.OPENID,
      product_checked: "true"
    }).remove()
  } catch(e) {
    console.error(e)
  }
}