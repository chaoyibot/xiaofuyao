<script>
import { useUserStore } from '@/stores/user'

export default {
  onLaunch: function () {
    console.log('🏥 小福药 App Launch')

    // 初始化用户信息（从本地存储恢复）
    const userStore = useUserStore()
    userStore.initFromStorage()

    // 检查更新（仅在生产环境）
    // #ifdef MP-WEIXIN
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (modal) {
                if (modal.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
    }
    // #endif
  },
  onShow: function () {
    console.log('📱 小福药 App Show')
  },
  onHide: function () {
    console.log('💤 小福药 App Hide')
  }
}
</script>

<style lang="scss">
@import "@/uni.scss";

/* 全局重置 */
page {
  background-color: $uni-bg-color-grey;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  line-height: 1.5;
  font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
}

/* 通用工具类 */
.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.flex-1 { flex: 1; }

.text-xs { font-size: $uni-font-size-sm; }
.text-base { font-size: $uni-font-size-base; }
.text-lg { font-size: $uni-font-size-lg; }
.text-xl { font-size: $uni-font-size-xl; }
.text-xxl { font-size: $uni-font-size-xxl; }

.text-primary { color: $uni-color-primary; }
.text-secondary { color: $uni-text-color-secondary; }
.text-danger { color: $uni-color-danger; }
.text-warning { color: $uni-color-warning; }
.text-success { color: $uni-color-success; }
.text-white { color: #FFFFFF; }

.bg-primary { background-color: $uni-color-primary; color: #FFFFFF; }
.bg-white { background-color: #FFFFFF; }
.bg-grey { background-color: $uni-bg-color-grey; }

.rounded { border-radius: $uni-border-radius-base; }
.rounded-sm { border-radius: $uni-border-radius-sm; }
.rounded-lg { border-radius: $uni-border-radius-lg; }
.rounded-full { border-radius: 9999rpx; }

.shadow-sm { box-shadow: $uni-shadow-sm; }
.shadow { box-shadow: $uni-shadow-base; }
.shadow-lg { box-shadow: $uni-shadow-lg; }

.p-2 { padding: $uni-spacing-col-base; }
.p-3 { padding: $uni-spacing-col-lg; }
.px-2 { padding-left: $uni-spacing-col-base; padding-right: $uni-spacing-col-base; }
.py-2 { padding-top: $uni-spacing-col-base; padding-bottom: $uni-spacing-col-base; }

.m-2 { margin: $uni-spacing-col-base; }
.mt-2 { margin-top: $uni-spacing-col-base; }
.mb-2 { margin-bottom: $uni-spacing-col-base; }
.ml-2 { margin-left: $uni-spacing-col-base; }
.mr-2 { margin-right: $uni-spacing-col-base; }

.gap-2 { gap: $uni-spacing-col-base; }
.gap-3 { gap: $uni-spacing-col-lg; }
</style>
