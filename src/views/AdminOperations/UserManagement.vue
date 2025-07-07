<template>
  <Snowfall />
  <Dashboard>
    <template #left-content>
      <div class="userManagement">
        <div class="main-content">
          <h2>User Management</h2>

          <!-- 查询与筛选容器 -->
          <div class="search-filter-row">
            <!-- 查询功能 -->
            <div class="search-container">
              <i class="fa fa-search search-icon"></i>
              <input v-model="searchQuery" @input="searchUser" placeholder="Search by username" class="search-input" />
            </div>

            <!-- 筛选管理员 -->
            <div class="filter-container">
              <select class="user-role-select" v-model="filterAdmin" @change="searchUser">
                <option value="">All</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          <!-- 用户表格 -->
          <table class="user-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>User Role</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="index">
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td v-if="editingIndex === index">
                  <select v-model="editUserData.permission_level">
                    <option :value="1">user</option>
                    <option :value="0">admin</option>
                  </select>
                </td>
                <td v-else>{{ user.permission_level === 1 ? 'user' : 'admin' }}</td>
                <td>
                  <button v-if="editingIndex === index" @click="saveUser(index)">Store</button>
                  <button v-else @click="editUser(index)">Edit</button>
                  <button class="delete-btn" v-if="editingIndex !== index" @click="deleteUser(index)">Delete</button>
                  <button v-if="editingIndex === index" @click="cancelEdit(index)">Cancel</button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="4" style="text-align: center; padding: 20px;">
                  No matching users found.
                </td>
              </tr>
            </tbody>
          </table>

          <!-- 分页控件 -->
          <div class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
          </div>
        </div>
      </div>
    </template>
  </Dashboard>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import Snowfall from "@/components/Snowfall.vue";
import { getUsername } from "@/utils/Auth";
import { API_ENDPOINTS } from "../../config/apiConfig";
import Dashboard from "@/components/DashboardAdmin.vue";

const router = useRouter();
const users = ref([]);
const editingIndex = ref(null);
const editUserData = ref({ username: "", permission_level: 1 });
const searchQuery = ref(""); // 搜索条件
const currentPage = ref(1); // 当前页码
const pageSize = ref(8); // 每页显示的用户数
const totalPages = ref(1); // 总页数
const filterAdmin = ref(""); // 筛选管理员的状态

const api = {
  get_user_info: API_ENDPOINTS.get_user_info,
  edit_user_info: API_ENDPOINTS.edit_user_info,
  delete_user: API_ENDPOINTS.delete_user,
};

let url = ref(api.get_user_info);
const token = localStorage.getItem("jwtToken");

const fetchUsers = async (page = 1, query = "", filter = "") => {
  try {
    const response = await axios.get(url.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page,  // 当前页码
        pageSize: pageSize.value,  // 每页显示的条数
        search: query,  // 查询条件
        filterAdmin: filter, // 筛选管理员条件
      },
    });

    if (response.data.code === 0) {
      users.value = response.data.data.users || [];
      const total = response.data.data.total || 0;
      const pages = Math.ceil(total / pageSize.value);
      totalPages.value = pages > 0 ? pages : 1;

      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
      }
    } else {
      console.error("获取用户数据失败:", response.data.message);
    }
  } catch (error) {
    console.error("获取用户数据失败:", error);
  }
};

const editUser = (index) => {
  editingIndex.value = index;
  editUserData.value = {
    username: users.value[index].username,
    permission_level: users.value[index].permission_level,
  };
};

// 查询功能
const searchUser = () => {
  currentPage.value = 1; // 每次查询时回到第一页
  fetchUsers(currentPage.value, searchQuery.value, filterAdmin.value); // 根据查询条件获取用户数据
};

// 分页功能
const changePage = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return; // 防止无效页码
  currentPage.value = newPage;
  fetchUsers(currentPage.value, searchQuery.value); // 根据新页码获取用户数据
};

onMounted(() => {
  const username = getUsername();
  if (!username) {
    router.push("/"); // 如果没有用户名则重定向
  } else {
    fetchUsers(currentPage.value, ""); // 初始化获取用户列表
  }
});

let url2 = api.edit_user_info;
const saveUser = async (index) => {
  if (editingIndex.value !== null) {
    users.value[index].permission_level = editUserData.value.permission_level;

    const formData = new FormData();
    formData.append("username", users.value[index].username);
    formData.append("permission_level", users.value[index].permission_level);

    try {
      const response = await fetch(url2, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (result.code === 0) {
        editingIndex.value = null;
        alert("User role has been updated!");
        fetchUsers(); // 🔁刷新用户列表
      } else {
        alert("Update failed: " + result.message);
        console.error("Edit failed", result.message);
      }
    } catch (error) {
      alert("Network error while updating user");
      console.error("Request failed", error);
    }
  }
};

let url3 = api.delete_user;
const deleteUser = async (index) => {
  if (confirm("Are you sure you want to delete this user?")) {
    alert("User has been deleted!");
    if (editingIndex.value === index) {
      editingIndex.value = null;
      editUserData.value = {};
    }

    const urlEncodedParams = new URLSearchParams({
      username: users.value[index].username,
    });

    try {
      const response = await fetch(url3, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedParams.toString(),
      });

      const result = await response.json();
      if (response.ok) {
        editingIndex.value = null;
        fetchUsers();
      } else {
        console.error("Delete failed", result.message);
      }
    } catch (error) {
      console.error("Request failed", error);
    }
  }
};

const cancelEdit = (index) => {
  if (confirm("Are you sure you want to cancel the modification?")) {
    editingIndex.value = null;
  }
};

onMounted(() => {
  const username = getUsername();
  if (!username) {
    router.push("/");
  } else {
    fetchUsers();
  }
});
</script>


<style scoped>
.main-content h2 {
  color: #ffffff;
  /* 设置为白色 */
  font-size: 26px;
  /* 字体大小可根据需要调整 */
  font-weight: 600;
  /* 加粗，可选 */
  margin-bottom: 20px;
  /* 与下方表格保持距离 */
}

body {
  margin: 0;
  font-family: "Montserrat", sans-serif;
  color: #d3d3d3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.userManagement {
  display: flex;
  height: fit-content;
  margin: 5px;
  border-radius: 5px;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  height: 100%;
  /* 不再限制高度为 780px */
  overflow: hidden;
  /* 防止外溢 */
}

.user-table {
  border-radius: 18px;
  box-shadow: 1px 1px 8px 0 grey;
  flex: 1;
  /* 占据剩余空间 */
  margin-bottom: 20px;
  padding: 20px 25px 20px 25px;
  width: 90%;
  color: rgba(255, 255, 255, 0.8);
  overflow-y: auto;
  /* ⚠️ 关键部分，启用垂直滚动 */
  max-height: 600px;
  /* 设置最大高度，防止无限撑开 */
}

.user-table th {
  background-color: rgba(106, 109, 155, 0.5);
  text-align: center;
}

.user-table thead th {
  text-align: center !important;
}

.user-table th {
  background-color: rgba(106, 109, 155, 0.5);
  text-align: center;
  padding: 15px 10px;
  /* 根据需要调整 */
  line-height: 1.6;
  /* 可选：提高行内内容的高度感 */
  min-height: 50px;
  /* 设置最小行高 */
}

.user-table td {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  /* 减小内容行的上下 padding */
  text-align: left;
  line-height: 1.4;
  /* 减小内容行的行高 */
  min-height: 25px;
  /* 设置最小行高 */
}

.user-table button {
  margin-right: 5px;
  padding: 8px 12px;
  /* 增加按钮内边距 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
  background-color: #0dbe83;
  width: 45%;
  height: 36px;
  /* 设置按钮高度 */
  margin-left: 5px;
  margin-right: 5px;
  font-size: 14px;
}

.user-table select {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px; 
  background-color: rgba(106, 109, 155, 0.2);
  color: #ffffff;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg fill='white' height='10' viewBox='0 0 24 24' width='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  transition: border-color 0.2s ease-in-out;
}

.user-role-select {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  height: 35px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background-color: rgba(106, 109, 155, 0.2);
  color: #ffffff;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg fill='white' height='10' viewBox='0 0 24 24' width='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  transition: border-color 0.2s ease-in-out;
}

.user-table select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: none;
}

.user-table option {
  background-color: rgba(106, 109, 155, 0.5);
  /* 新的下拉菜单背景 */
  color: #fff;
}

.user-role-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: none;
}

.user-role-select option {
  background-color: rgba(106, 109, 155, 0.5);
  color: #fff;
}

.user-table button:hover {
  background-color: #0dbe83;
}

.user-table button:active {
  background-color: #0056b3;
}

.delete-btn:active {
  background-color: #d9534f !important;
}

.user-table input {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: rgba(106, 109, 155, 0.1);
  color: #fff;
}

.user-table th:nth-child(3),
.user-table td:nth-child(3) {
  text-align: center;
  width: 120px;
}

.search-container {
  position: relative;
  max-width: 200px;
  width: 100%;
  margin-bottom: 20px;
  text-align: left;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  height: 35px;
  padding: 8px 8px 8px 36px;
  /* 👈 左边为图标留空间 */
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: rgba(106, 109, 155, 0.2);
  color: #fff;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
  background-color: #0dbe83;
}

.pagination button:disabled {
  background-color: #ccc;
}

.pagination span {
  color: #fff;
  font-size: 16px;
}

.filter-container {
  margin-bottom: 20px;
  text-align: left;
}

.filter-container select {
  padding: 8px;
  font-size: 14px;
  height: 35px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  background-color: rgba(106, 109, 155, 0.2);
  color: #ffffff;
  min-width: 80px;
}

.search-filter-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px; /* 控制间距 */
  margin-bottom: 5px;
  width: 100%;
  max-width: 500px;
}

.search-container,
.filter-container {
  flex-shrink: 0;
}

</style>
