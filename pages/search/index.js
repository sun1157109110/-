// pages/search/index.js
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHolderContent: '',
    hotList: [],
    searchContent: '',
    searchList: [],
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotInfo();
    this.fn = this.debounce(this.getSearchInfo, 1000);
    let historyList = wx.getStorageSync('historyList');
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },

  //获取搜索默认关键字信息
  async getHotInfo() {
    let resData = await request('/search/default');
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeHolderContent: resData.data.showKeyword,
      hotList: hotListData.data.map((item, index) => ({
        index,
        ...item
      }))
    })
  },
  //防抖
  debounce(fn, delayTime) {
    let timer = null;
    return function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, arguments)
      }, delayTime)
    }
  },

  //input事件
  handleInput(e) {
    let searchContent = e.detail.value.trim();
    this.setData({
      searchContent
    })
    this.fn()
  },
  //关键词模糊匹配搜索数据
  async getSearchInfo() {
    if (!this.data.searchContent) {
      this.setData({
        searchList: []
      });
      return
    };
    let {
      searchContent,
      historyList
    } = this.data
    let resSearchData = await request('/search', {
      keywords: searchContent,
      limit: 10
    });
    this.setData({
      searchList: resSearchData.result.songs
    });
    //添加历史记录 将相同的历史记录先删除再添加到前面
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1);
    }
    historyList.unshift(searchContent);
    wx.setStorageSync('historyList', historyList)
    this.setData({
      historyList
    })
  },

  //删除搜索框内容
  handleDelete() {
    this.setData({
      searchContent: '',
      searchList: []
    })
  },
  //清楚历史记录按钮回调
  clearHistoryList() {
    wx.showModal({
      title: '清除历史记录',
      content: '你确定要删除嘛?',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('historyList');
          this.setData({
            historyList: []
          })
        }
      }
    })
  },
  //点击取消回到上一个页面
  handleCancel(){
    wx.navigateBack()
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