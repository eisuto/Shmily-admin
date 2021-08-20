export function getAPI() {
    // 本地
    const local_base = "http://127.0.0.1:";
    const dev_base   = "http://82.156.231.128:";
    const local = {
        // 用户侧 - 基础服务
        user_base_service:  local_base + "8001",
        // 管理侧 - 基础服务
        admin_base_service: local_base + "7001",
    };
    const dev = {
        // 用户侧 - 基础服务
        user_base_service:  dev_base + "8001",
        // 管理侧 - 基础服务
        admin_base_service: dev_base + "7001",
    };
    // 返回根机
    return local;
}
