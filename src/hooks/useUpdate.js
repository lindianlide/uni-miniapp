//新版本更新小程序
export function useUpdate() {
  function update() {
    const updateManager = uni.getUpdateManager()

    updateManager.onCheckForUpdate(function () {
      // 请求完新版本信息的回调
      //console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      uni.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      uni.showModal({
        title: '提示',
        content: '新版小程序下载失败\n请自行退出程序，手动卸载本程序，再运行',
        confirmText: '知道了'
      })
    })
  }

  return { update }
}
