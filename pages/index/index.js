import request from '../../utils/request'
// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    let bannerListData = await request('/banner', {
      type: 2
    });
    let recommendListData = await request('/personalized', {
      limit: 10
    });
    this.setData({
      bannerList: bannerListData.banners,
      recommendList: recommendListData.result
    });
    let index = 0;
    let resArr = [];
    while (index < 5) {
      let topListData = await request('/top/list', {
        idx: index
      })
      let topListItem = {
        name: topListData.playlist.name,
        tracks: topListData.playlist.tracks.slice(0, 3)
      };
      resArr.push(topListItem)
      this.setData({
        topList: resArr
      })
      index++;
    }

  },
  //跳转每日推荐页面
  handleRecommend(){
    wx.navigateTo({
      url: "/pages/recommendSong/index"
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