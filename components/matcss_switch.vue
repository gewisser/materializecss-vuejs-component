//
Created by Roman on 20.09.2017.
matcss_switch.vue

<template lang="pug">
    .switch
        label
            | {{ labelOff }}
            input(type='checkbox', :checked="checkedDOM")
            span.lever
            | {{ labelOn }}
</template>

<script>
    export default {
        name: 'matcss_switch',
        props: ['labelOff', 'labelOn', 'checked'],
        data () {
            return {
                elInp: undefined,
                checkedIsBool: false
            }
        },
        computed:{
            checkedDOM(){
                this.checkedIsBool = typeof this.checked === 'boolean'

                if (this.checkedIsBool)
                    return this.checked;

                return this.checked == 1? true: false
            }
        },
        watch: {
            checked(newVal){
                let mod_newVal = this.getBoolVal(newVal);

                if (this.getBoolVal(this.elInp.prop('checked')) != mod_newVal)
                    this.$emit('update:checked', mod_newVal);
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