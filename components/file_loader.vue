//
Created by Roman on 09.08.2017.
file_loader.vue

<template lang="pug">
    .modal.bottom-sheet
        .modal-content
            h4 Файловый менеджер
            form
                table.striped.highlight.bordered
                    thead
                        tr
                            th(style='width: 50px')
                                m-checkbox(name="|", :checked.sync="allChecked")
                            th Название
                            th Дата загрузки
                            th Автор
                            th Размер
                    tbody
                        tr(v-for="item in items")
                            td
                                m-checkbox(name="|", :checked="allChecked", @update:checked="value => {onItemChecked(item, value)}", :key="item.id")
                            td(:class='{selected_item_list: item.checked}') {{ item.cell.name }}
                            td(:class='{selected_item_list: item.checked}') {{ item.cell.date_load }}
                            td(:class='{selected_item_list: item.checked}') {{ item.cell.user_name }}
                            td(:class='{selected_item_list: item.checked}') {{ item.cell.size }}
                    tfoot
        div(style='height: 77px')
        .modal-footer_custom
            .row
                form#s_files(enctype='multipart/form-data', method='post')
                    .file-field.input-field.col.s6
                        .btn
                            .preloader-wrapper.small(style='margin-top: 5px;', v-if="ShowProgress", :class="{active: ShowProgress}")
                                .spinner-layer.spinner-blue-only(style='border-color: #FFFFFF')
                                    .circle-clipper.left
                                        .circle
                                    .gap-patch
                                        .circle
                                    .circle-clipper.right
                                        .circle
                            span(v-else) Файлы
                            input#file_selector(type='file', name='mFiles[]', multiple='')
                        .file-path-wrapper
                            input.file-path.validate(type='text', placeholder='Загрузите один или несколько файлов')
                .col.s6.right-align(style='padding-top: 19px')
                    a.waves-effect.waves-light.btn.red.lighten-2(style='height: 44px; padding-top: 5px; margin-right: 5px', @click="DeleteFile")
                        i.material-icons.left delete_forever
                        | Удалить
                    a.waves-effect.waves-light.btn(style='height: 44px; padding-top: 5px', @click="DownloadFiles")
                        i.material-icons.left file_download
                        | Скачать

</template>

<script>
    import {implodeObj} from './../js/utils.js';

    export default {
        name: 'file-container',
        props: ['init-dir-id'],
        data () {
            return {
                items: [],
                allChecked: false,
                ShowProgress: false,
                dir_id: this.initDirId

                //itemChecked: false
            }
        },
        methods: {
            getData(){
                const params = {
                    cmd: 'getFilesList',
                    dir_id: this.dir_id,
                    rows: 12,
                    page: 1,
                    sidx: 'date_load',
                    sord: 'desc'
                };

                this.$http.get('/', {params: params}).then(response => {
                   //console.log(response);

                    if (response.body != '')
                        this.items = response.body.rows;

                    //console.log(this.items);
                }, response => {
                    // error callback
                });
            },
            onItemChecked(item, val){
                this.$set(item, 'checked', val);
            },
            DeleteFile(){
                const parms = {
                    params: {
                        cmd: 'del_file'
                    }
                };

                const post = {
                    dir_id: this.dir_id,
                    files: implodeObj(this.items, 'id', 'checked', true)
                };


                this.$http.post('/', post, parms).then(response => {
                    this.getData();

                }, response => {

                });

            },
            DownloadFiles(){
                const parms = {
                    params: {
                        cmd: 'download'
                    }
                };

                const post = {
                    dir_id: this.dir_id,
                    files: implodeObj(this.items, 'id', 'checked', true)
                };


                this.$http.post('/', post, parms).then(response => {
                    this.getData();

                    if (response.body.ret)
                        window.location.href = '/?cmd=transfer&hash='+response.body.hash;
                }, response => {

                });

            }
        },
        created(){
            const _this = this;
            bus.$on(SHOW_FILE_BOX, function (dir) {
                _this.dir_id = dir === undefined? _this.$store.state.cur_company.dir_id: dir;
                _this.getData();
                $(_this.$el).modal('open');
            })
        },
        mounted(){
            const _this = this;

            this.getData();

            $(this.$el).find('#file_selector').change(function() {
                _this.ShowProgress = true;

                if ($(this)[0].files.length == 0)
                    return;

                const s_files = $(_this.$el).find('#s_files')[0];

                const parms = {
                    params: {
                        cmd: 'Upload',
                        dir_id: _this.dir_id
                    }
                };

                _this.$http.post('/', new FormData(s_files), parms).then(response => {
                    _this.ShowProgress = false;
                    _this.getData();

                    s_files.reset()
                }, response => {
                    _this.ShowProgress = false;
                    s_files.reset()
                });
            });



            $(this.$el).modal({
                complete: function(){
                    $(this).attr('style', '')
                }
            }).modal('open');
        }
    }
</script>