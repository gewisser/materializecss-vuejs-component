//
Created by Roman on 05.09.2017.
matcss_select.vue

<template lang="pug">
    .input-field
        select
            option(
            v-for="item in items_c",
            :value="item.id",
            :disabled="item.disabled == undefined? false: item.disabled",
            :selected="item.id == selectedId"
            ) {{ item.text }}
        label {{ name }}

</template>

<script>
    export default {
        name: 'matcss_select',
        props: ['items', 'name', 'selectedId'],
        data () {
            return {
                isInit: false,
                changeItems: false,
                selectDOM: undefined
            }
        },
        computed: {
            items_c(){
                const pre_item = [
                    {id: -1, text: 'Выберите значение из списка', disabled: true}
                ];

                return pre_item.concat(this.items);
            }
        },

        watch: {
            items(){
                this.changeItems = true;

                if (this.isInit) {
                    this.selectDOM.material_select('destroy');
                }
            }
        },
        updated: function () {
            this.$nextTick(function () {
                if (this.changeItems) {

                    this.changeItems = false;
                    this.selectDOM.material_select();

                    const _this = this;

                    this.selectDOM.prev().children().click(function () {
                        const inx = $(this).index();
                        _this.$emit('update:selectedId', _this.items_c[inx].id);
                        _this.$emit('onSelect', _this.items_c[inx]);
                    });

                    this.isInit = true
                }
            })
        },
        mounted(){
            this.selectDOM = $(this.$el).find('select');
        }
    }
</script>

<style>
</style>