//
Created by Roman on 18.08.2017.
matcss_input.vue

<template lang="pug">
    .input-field
        i.material-icons.prefix(v-if="iconPrefix !== undefined") {{ iconPrefix }}
        input(
            :id="GUIDID",
            :value="val",
            @change="onChange",
            :type="type==undefined?'text': type",
            :class="c_inputClass",
            :disabled="c_disabled"
        )
        label(:for='GUIDID', :class="{ active: textExist}", :data-error="dataError", :data-success="dataSuccess") {{ name }}
</template>

<script>
    export default {
        props: ['name', 'val', 'type', 'disabled', 'validation', 'isValid', 'dataError', 'dataSuccess', 'iconPrefix', 'addClass'],
        name: 'matcss_input',
        data () {
            return {
                GUIDID: undefined,
                inputClass: {
                    valid: false,
                    invalid: false
                },

            }
        },
        computed: {
            textExist(){
                return this.val !== undefined && this.val !== '';
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
                if (this.disabled == undefined) return false;

                if (typeof this.disabled === 'boolean')
                    return this.disabled
                else
                    return this.disabled == 1? true: false;
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        watch:{
            isValid(val){
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
        methods: {
            onChange() {
                this.UpdateVal($(this.$el).children('input').val());
            },

            UpdateVal(val){
                if (this.validation != undefined) {
                    let run = new Function('val', 'return '+this.validation);
                    let result = run(val);

                    //this.isValid(result);

                    this.$emit('update:isValid', result? 1:0);
                }

                this.$emit('update:val', val);
            }
        },
        mounted(){
            const _this = this;

            let input = $(this.$el).children('input').keypress(function (e) {
                var val = $(this).val();

                if (e.which == 13 && val && val != '') {
                    _this.UpdateVal(val);

                    return true;
                }

                return true;
            });
        }
    }
</script>
