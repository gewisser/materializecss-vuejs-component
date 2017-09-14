//
Created by Roman on 18.08.2017.
matcss_input.vue

<template lang="pug">
    .input-field
        input.validate(:id="GUIDID", :value="val", @change="onChange", :type="type==undefined?'text': type", :class="{ valid: textExist }")
        label(:for='GUIDID', :class="{ active: textExist}") {{ name }}
</template>

<script>
    export default {
        props: ['name', 'val', 'type'],
        name: 'matcss_input',
        data () {
            return {
                GUIDID: undefined
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        methods: {
            onChange() {
                this.$emit('update:val', $(this.$el).children('input').val());
            }
        },
        computed: {
            textExist(){
                return this.val !== undefined && this.val !== '';
            }
        },
        mounted(){
            const _this = this;

            $(this.$el).children('input').keypress(function (e) {
                var val = $(this).val();

                if (e.which == 13 && val && val != '') {
                    _this.$emit('update:val', val);

                    return true;
                }

                return true;
            });
        }
    }
</script>

<style>
</style>