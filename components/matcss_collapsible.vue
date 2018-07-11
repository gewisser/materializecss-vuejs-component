//
Created by Roman on 12.09.2017.
matcss_collapsible.vue

<template lang="pug">
    div
        .center-align.nodata.grey-text.text-lighten-1(v-if="items.length == 0")
            slot(name="clear")
                span This list is empty :(
        ul(:class="cclass !== undefined? cclass: ''")
            li(v-for="(item, index) in items", :id="item.id")
                .collapsible-header(@click="OnClick(item, $event)")
                    slot(name="header", :item="item")
                .collapsible-body(@click="OnClick(item, $event)")
                        slot(name="body", :item="item" :index="index")

</template>

<script>
    export default {
        props: ['items', 'cclass'],
        name: 'matcss_collapsible',
        methods:{
            OnClick(item, event) {
                this.$emit('onClick', item, event)
            },
            findItem(id){
                if (id == undefined)
                    return;

                var ret = undefined;

                this.items.forEach(function callback(currentValue, index, array) {
                    if (index == id) {
                        ret = currentValue;
                        return false;
                    }
                });

                return ret;
            }
        },
        mounted(){
            this.collapsbl = $(this.$el).children('ul');

            this.collapsbl.collapsible({
                    onOpen: el => {
                        this.$emit('onOpen', this.findItem(el.index()))
                    },
                    onClose: el => {
                        this.$emit('onClose', this.findItem(el.index()))
                    }
                }
            );
        }

    }
</script>