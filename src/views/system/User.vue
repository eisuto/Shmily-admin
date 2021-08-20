<template>
    <div>
        <v-data-table
                :loading="loading"
                loading-text="数据加载中……"
                v-model="selected"
                item-key="id"
                show-select
                :headers="headers"
                :items="desserts"
                sort-by="calories"
                class="elevation-1"
                :page.sync="searchForm.pageNum"
                :items-per-page="searchForm.pageSize"
                hide-default-footer
        >
            <!--            性别插槽-->
            <template v-slot:item.sex="{item}">
                <span class="ma-2"
                        label
                        link
                > {{getDictKeyName(item.sex,"sys_user_sex")}}
                </span>
            </template>
            <!--            角色插槽-->
            <template v-slot:item.role="{item}">
                <v-chip class="ma-2"
                        label
                        link
                        :color="getRoleColor(item.role)"
                        text-color="white"
                > {{getDictKeyName(item.role,"sys_role")}}
                </v-chip>
            </template>
            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field
                            style="width: 1rem"
                            v-model="searchForm.keyWord"
                            append-icon="mdi-magnify"
                            label="ID/昵称/邮箱/角色/手机号"
                            single-line
                            hide-details
                            @keyup.enter="search()"
                    ></v-text-field>
                    <v-dialog
                            v-model="dialog"
                            max-width="700px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                    style="margin-left: 2rem"
                                    color="primary"
                                    dark
                                    v-bind="attrs"
                                    v-on="on"
                            >
                                新增
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" md="8">
                                            <v-text-field
                                                    outlined
                                                    clearable
                                                    v-model="editedItem.nikeName" label="昵称"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-autocomplete
                                                    outlined
                                                    clearable
                                                    v-model="editedItem.role"
                                                    :items="getDict('sys_role')"
                                                    item-text="text"
                                                    item-value="value"
                                                    label="角色"
                                                    persistent-hint
                                                    single-line
                                            ></v-autocomplete>
                                        </v-col>
                                        <v-col cols="12" md="8">
                                            <v-text-field
                                                    outlined
                                                    clearable
                                                    v-model="editedItem.email" label="邮箱"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field
                                                    outlined
                                                    clearable
                                                    v-model="editedItem.age" label="年龄"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="8">
                                            <v-text-field
                                                    outlined
                                                    clearable
                                                    v-model="editedItem.mobile" label="手机号"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-autocomplete
                                                    outlined
                                                    clearable
                                                    v-model="editedItem.sex"
                                                    :items="getDict('sys_user_sex')"
                                                    item-text="text"
                                                    item-value="value"
                                                    label="性别"
                                                    persistent-hint
                                            ></v-autocomplete>
                                        </v-col>

                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="close"
                                >
                                    取消
                                </v-btn>
                                <v-btn
                                        color="blue darken-1"
                                        text
                                        @click="save"
                                >
                                    保存
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-spacer></v-spacer>

                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialogDelete" max-width="460px">
                        <v-card>
                            <v-card-title class="text-h5">您确定要删除此条数据吗？此操作不可恢复。</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn class="body-1" color="blue darken-1" text @click="closeDelete">取消</v-btn>
                                <v-btn class="body-1" color="blue darken-1" text @click="deleteItemConfirm">确定</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-btn
                        class="ma-lg-2"
                        elevation="0"
                        small
                        outlined
                        @click="editItem(item)"
                        color="success">
                    <v-icon left >
                        edit
                    </v-icon>
                    编辑
                </v-btn>
                <v-btn
                        class="ma-lg-2"
                        elevation="0"
                        small
                        outlined
                        @click="deleteItem(item)"
                        color="error">
                    <v-icon left >
                        delete
                    </v-icon>
                    删除
                </v-btn>
                <v-btn outlined color="primary" class="ma-lg-2" small>
                    <v-icon left>share</v-icon>
                    关系网
                </v-btn>
            </template>
            <template v-slot:no-data>
                <v-btn
                        color="primary"
                        @click="initialize"
                >
                    Reset
                </v-btn>
            </template>
        </v-data-table>
        <!--        分页-->
        <div>
            <v-container>
                <v-row>
                    <v-col cols="12" sm="10">
                        <v-pagination
                                v-model="searchForm.pageNum"
                                :length="searchForm.total"
                                :total-visible="7"
                                @input="toPage()"
                        ></v-pagination>
                    </v-col>
                    <v-col cols="12" sm="1">
                        <v-text-field
                                class="float-right"
                                solo
                                dense
                                :value="searchForm.pageNum"
                                min="1"
                                suffix="页"
                                @input="searchForm.pageNum = parseInt($event, 10)"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="1">
                        <v-select
                                solo
                                dense
                                suffix="条"
                                v-model="searchForm.pageSize"
                                :items="pageSizes"
                                @input="toPage()"
                        ></v-select>
                    </v-col>


                </v-row>
            </v-container>
        </div>


        <!--    消息条-->
        <v-snackbar v-model="snackbar"
                    :color="options"
                    outlined
                    top
                    style="margin-top: 4rem;font-size: 15px!important;"
                    :timeout="2000">
            <v-icon v-if="options === 'success'" color="#fff">check_circle</v-icon>
            <v-icon v-if="options === 'info'"    color="#fff">info</v-icon>
            <v-icon v-if="options === 'error'"   color="#fff">error</v-icon>
            {{ text }}
            <v-btn
                    color="#fff"
                    text
                    @click="snackbar = false" >
                Close
            </v-btn>
        </v-snackbar>
    </div>


</template>

<script>
    import {
        list,
        addUser,
        delUser,
        putUser
    } from "../../api/user"
    import {listDict} from "../../api/dict";

    export default {
        name: "User",
        data: () => ({
            dictTemp:[],
            // 加载开关
            loading: false,
            // 消息条
            snackbar: false,
            options:'info',
            text: '',

            selected: '',

            // 搜索 分页
            searchForm: {
                keyWord: '',
                pageNum: 1,
                pageSize: 10,
                total: 10,
            },
            pageSizes: [5, 10, 20, 50, 100],
            dialog: false,
            dialogDelete: false,
            headers: [
                {text: 'ID', value: 'id', align: 'start',},
                {text: '昵称', value: 'nikeName', sortable: false},
                {text: '邮箱', value: 'email', sortable: false},
                {text: '手机号码', value: 'mobile', sortable: false},
                {text: '粉丝数', value: 'fans'},
                {text: '关注数', value: 'follow'},
                {text: '年龄', value: 'age'},
                {text: '性别', value: 'sex', sortable: false},
                {text: '角色', value: 'role'},
                {text: '注册时间', value: 'createTime'},
                {text: '操作', value: 'actions', sortable: false},

            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                id: '',
                nikeName: '',
                email: '',
                role: '',
                age: '',
                sex: '',
                mobile: '',
                fans: '',
                follow: '',
                createTime: '',

            },
            defaultItem: {
                id: '',
                nikeName: '',
                email: '',
                role: '',
                age: '',
                sex: '',
                mobile: '',
                fans: '',
                follow: '',
                createTime: '',
            },
        }),

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? '新增' : '编辑'
            },
        },

        watch: {
            dialog(val) {
                val || this.close()
            },
            dialogDelete(val) {
                val || this.closeDelete()
            },
        },

        created() {
            this.initialize()
        },

        methods: {
            initialize() {
                this.loading = true;
                this.getDictList();
                list(this.searchForm).then(
                    res => {
                        if (res.code === 200) {
                            this.desserts = res.data.list;
                            this.searchForm.total = res.data.page.pages;
                            console.log(this.desserts);
                            this.loading = false;
                        } else {
                            console.log(res.data);

                        }

                    }
                )

            },
            getRoleColor(value) {
                if (value === 'admin') {
                    return 'red';
                } else {
                    return 'primary'
                }
            },
            // 切换页码
            toPage() {
                this.initialize();
            },
            // 搜索
            search() {
                this.searchForm.pageNum = 1;
                this.initialize();
            },

            editItem(item) {
                this.editedIndex = this.desserts.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true
            },

            deleteItem(item) {
                this.editedIndex = this.desserts.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialogDelete = true
            },

            // 删除 单条
            deleteItemConfirm() {
                // this.desserts.splice(this.editedIndex, 1)
                delUser(this.editedItem.id).then(
                    res => {
                        if (res.code === 200) {
                            this.initialize();
                            this.snack("删除成功",'success');
                        } else {
                            this.snack("删除失败",'error');
                        }
                    }
                );
                this.closeDelete()
            },

            close() {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
            },

            closeDelete() {
                this.dialogDelete = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
            },

            save() {
                // 修改的情况
                if (this.editedIndex > -1) {
                    // Object.assign(this.desserts[this.editedIndex], this.editedItem)
                    putUser(this.editedItem).then(
                        res => {
                            if (res.code === 200) {
                                this.initialize();
                                this.snack("修改成功",'success');
                            } else {
                                this.snack("修改失败",'error');
                            }
                        }
                    );
                }
                // 新增的情况
                else {
                    addUser(this.editedItem).then(
                        res => {
                            if (res.code === 200) {
                                this.initialize();
                                this.snack("新增成功",'success');
                            } else {
                                this.snack("新增失败",'error');
                            }
                        }
                    );

                }
                this.close()
            },
            snack(text,options) {
                this.snackbar = true;
                this.options = options;
                this.text = text;
            },
            // 获取字典列表
            getDictList() {
                const query = {
                    'pageNum': 1,
                    'pageSize': 10000,
                };
                listDict(JSON.stringify(query)).then(
                    res => {
                        if (res.code === 200) {
                            this.dictTemp = res.data.list;
                        } else {
                            console.log(res.data);
                        }

                    }
                )
            },
            // 获取字典键列表，根据字典类型
            getDict(typeName) {
                let temp = [];
                for (let dict of this.dictTemp) {
                    if (dict.typeValue === typeName) {
                        temp.push(dict);
                    }
                }
                return temp;
            },
            // 根据字典翻译 键值 => 键名称
            getDictKeyName(keyValue,typeValue){
                for (let dict of this.dictTemp) {
                    if (keyValue === dict.value && typeValue === dict.typeValue) {
                        return dict.text
                    }
                }
            }
        },

    }
</script>
<style scoped>
    /deep/ .v-pagination li:nth-child(1) {
        margin-left: auto !important;
    }
</style>
