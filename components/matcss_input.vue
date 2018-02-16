//
Created by Roman on 18.08.2017.
matcss_input.vue

<template lang="pug">
    .input-field
        i.material-icons.prefix(v-if="iconPrefix !== undefined") {{ iconPrefix }}
        input(
            v-if="!showTextarea",
            :id="GUIDID",
            :value="val",
            @change="onChange",
            :type="type==undefined?'text': type",
            :class="c_inputClass",
            :disabled="c_disabled",
            :readonly="c_readonly",
            :placeholder="placeholder"
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

        label(style="width: 100%;", :for='GUIDID', :class="{ active: textExist}", :data-error="dataError", :data-success="dataSuccess") {{ name }}
</template>

<script>
    import {is_bool} from 'materializecss-vuejs-component';

    export default {
        props: [
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
            'numeric'
        ],
        name: 'matcss_input',
        data () {
            return {
                GUIDID: undefined,
                inputClass: {
                    valid: false,
                    invalid: false
                }
            }
        },
        computed: {
            textExist(){
                return (this.val !== undefined && this.val !== '') || (this.placeholder !== undefined && this.placeholder !== '');
            },
            c_inputClass(){
                let addClass;

                if (typeof this.addClass === 'object')
                    addClass = this.addClass;
                else
                    addClass = new Function('', 'return '+this.addClass)();

                return Object.assign({}, this.inputClass, addClass);
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
            isValid(val){
                this.informValidation(val);
            }
        },
        methods: {
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

            this.input = $(this.$el).find(el).keypress(function (e) {
                let ret = true;

                if (_this.is_numeric)
                    if ((e.which == 32) || (e.which == 37) || (e.which == 38) || (e.which == 39) || (e.which == 40) || (e.which == 46) ||
                        (e.which ==  9) || (e.which ==  8) || (e.which == 35) || (e.which ==  36) || (e.which == 13)) ret = true;
                    else
                        if (((e.which > 47) && (e.which < 58))) {
                            ret = true
                        }	else {
                            ret = false;
                        }


                var val = $(this).val();

                if (e.which == 13 && val && val != '') {
                    _this.UpdateVal(val);
                    _this.$emit('onEnter', val);
                }

                return ret;
            });

        }
    }
</script>
