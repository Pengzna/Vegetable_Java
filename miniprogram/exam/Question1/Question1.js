// pages/page1/page1.js
Page({

    /**
     * 页面的初始数据
     */
    data: {  
        questionDecArr:[
            '欢迎来到概念题：特定区域（或组织）一年内所有二氧化碳排放量与清除量达到平衡"指的是',
            "现实题扑面而来：截止2019年底地球二氧化碳浓度超过____",
            "这是一道数学题噢，请听题：1ppm = ____",
            "来权衡一下利弊吧：下列哪项是全球变暖带来的危害",
            "比比大小：下列哪一个碳排放量最多"
            ],
        questionAnsArr:[
            "碳中和","碳达峰","碳饱和","碳太多",
            "400ppm","300ppm","200ppm","600ppm",
            "百万分之一","十万分之一","万分之一","千万分之一",
            "干旱地区更干旱，多雨地区更多雨","我找不到女朋友","没有女孩子喜欢我","呜呜呜",
            "开车带女朋友兜风一小时","在英雄联盟和队友激烈对线一小时","爽爽地吹一小时的空调","用电视看一小时的玛卡巴卡"
            
        ],
        questionExpArr:[
            "好，这就是朴素无华的碳中和的概念噢","碳达峰指的是碳达峰指特定区域（或组织）年二氧化碳排放在一段时间内达到峰值，之后在一定范围内波动，然后进入平稳下降阶段","暂无解析","目前没有碳太多这个专有名词噢",
            
            "据说全中国知道这题答案的人不高于13亿人，你居然答对了，简直太厉害啦","正确答案是400ppm啦","正确答案是400ppm啦","正确答案是400ppm啦",
            
            "建议你看看其他三条答案会有惊喜噢","1pm = 1×10负十二次方。恭喜你找到了1条解析","1ppm 有两个p。恭喜你找到了第二条解析","所以可以理解成1ppm是1×10负六次方，即百万分之一啦。恭喜你找到了所有解析！",
            
            "呜呜呜选择这条答案的都是现充吗，不过还是恭喜你找到了正确答案","这是结果","这是起因","这是我的悲伤",

            "开车耗碳高达22000克/小时，确实是正确答案，没有女朋友的孩子希望这个答案能够成为你将来的模样！","虽然一小时的英雄联盟才耗碳190克，和开车比起来就是个小弱鸡，但是我对线耗费的精气神需要耗碳高达13kg/kg的牛肉来补！","空调哥621克/小时","为什么我的玛卡巴卡只有96克/小时？这不合理！",
            

        ],
        correctOfUserChoice : 2,
        numOfSelection: "" ,
        count : 1,
        total : 5,
        textOfBtn : "下一题"
    },



    myTap:function(res){
        //根据用户的选择判断对错，错了弹出对应解析，直到对了才进入下一题。
        var isTrue = res.currentTarget.dataset.istrue
        var name = "A"
        var numOfSelection = Number(res.currentTarget.id.charCodeAt()-65)//A是65，减去65后A是0，但是这样就代表第一个选项始终是第一个答案的解析，但是我们答案的设置是随机的，所以不一定第一个选项是第一个答案的解析，而应该是得要在数组索引加0的地方是原有
        this.setData({
            correctOfUserChoice:isTrue,
            numOfSelection:numOfSelection,
        })
        console.log(this.data.questionExpArr[0]);
        // console.log(res.currentTarget.dataset.istrue)
        // console.log(this.data.correctOfUserChoice)
        this.onLoad()
    
    },
   
    /**
     * 生命周期函数--监听页面加载
     * 在onload中实现获取id
     */
    onLoad: function (options) {
        var getapp = getApp()
        if(getapp.globalData.docId == "")
        {const db = wx.cloud.database()
        db.collection("users").where({openId:getapp.globalData.openId
        }).get().then(
          res=>{
            console.log(res)
            getapp.globalData.docId = res.data[0]._id
            console.log("the docId is " + getapp.globalData.docId)
    
          }
        )}
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     * 
     */
    onReady: function () {



        //利用随机数得到问题编号，答案编号，选项模版，存入Date
        var ranOfModle = parseInt(4*Math.random()+1)
        var lenOfQue = this.data.questionDecArr.length
        var ranOfQuestion = parseInt(lenOfQue*Math.random())
        var startOfAnswer = ranOfQuestion*4
        this.setData({
            numOfQuestion:ranOfQuestion,
            modelType : ranOfModle,
            startOfAnswer : startOfAnswer
        })       

    },

     /**
      * 这个函数用来统计用户的答题数，并在答完5题之后跳转到新页面
      * 计数通过更改全局变量实现
     */
    btnTap:function(){
        var getapp = getApp()
        var count = getapp.globalData.countOfQue
        getapp.globalData.userCredict++
        console.log("now the global credit is " + getapp.globalData.userCredict)
        count+=1
        getapp.globalData.countOfQue = count
        if(count<=5)
        {   
            
            wx.redirectTo({
                url: '../../exam/Question1/Question1',
              })
        }

        else
        {   
            var db = wx.cloud.database()
            db.collection("users").doc(getapp.globalData.docId).update(
                {
                    data:{
                        credit:getapp.globalData.userCredict
                    }
                }
            )
            console.log("成功更新")
            // db.collection("users").doc(getapp.globalData.docId).get().then(
            //     res=>{
            //         console.log(res)  //这边data不是数组
            //     }
            // )
            wx.showToast({
              title: '恭喜你完成了本次答题，希望你能继续学习碳中和相关知识，做一个环保战士哦',
            })
            wx.redirectTo({
                url: '../index/index',
              })
        }
        
    
    
        
    },

    navTap:function(){
        var getapp = getApp()
        var db = wx.cloud.database()
            db.collection("users").doc(getapp.globalData.docId).update(
                {
                    data:{
                        credit:getapp.globalData.userCredict
                    }
                }
            )
            console.log("成功更新")
    },
    /**
     * 生命周期函数--监听页面显示
     * 是在页面显示之后执行，那么我想要从上个页面传过来的数据可以先存到global数据里面，再在onshow
     * 里面调用，并给该页面的date，实现动态初始化 
     * 
     */
    onShow: function () {
         var getapp = getApp()
         var count = getapp.globalData.countOfQue
        console.log("the global count is " + count)
        if(count == 5)
        {   
            this.setData({
                textOfBtn:"结束答题",
            })
        }
        this.setData({
            count:count
        })
        // console.log("the date count is "+this.data.count)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        var getapp = getApp()
        var count = getapp.globalData.countOfQue
        if(count==6)
        {wx.showToast({
            title: '恭喜你完成了本次答题，希望你能继续学习碳中和相关知识，做一个环保战士哦',
            icon:"none",
            duration:5000
          })}
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})