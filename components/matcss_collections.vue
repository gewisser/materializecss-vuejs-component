//
Created by Roman on 05.09.2017.
matcss_collections.vue

<template lang="pug">
    div
        .center-align.nodata.grey-text.text-lighten-1(v-if="items.length == 0")
            slot(name="clear")
                span Список пуст
        ul.collection(v-if="items.length > 0", @contextmenu="cm($event)")
            li.collection-item(v-for="item in items", @dblclick="itemdblClick(item, $event)", @click="OnLiClick(item, $event)", :class="li_class(item)")
                img.circle(v-if="c_avatarMode", :src="item[ratio.photo] !== undefined? item[ratio.photo]: '/avatar_2x.png'", alt='')
                span.title {{ item[ratio.title] }}
                br(v-if="item[ratio.line1] != undefined && item[ratio.line1] != '' && !c_avatarMode")
                span.line1(v-if="item[ratio.line1] != undefined && item[ratio.line1] != '' && !c_avatarMode" ) {{ item[ratio.line1] }}
                br(v-if="item[ratio.line2] != undefined && item[ratio.line2] != '' && !c_avatarMode")
                span.line2(v-if="item[ratio.line2] != undefined && item[ratio.line2] != '' && !c_avatarMode" ) {{ item[ratio.line2] }}
                p.line1(v-if="item[ratio.line1] != undefined && item[ratio.line1] != '' && c_avatarMode") {{ item[ratio.line1] }}
                p.line2(v-if="item[ratio.line2] != undefined && item[ratio.line2] != '' && c_avatarMode") {{ item[ratio.line2] }}
                .secondary-content(:id="item.id", @click="OnClick(item, $event)", :style="c_scStyle")
                    slot(name="secondary", :item="item")

</template>

<script>
    import './../images/avatar_2x.png';

    export default {
        props: ['items', 'scStyle', 'ratioProp', 'avatarMode', 'selectedMode', 'multiselect', 'selectedId'],
        name: 'matcss_collections',
        data(){
            return {
                ratio: this.c_ratioProp()
            }
        },
        watch: {
            selectedId(val){
                if (this.selfChange) {
                    this.selfChange = false;
                    return;
                }

                this.$emit('OnSelectedChange', true); // false - параметр сисгнализирующий произошло ли событие от нажатия, false - изменили массив selectedId программно
                this.findByIdAndSelect();
            }
        },
        created(){
            this.selfChange = false;
        },
        updated: function () {
            this.$nextTick(function () {
                if (!this.c_selectedMode || this.selectedId === undefined || this.selectedId.length == 0)
                    return;

                this.findByIdAndSelect();
            })
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
            c_multiselect(){
                return this.multiselect === undefined? false:
                    typeof this.multiselect === 'boolean'? this.multiselect:
                        this.multiselect == 'true'? true:
                            this.multiselect == 1? true:
                                false;
            }
        },
        methods:{
            JQcollection(){
                if (this._JQcollection == undefined) {
                    let JQcollection = $(this.$el).find('ul.collection');
                    if (JQcollection.length > 0) {
                        this._JQcollection = JQcollection;
                    }
                }

                return this._JQcollection;

            },
            findByIdAndSelect(){
                if (!this.JQcollection())
                    return;

                this.JQcollection().children().removeClass('active');

                for (let i = 0; i < this.items.length; i++) {
                    if (this.selectedId.indexOf(parseInt(this.items[i].id)) != -1)
                        this.JQcollection().children(':eq(' + i + ')').addClass('active');
                }
            },
            OnLiClick(item, event){
                this.$emit('onItemClick', item, event);

                if (!this.c_selectedMode)
                    return;

                let target = $(event.target);
                target = target.hasClass('collection-item')? target: target.closest('.collection-item');


                if (this.c_multiselect) {
                    target.toggleClass('active')
                } else {
                    this.JQcollection().children().removeClass('active');

                    target.addClass('active');
                }

                let selids = [];

                const _this = this;
                this.JQcollection().children('.active').each(function(index, element) {
                    selids.push(parseInt(_this.items[$(element).index()].id));
                });

                this.selfChange = true;
                this.$emit('update:selectedId', selids);
                this.$emit('OnSelectedChange', false); // false - параметр сисгнализирующий произошло ли событие от нажатия, false - изменили массив selectedId программно
            },
            cm(e){
                if (this.c_multiselect) {
                    this.selfChange = true;

                    this.JQcollection().children().removeClass('active');

                    this.$emit('update:selectedId', [-1]);
                    this.$emit('OnSelectedChange', false); // false - параметр сисгнализирующий произошло ли событие от нажатия, false - изменили массив selectedId программно

                    e.preventDefault();
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

                return $.extend({ title: 'title', line1: 'line1', line2: 'line2', photo: 'photo', class: 'class'}, ratioObj);
            },
            OnClick(item, event) {
                this.$emit('onClick', item, event)
            },
            itemdblClick(item, $event){
                this.$emit('onItemDblClick', item, $event)
            }
        }
    }
</script>