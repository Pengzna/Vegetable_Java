// 使用了 async await 语法
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-2gm89gcbba9c155c',
})


const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const ap = cloud.getWXContext()
  try {
    return await db.collection('shopping_cart').where({
     
      product_checked: "true"
    }).remove()
  } catch(e) {
    console.error(e)
  }
}