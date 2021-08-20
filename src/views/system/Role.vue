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

            <template v-slot:top>
                <v-toolbar flat>
                    <!--搜索框-->
                    <v-text-field
                            style="width: 1rem"
                            v-model="searchForm.keyWord"
                            append-icon="mdi-magnify"
                            label="ID/角色名称/权限字符"
                            single-line
                            hide-details
                            @keyup.enter="search()"
                    ></v-text-field>
                    <!--                    弹出层-->
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                    style="margin-left: 2rem"
                                    color="primary"
                                    dark
                                    v-bind="attrs"
                                    v-on="on">新增
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" md="12">
                                            <v-text-field
                                                    outlined
                                                    clearable
                                                    v-model="editedItem.roleName" label="角色名称">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="12">
                                            <v-text-field
                                                    outlined
                                                    clearable
                                                    v-model="editedItem.roleValue" label="权限字符">

                                            </v-text-field>
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
                        @click="editComp(item)"
                        color="info">
                    <v-icon left>
                        label_important
                    </v-icon>
                    权限分配
                </v-btn>
                <v-btn
                        class="ma-lg-2"
                        elevation="0"
                        small
                        outlined
                        @click="editItem(item)"
                        color="success">
                    <v-icon left>
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
                    <v-icon left>
                        delete
                    </v-icon>
                    删除
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
        <!--        权限分配对话框-->
        <v-dialog
                v-model="compDialog"
                scrollable
                max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">权限分配</span>
                </v-card-title>
                <v-card-text>
                    <v-container></v-container>
                    <!--                    权限树-->
                    <v-treeview
                            v-model="selectionComps"
                            color="warning"
                            rounded
                            hoverable
                            dense
                            selectable
                            :items="comps"
                            selected-color="red"
                    ></v-treeview>
                </v-card-text>


                <v-card-actions>

                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text
                           @click="compDialog = false">
                        取消
                    </v-btn>
                    <v-btn color="blue darken-1" text
                           @click="saveComp()">
                        保存
                    </v-btn>
                </v-card-actions>
            </v-card>

        </v-dialog>

        <!--    消息条-->
        <v-snackbar v-model="snackbar"
                    :color="options"
                    outlined
                    top
                    style="margin-top: 4rem;font-size: 15px!important;"
                    :timeout="2000">
            <v-icon v-if="options === 'success'" color="#fff">check_circle</v-icon>
            <v-icon v-if="options === 'info'" color="#fff">info</v-icon>
            <v-icon v-if="options === 'error'" color="#fff">error</v-icon>
            {{ text }}
            <v-btn
                    color="#fff"
                    text
                    @click="snackbar = false">
                Close
            </v-btn>
        </v-snackbar>
    </div>


</template>

<script>
    import {

        list,
        comps,
        addRole,
        delRole,
        putRole,
        saveComps,
    } from "../../api/role"
    import {tree} from "../../api/comp"

    export default {
        name: "Role",
        data: () => ({
            // 权限分配对话框
            compDialog: false,
            // 加载开关
            loading: false,
            // 消息条
            snackbar: false,
            options: 'info',
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
                {text: '角色名称', value: 'roleName', sortable: false},
                {text: '权限字符', value: 'roleValue', sortable: false},
                {text: '创建时间', value: 'createTime'},
                {text: '修改时间', value: 'updateTime'},
                {text: '操作', value: 'actions', sortable: false},

            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                id: '',
                roleName: '',
                roleValue: '',
            },
            defaultItem: {
                id: '',
                roleName: '',
                roleValue: '',
            },
            // 权限树
            comps: [],
            // 选择的权限
            selectionComps: [],
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
                this.treeComp();
                list(this.searchForm).then(
                    res => {
                        if (res.code === 200) {
                            this.desserts = res.data.list;
                            this.searchForm.total = res.data.page.pages;
                            this.loading = false;
                        } else {
                            console.log(res.data);

                        }

                    }
                )
            },
            // 获取角色权限树结构
            treeComp() {
                tree().then(
                    res => {
                        if (res.code === 200) {
                            this.comps = res.data;
                            console.log(res.data)
                        } else {
                            console.log(res.data);

                        }

                    }
                )
            },

            // 保存角色权限
            saveComp() {
                this.compDialog = false;
                saveComps({
                    id: this.editedItem.id,
                    compIds : this.selectionComps,
                }).then(
                    res => {
                        if (res.code === 200) {
                            this.snack("分配成功", 'success');
                        } else {
                            this.snack("分配失败", 'error');
                        }

                    }
                );
                console.log(this.selectionComps)
            },
            // 编辑角色权限
            editComp(item) {
                this.selectionComps = [];
                this.editedItem = Object.assign({}, item);
                // 查询指定角色拥有的权限
                comps(item).then(
                    res => {
                        if (res.code === 200) {
                            console.log("这个角色拥有的权限");
                            console.log(res.data);
                            let list = res.data;
                            for (let item of list) {
                                this.selectionComps.push(item.id)
                            }
                            // this.selectionComps = res.data
                        } else {
                            this.snack("操作失败", 'error');
                        }

                    }
                );
                this.compDialog = true;
            },


            // 获取角色颜色
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
                delRole(this.editedItem.id).then(
                    res => {
                        if (res.code === 200) {
                            this.initialize();
                            this.snack("删除成功", 'success');
                        } else {
                            this.snack("删除失败", 'error');
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
                    putRole(this.editedItem).then(
                        res => {
                            if (res.code === 200) {
                                this.initialize();
                                this.snack("修改成功", 'success');
                            } else {
                                this.snack("修改失败", 'error');
                            }
                        }
                    );
                }
                // 新增的情况
                else {
                    addRole(this.editedItem).then(
                        res => {
                            if (res.code === 200) {
                                this.initialize();
                                this.snack("新增成功", 'success');
                            } else {
                                this.snack("新增失败", 'error');
                            }
                        }
                    );

                }
                this.close()
            },
            snack(text, options) {
                this.snackbar = true;
                this.options = options;
                this.text = text;
            },
        },

    }
</script>
<style scoped>
    /deep/ .v-pagination li:nth-child(1) {
        margin-left: auto !important;
    }
</style>
