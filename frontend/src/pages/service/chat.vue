<template>
  <view class="chat-page">
    <AppHeader title="智能客服" />

    <!-- 状态指示 -->
    <view class="status-bar">
      <view class="status-dot"></view>
      <text class="status-text">{{ botStatus }}</text>
    </view>

    <!-- 消息列表 -->
    <scroll-view scroll-y class="message-list" :scroll-into-view="lastMessageId">
      <view
        v-for="msg in messages"
        :key="msg.id"
        :id="`msg-${msg.id}`"
      >
        <ChatBubble
          :role="msg.role"
          :text="msg.content"
        />
        <view v-if="msg.role === 'bot' && msg.suggestions" class="suggestions">
          <view
            v-for="s in msg.suggestions"
            :key="s"
            class="suggestion-chip"
            @click="sendSuggestion(s)"
          >{{ s }}</view>
        </view>
      </view>

      <!-- 加载中 -->
      <view v-if="isLoading" class="loading">
        <ChatBubble role="bot" text="正在思考..." />
      </view>
    </scroll-view>

    <!-- 快捷问题 -->
    <view class="quick-questions">
      <view
        v-for="q in quickQuestions"
        :key="q"
        class="quick-chip"
        @click="sendMessage(q)"
      >{{ q }}</view>
    </view>

    <!-- 输入框 -->
    <view class="input-bar">
      <input
        v-model="inputText"
        class="input-field"
        placeholder="请输入您的问题..."
        confirm-type="send"
        @confirm="onSend"
      />
      <button class="btn-send" :disabled="!inputText.trim()" @click="onSend">发送</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import ChatBubble from '@/components/ChatBubble.vue'
import { config } from '@/config'

const botStatus = ref('AI 药师在线 · 接入混元大模型')
const inputText = ref('')
const messages = ref([])
const isLoading = ref(false)
const lastMessageId = ref('')

const quickQuestions = [
  '怎么服药？',
  '漏服怎么办？',
  '常见副作用',
  '何时复查？',
  '饮食注意'
]

const initialMessages = [
  {
    id: 1,
    role: 'bot',
    content: '您好！我是您的专属 AI 药师助手 🤖\n\n我可以帮您解答关于氟尿嘧啶口服乳的用药问题。请随时向我提问！',
    suggestions: null
  },
  {
    id: 2,
    role: 'bot',
    content: '⚠️ 重要提示：我是 AI 助手，不能替代专业医师诊断。如有紧急情况，请立即拨打热线或就医。',
    suggestions: null
  }
]

// 知识库（模拟混元大模型回复）
const knowledgeBase = {
  '怎么服药': '📋 氟尿嘧啶口服乳用法用量：\n\n• 一般每日 300-600mg/m²，分 2-3 次口服\n• 推荐餐后 30 分钟服用，减少胃肠刺激\n• 整支服用，请勿拆分或咀嚼\n• 严格遵医嘱，切勿自行调整剂量\n\n⚠️ 具体方案以您的医师处方为准。',
  '漏服怎么办': '⏰ 漏服处理原则：\n\n• 想起时立即补服\n• 若已接近下次服药时间，跳过本次，按下次时间服药\n• 切勿一次服用双倍剂量\n• 连续漏服请咨询医师\n\n💡 建议开启用药提醒功能，避免漏服。',
  '常见副作用': '🩺 常见副作用（CTCAE 分级）：\n\n1️⃣ 胃肠道：恶心、呕吐、腹泻、口腔黏膜炎\n2️⃣ 血液：白细胞减少、血小板减少、贫血\n3️⃣ 皮肤：手足综合征、皮疹、色素沉着\n4️⃣ 其他：疲劳、脱发、食欲下降\n\n⚠️ 出现严重副作用请立即上报！',
  '何时复查': '📅 化疗期间复查建议：\n\n• 血常规：每 2-4 周一次\n• 肝肾功能：每月一次\n• 影像学（CT/MRI）：每 2-3 个月\n• 肿瘤标志物：根据方案调整\n\n💡 您可在「复查提醒」中查看个性化安排。',
  '饮食注意': '🥗 化疗期间饮食建议：\n\n✅ 多吃：高蛋白、新鲜蔬果、易消化食物\n❌ 避免：辛辣、油腻、生冷、酒精\n💧 每日饮水 2000ml 以上\n🧂 适量补铁、补钙\n\n⚠️ 食欲下降时可少量多餐'
}

function initMessages() {
  messages.value = [...initialMessages]
}

onMounted(() => {
  initMessages()
})

function scrollToBottom() {
  nextTick(() => {
    if (messages.value.length > 0) {
      lastMessageId.value = `msg-${messages.value[messages.value.length - 1].id}`
    }
  })
}

function generateBotReply(userMessage) {
  // 简单匹配
  for (const [key, reply] of Object.entries(knowledgeBase)) {
    if (userMessage.includes(key.replace(/怎么|怎么办/g, ''))) {
      return reply
    }
  }
  // 默认回复
  return `关于您咨询的问题，建议：\n1. 仔细阅读药品说明书\n2. 联系您的主治医师\n3. 必要时拨打紧急热线 ${config.emergencyPhone}\n\n⚠️ 我是 AI 助手，不能替代专业医师诊断。`
}

async function onSend() {
  const text = inputText.value.trim()
  if (!text) return

  // 添加用户消息
  const userMsg = { id: Date.now(), role: 'user', content: text }
  messages.value.push(userMsg)
  inputText.value = ''
  scrollToBottom()

  // 模拟 AI 思考
  isLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  isLoading.value = false

  // AI 回复
  const botMsg = {
    id: Date.now() + 1,
    role: 'bot',
    content: generateBotReply(text),
    suggestions: null
  }
  messages.value.push(botMsg)
  scrollToBottom()
}

function sendSuggestion(s) {
  sendMessage(s)
}

function sendMessage(text) {
  inputText.value = text
  onSend()
}
</script>

<style lang="scss" scoped>
@import "@/uni.scss";

.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: $uni-bg-color-grey;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 8rpx;
  background: #E8F5E9;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
  color: #2E7D32;
}
.status-dot {
  width: 12rpx;
  height: 12rpx;
  background: #4CAF50;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.message-list {
  flex: 1;
  padding: 16rpx 24rpx;
  overflow-y: auto;
}

.suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin: 8rpx 0 16rpx 76rpx;
}
.suggestion-chip {
  background: #FFFFFF;
  border: 1rpx solid $uni-color-primary-light;
  color: $uni-color-primary;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 16rpx;
}

.loading {
  opacity: 0.6;
}

.quick-questions {
  display: flex;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  background: #FFFFFF;
  border-top: 1rpx solid $uni-border-color;
  overflow-x: auto;
  white-space: nowrap;
}
.quick-chip {
  display: inline-block;
  background: $uni-color-primary-bg;
  color: $uni-color-primary;
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
}

.input-bar {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 24rpx;
  background: #FFFFFF;
  border-top: 1rpx solid $uni-border-color;
}
.input-field {
  flex: 1;
  background: $uni-bg-color-grey;
  border-radius: 24rpx;
  padding: 16rpx 24rpx;
  font-size: 28rpx;
}
.btn-send {
  background: $uni-color-primary;
  color: #FFFFFF;
  font-size: 26rpx;
  padding: 12rpx 24rpx;
  border-radius: 24rpx;
  border: none;
  &::after { border: none; }
  &[disabled] {
    background: #BBDEFB;
  }
}
</style>
