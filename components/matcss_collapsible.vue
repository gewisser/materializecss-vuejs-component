//
Created by Roman on 12.09.2017.
matcss_collapsible.vue

<template lang="pug">
    ul
        li(v-for="item in items", :id="item.id")
            .collapsible-header(@click="OnClick(item, $event)")
                table
                    tr
                        td
                            a(target='_blank')
                                img#icon-id.circle(alt='', :src="item[ratio.photo]")
                        td#title-id(v-html="item[ratio.title]")
            .collapsible-body(@click="OnClick(item, $event)")
                slot(name="body", :item="item")

</template>

<script>
    export default {
        props: ['items', 'ratioProp'],
        name: 'matcss_collapsible',
        data(){
            return {
                ratio: this.c_ratioProp()
            }
        },
        watch:{
            items(val){
                const collapsbl = $(this.$el);

                collapsbl.children().each(function( index, element ) {
                    collapsbl.collapsible('close', index)
                })
            }
        },
        methods:{
            c_ratioProp(){
                let ratioObj = {};

                if (this.ratioProp !== undefined)
                    if (typeof this.ratioProp === 'object')
                        ratioObj = this.ratioProp;
                    else
                        ratioObj = new Function('', 'return '+this.ratioProp)();

                return $.extend({ title: 'title', photo: 'photo'}, ratioObj);
            },

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
            $(this.$el).collapsible({
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