import "../plugins/axios";
import {getAPI} from './config'
const _axios = axios;
const api = getAPI();

/**
 * 用户列表
 * @returns {*}
 */
export function list(data) {
    return _axios.post(
        api.admin_base_service + "/admin/user/list",
        data
    );
}

/**
 * 新增用户
 * @returns {*}
 */
export function addUser(data) {
  return _axios.post(
      api.admin_base_service + "/admin/user",
      data
  );
}
/**
 * 删除用户
 * @returns {*}
 */
export function delUser(data) {
  return _axios.delete(
      api.admin_base_service + "/admin/user/" + data
  );
}
/**
 * 修改用户
 * @returns {*}
 */
export function putUser(data) {
  return _axios.put(
      api.admin_base_service + "/admin/user",
      data
  );
}


// 这下面两个现在是模拟的
/**
 * 用户登录
 * @param data
 * @returns {*}
 */
export function login(data) {
    return _axios.post("/user/login", data);
}

/**
 * 获取用户信息
 * @returns {*}
 */
export function getUserInfo() {
    return _axios.get("/user/info");
}
