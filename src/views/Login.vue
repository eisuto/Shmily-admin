<template>
    <v-app>
        <v-content>
            <v-container fluid fill-height>
                <v-layout class="align-center justify-center">
                    <v-flex xs12 sm8 md6 lg5 xl3>
                        <v-card class="elevation-12">
                            <v-toolbar color="primary" dark flat>
                                <v-toolbar-title>
                                    <v-icon  large>admin_panel_settings</v-icon>
                                    Shmily 管理员登录
                                </v-toolbar-title>
                                <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-card-text>
                                <v-form ref="login_form">
                                    <v-text-field
                                            label="邮箱"
                                            name="nikeName"
                                            prepend-icon="email"
                                            type="text"
                                            v-model="loginForm.nikeName"
                                            :rules="[rules.required]"
                                    ></v-text-field>

                                    <v-text-field
                                            id="password"
                                            label="密码"
                                            name="password"
                                            prepend-icon="lock"
                                            :type="passwordDisplay ? 'text' : 'password'"
                                            v-model="loginForm.password"
                                            :append-icon="passwordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                                            @click:append="passwordDisplay = !passwordDisplay"
                                            :rules="[rules.required]"
                                    ></v-text-field>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                        :loading="loginLoading"
                                        color="primary"
                                        @click="userLogin"
                                >登录
                                </v-btn
                                >
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
        <v-snackbar top :color="snackbar.color" v-model="snackbar.show">
            {{ snackbar.text }}
            <v-btn text @click="snackbar.show = false">Close</v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
    import {login} from "../api/login"
    import {comps} from "../api/role";

    export default {
        name: "Login",
        data: () => ({
            passwordDisplay: false,
            loginLoading: false,
            loginForm: {
                nikeName: "waabdxiaoyi@gmail.com",
                password: "123456"
            },
            rules: {
                required: value => !!value || "Required."
            },
            snackbar: {
                show: false,
                text: "",
                color: "primary"
            }
        }),
        methods: {
            userLogin() {
                login(this.loginForm).then(
                    res => {
                        if (res.code === 200) {
                            sessionStorage.setItem("userInfo",JSON.stringify(res.data));
                            comps({
                                roleValue : JSON.parse(sessionStorage.getItem("userInfo")).role
                            }).then(
                                res => {
                                    if (res.code === 200) {
                                        console.log("获取这个角色拥有的权限成功");
                                        sessionStorage.setItem("userComps",JSON.stringify(res.data));
                                    } else {
                                        console.log("获取角色权限新失败")
                                    }

                                }
                            );
                            this.$store.dispatch("user/LOGIN", this.loginForm).then(
                                res => {
                                    this.loginLoading = false;
                                    this.$router.replace("/");
                                }
                            )

                        } else {
                            this.snackbarShow("普通用户不能登录后台系统", "error");
                            console.error(res);
                        }
                    }
                )
                // const _this = this;
                // if (!_this.$refs.login_form.validate()) return;
                // // 表单验证成功
                // _this.loginLoading = true;
                // _this.$store
                //     .dispatch("user/LOGIN", _this.loginForm)
                //     .then(res => {
                //         if (res.code === 200) {
                //             _this.loginLoading = false;
                //             _this.$router.replace("/");
                //         } else {
                //             console.error(res); // _this.snackbarShow(res.msg);
                //         }
                //     })
                //     .catch(({msg}) => {
                //         _this.snackbarShow(msg, "error");
                //     })
                //     .finally(() => {
                //         _this.loginLoading = false;
                //     });
            },
            snackbarShow(text, color) {
                this.snackbar = {
                    show: true,
                    text,
                    color
                };
            }
        }
    };
</script>

<style scoped>
    .v-content {
        background-image: url("../assets/back.svg");
        background-size: 100%;
    }
</style>
