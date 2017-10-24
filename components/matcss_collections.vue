//
Created by Roman on 05.09.2017.
matcss_collections.vue

<template lang="pug">
    ul.collection
        li.collection-item.avatar(v-for="item in items", @dblclick="itemdblClick(item)", :class="item[ratio.class] == undefined? '' : item[ratio.class]")
            img.circle(:src="item[ratio.photo] !== undefined? item[ratio.photo]: '/avatar_2x.png'", alt='')
            span.title {{ item[ratio.title] }}
            p.line1 {{ item[ratio.line1] }}
            span.line2 {{ item[ratio.line2] }}
            .secondary-content(:id="item.id", @click="OnClick(item, $event)", :style="c_scStyle")
                slot(name="secondary", :item="item")

</template>

<script>
    import './../images/avatar_2x.png';

    export default {
        props: ['items', 'scStyle', 'ratioProp'],
        name: 'matcss_collections',
        data(){
            return {
                ratio: this.c_ratioProp()
            }
        },
        computed:{
            c_scStyle(){
                let style;

                if (typeof this.scStyle === 'object')
                    style = this.scStyle;
                else
                    style = new Function('', 'return '+this.scStyle)();

                return style;
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

                return $.extend({ title: 'title', line1: 'line1', line2: 'line2' }, ratioObj);
            },
            OnClick(item, event) {
                this.$emit('onClick', item, event)
            },
            itemdblClick(item){
                this.$emit('onItemDblClick', item)
            }
        }
    }
</script>