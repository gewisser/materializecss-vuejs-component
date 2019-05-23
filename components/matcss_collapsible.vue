//
Created by Roman on 12.09.2017.
matcss_collapsible.vue

<template lang="pug">
    div
        .center-align.nodata.grey-text.text-lighten-1(v-if="items.length == 0")
            slot(name="clear")
                span {{ $t('this_list_is_empty')}}
        ul(:class="cclass !== undefined? cclass: ''", :data-collapsible="dataCollapsible")
            li(v-for="(item, index) in items", :id="item.id", :key="item.id")
                .collapsible-header(@click="OnClick(item, $event)", :class="c_class(item)")
                    slot(name="header", :item="item")
                .collapsible-body(@click="OnClick(item, $event)")
                    slot(name="body", :item="item" :index="index")

</template>

<script>
    export default {
        collapsbl: undefined,
        props: ['items', 'cclass', 'dataCollapsible', 'activeId'],
        name: 'matcss_collapsible',
        watch: {
            activeId(val) {
                this.setActiveByItemId(val)
            }
        },
        methods:{
            setActiveByItemId(id){
                for (let i = 0; i < this.items.length; i++)
                    if (this.items[i].id == id) {
                        this.items[i].active = true;
                        this.$options.collapsbl.collapsible('open', i);
                        return;
                    }
            },

            c_class(item) {
                return (this.activeId == item.id ? 'active ' : '') + (item.ch_class != undefined ? item.ch_class : '')
            },
            /*c_color(item) {
                return item.color || '';
            },
            c_active(item){
                if (this.activeId == undefined)
                    return false;

                return item.id == this.activeId;
            },*/

            OnClick(item, event) {
                this.$emit('onClick', item, event)
            },
            findItem(id){
                if (id == undefined)
                    return;

                var ret = undefined;

                this.items.forEach(function callback(currentValue, index) {
                    if (index == id) {
                        ret = currentValue;
                        return false;
                    }
                });

                return ret;
            }
        },
        mounted(){
            //console.log('с - init'); ??

            this.$options.collapsbl = $(this.$el).children('ul');

            this.$options.collapsbl.collapsible({
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

<style scoped>
    @media only screen and (max-width: 800px) {
        ul li {
            margin: 0 !important;
        }
        ul li .collapsible-body {
            padding: 10px;
        }
    }
    .collapsible-header {
        transition: background .15s;
    }
</style>