<template>
  <component :is="currentThemeComponent" />
  <dashboard>
    <template #left-content>
      <div class="history-system">
        <div class="main-content">
          <div class="history-container">
            <!-- 历史记录标题区域 -->
            <div class="history-header">
              <h2>Search History</h2>
              <div class="history-actions">
                <button class="action-button" @click="refreshHistory">Refresh</button>
                <button class="action-button" @click="clearAllHistory">Clear All</button>
              </div>
            </div>

            <!-- 历史记录列表 -->
            <div class="history-list-container">
              <div
                  class="history-item"
                  v-for="(item, index) in history"
                  :key="item.id"
                  @click="viewHistoryDetail(item)"
              >
                <div class="history-item-content">
                  <img :src="item.imageUrl" alt="History Image" class="history-thumbnail" />
                  <div class="history-info">
                    <div class="history-text">{{ item.text || 'No description' }}</div>
                    <div class="history-time">{{ formatTime(item.time) }}</div>
                  </div>
                </div>
                <div class="history-item-actions">
                  <button class="item-button" @click.stop="copyResult(item)">Copy</button>
                  <button class="item-button delete-btn" @click.stop="removeHistory(index)">Delete</button>
                </div>
              </div>

              <div v-if="history.length === 0" class="empty-history">
                No history records found
              </div>
            </div>

            <!-- 历史记录详情弹窗 -->
            <div v-if="showDetailModal" class="history-detail-modal" @click.self="closeDetailModal">
              <div class="modal-content">
                <div class="modal-header">
                  <h3>History Detail</h3>
                  <button class="close-btn" @click="closeDetailModal">×</button>
                </div>
                <div class="modal-body">
                  <img :src="currentDetail.imageUrl" alt="Detail Image" class="detail-image" />
                  <div class="detail-text">{{ currentDetail.text }}</div>
                  <div class="detail-time">Created at: {{ formatTime(currentDetail.time) }}</div>
                </div>
                <div class="modal-footer">
                  <button class="modal-button" @click="copyResult(currentDetail)">Copy Text</button>
                  <button class="modal-button" @click="downloadImage(currentDetail.imageUrl)">Download Image</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </dashboard>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import {useRouter} from "vue-router";
import Snowfall from "../components/Snowfall.vue";
import {getUsername} from "../utils/Auth";
import dashboard from "../components/Dashboard.vue";
import {API_ENDPOINTS} from "../config/apiConfig";

const router = useRouter();

// 主题相关
const currentTheme = ref("Snowfall");
const currentThemeComponent = computed(() => {
      return Snowfall;
});

// 历史记录数据
const history = ref([]);
const isLoading = ref(false);
const showDetailModal = ref(false);
const currentDetail = ref({
  id: "",
  imageUrl: "",
  text: "",
  time: ""
});

// API配置
const api = {
  fetchHistory: API_ENDPOINTS.list,
  deleteHistory: API_ENDPOINTS.deleteHistory
};

// 初始化加载历史记录
onMounted(() => {
  const username = getUsername();
  if (!username) {
    router.push("/");
  } else {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      currentTheme.value = savedTheme;
    }
    loadHistory();
  }
});

// 加载历史记录
const loadHistory = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(api.fetchHistory, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        username: getUsername()
      })
    });

    const result = await response.json();

    if (result.code === 0 && result.data) {
      history.value = result.data.map(item => ({
        id: item.search_history_id,
        imageUrl: item.image_url || "",
        text: item.search_text || "",
        time: item.created_at || new Date().toISOString()
      }));
    } else {
      console.error("Failed to load history:", result.message);
    }
  } catch (error) {
    console.error("Error loading history:", error);
  } finally {
    isLoading.value = false;
  }
};

// 刷新历史记录
const refreshHistory = () => {
  loadHistory();
};

// 清除所有历史记录
const clearAllHistory = async () => {
  if (confirm("Are you sure you want to clear all history?")) {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(api.deleteHistory, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: getUsername(),
          delete_all: true
        })
      });

      const result = await response.json();

      if (result.code === 0) {
        history.value = [];
      } else {
        console.error("Failed to clear history:", result.message);
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  }
};

// 删除单条历史记录
const removeHistory = async (index) => {
  if (confirm("Are you sure you want to delete this record?")) {
    const item = history.value[index];
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(api.deleteHistory, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: getUsername(),
          search_history_id: item.id
        })
      });

      const result = await response.json();

      if (result.code === 0) {
        history.value.splice(index, 1);
      } else {
        console.error("Failed to delete history item:", result.message);
      }
    } catch (error) {
      console.error("Error deleting history item:", error);
    }
  }
};

// 查看历史记录详情
const viewHistoryDetail = (item) => {
  currentDetail.value = {...item};
  showDetailModal.value = true;
};

// 关闭详情弹窗
const closeDetailModal = () => {
  showDetailModal.value = false;
};

// 复制结果文本
const copyResult = (item) => {
  if (item.text) {
    navigator.clipboard.writeText(item.text)
        .then(() => alert("Text copied to clipboard"))
        .catch(() => alert("Failed to copy text"));
  }
};

// 下载图片
const downloadImage = (imageUrl) => {
  const link = document.createElement("a");
  link.href = imageUrl;
  link.download = `history-image-${Date.now()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 格式化时间显示
const formatTime = (timeString) => {
  if (!timeString) return "Unknown time";
  const date = new Date(timeString);
  return date.toLocaleString();
};
</script>

<style scoped>
.history-system {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  overflow: hidden;
}

.history-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  color: #353535;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.history-header h2 {
  font-size: 1.5rem;
  color: #353535;
  margin: 0;
}

.history-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  background-color: rgba(46,49,64);
  color: #ccc;
  border: 1px solid rgba(84, 83, 83, 0.5);
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Consolas", monospace;
}

.action-button:hover {
  background-color: #434653;
}

.history-list-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.history-item {
  background-color: rgba(46, 49, 64, 0.5);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.history-item:hover {
  background-color: rgba(46, 49, 64, 0.7);
}

.history-item-content {
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.history-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 15px;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-text {
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.history-time {
  font-size: 0.8rem;
  color: rgba(211, 211, 211, 0.7);
}

.history-item-actions {
  display: flex;
  gap: 10px;
}

.item-button {
  background-color: rgba(30, 30, 63, 0.5);
  color: #d3d3d3;
  border: 1px solid rgba(84, 83, 83, 0.5);
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-family: "Consolas", monospace;
}

.item-button:hover {
  background-color: rgba(173, 216, 230, 0.3);
}

.delete-btn {
  background-color: rgba(100, 30, 30, 0.5);
}

.delete-btn:hover {
  background-color: rgba(200, 60, 60, 0.3);
}

.empty-history {
  text-align: center;
  padding: 40px;
  color: rgba(25,25,25, 0.5);
  font-style: italic;
  font-size: 1.3rem;
}

/* 详情弹窗样式 */
.history-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: rgba(46, 49, 64, 0.95);
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  margin: 0;
  color: #d3d3d3;
}

.close-btn {
  background: none;
  border: none;
  color: #d3d3d3;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px 10px;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.detail-text {
  width: 100%;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin-bottom: 15px;
  white-space: pre-wrap;
  font-family: "Consolas", monospace;
}

.detail-time {
  font-size: 0.9rem;
  color: rgba(211, 211, 211, 0.7);
  align-self: flex-start;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 10px;
}

.modal-button {
  background-color: rgba(46, 49, 64, 0.8);
  color: #d3d3d3;
  border: 1px solid rgba(84, 83, 83, 0.5);
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-button:hover {
  background-color: rgba(173, 216, 230, 0.3);
}

/* 滚动条样式 */
.history-list-container::-webkit-scrollbar {
  width: 6px;
}

.history-list-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.history-list-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.history-list-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}

.modal-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>