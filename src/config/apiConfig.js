// src/config/apiConfig.js
import { SERVER_URL } from './serverConfig.ts';
export const API_BASE_URL = SERVER_URL;/* nginx自动解析 */

export const API_ENDPOINTS = {

/* -----已实现---------------------------------------------------------------- */
  login: `${API_BASE_URL}/user/login`, /* 用户登录 */ 
  register: `${API_BASE_URL}/user/register`, /* 用户注册 */
  sendCode: `${API_BASE_URL}/user/reset_password/send_code`, /* 发送验证码 */
  resetConfirm: `${API_BASE_URL}/user/reset_password/confirm`, /* 确认验证码并重置密码 */
  edit: `${API_BASE_URL}/user/edit`, /* 用户信息编辑 */
  feedback: `${API_BASE_URL}/user/feedback`, /* 提交反馈与建议 */
  delete: `${API_BASE_URL}/user/delete`, /* 账户注销 */
  personal: `${API_BASE_URL}/user/personal`, /* 个性化界面设置 */     

  text: `${API_BASE_URL}/search/text`, /* 文本检索 */
  image: `${API_BASE_URL}/search/image`, /* 图片检索 */
  dialogue:`${API_BASE_URL}/user/dialog`,/* 对话 */

  record: `${API_BASE_URL}/search_history/record`, /* 记录检索历史 */
  list: `${API_BASE_URL}/search_history/list`, /* 获取用户检索历史一组对话 */
  listAll: `${API_BASE_URL}/search_history/list_all`, /* 获取用户所有检索历史 */

  delete_user: `${API_BASE_URL}/admin/delete_user`, /* 管理员删除用户账号 */
  edit_user_info: `${API_BASE_URL}/admin/edit_user_info`, /* 管理员更改用户信息 */
  get_user_info: `${API_BASE_URL}/admin/get_user_info`, /* 管理员获取用户数据 */

  get_setting: `${API_BASE_URL}/admin/get_setting`,     /* 获取管理员备份设置 */
  set_setting:`${API_BASE_URL}/admin/set_setting`,      /* 更改管理员备份设置 */
  get_record: `${API_BASE_URL}/admin/get_record`,       /* 获取管理员备份记录 */
  create_backup:`${API_BASE_URL}/admin/create_backup`,  /* 管理员进行备份 */

};
