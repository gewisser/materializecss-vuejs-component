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
        data () {
            return {
                GUIDID: undefined,
                elInp: undefined
            }
        },
        mounted () {
            const _this = this;
            this.elInp = $(this.$el).find('input').click(function(){ // событие onClick или onChange не работают, пришлось использовать события jquery
                _this.$emit('update:checked', $(this).prop('checked'));
            });
        },
        watch: {
            checked(newVal){
                if (this.elInp.prop('checked') != newVal)
                    this.$emit('update:checked', newVal);
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        methods: {

        }
    }
</script>