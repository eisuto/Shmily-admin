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
            <!--            状态插槽-->
            <template v-slot:item.status="{item}">
                <span class="ma-2"
                > {{getDictKeyName(String(item.status),"sys_status")}}
                </span>
            </template>
            <!--            子权限插槽-->
            <template v-slot:item.child="{item}">
                <v-btn
                        text
                        color="primary"
                        style="text-align: left !important"
                        @click="toChild(item.id)"
                >查看
                </v-btn>
            </template>
            <!--            图标插槽-->
            <template v-slot:item.icon="{item}">
                <v-icon>{{item.icon}}</v-icon>
            </template>q

            <template v-slot:top>
                <v-toolbar flat>
                    <v-text-field
                            style="width: 1rem;"
                            v-model="searchForm.keyWord"
                            append-icon="mdi-magnify"
                            label="ID/权限名称"
                            single-line
                            hide-details
                            @keyup.enter="search()"
                    ></v-text-field>

                    <v-btn v-if="father !== 0"
                           style="margin-left: 2rem"
                           color="primary"
                           dark
                           @click="toFather()">
                        返回父级权限
                    </v-btn>

                    <v-dialog
                            v-model="dialog"
                            max-width="500px"
                    >
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>

                                        <v-col cols="12" md="12">
                                            <v-text-field outlined clearable
                                                          v-model="editedItem.name" label="权限名称">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field outlined clearable
                                                          v-model="editedItem.icon" label="菜单图标">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-text-field outlined clearable
                                                          v-model="editedItem.order" label="排序">
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-autocomplete
                                                    outlined
                                                    clearable
                                                    v-model="editedItem.status"
                                                    :items="getDict('sys_status')"
                                                    item-text="text"
                                                    item-value="value"
                                                    label="状态"
                                                    persistent-hint
                                                    single-line
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
                <v-dialog
                        v-model="dialog"
                        max-width="500px"
                >
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>

                                    <v-col cols="12" md="12">
                                        <v-text-field outlined clearable
                                                      v-model="editedItem.name" label="权限名称">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field outlined clearable
                                                      v-model="editedItem.icon" label="菜单图标">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-text-field outlined clearable
                                                      v-model="editedItem.order" label="排序">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" md="4">
                                        <v-autocomplete
                                                outlined
                                                clearable
                                                v-model="editedItem.status"
                                                :items="getDict('sys_status')"
                                                item-text="text"
                                                item-value="value"
                                                label="状态"
                                                persistent-hint
                                                single-line
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
            </template>
            <template v-slot:item.actions="{ item }">
<!--                <v-btn-->
<!--                        class="ma-lg-2"-->
<!--                        elevation="0"-->
<!--                        small-->
<!--                        outlined-->
<!--                        @click="editItem(item)"-->
<!--                        color="info">-->
<!--                    <v-icon left>-->
<!--                        edit-->
<!--                    </v-icon>-->
<!--                    权限角色-->
<!--                </v-btn>-->
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
        addComp,
        delComp,
        putComp
    } from "../../api/comp"
    import {listDict} from "../../api/dict";

    export default {
        name: "Comp",
        data: () => ({
            father: 0,
            dictTemp: [],
            // 加载开关
            loading: false,
            // 消息条
            snackbar: false,
            options:'info',
            text: '',

            selected: '',

            // 搜索 分页
            searchForm: {
                fatherId: 0,
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
                {text: '权限名称', value: 'name', sortable: false},
                {text: '次级权限', value: 'child', sortable: false},
                {text: '菜单图标', value: 'icon', sortable: false},
                {text: '排序', value: 'order', sortable: false},
                {text: '状态', value: 'status'},
                {text: '创建时间', value: 'createTime', sortable: false},
                {text: '操作', value: 'actions', sortable: false},

            ],
            desserts: [],
            editedIndex: -1,
            editedItem: {
                id: '',
                name: '',
                icon: '',
                order: '',
                status: 1,


            },
            defaultItem: {
                id: '',
                name: '',
                icon: '',
                order: '',
                status: 1,
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
                this.searchForm.fatherId = 0;
                this.getList();
            },
            getList() {
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
            // 父级权限列表
            toFather() {
                // this.loading = true;
                this.father = 0;
                this.searchForm.fatherId = this.father;

                this.getList();
            },
            // 次级权限列表
            async toChild(id) {
                this.searchForm.fatherId = id;
                list(this.searchForm).then(
                    res => {
                        if (res.code === 200) {
                            if (res.data.list.length === 0) {
                                this.snack("没有次级数据",'info');
                            } else {
                                this.father = id;
                                this.desserts = res.data.list;
                                this.searchForm.total = res.data.page.pages;
                            }
                            this.loading = false;
                        } else {
                            console.log(res.data);

                        }

                    }
                )
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
                delComp(this.editedItem.id).then(
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
                    putComp(this.editedItem).then(
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
                    addComp(this.editedItem).then(
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
            getDictKeyName(keyValue, typeValue) {
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
