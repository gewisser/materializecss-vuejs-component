//
Created by Roman on 05.09.2017.
matcss_collections.vue

<template lang="pug">
    ul.collection
        li.collection-item.avatar(v-for="item in items", @dblclick="itemdblClick(item)", :class="item.class == undefined? '' : item.class")
            img.circle(:src="item.photo !== undefined? item.photo: '/avatar_2x.png'", alt='')
            span.title {{ item.title }}
            p.line1 {{ item.line1 }}
            span.line2 {{ item.line2 }}
            .secondary-content(:id="item.id", @click="OnClick(item, $event)", :style="c_scStyle")
                slot(name="item", :item="item")

</template>

<script>
    import './../images/avatar_2x.png';

    export default {
        props: ['items', 'scStyle'],
        name: 'matcss_collections',
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
            OnClick(item, event) {
                this.$emit('onClick', item, event)
            },
            itemdblClick(item){
                this.$emit('onItemDblClick', item)
            }
        }
    }
</script>