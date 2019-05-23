//
Created by Roman on 16.08.2017.
matcss_list.vue

<template lang="pug">
    div(v-callout="true")
        ul.dropdown-content(:id="id")
            li(v-for="item in items", :class="c_class_item(item)", @click="OnClick(item, true)")
                slot(:item="item")
                    a.tooltipped(
                        v-if="tooltipped",
                        :class="item[ratio._class] == undefined ? aclass: item[ratio._class]",
                        data-delay="200",
                        :data-tooltip="item[ratio.text]",
                        data-position="right"
                    ) {{ item[ratio.text] }}
                    a(v-else, :class="item[ratio._class] == undefined ? aclass: item[ratio._class]") {{ item[ratio.text] }}
</template>

<script>
    export default {
        name: 'matcss_list',
        props: ['items', 'id', 'selectedId', 'aclass', 'ratioProp', 'tooltipped'],
        data(){
            return {
                last_item_click: 0,
                ratio: this.c_ratioProp()
            }
        },
        created(){
            var obj = undefined;

            this.items.forEach(function(currentValue) {
                if (this.selectedId == currentValue.id) {
                    obj = currentValue;
                    return false;
                }
            }, this);


            this.OnClick(obj, false);
        },
        watch:{
            selectedId(val){
                var obj = undefined;

                this.items.forEach(function callback(currentValue, index, array) {
                    if (currentValue.id == val) {
                        obj = currentValue;
                        return;
                    }
                });

                if (!obj){
                    if (this.last_item_click != val) {
                        this.last_item_click = val
                    } else return;
                }


                this.OnClick(obj, false)
            },
        },
        updated() {
            this.$nextTick(function () {
                if (this.tooltipped)
                    $('#'+this.id).find('.tooltipped').tooltip();
            })
        },
        methods: {
            c_class_item(item){
                return {
                    divider: item[this.ratio.text] == '-',
                    active: this.selectedId == item.id
                }
            },

            c_ratioProp(){
                let ratioObj = {};

                if (this.ratioProp !== undefined)
                    if (typeof this.ratioProp === 'object')
                        ratioObj = this.ratioProp;
                    else
                        ratioObj = new Function('', 'return '+this.ratioProp)();

                return $.extend({ text: 'text', _class: '_class' }, ratioObj);
            },
            OnClick(item, is_mouse) {
                this.$emit('onClick', item, is_mouse);

                if (item) {
                    if (this.last_item_click != item.id)
                        this.last_item_click = item.id;
                    else return;
                }

                this.$emit('onSelect', item, is_mouse)
            }
        }
    }
</script>