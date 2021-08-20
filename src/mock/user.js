const Mock = require("mockjs");
const Random = Mock.Random;
// 这里是用户的权限列表 root为全部放开
Random.extend({
    roles: function () {
        console.log("这是时候调用的")
        // const roles = [
        //     ["admin"],
        // ];
        const roles = [
            [JSON.parse(sessionStorage.getItem("userInfo")).role]
        ];
        return this.pick(roles);
    }
});
export default {
    /** 用户登陆 */
    login: Mock.mock("/user/login", {
        code: 200,
        data: {
            token: "vuetify-admin-token"
        }
    }),
    /** 获取用户信息 */
    getUserInfo: Mock.mock("/user/info", {
        code: 200,
        data: {
            roles: "@ROLES",
            name: "@NAME",
            // avatar:
            // "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
            // 这里用户的头像
        }
    }),
    /** 用户登出 */
    logout: Mock.mock("/logout", {
        code: 200,
        meg: "logout success"
    })
};
