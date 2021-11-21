// pages/login/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },
  handleInput(e) {
    let type = e.currentTarget.id;
    this.setData({
      [type]: e.detail.value
    })

  },
  //登录的回调
  async login() {
    let {
      phone,
      password
    } = this.data;
    let regNumber = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    let regPassword = /^[a-zA-Z]\w{5,17}$/;
    //前端验证
    /* 
    1.验证用户信息是否合法
    2.前端验证不通过就提示用户不需要发请求
    3.前端验证通过了，发请求（携带账号密码）给服务端
    */
    
    //1.手机号为空2.手机号不正确 正则3.验证成功
    if (!phone) {
      wx.showToast({
        title: "请输入手机号",
        icon: "none"
      })
      return
    };
    if (!regNumber.test(phone)) {
      wx.showToast({
        title: "手机号格式输入不正确！",
        icon: "none"
      })
      return 
    }
    if (!regPassword.test(password)) {
      wx.showToast({
        title: "密码请以字母开头，长度在6~18之间，只能包含字母、数字和下划线！",
        icon: "none"
      });
      return
    };
   
    //后端验证
    let resData = await request('/login/cellphone',{phone,password,isLogin:true});
    if(resData.code===200){
      wx.showToast({
        title: "恭喜登录成功！"
      })
    }else if(resData.code===501){
      wx.showToast({
        title: "账号不存在！",
        icon: "none"
      })
    }else if(resData.code===502){
      wx.showToast({
        title: "密码错误！",
        icon: "none"
      })
    }else if(resData.code===400){
      wx.showToast({
        title: "手机号错误！",
        icon: "none"
      })
    }else{
      wx.showToast({
        title: "登陆失败，请重新登录！",
        icon: "none"
      })
    };
    wx.setStorageSync('userInfo', JSON.stringify(resData.profile))
    wx.reLaunch({
      url:"/pages/personal/index"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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