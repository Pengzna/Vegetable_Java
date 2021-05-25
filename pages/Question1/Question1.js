// pages/page1/page1.js
Page({

    /**
     * 页面的初始数据
     */
    data: {  
        questionDecArr:["QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ","QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ","QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ","QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ"],
        questionAnsArr:["A11","A12","A13","A14","A21","A22","A23","A24","A31","A32","A33","A34","A41","A42","A43","A44"],
        questionExpArr:["A11","A12","A13","A14","A21","A22","A23","A24","A31","A32","A33","A34","A41","A42","A43","A44"],
        correctOfUserChoice : 2,
        numOfSelection: "" ,
        count : 0,
        total : 5,
        textOfBtn : "下一题"
    },



    myTap:function(res){
        //根据用户的选择判断对错，错了弹出对应解析，直到对了才进入下一题。
        var isTrue = res.currentTarget.dataset.istrue
        var name = "A"
        var numOfSelection = Number(res.currentTarget.id.charCodeAt()-65)//A是65，减去65后A是0
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
     */
    onLoad: function (options) {
       
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
        getapp.globalData.credit++
        console.log("now the global credit is" + getapp.globalData.credit)
        count+=1
        getapp.globalData.countOfQue = count
        if(count<=5)
        {   

            wx.redirectTo({
                url: '../../pages/Question1/Question1',
              })
        }

        else
        {
            wx.showToast({
              title: '恭喜你完成了本次答题，希望你能继续学习碳中和相关知识，做一个环保战士哦',
            })
            wx.redirectTo({
                url: '../index/index',
              })
        }
        
    
        console.log("this count is "+this.data.count)
        
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
        console.log("the date count is "+this.data.count)
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