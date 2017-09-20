//
Created by Roman on 20.09.2017.
matcss_switch.vue

<template lang="pug">
    .switch
        label
            | {{ labelOff }}
            input(type='checkbox', :checked="checked? 'checked': ''")
            span.lever
            | {{ labelOn }}
</template>

<script>
    export default {
        name: 'matcss_switch',
        props: ['labelOff', 'labelOn', 'checked'],
        data () {
            return {
                elInp: undefined
            }
        },
        watch: {
            checked(newVal){
                if (this.elInp.prop('checked') != newVal)
                    this.$emit('update:checked', newVal);
            }
        },
        mounted () {
            const _this = this;
            this.elInp = $(this.$el).find('input').click(function(){
                _this.$emit('update:checked', $(this).prop('checked'));
            });
        },
    }
</script>