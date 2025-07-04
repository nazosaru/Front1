<template>
  <Starfield />

  <Dashboard>
    <template #left-content>
      <div class="userManagement">
        <div class="main-content">
          <h2>User Management</h2>
          <table class="user-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>User Role</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in users" :key="index">
                <td v-if="editingIndex === index">
                  <input v-model="editUserData.username" readonly />
                </td>
                <td v-else>{{ user.username }}</td>

                <td v-if="editingIndex === index">
                  <input v-model="editUserData.email" />
                </td>
                <td v-else>{{ user.email }}</td>

                <td>{{ user.permission_level === 1 ? 'user' : 'admin' }}</td>

                <td>
                  <button v-if="editingIndex === index" @click="saveUser(index)">
                    Store
                  </button>
                  <button v-else @click="editUser(index)">Edit</button>

                  <button v-if="editingIndex !== index" @click="deleteUser(index)">
                    Delete
                  </button>

                  <button v-if="editingIndex === index" @click="cancelEdit(index)">
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </template>
  </Dashboard>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import Starfield from "@/components/Snowfall.vue";
import { getUsername } from "@/utils/Auth";
import { API_ENDPOINTS } from "../../config/apiConfig";
import Dashboard from "@/components/DashboardAdmin.vue";

const router = useRouter();
const route = useRoute();

const users = ref([]);
const editingIndex = ref(null);
const editUserData = ref({ username: "", email: "" });

const api = {
  get_user_info: API_ENDPOINTS.get_user_info,
  edit_user_info: API_ENDPOINTS.edit_user_info,
  delete_user: API_ENDPOINTS.delete_user,
};

let url = ref(api.get_user_info);
const token = localStorage.getItem("jwtToken");

const fetchUsers = async () => {
  try {
    const response = await axios.get(url.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.code === 0) {
      users.value = response.data.data;
    } else {
      console.error("获取用户数据失败:", response.data.message);
    }
  } catch (error) {
    console.error("获取用户数据失败:", error);
  }
};

const editUser = (index) => {
  editingIndex.value = index;
  editUserData.value = { ...users.value[index] };
};

let url2 = api.edit_user_info;
const saveUser = async (index) => {
  if (editingIndex.value !== null) {
    users.value[index] = { ...editUserData.value };

    const formData = new FormData();
    formData.append("username", users.value[index].username);
    formData.append("email", users.value[index].email);

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
        alert("User information has been updated!");
      } else {
        console.error("Edit failed", result.message);
      }
    } catch (error) {
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

    const urlEncodedParams = new URLSearchParams(Object.entries(users.value[index]));

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
        console.error("Edit failed", result.message);
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
  color: #ffffff;       /* 设置为白色 */
  font-size: 26px;      /* 字体大小可根据需要调整 */
  font-weight: 600;     /* 加粗，可选 */
  margin-bottom: 20px;  /* 与下方表格保持距离 */
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
  height: 780px;
}

.user-table {
  border-radius: 18px;
  box-shadow: 1px 1px 8px 0 grey;
  height: 90%;
  margin-bottom: 20px;
  padding: 20px 25px 20px 25px;
  width: 90%;
  color: rgba(255, 255, 255, 0.8);
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.user-table th {
  background-color: rgba(62, 62, 95, 0.6);
  text-align: center;
}

.user-table th,
.user-table td {
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 10px; /* 增加垂直 padding */
  text-align: left;
  line-height: 1.6; /* 可选：提高行内内容的高度感 */
  min-height: 48px; /* 设置最小行高 */
}

.user-table button {
  margin-right: 5px;
  padding: 8px 12px; /* 增加按钮内边距 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
  background-color: #0dbe83;
  width: 45%;
  height: 38px; /* 设置按钮高度 */
  margin-left: 5px;
  margin-right: 5px;
  font-size: 14px;
}


  .user-table button:hover {
    background-color: #0dbe83;
  }

.user-table button:active {
  background-color: #0056b3;
}

.user-table input {
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid #3e4a6b;
  background-color: #3e4a6b;
  color: #d3d3d3;
}

.user-table th:nth-child(3),
.user-table td:nth-child(3) {
  text-align: center;
  width: 120px;
}
</style>
