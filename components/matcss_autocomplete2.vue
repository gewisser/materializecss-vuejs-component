//
Created by Roman on 12.03.2019.
matcss_autocomplete2.vue

<template lang="pug">
    .input-field
        i.material-icons.prefix(@click="removeInputDataIfClearIcon()", v-if="iconPrefix") {{ iconPrefix }}
        input.truncate(
            :class="{clear_shadows: !valid && required}",
            type='text',
            :id="GUIDID",
            :disabled="c_disabled",
            :readonly="c_readonly",
            @change="onChange",
            @focus="onFocus",
            @blur="onBlur",
            :style="{'border-bottom': valid ? ' 2px solid #4CAF50' : required ? '2px solid #F44336' : '','padding-right': inputPaddingRight, 'padding-left': inputPaddingLeft, width: `calc(100% - ${inputPaddingRight} - ${inputPaddingLeft})` }"
        )
        label(:for='GUIDID', :style="{'padding-left': inputPaddingLeft}") {{ name }}

        slot(name="inner-icon", :context="thisCtx()")


        //.inner-icon
            i.material-icons cloud
        //.inner-icon
            i.material-icons cloud

        ul.autocomplete-content.dropdown-content(style="position: absolute !important;")
            li(v-for="(item, index) in items", :key="index", :class="{ active: index === activeIndex }", @mousedown="onSelect(item, false)", @touchstart="onSelect(item, true)")
                slot(:item="item")
                    img.right.circle(v-if="item[ratio.img]" :src="item[ratio.img]")
                    i.material-icons.right.circle.teal-text(v-if="item[ratio.icon]") {{ item[ratio.icon] }}
                    span {{ item[ratio.text] }}
</template>

<script>
    import {is_bool, get_obj} from 'materializecss-vuejs-component';

    export default {
        ddMenuInput: undefined,
        props: {
            name:               { type: String, default: 'Type text...' },
            value:              { type: Object, default: undefined }, // Array, Object: default должна возвращать функцию с объектом. ( default: () => {} )
            text:               { type: String, default: undefined },
            url:                { type: Object, default: undefined},
            iconPrefix:         { type: String, default: undefined },
            disabled:           { type: Boolean, default: false },
            readonly:           { type: Boolean, default: false },
            ratioProp:          { default: undefined },
            inputPaddingRight:  { type: String, default: '' },
            inputPaddingLeft:   { type: String, default: '' },
            valid:              { default: false },
            required:           { type: Boolean, default: false }
        },
        name: 'matcss_autocomplete2',
        data() {
            return {
                items: [],
                GUIDID: Materialize.guid(),
                ratio: get_obj(this.ratioProp, { text: 'text', _class: '_class', img: 'img', icon: 'icon' }),
                activeIndex: -1,
                sel_text: this.text,
                focused: false
            }
        },
        watch: {
            value: {
                handler(val){
                    this.initVal(val);
                },
                deep: true
            },
            text(val){
                if (this.$options.ddMenuInput)
                    this.$options.ddMenuInput.val(val);

                Materialize.updateTextFields();

                if (!val || val == '')
                    this.$emit('input', undefined);
            }
        },

        computed: {
            c_disabled(){
                return is_bool(this.disabled);
            },
            c_readonly(){
                return is_bool(this.readonly);
            },

        },
        methods: {
            clearInputField() {
                let elem = this.$el.querySelector('input');
                elem.focus();
                elem.value = null;
                elem.blur(); // фокус и блюр нужен для того, чтобы label не застывал в верхней точке
            },
            thisCtx() {
                return this; // передаем контекст экземпляра для props чтобы иметь возможность вызвать из родителя функцию выше
            },
            onFocus(){
                this.focused = true
            },
            onBlur(){
                this.focused = false;
                this.removeAutocomplete();
            },
            onChange(){
                let val = this.$options.ddMenuInput.val();
                this.$emit('update:text', val);

                if (val !== this.sel_text)
                    this.$emit('input', undefined);
            },

            is_touch_device() {
                return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
            },

            removeAutocomplete(){
                this.activeIndex = -1;
                this.items = [];
            },

            onSelect(item, is_event_touch) {
                if (this.is_touch_device() && is_event_touch) {
                    return;
                }

                let selectedItem = Object.assign({}, item);

                let text = selectedItem[this.ratio.text];

                this.sel_text = text;

                this.$options.ddMenuInput.val(text);
                this.$emit('update:text', text);
                this.$emit('input', selectedItem);

                this.removeAutocomplete();
            },

            initVal(val_obj){
                if (val_obj === undefined || val_obj === null || typeof val_obj !== 'object') {
                    this.$options.ddMenuInput.val(this.text);
                } else  {
                    this.$options.ddMenuInput.val(val_obj[this.ratio.text]);
                }

                Materialize.updateTextFields();
            },
        },
        mounted () {
            this.$nextTick(function () {
                this.$options.ddMenuInput = $(this.$el).find('#'+this.GUIDID);
                const _this = this;

                var timeout_id = undefined;

                this.$options.ddMenuInput.keyup(function(e) {
                    const jQ_this =  $(this);

                    let value = jQ_this.val();

                    if (value == '') {
                        _this.$emit('update:text', undefined);
                    }


                    if (_this.value != undefined) // Запретим поиск в базе, если уже выбран объект
                        return;

                    if (e.which === 13 ||
                        e.which === 38 ||
                        e.which === 37 ||
                        e.which === 39 ||
                        e.which === 40) {
                        return;
                    }

                    _this.removeAutocomplete();

                    if (e.which === 27)
                        return;

                    if (value.length < 3) // снижение нагрузки на базу данных. Ищем от 3 и более символов
                        return;

                    if (timeout_id !== undefined)
                        window.clearTimeout(timeout_id);

                    timeout_id = window.setTimeout(function () {
                        let value = jQ_this.val();

                        if (value === '')
                            return;

                        _this.url.params.s = value;

                        _this.url.before = function(request) {
                            // Прерывание предидущего запроса, если существует
                            if (this.previousRequest) {
                                this.previousRequest.abort();
                            }
                            // установка предидущего запроса в Vue instance
                            this.previousRequest = request;
                        };

                        _this.$http.get('/', _this.url).then(response => {
                            if (response.body === null || !response.body.ret)
                                return;

                            if (response.body.list.length > 0)
                                this.activeIndex = 0;

                            _this.items = response.body.list;
                        });
                    }, 600)
                });

                this.$options.ddMenuInput.keydown(function(e) {
                    let keyCode = e.which;

                    // select element on Enter
                    if (keyCode === 13 && _this.activeIndex >= 0) {
                        _this.onSelect(_this.items[_this.activeIndex], true);
                        return;
                    }

                    // Capture up and down key
                    if (keyCode === 38 || keyCode === 40) {
                        e.preventDefault();

                        if (keyCode === 38 && _this.activeIndex > 0) {
                            _this.activeIndex--;
                        }

                        if (keyCode === 40 && _this.activeIndex < _this.items.length - 1) {
                            _this.activeIndex++;
                        }
                    }
                });

                this.initVal(this.value);
            })
        }
    }
</script>
<style lang="sass">
    .autocomplete-content.dropdown-content>li>i
        padding: 12px

    .inner-icon
        -webkit-transform: unset !important
        transform: unset !important
        top: 10px
        cursor: pointer !important
        pointer-events: unset !important
        position: absolute !important

    .prepend-inner-icon
        left: 10px !important
    .append-inner-icon
        right: 10px !important
        left: auto !important

</style>
<style scoped lang="sass">
    .input-field input[type=text].clear_shadows:not(.browser-default):focus:not([readonly])
        box-shadow: none
        -webkit-box-shadow: none
</style>