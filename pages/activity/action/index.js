// pages/activity/action/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList:['校友活动','学校活动','学院活动','专业活动','班级活动','讲座活动'],
    type:'',
    organizerList:['官方','非官方'],
    organ:'',
    klassList:['校团委','学生会','学工处','后勤处'],
    klass:'',
    start:'',
    end:'',
    cover:[],
    address:[],
    isShow:0,
    years:[],
    months:[],
    days:[],
    hours:[],
    munite:[],
    showPickerView:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.newTimeStr()
  },
  pickerViewChange(e){
    let indexArr = e.detail.value
    if(this.data.showPickerView == 'start'){
      this.data.start = this.data.years[indexArr[0]] +'-'+this.data.months[indexArr[1]]+'-'+this.data.days[indexArr[2]]+' '+this.data.hours[indexArr[3]]+':'+this.data.munite[indexArr[4]]+':'+'00'
    }
    if(this.data.showPickerView == 'end'){
      this.data.end = this.data.years[indexArr[0]] +'-'+this.data.months[indexArr[1]]+'-'+this.data.days[indexArr[2]]+' '+this.data.hours[indexArr[3]]+':'+this.data.munite[indexArr[4]]+':'+'00'
    }
  },
  pickerBtn(e){
    let type = e.currentTarget.dataset.btn
    if(type == 'ok'){
      this.setData({
        start:this.data.start,
        end:this.data.end,
        showPickerView:false
      })
    }else{
      this.setData({
        showPickerView:false
      })
    }
  },
  newTimeStr(){
    let date = new Date()
    for(var i = 1990; i<date.getFullYear()+5;i++){
      this.data.years.push(i)
    }
    for(var i=1;i<=12;i++){
      if(i<10){
        i = '0' + i
      }
      this.data.months.push(i)
    }
    for(var i=1;i<=31;i++){
      this.data.days.push(i)
    }
    for(var i=0;i<24;i++){
      if(i < 10){
        i = '0' + i
      }
      this.data.hours.push(i)
    }
    for(var i=0;i<=60;i++){
      if(i<10){
        i = '0'+i
      }
      this.data.munite.push(i)
    }
    this.setData({
      years:this.data.years,
      months:this.data.months,
      days:this.data.days,
      hours:this.data.hours,
      munite:this.data.munite
    })
  },
  chooseTime(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      showPickerView:type
    })
  },
  pickerChange(e){
    let type = e.currentTarget.dataset.type
    let value = []
    switch(type){
      case 1 : this.setData({type:this.data.typeList[e.detail.value]})
                break;
      case 2 :this.setData({organ:this.data.organizerList[e.detail.value]})
                break;
      case 3 : this.setData({klass:this.data.klassList[e.detail.value]})
    }
  },
  cancel(){
    this.setData({
      isShow:0
    })
  },
  deleteImg(e){
    let index = e.currentTarget.dataset.index 
    let type = e.currentTarget.dataset.type
    if(type == 1){
      this.setData({
        cover:''
      })
    }
    if(type == 2){
      this.data.address.splice(index,1)
      this.setData({
        address:this.data.address
      })
    }
  },
  uploadImg(e){
    let self = this ,
    type = e.currentTarget.dataset.type
    wx.chooseImage({
      count:1,
      success:function(res){
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url:app.server + 'addImages',
          filePath:tempFilePaths[0],
          name:'file',
          success:function(res){
            let data = JSON.parse(res.data)
              if(res.statusCode == 200){
                if(type == 1){
                  self.setData({
                    cover:data
                  })
                }
                if(type == 2){
                  self.data.address.push(data)
                  self.setData({
                    address:self.data.address
                  })
                }
              }else{
                app.toastMsg('error','上传失败')
              }
          }
        })
      }
    })
  },

  formSubmit(e){
    var data = e.detail.value
    var newList = {
      starttime:this.data.start,
      endtime:this.data.end,
      cover:this.data.cover,
      address:this.data.address.toString()
    }
    data = Object.assign(data,newList)
    if(data.cover.length == 0){
      app.toastMsg('error','请上传封面照')
      return
    }
    if(!data.title){
      app.toastMsg('error','请填写标题')
      return
    }
    if(!data.type){
      app.toastMsg('error','请选择活动类型')
      return
    }
    if(!data.starttime || !data.endtime){
      app.toastMsg('error','请选择时间')
      return
    }
    if(!data.place){
      app.toastMsg('error','请填写地址')
      return
    }
    if(!data.organizer){
      app.toastMsg('error','请选择组织者')
      return
    }
    if(!data.participants){
      app.toastMsg('error','请填写参与人数')
      return
    }
    if(!data.phone && !data.email && !data.weixin && !data.qq){
      app.toastMsg('error','请填写联系方式')
      return
    }
    app.apiPost('addActivity',data).then(res=>{
      let error = res.error == 0 ? 'success' : 'error'
      app.toastMsg(error,res.msg)
      if(res.error == 0){
        this.setData({
          isShow:1
        })
        wx.removeStorageSync('start')
        wx.removeStorageSync('end')
      }else{
        this.setData({
          isShow:2
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成 
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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