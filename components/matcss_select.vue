//
Created by Roman on 05.09.2017.
matcss_select.vue

<template lang="pug">
    .input-field
        select(:class="iconsClass !== undefined? 'icons':''", :disabled="c_readonly", :multiple="c_multiple")
            optgroup(v-if="c_optgroup", v-for="item_group in items", :label="item_group[ratio.group_caption]")
                option(
                    v-for="item in item_group.items",
                    :value="item.id",
                    :data-icon="item[ratio.icon] !== undefined? item[ratio.icon]: false",
                    :class="iconsClass !== undefined? iconsClass: false",
                    :disabled="id_disabled(item)",
                    :selected="getSelection(item)",
                    :key="item.id"
                ) {{ item[ratio.text] == undefined? item.text: item[ratio.text] }}

            option(
                v-if="!c_optgroup",
                v-for="item in items",
                :value="item.id",
                :data-icon="item[ratio.icon] !== undefined? item[ratio.icon]: false",
                :class="iconsClass !== undefined? iconsClass: false",
                :disabled="id_disabled(item)",
                :selected="getSelection(item)",
                :key="item.id"
            ) {{ item[ratio.text] == undefined? item.text: item[ratio.text] }}
        label(style="font-size: 13px;", :class="c_selectClass") {{ name }}
</template>

<script>
    import {is_bool, get_obj} from 'materializecss-vuejs-component';

    export default {
        selectDOM: undefined,
        name: 'matcss_select',
        props: [
            'items',
            'validation',
            'checkValidation',
            'name',
            'selectedId',
            'iconsClass',
            'multiple',
            'ratioProp',
            'noSelectedId',
            'readonly',
            'defMess',
            'optgroup',
            'inputClass',
            'valid',
            'required'
        ],
        data () {
            return {
                input_el: undefined,

                curSelId: this.noSelectedId,
                cur_items_len: -1,
                ratio: this.c_ratioProp(),
                c_multiple: is_bool(this.multiple),
                c_optgroup: is_bool(this.optgroup),
                
                selectClass: {
                    valid: false,
                    invalid: false
                },
            }
        },
        created(){
            //this.addFirstItem();
        },
        computed:{
            c_validation() {
                return this.valid + this.required + this.selectedId;
            },
            c_readonly(){
                return is_bool(this.readonly);
            },
            c_selectClass() {
                return get_obj(this.addClass, this.selectClass);
            }
        },
        watch: {
            c_validation() {
                this.validateSelect();
            }, // для c_validation
            selectedId(val){
                if (this.c_multiple) {
                    let sf_selectedId = JSON.stringify(val);

                    if (sf_selectedId === this.curSelId)
                        return;

                    this.curSelId = sf_selectedId;
                } else {
                    let run = new Function('val', 'return '+this.validation);

                    this.curSelId = val;

                    let result = (run(val)) ? 1:0;
                    if (run(val))
                        this.informValidation(result)
                }

                this.programmSetSelection();
            },
            readonly(val) {
                this.$options.selectDOM.prev().prev().prop( "disabled", is_bool(val));
            },
            checkValidation(val) { // принудительная валидация, инициализируемая родителем
                let run = new Function('val', 'return '+this.validation);
                let result = !run(val) ? 1:0;
                if (val == 0 && !run(this.curSelId))
                    this.informValidation(result);
                this.$emit('checkValidation:update', 1);
            }
        },
        updated: function () {
            this.$nextTick(function () {
                this.reinitSelect();  // вызывает закрытие селекта при мультивыборе
                // К сожалению в других местах неработает пост обновление данных. Раскоментировано. Не коментировать!

            })
        },
        methods:{
            validateSelect() {
                let input_el = this.input_el = $(this.$el).find('.select-wrapper input.select-dropdown');
                if (this.valid) {
                    $(input_el).addClass('valid_brd');
                    if (this.required)
                        $(input_el).removeClass('invalid_brd')
                } else {
                    $(input_el).removeClass('valid_brd');
                    if (this.required)
                        $(input_el).addClass('invalid_brd')
                }
            },
            informValidation(val){
                switch (val) {
                    case -1:
                        this.selectClass.valid = false;
                        this.selectClass.invalid = false;

                        break;
                    case 0:
                        this.selectClass.valid = false;
                        this.selectClass.invalid = true;

                        break;
                    case 1:
                        this.selectClass.valid = true;
                        this.selectClass.invalid = false;

                        break;
                }
            },

            setNoSelected(){
                const edit = this.$options.selectDOM.prev().prev();
                edit.css("color", "#9e9e9e");
                edit.val(this.defMess === undefined? `${this.$t('select_a_value_from_the_list')}`: this.defMess);
            },

            getLineObj(idx){
                var counter = 0;
                for (var i = 0; i < this.items.length; i++) {
                    for (let y = 0; y < this.items[i].items.length; y++) {
                        counter++;
                        if (counter == idx)
                            return this.items[i].items[y]
                    }
                    counter++;
                }
            },

            getSelection(item) {
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

/*            addFirstItem(){
                if (this.items === undefined || this.items.length > 0 && this.items[0].disabled === true)
                    return;

                this.items.unshift({id: this.noSelectedId, text: this.defMess === undefined? 'Select a value from the list': this.defMess, disabled: true});
            },*/

            programmSetSelection(){
                const selobj = [];
                const edit = this.$options.selectDOM.prev().prev();

                edit.val('');
                var val = '';

                if (this.c_multiple && this.selectedId.length == 0) {
                    this.setNoSelected();
                } else if (this.selectedId == this.noSelectedId) {
                    this.setNoSelected();
                }

                if (this.c_multiple) {
                    if (!Array.isArray(this.selectedId)) {
                        console.warn('selected-id must be array in selected mode');
                        return;
                    }

                    this.items.forEach(function (currentValue, index, array) {
                        const el = this.$options.selectDOM.children().eq(index);
                        el.prop('selected', false);

                        for (let i = 0; i < this.selectedId.length; i++) {
                            if (currentValue.id == this.selectedId[i]) {
                                el.prop('selected', true);
                                selobj.push(currentValue);

                                break;
                            }
                        }


                    }, this);
                } else if (this.c_optgroup) {

                    var counter = 0;
                    for (var i = 0; i < this.items.length; i++) {
                        for (let y = 0; y < this.items[i].items.length; y++) {
                            counter++;

                            if (this.items[i].items[y].id == this.curSelId) {

                                val = this.items[i].items[y][this.ratio.text];
                                edit.val(val);
                                edit.css("color", "");
                                this.$emit('onSelect', this.items[i].items[y], true);
                                break;
                            }
                        }
                        counter++;
                    }

                } else {
                    this.items.forEach(function (currentValue, index, array) {
                        if (currentValue.id == this.curSelId) {

                            this.$options.selectDOM.prev().children().not(".disabled")
                                .removeClass()
                                .find(':eq(' + index + ')').addClass('active selected');

                            val = currentValue[this.ratio.text];

                            edit.val(val);
                            edit.css("color", "");
                            this.$emit('onSelect', currentValue, true);
                        }
                    }, this);
                }


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

                return $.extend({ text: 'text', icon: 'icon', group_caption: 'caption'}, ratioObj);
            },

            getMultiselected(is_prog){
                const selids = [];
                const selobj = [];

                const _this = this;


                this.$options.selectDOM.prev().children('.active').each(function(index, element) {
                    let idx = $(element).index();
                    selids.push(parseInt(_this.items[idx].id));
                    selobj.push(_this.items[idx]);
                });

                if (selids.length > 0)
                    this.$options.selectDOM.prev().prev().css("color", "");
                else
                    this.setNoSelected();

                this.curSelId = JSON.stringify(selids);

                this.$emit('update:selectedId', selids);
                this.$emit('onSelect', selobj, is_prog);
            },

            reinitSelect(){
                this.$options.selectDOM.material_select('destroy');
                this.$options.selectDOM.material_select();

                const _this = this;

                let edit = this.$options.selectDOM.prev().prev();

                if (this.inputClass)
                    edit.addClass(this.inputClass);

                if (this.c_multiple && this.selectedId.length == 0) {
                    this.setNoSelected();
                } else if (this.selectedId == this.noSelectedId) {
                    this.setNoSelected();
                }

                edit.prop( "disabled", this.c_readonly);

                this.$options.selectDOM.prev().children().click(function () {

                    if ($(this).hasClass('disabled'))
                        return;

                    if (_this.c_multiple) {
                        _this.getMultiselected(false);
                    } else if (_this.c_optgroup) {
                        if ($(this).hasClass('optgroup'))
                            return;

                        _this.$options.selectDOM.prev().prev().css("color", "");

                        let _curSelObj = _this.getLineObj($(this).index());

                        _this.curSelId = _curSelObj.id;

                        _this.$emit('update:selectedId', _this.curSelId);
                        _this.$emit('onSelect', _curSelObj, false);
                    } else {
                        let _curSelObj = _this.items[$(this).index()];

                        if (_this.curSelId == _curSelObj.id)
                            return;

                        _this.curSelId = _curSelObj.id;



                        _this.$options.selectDOM.prev().prev().css("color", "");


                        _this.$emit('update:selectedId', _this.curSelId);
                        _this.$emit('onSelect', _curSelObj, false);
                    }
                });

                this.validateSelect();
            }
        },
        mounted(){
            this.$options.selectDOM = $(this.$el).find('select');
            this.reinitSelect();
        }
    }
</script>

<style>
    .select-wrapper input.select-dropdown.valid_brd {
        border-bottom: 2px solid #4CAF50 !important;
    }
    .select-wrapper input.select-dropdown.invalid_brd {
        border-bottom: 2px solid red !important;
    }
</style>
<style scoped>
    .input-field >>> .dropdown-content li > span > label {
        top: -11px;
    }
    .invalid {
        color: red !important;
    }
    .valid {
        color: green !important;
    }
</style>