//
Created by Roman on 05.09.2017.
matcss_select.vue

<template lang="pug">
    .input-field
        select(:class="iconsClass !== undefined? 'icons':''")
            option(
            v-for="item in items_c",
            :value="item.id",
            :data-icon="item[ratio.icon] !== undefined? item[ratio.icon]: ''",
            :class="iconsClass !== undefined? iconsClass:''",
            :disabled="id_disabled(item)",
            :selected="item.id == selectedId"
            ) {{ item[ratio.text] == undefined? item.text: item[ratio.text] }}
        label {{ name }}

</template>

<script>
    export default {
        name: 'matcss_select',
        props: ['items', 'name', 'selectedId', 'iconsClass', 'ratioProp'],
        data () {
            return {
                isInit: false,
                changeItems: false,
                selectDOM: undefined,
                items_c: [],
                curSelectIndex: 0,
                ratio: this.c_ratioProp()
            }
        },
        created(){
            this.initItems();
        },
        watch: {
            items(){
                this.changeItems = true;

                if (this.isInit) {
                    this.selectDOM.material_select('destroy');
                    this.initItems();
                }
            },
            selectedId(val){
                this.items_c.forEach(function (currentValue, index, array) {
                    if (currentValue.id == val && this.curSelectIndex != index) {
                        this.selectDOM.prev().children().not(".disabled")
                            .removeClass()
                            .find(':eq('+index+')').addClass('active selected');

                        this.selectDOM.prev().prev().val(currentValue.text);

                        this.curSelectIndex = index;

                        this.$emit('onSelect', currentValue, true);
                    }
                }, this);
            }
        },
        updated: function () {
            this.$nextTick(function () {
                this.reinitSelect();
            })
        },
        methods:{
            c_ratioProp(){
                let ratioObj = {};

                if (this.ratioProp !== undefined)
                    if (typeof this.ratioProp === 'object')
                        ratioObj = this.ratioProp;
                    else
                        ratioObj = new Function('', 'return '+this.ratioProp)();

                return $.extend({ text: 'text', icon: 'icon' }, ratioObj);
            },
            id_disabled(item){
                if (item.disabled == undefined)
                    return false;

                return typeof item.disabled === 'boolean'? item.disabled: item.disabled == 1? true: false
            },

            initItems(){
                if (this.items == undefined) {
                    this.items_c = [];
                    return;
                }

                const pre_item = [
                    {id: -1, text: 'Выберите значение из списка', disabled: true}
                ];

                this.items_c = pre_item.concat(this.items);
            },
            reinitSelect(){
                if (this.changeItems) {

                    this.changeItems = false;
                    this.selectDOM.material_select();

                    const _this = this;

                    this.selectDOM.prev().children().click(function () {
                        if ($(this).hasClass('disabled'))
                            return;

                        let idx = $(this).index();

                        if (_this.curSelectIndex == idx)
                            return;

                        _this.curSelectIndex = idx;

                        if (_this.curSelectIndex == 0)
                            return;

                        _this.$emit('update:selectedId', _this.items_c[_this.curSelectIndex].id);
                        _this.$emit('onSelect', _this.items_c[_this.curSelectIndex], false);
                    });

                    this.isInit = true
                }
            }
        },
        mounted(){
            this.selectDOM = $(this.$el).find('select');
            this.changeItems = true;
            this.reinitSelect();
        }
    }
</script>