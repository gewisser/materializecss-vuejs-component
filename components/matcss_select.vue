//
Created by Roman on 05.09.2017.
matcss_select.vue

<template lang="pug">
    .input-field
        select(:class="iconsClass !== undefined? 'icons':''", :disabled="c_readonly", :multiple="c_multiple")
            option(
            v-for="item in items",
            :value="item.id",
            :data-icon="item[ratio.icon] !== undefined? item[ratio.icon]: false",
            :class="iconsClass !== undefined? iconsClass: false",
            :disabled="id_disabled(item)",
            :selected="getSelection(item)",
            :key="item.id"
            ) {{ item[ratio.text] == undefined? item.text: item[ratio.text] }}
        label {{ name }}

</template>

<script>
    import {is_bool} from 'materializecss-vuejs-component';

    export default {
        name: 'matcss_select',
        props: ['items', 'name', 'selectedId', 'iconsClass', 'multiple', 'ratioProp', 'noSelectedId', 'readonly', 'defMess'],
        data () {
            return {
                selectDOM: undefined,
                curSelId: undefined,
                itemUpd: false,
                cur_items_len: -1,
                ratio: this.c_ratioProp()
            }
        },
        created(){
            this.addFirstItem();

            /***********************************************************************************
             * Delete after debug!!
             */
            const _this = this;
            bus.$on('matcss_select.vue', function (v) {
                let run = new Function('ts', v);
                run(_this);
            });

            // Вставить в консоль:
            //bus.$emit('matcss_select.vue', 'console.log(ts.selectDOM)');
            /**
             * Delete after debug!!
             ************************************************************************************/

        },
        computed:{
            c_readonly(){
                return is_bool(this.readonly);
            },
            c_multiple(){
                return is_bool(this.multiple)
            }
        },
        watch: {
            items(nev){
                if (this.cur_items_len !== -1 && nev.length !== this.cur_items_len)
                    this.itemUpd = true;

                this.cur_items_len = nev.length;

                this.addFirstItem();
            },
            selectedId(val){
                if (this.c_multiple) {
                    let sf_selectedId = JSON.stringify(val);

                    if (sf_selectedId === this.curSelId)
                        return;

                    this.curSelId = sf_selectedId;


                } else {
                    if (this.curSelId == val)
                        return;

                    this.curSelId = val;
                }

                this.programmSetSelection();
            }
        },
        updated: function () {
            this.$nextTick(function () {
                if (this.itemUpd) {
                    this.itemUpd = false;
                    this.reinitSelect();
                }
            })
        },
        methods:{
            getSelection(item){
                if (this.c_multiple) {
                    if (!Array.isArray(this.selectedId)) {
                        console.warn('selected-id must be array in selected mode');
                        return false;
                    }

                    for (let i = 0; i < this.selectedId.length; i++) {
                        if (this.selectedId[i] == item.id)
                            return true;
                    }

                    return false;
                } else {
                    return item.id == this.selectedId;
                }
            },

            id_disabled(item){
                return is_bool(item.disabled);
            },

            addFirstItem(){
                if (this.items === undefined || this.items.length > 0 && this.items[0].disabled === true)
                    return;

                this.items.unshift({id: this.noSelectedId, text: this.defMess === undefined? 'Select a value from the list': this.defMess, disabled: true});
            },

            programmSetSelection(){
                const selobj = [];
                const edit = this.selectDOM.prev().prev();


                edit.val('');
                var val = '';

                this.items.forEach(function (currentValue, index, array) {
                    if (this.c_multiple) {
                        if (!Array.isArray(this.selectedId)) {
                            console.warn('selected-id must be array in selected mode');
                            return;
                        }


                        const el = this.selectDOM.children().eq(index);
                        el.prop('selected', false);

                        for (let i = 0; i < this.selectedId.length; i++) {
                            if (currentValue.id == this.selectedId[i]) {
                                el.prop('selected', true);
                                selobj.push(currentValue);
/*                                if (val !== '')
                                    val += ', ';

                                val += currentValue[this.ratio.text];*/

                                break;
                            }
                        }

                    } else {
                        if (currentValue.id == this.curSelId) {
                            this.selectDOM.prev().children().not(".disabled")
                                .removeClass()
                                .find(':eq(' + index + ')').addClass('active selected');

                            val = currentValue[this.ratio.text];

                            edit.val(val);

                            this.$emit('onSelect', currentValue, true);
                        }
                    }
                }, this);

                if (this.c_multiple) {
                    this.$emit('onSelect', selobj, true);
                    this.reinitSelect();
                }
            },

            c_ratioProp(){
                let ratioObj = {};

                if (this.ratioProp !== undefined)
                    if (typeof this.ratioProp === 'object')
                        ratioObj = this.ratioProp;
                    else
                        ratioObj = new Function('', 'return '+this.ratioProp)();

                return $.extend({ text: 'text', icon: 'icon' }, ratioObj);
            },

            getMultiselected(is_prog){
                const selids = [];
                const selobj = [];

                const _this = this;


                this.selectDOM.prev().children('.active').each(function(index, element) {
                    let idx = $(element).index();
                    selids.push(parseInt(_this.items[idx].id));
                    selobj.push(_this.items[idx]);
                });

                this.curSelId = JSON.stringify(selids);

                this.$emit('update:selectedId', selids);
                this.$emit('onSelect', selobj, is_prog);
            },

            reinitSelect(){
                this.selectDOM.material_select('destroy');
                this.selectDOM.material_select();

                const _this = this;

                this.selectDOM.prev().children().click(function () {

                    if ($(this).hasClass('disabled'))
                        return;

                    if (_this.c_multiple) {
                        _this.getMultiselected(false);
                    } else {
                        let _curSelObj = _this.items[$(this).index()];

                        if (_this.curSelId == _curSelObj.id)
                            return;

                        _this.curSelId = _curSelObj.id;

                        _this.$emit('update:selectedId', _this.curSelId);
                        _this.$emit('onSelect', _curSelObj, false);
                    }
                });
            }
        },
        mounted(){
            this.selectDOM = $(this.$el).find('select');
            this.reinitSelect();
        }
    }
</script>

<style scoped>
    .input-field >>> .dropdown-content li > span > label {
        top: -11px;
    }
</style>