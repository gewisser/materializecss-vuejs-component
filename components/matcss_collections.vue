//
Created by Roman on 05.09.2017.
matcss_collections.vue

<template lang="pug">
    div
        .center-align.nodata.grey-text.text-lighten-1(v-if="items.length == 0")
            slot(name="clear")
                span {{ $t('this_list_is_empty') }}
        ul.collection(v-if="items.length > 0", @contextmenu="cm($event)", style="border: none !important;")
            li.collection-item(v-for="(item, index) in items", @dblclick="itemdblClick(item, $event)", @click="OnLiClick(item, $event)", :class="li_class(item)", :key="item.id || index", style="margin-bottom: 2px; border: 1px solid #e0e0e0;")
                slot(name="item", :item="item")
                    i.circle.material-icons(v-if="c_avatarMode && c_materialIcons") {{ item[ratio.photo] !== undefined? item[ratio.photo]: 'account_circle' }}
                    img.circle(v-if="c_avatarMode && !c_materialIcons", :src="item[ratio.photo] !== undefined? item[ratio.photo]: '/avatar_2x.png'", alt='')
                    slot(name="title", :item="item")
                        p.title.truncate(:class="{single: !c_avatarMode}", style="min-height: 22px;") {{ item[ratio.title] }}
                        // возможно, не лучшее решение

                    //br(v-if="item[ratio.line1] != undefined && item[ratio.line1] != '' && !c_avatarMode")
                    span.line1.line(v-if="item[ratio.line1] != undefined && item[ratio.line1] != '' && !c_avatarMode" ) {{ item[ratio.line1] }}
                    br(v-if="item[ratio.line2] != undefined && item[ratio.line2] != '' && !c_avatarMode")
                    span.line2.line(v-if="item[ratio.line2] != undefined && item[ratio.line2] != '' && !c_avatarMode" ) {{ item[ratio.line2] }}

                    p.line1.line(v-if="item[ratio.line1] != undefined && item[ratio.line1] != '' && c_avatarMode") {{ item[ratio.line1] }}
                    p.line2.line(v-if="item[ratio.line2] != undefined && item[ratio.line2] != '' && c_avatarMode") {{ item[ratio.line2] }}
                .secondary-content(:id="item.id", @click="OnClick(item, $event)", :style="c_scStyle")
                    slot(name="secondary", :item="item")

</template>

<script>
    import {is_bool} from 'materializecss-vuejs-component';
    import './../images/avatar_2x.png';

    export default {
        props: ['items', 'scStyle', 'ratioProp', 'avatarMode', 'selectedMode', 'multiselect', 'selectedId', 'materialIcons'],
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
            c_materialIcons(){
                return is_bool(this.materialIcons);
            },
            c_avatarMode(){
                return is_bool(this.avatarMode);
            },
            c_selectedMode(){
                return is_bool(this.selectedMode);
            },
            c_multiselect(){
                return is_bool(this.multiselect);
            }
        },
        methods:{
            is_touch_device() {
                return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
            },
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
            OnLiClick(item, event) {
                if (this.is_touch_device()) {
                    this.itemdblClick(item, event);
                    return;
                }
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

                    this.$emit('update:selectedId', []);
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
<style>
    .collection .collection-item .title {
        padding-bottom: 8px;
        width: 80%;
    }

    .collection .collection-item .line {
        font-size: 0.95em;
    }

    .collection .collection-item .single {
        padding-bottom: 0 !important;
        margin: 6px 0;
    }

</style>