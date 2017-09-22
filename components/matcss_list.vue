//
Created by Roman on 16.08.2017.
matcss_list.vue

<template lang="pug">
    div(v-callout="true")
        ul.dropdown-content(:id="id")
            li(v-for="item in items", :class="item.text == '-'?'divider': ''", @click="OnClick(item)")
                a(:class="item._class == undefined ? aclass: item._class") {{ item.text }}
</template>

<script>
    export default {
        name: 'matcss_list',
        props: ['items', 'id', 'selectedId', 'aclass'],
        data(){
            return {
                last_item_click: -100
            }
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

                if (obj !== undefined)
                    this.OnClick(obj)
            }
        },
        methods: {
            OnClick(item) {
                if (this.last_item_click !== item.id) {
                    this.last_item_click = item.id;
                    this.$emit('onSelect', item)
                }
            }
        }
    }
</script>