import "../plugins/axios";
import {getAPI} from './config'
const _axios = axios;
const api = getAPI();

/**
 * 管理人员登录
 * @returns {*}
 */
export function login(data) {
    return _axios.post(
        api.admin_base_service + "/admin/user/login",
        data
    );
}
