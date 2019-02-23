//
Created by Roman on 20.09.2017.
matcss_switch.vue

<template lang="pug">
    div
        label {{ name }}
        .switch(style="margin-top: 8px;")
            label
                span.text(:class="{'teal-text': !checkedDOM}") {{ labelOff }}
                input(type='checkbox', :checked="checkedDOM", :disabled="c_readonly")
                span.lever
                span.text(:class="{'teal-text': checkedDOM}") {{ labelOn }}
</template>

<script>
    import {is_bool} from 'materializecss-vuejs-component';

    export default {
        name: 'matcss_switch',
        props: ['name', 'labelOff', 'labelOn', 'checked', 'readonly'],
        data () {
            return {
                elInp: undefined,
                checkedIsBool: false
            }
        },
        computed:{
            checkedDOM(){
                this.checkedIsBool = typeof this.checked === 'boolean';

                if (this.checkedIsBool)
                    return this.checked;

                return this.checked == 1? true: false
            },
            c_readonly(){
                return is_bool(this.readonly);
            }
        },
        watch: {
            checked(newVal){
                let mod_newVal = this.getBoolVal(newVal);

                if (this.getBoolVal(this.elInp.prop('checked')) != mod_newVal)
                    this.$emit('update:checked', mod_newVal);

                this.$emit('update');
            }
        },
        mounted () {
            const _this = this;
            this.elInp = $(this.$el).find('input').click(function(){
                _this.$emit('update:checked', _this.getBoolVal($(this).prop('checked')));
            });
        },
        methods: {
            getBoolVal(boolVal){
                return typeof boolVal !== 'boolean'? boolVal: this.checkedIsBool? boolVal: boolVal? 1:0;
            }
        }
    }
</script>
<style scoped>
    .switch .text {
        font-size: 1.2em;
        color: #000000eb;
    }
</style>