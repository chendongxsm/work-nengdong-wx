// pages/other/help/publish.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeList:[],
    type:'',
    user:[
      {
        name:'联系人',
        value:'',
        showimg:false,
        msg:'请输入联系人',
        prop:'college',
        hide:''
      },
      {
        name:'手机号',
        value:'',
        showimg:true,
        msg:'请输入手机号',
        hide:false,
        prop:'phone'
      },
      {
        name:'邮箱',
        value:'',
        showimg:true,
        msg:'请输入邮箱',
        hide:false,
        prop:'email'
      },
      {
        name:'QQ',
        value:'',
        showimg:true,
        msg:'请输入QQ',
        hide:false,
        prop:'qq'
      },
      {
        name:'微信',
        value:'',
        showimg:true,
        msg:'请输入微信',
        hide:false,
        prop:'weixin'
      }
    ],
    address:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.apiPost('getMutual_Help_Type').then(res=>{
      this.setData({
        typeList:res
      })
    })
  },
  bindinput(e){
    let prop = e.currentTarget.dataset.prop
    this.data.user.forEach(item => {
        if(item.prop === prop){
          item.value = e.detail.value
        }
    });
    this.setData({
      user:this.data.user
    })
  },
  checkShow(e){
    this.data.user.map(item=>{
      if(e.currentTarget.dataset.prop == item.prop)
      item.hide = true
    })
    this.setData({
      user:this.data.user
    })
  },
  checkHide(e){
    this.data.user.map(item=>{
      if(e.currentTarget.dataset.prop == item.prop)
      item.hide = false
    })
    this.setData({
      user:this.data.user
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

  submit(e){
    let data = e.detail.value
    let arr = {}
    this.data.user.map(item=>{
      arr[item.prop+'_hide'] = item.hide
    })
    let result =this.data.user.some(item=>{
      return item.hide === true
    })
    data = Object.assign({address:this.data.address,list:arr},data)
    if(!data.type){
      app.toastMsg('error','请选择类型')
      return
    }
    if(!data.title){
      app.toastMsg('error','请填写标题')
      return
    }
    if(!data.content){
      app.toastMsg('error','请填写内容')
      return
    }
    if(data.address.length == 0){
      app.toastMsg('error','请上传图片')
      return
    }
    if(!result){
      app.toastMsg('error','请勾选一项可见')
      return
    }
    app.apiPost('addMutual_Help',data).then(res=>{
      let error = res.error == 0 ? 'success' : 'error'
      app.toastMsg(error,res.msg)
      if(res.error == 0){
        wx.redirectTo({
          url:'pages/other/help/help?type=1'
        })
      }
    })
  },
  pickerChange(e){
    this.setData({
      type:this.data.typeList[e.detail.value].name
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