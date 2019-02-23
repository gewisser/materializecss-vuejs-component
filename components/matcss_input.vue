//
Created by Roman on 18.08.2017.
matcss_input.vue

<template lang="pug">
    .input-field(:class="ifclass")
        i.material-icons.prefix(v-if="iconPrefix", data-position="bottom", :data-tooltip="tooltip", :class="{tooltipped: tooltip}") {{ iconPrefix }}

        input(
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
            @focus="focused = true",
            @blur="focused = false"
        )

        textarea.materialize-textarea(
            v-if="showTextarea",
            :id="GUIDID",
            @change="onChange",
            :class="c_inputClass",
            :disabled="c_disabled",
            :readonly="c_readonly",
            :value="val",
            :placeholder="placeholder"
        )


        label.inner-icon.prepend-inner-icon(v-if="prependInnerIcon", :for="GUIDID", @click="onIconClick(prependInnerIcon)")
            i.material-icons {{ prependInnerIcon }}
        label.inner-icon.append-inner-icon(v-if="appendInnerIcon", :for="GUIDID", @click="onIconClick(appendInnerIcon)")
            i.material-icons {{ appendInnerIcon }}

        label(v-if="!borderStyle", style="width: 100%;", :for='GUIDID', :class="{ active: textExist}", :data-error="dataError", :data-success="dataSuccess") {{ name }}
</template>

<script>
    import {is_bool, get_obj} from 'materializecss-vuejs-component';

    export default {
        input: undefined,
        props: [
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
            'numeric',
            'autocomplete',
            'checkValidation',
            'positive',
            'borderStyle',
            'prependInnerIcon',
            'appendInnerIcon',
            'clearOnEnter'
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
                    'foc': this.focused,
                    'f-prepend': this.prependInnerIcon,
                    'f-append': this.appendInnerIcon
                }
            },

            textExist(){
                return (this.val && this.val !== '') || (this.placeholder && this.placeholder !== '');
            },
            c_inputClass(){
                return get_obj(this.addClass, this.inputClass);
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
            onIconClick(iconName){
                this.$emit('onIconClick', iconName);
            },

            onChange() {
                let el ='input';
                el = this.showTextarea? 'textarea': el;
                this.UpdateVal($(this.$el).children(el).val());
            },

            UpdateVal(val){
                if (this.validation != undefined) {
                    let run = new Function('val', 'return '+this.validation);
                    let result = run(val)? 1:0;


                    this.informValidation(result);
                    this.$emit('update:isValid', result);
                }

                if (this.numeric && this.positive) {
                    this.$emit('update:val', Math.abs(val));
                } else
                    this.$emit('update:val', val);
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

            this.$options.input = $(this.$el).find(el).keypress(function (e) {
                let ret = true;

                if (_this.is_numeric)
                    if ((e.which == 32) || (e.which == 37) || (e.which == 38) || (e.which == 39) || (e.which == 40) || (e.which == 46) ||
                        (e.which ==  9) || (e.which ==  8) || (e.which == 35) || (e.which ==  36) || (e.which == 13)) ret = true;
                    else
                        ret = ((e.which > 47) && (e.which < 58));

                var val = $(this).val();

                if (e.which == 13 && val) {
                    if (_this.clearOnEnter)
                        $(this).val('');
                    else
                        _this.UpdateVal(val);
    
                    _this.$emit('onEnter', val);
                }

                return ret;
            });

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

</style>
