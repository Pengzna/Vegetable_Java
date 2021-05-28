// zujian/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    Tabs:[
      {
        id:0,
        value:"最新发布",
        isactive:true
      },
      {
        id:1,
        value:"本周最热",
        isactive:false
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changetitle(e){
      console.log(e.currentTarget.dataset.title)
      var Tabs=this.data.Tabs
      if(e.currentTarget.dataset.title==0){
        Tabs[0].isactive=true
        Tabs[1].isactive=false
      }else{
        Tabs[0].isactive=false
        Tabs[1].isactive=true
      }
      this.setData({
        Tabs:Tabs
      })
      this.triggerEvent("change",e.currentTarget.dataset.title)
    }
  }
})
