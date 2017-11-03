//
Created by Roman on 05.09.2017.
matcss_collections.vue

<template lang="pug">
    ul.collection
        li.collection-item(v-for="item in items", @dblclick="itemdblClick(item)", @click="OnLiClick(item, $event)", :class="li_class(item)")
            img.circle(v-if="c_avatarMode", :src="item[ratio.photo] !== undefined? item[ratio.photo]: '/avatar_2x.png'", alt='')
            span.title {{ item[ratio.title] }}
            p.line1(v-if="item[ratio.line1] != undefined && item[ratio.line1] != ''") {{ item[ratio.line1] }}
            p.line2(v-if="item[ratio.line2] != undefined && item[ratio.line2] != ''") {{ item[ratio.line2] }}
            .secondary-content(:id="item.id", @click="OnClick(item, $event)", :style="c_scStyle")
                slot(name="secondary", :item="item")

</template>

<script>
    import './../images/avatar_2x.png';

    export default {
        props: ['items', 'scStyle', 'ratioProp', 'avatarMode', 'selectedMode', 'selectedId'],
        name: 'matcss_collections',
        data(){
            return {
                JQcollection: undefined,
                ratio: this.c_ratioProp(),
                l_selectedId: -100
            }
        },
        mounted(){
            this.JQcollection = $(this.$el);
        },
        watch: {
            selectedId(val){
                if (val == this.l_selectedId)
                    return;

                this.items.forEach(function (currentValue, index, array) {
                    if (currentValue.id == val) {
                        this.SetActive(currentValue, this.JQcollection.children(':eq('+index+')'));
                        this.$emit('update:selectedId', currentValue.id, true);
                        return false;
                    }
                }, this);
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
            },
            c_avatarMode(){
                return this.avatarMode === undefined? false:
                    typeof this.avatarMode === 'boolean'? this.avatarMode:
                        this.avatarMode == 'true'? true:
                            this.avatarMode == 1? true:
                                false;
            },
            c_selectedMode(){
                return this.selectedMode === undefined? false:
                    typeof this.selectedMode === 'boolean'? this.selectedMode:
                        this.selectedMode == 'true'? true:
                            this.selectedMode == 1? true:
                                false;
            },

        },
        methods:{
            OnLiClick(item, event){
                if (item.id == this.l_selectedId)
                    return;

                this.SetActive(item, $(event.target));
                this.$emit('update:selectedId', item.id, false);
            },
            SetActive(item, jqevent){
                if (this.c_selectedMode) {
                    this.JQcollection.children().removeClass('active');

                    if (jqevent.hasClass('collection-item'))
                        jqevent.addClass('active');
                    else
                        jqevent.closest('.collection-item').addClass('active');

                    this.l_selectedId = item.id;
                }
            },
            li_class(item){
                let cla = item[this.ratio.class] == undefined? '' : item[this.ratio.class];

                if (this.c_avatarMode)
                    cla+=' avatar';

                return cla;
            },
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