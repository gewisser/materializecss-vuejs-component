//
Created by Roman on 05.09.2017.
matcss_select.vue

<template lang="pug">
    .input-field
        select(:class="iconsClass !== undefined? 'icons':''")
            option(
            v-for="item in items_c",
            :value="item.id",
            :data-icon="item.icon !== undefined? item.icon: ''",
            :class="iconsClass !== undefined? iconsClass:''",
            :disabled="item.disabled == undefined? false: item.disabled",
            :selected="item.id == selectedId"
            ) {{ item.text }}
        label {{ name }}

</template>

<script>
    export default {
        name: 'matcss_select',
        props: ['items', 'name', 'selectedId', 'iconsClass'],
        data () {
            return {
                isInit: false,
                changeItems: false,
                selectDOM: undefined,
                items_c: []
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
                    if (currentValue.id == val) {
                        this.selectDOM.prev().children().not(".disabled")
                            .removeClass()
                            .find(':eq('+index+')').addClass('active selected');

                        this.selectDOM.prev().prev().val(currentValue.text);

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
            initItems(){
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
                        const inx = $(this).index();
                        _this.$emit('update:selectedId', _this.items_c[inx].id);
                        _this.$emit('onSelect', _this.items_c[inx], false);
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