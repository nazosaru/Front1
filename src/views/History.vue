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
            </div>

            <!-- 历史记录列表 -->
            <div class="history-list-container">
              <div class="history-item" v-for="(item, index) in paginatedHistory" :key="item.id"
                   @click="viewHistoryDetail(item)">
                <div class="history-item-content">
                  <img :src="item.imageUrl" alt="History Image" class="history-thumbnail" />
                  <div class="history-info">
                    <div class="history-text">{{ item.text || 'No description' }}</div>
                    <div class="history-time">{{ formatTime(item.time) }}</div>
                  </div>
                </div>
                <div class="history-item-actions">
                  <button class="item-button" @click.stop="copyResult(item)">Copy</button>
                </div>
              </div>

              <div v-if="paginatedHistory.length === 0" class="empty-history">
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

      <!-- 在 history-list-container 下方添加分页控件 -->
      <div class="pagination-controls">
        <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="pagination-button"
        >
          Previous
        </button>
        <span class="page-info">
       {{ currentPage }} / {{ totalPages }}
    </span>
        <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="pagination-button"
        >
          Next
        </button>
      </div>

    </template>
  </dashboard>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Snowfall from "../components/Snowfall.vue";
import { getUsername } from "../utils/Auth";
import dashboard from "../components/Dashboard.vue";
import { API_ENDPOINTS } from "../config/apiConfig";


// 新增分页相关响应式变量
const currentPage = ref(1);
const pageSize = ref(7);
const allHistory = ref([]); // 存储所有历史记录


const totalPages = computed(() => {
  return Math.ceil(allHistory.value.length / pageSize.value);
});

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return allHistory.value.slice(start, end);
});


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
  fetchHistory: API_ENDPOINTS.listAll,
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
    const userId = localStorage.getItem("user_id");

    const formData = new FormData();
    formData.append("user_id", userId);

    // 注意：这里不再发送分页参数，获取全部数据
    const response = await fetch(api.fetchHistory, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();

    if (result.code === 0 && result.data) {
      // 存储所有历史记录
      allHistory.value = result.data.map((item, idx) => ({
        id: idx,
        imageUrl: item.images?.[0] ? 'data:image/jpeg;base64,' + item.images[0] : "",
        text: item.search_text || "",
        time: item.date || new Date().toISOString()
      }));
    }
  } catch (error) {
    console.error("Error loading history:", error);
  } finally {
    isLoading.value = false;
  }
};

// 分页切换函数
const changePage = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return;
  currentPage.value = newPage;
};

// 刷新历史记录
const refreshHistory = () => {
  loadHistory();
};



// 查看历史记录详情
const viewHistoryDetail = (item) => {
  currentDetail.value = { ...item };
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


.history-list-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.history-item {
  background-color: rgba(240, 240, 255, 0.2);
  /* 原本是 rgba(46, 49, 64, 0.5) */
  border: 1px solid rgba(180, 180, 200, 0.4);
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
  background-color: rgba(51,51,51, 0.2);
  /* 原来更深，这里改成更亮的悬停色 */
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
  margin-right: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-family: "Consolas", monospace;
}

.item-button:hover {
  background-color: rgba(0,0,0, 0.7);
}



.empty-history {
  text-align: center;
  padding: 40px;
  color: rgba(25, 25, 25, 0.5);
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: rgba(26, 28, 45, 0.8);
  color: #e0e0e0;
  border-radius: 10px;
  width: 60%;
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
  color: #ffffff;
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
  background-color: #2e2e3f;
  color: #e6e6e6;
  border-radius: 5px;
  margin-bottom: 15px;
  white-space: pre-wrap;
  font-family: "Consolas", monospace;
}

.modal-header,
.modal-footer {
  background-color: transparent;
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

/* 分页控件样式 */
.pagination-controls {
  position: fixed;
  bottom: 15px;
  left: 55%;
  background: transparent;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 10px 20px;
  border-radius: 30px;
  z-index: 100;
}

.pagination-button {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: rgba(240,240,240,0.7);
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: #65657f;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
  min-width: 100px;
  text-align: center;
}



</style>