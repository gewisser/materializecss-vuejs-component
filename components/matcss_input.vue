//
Created by Roman on 18.08.2017.
matcss_input.vue

<template lang="pug">
    .input-field(:class="ifclass")
        i.material-icons.prefix(v-if="iconPrefix", data-position="bottom", :data-tooltip="tooltip", :class="{tooltipped: tooltip}") {{ iconPrefix }}

        input.truncate(
            :style="{'border-bottom': valid ? ' 2px solid #4CAF50' : required ? '2px solid #F44336' : ''}",
            v-if="!showTextarea",
            :id="GUIDID",
            :value="val",
            @change="onChange",
            :type="type==undefined?'text': type",
            :class="c_inputClass",
            :disabled="c_disabled",
            :readonly="c_readonly",
            :placeholder="placeholder",
            :autocomplete="autocomplete === undefined? false: autocomplete",
            @focus="onFocus",
            @blur="onBlur"
        )

        textarea.materialize-textarea(
            :style="{'border-bottom': valid ? ' 2px solid #4CAF50' : required ? '2px solid #F44336' : ''}",
            v-if="showTextarea",
            :id="GUIDID",
            @change="onChange",
            :class="c_inputClass",
            :disabled="c_disabled",
            :readonly="c_readonly",
            :value="val",
            :placeholder="placeholder",
            @focus="onFocus",
            @blur="onBlur"
        )


        label.inner-icon.prepend-inner-icon(v-if="prependInnerIcon", :for="GUIDID", @click="onIconClick(prependInnerIcon)")
            i.material-icons {{ prependInnerIcon }}
        label.inner-icon.append-inner-icon(v-if="appendInnerIcon", :for="GUIDID", @click="onIconClick(appendInnerIcon)")
            i.material-icons {{ appendInnerIcon }}

        label(v-if="!borderStyle && name", :style="iconPrefix !== undefined? 'width: calc(100% - 3rem)': 'width: 100%'", :for='GUIDID', :class="{ active: textExist}", :data-error="dataError", :data-success="dataSuccess") {{ name }}
</template>

<script>
    import {is_bool, get_obj} from 'materializecss-vuejs-component';

    export default {
        input: undefined,
        props: [
            'setTextAreaFocus',
            'tooltip',
            'name',
            'val',
            'type',
            'disabled',
            'readonly',
            'validation',
            'isValid',
            'dataError',
            'dataSuccess',
            'iconPrefix',
            'addClass',
            'isTextarea',
            'placeholder',
            'numeric', // разрешает вводить исключительно цифры и некоторые арифметические знаки, приводит число к int
            // 'doc_number', // запрещает вводить точки и прочие арифметические знаки, не приводит число к int
            'is_currency', // не разрешает вводить ничего, кроме цифр и одной точки
            'autocomplete',
            'checkValidation',
            'positive',
            'borderStyle',
            'prependInnerIcon',
            'appendInnerIcon',
            'clearOnEnter',
            'autofocus',
            'autoSelect',
            'round',
            'valid',
            'required',
            'incrementalSearch'
        ],
        name: 'matcss_input',
        data () {
            return {
                GUIDID: undefined,
                inputClass: {
                    valid: false,
                    invalid: false
                },
                focused: false,
            }
        },
        computed: {
            ifclass() {
                return {
                    'mode-border': this.borderStyle,
                    'card': this.borderStyle,
                    'foc': this.focused && this.borderStyle,
                    'f-prepend': this.prependInnerIcon,
                    'f-append': this.appendInnerIcon
                }
            },

            textExist(){
                let ret = (this.val !== undefined && this.val !== null && this.val !== '') || (this.placeholder && this.placeholder !== '');
                if (this.$options.input)
                    ret = ret ||  this.$options.input.val() != '';

                return ret;
            },
            c_clear_shadows() {
                return {
                    clear_shadows: !!(!this.valid && this.required)
                }
            },
            c_inputClass(){
                return get_obj(get_obj(this.addClass, this.inputClass), this.c_clear_shadows);
            },
            c_disabled(){
                return is_bool(this.disabled);
            },
            c_readonly(){
                return is_bool(this.readonly);
            },
            showTextarea(){
                return is_bool(this.isTextarea);
            },
            is_numeric(){
                return is_bool(this.numeric);
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        watch:{
            setTextAreaFocus (){
                this.$options.input.focus();
                this.$emit('ressetFocus');
            },
            val() {
                if (this.validation != undefined) {
                    let run = new Function('val', 'return ' + this.validation);
                    let result = run(this.val) ? 1 : 0;

                    this.informValidation(result);
                    this.$emit('checkValidation:update', 1);
                }
            },
            isValid(val){
                this.informValidation(val);
            },
            checkValidation(val) { // принудительная валидация, инициализируемая родителем
                let run = new Function('val', 'return '+this.validation);
                let result = run(this.val)? 1:0;

                if (val == 0)
                    this.informValidation(result);
                this.$emit('checkValidation:update', 1);
            }
        },
        methods: {
            setFocus(){
                if (!this.$options.input || !this.autofocus)
                    return;
                this.$options.input.focus();
            },

            onFocus(){
                if (this.autoSelect || this.val && this.val == 0 && (this.numeric || this.is_currency) ) {

                    this.$options.input.select();
                }

                this.focused = true;
                this.$emit('focus')
            },

            onBlur(){
                this.focused = false;
                this.$emit('blur')
            },

            onIconClick(iconName){
                this.$emit('onIconClick', iconName);
            },

            onChange() {
                this.UpdateVal(this.$options.input.val());
            },

            UpdateVal(val){
                if (this.validation != undefined) {
                    let run = new Function('val', 'return '+this.validation);
                    let result = run(val)? 1:0;


                    this.informValidation(result);
                    this.$emit('update:isValid', result);
                }
                if (this.is_currency)
                    this.$emit('update:val', this.correctValue(val));
                else if (this.numeric && this.positive) {
                    this.$emit('update:val', Math.abs(val));
                } else
                    this.$emit('update:val', val);
            },
            correctValue(val) {
                if (val) {
                    let value = parseFloat(val);

                    if (value == '')
                        return 0;

                    if (this.round != undefined)
                        value = (Math.round(parseFloat(val) * (Math.pow(10, parseInt(this.round))))) / (Math.pow(10, parseInt(this.round)));

                    return this.positive ? Math.abs(value) : parseFloat(value);
                }
                else
                    return 0;
            },
            informValidation(val){
                switch (val) {
                    case -1:
                        this.inputClass.valid = false;
                        this.inputClass.invalid = false;

                        break;
                    case 0:
                        this.inputClass.valid = false;
                        this.inputClass.invalid = true;

                        break;
                    case 1:
                        this.inputClass.valid = true;
                        this.inputClass.invalid = false;

                        break;
                }
            }
        },
        mounted(){

            const _this = this;

            let el ='input';
            el = this.showTextarea? 'textarea': el;

            var timeout_id = undefined;

            this.$options.input = $(this.$el).find(el).keypress(function (e) {
                let ret = true;


                if (_this.is_numeric && !_this.is_currency)
                    if ((e.which == 32) || (e.which == 37) || (e.which == 38) || (e.which == 39) || (e.which == 40) || (e.which == 46) ||
                        (e.which ==  9) || (e.which ==  8) || (e.which == 35) || (e.which ==  36) || (e.which == 13)) ret = true;
                    else
                        ret = ((e.which > 47) && (e.which < 58));

                else if (_this.is_numeric && _this.is_currency)
                    ret = ((e.which == 46) || ((e.which > 47) && (e.which < 58))); // только точки и только цифры допускаются к вводу

                var val = $(this).val();

                if (_this.is_currency && _this.is_numeric && ret && (_this.round > 0 || _this.round == undefined) && e.which == 46) // запрет на ввод более чем одной точки, когда речь о числах
                    ret = !~val.indexOf('.');
                else if (_this.is_currency && _this.is_numeric && ret && _this.round == 0 && e.which == 46) // если знаков после точки нет - значит и точка не нужна
                    ret = false;

                if (e.which == 13 && val && !e.shiftKey) {

                    if (!(el == 'textarea'))
                        ret = false;

                    let new_val = val;

                    if (_this.clearOnEnter) {
                        ret = false;
                        $(this).val('');
                        new_val = '';
                    }


                    _this.UpdateVal(new_val);
                    _this.$emit('onEnter', val);
                }

                return ret;
            }).keyup(function (e) {
                var val = e.target.value;

                if (val === '')
                    _this.$emit('onEmpty');  // если будет очищен input от текста.

                if (!_this.incrementalSearch)
                    return;

                if (timeout_id !== undefined)
                    window.clearTimeout(timeout_id);

                timeout_id = window.setTimeout(function () {
                    _this.UpdateVal(val);
                }, 600)

            });

            this.setFocus();

            if (this.iconPrefix && this.tooltip)
                $(this.$el).find('.tooltipped').tooltip();
        }
    }
</script>
<style scoped lang="sass">
    .input-field > .material-icons.tooltipped
        cursor: pointer

    .mode-border
        &.f-prepend
            padding-left: 40px
        &.f-append
            padding-right: 40px
        input
            margin-bottom: 0
            border-bottom: 0 !important
            box-shadow: none !important
            width: 100%
        margin-left: 2px
        margin-right: 2px
        transition: .2s
        padding: 0 8px
        height: 3rem
        &.foc
            margin-left: 0
            margin-right: 0

    .inner-icon
        -webkit-transform: unset !important
        transform: unset !important
        top: 10px
        cursor: pointer !important
        pointer-events: unset !important

    .mode-border
        .prepend-inner-icon
            left: 10px !important
        .append-inner-icon
            right: 10px !important
            left: auto !important

    textarea:not(.browser-default)[readonly="readonly"]
        color: rgba(0,0,0,0.42) !important

    .input-field.black-text > input:disabled, .input-field.black-text textarea:not(.browser-default)[readonly="readonly"]
        color: black !important

    .input-field input[type=text].clear_shadows:not(.browser-default):focus:not([readonly]), .input-field textarea.clear_shadows:not(.browser-default):focus:not([readonly])
        box-shadow: none
        -webkit-box-shadow: none


    .lite_input
        margin-top: -2px !important
        width: 75px
        input
            margin-bottom: 0 !important
            margin: 0 !important
            height: 21px !important
            text-align: center

</style>
