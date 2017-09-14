//
Created by Roman on 29.08.2017.
matcss_checkbox.vue

<template lang="pug">
    div
        input(type="checkbox", :id="GUIDID", :checked="checked? 'checked': ''")
        label(:for="GUIDID") {{ name }}
</template>

<script>
    export default {
        props: ['name', 'checked'],
        name: 'matcss_checkbox',

        mounted () {
            const _this = this;
            $(this.$el).find('input').click(function(){ // событие onClick или onChange не работают, пришлось использовать события jquery
                _this.$emit('update:checked', $(this).prop('checked'));
            });
        },
        watch: {
            checked(newVal){
                this.$emit('update:checked', newVal);
            }
        },
        data () {
            return {
                GUIDID: undefined,
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        methods: {

        }
    }
</script>

<style>
</style>