//
Created by Roman on 29.08.2017.
matcss_checkbox.vue

<template lang="pug">
    .checkbox-field
        input(type="checkbox", :id="GUIDID", :checked="c_checked", :disabled="c_readonly", :class="{'filled-in': filled}")
        label(:for="GUIDID") {{ name }}
</template>

<script>
    import {is_bool} from 'materializecss-vuejs-component';

    export default {
        props: ['name', 'checked', 'readonly', 'indeterminate', 'filled'],
        name: 'matcss_checkbox',
        data () {
            return {
                GUIDID: undefined,
                checkedIsBool: false
            }
        },
        watch: {
            checked(newVal){
                let mod_newVal = this.getBoolVal(newVal);

                this.$emit('update:indeterminate', false);

                let color = is_bool(newVal)? 'inherit': '';
                this.elInp.next().css("color", color);

                if (this.getBoolVal(this.elInp.prop('checked')) != mod_newVal)
                    this.$emit('update:checked', mod_newVal);
            },
            indeterminate(val) {
                this.elInp[0].indeterminate = is_bool(val);
            }
        },

        mounted () {
            const _this = this;
            this.elInp = $(this.$el).find('input').click(function(){ // событие onClick или onChange не работают, пришлось использовать события jquery
                _this.$emit('update:checked', _this.getBoolVal($(this).prop('checked')));
            });

            this.elInp[0].indeterminate = is_bool(this.indeterminate);
        },
        computed:{
            c_checked(){
                this.checkedIsBool = typeof this.checked === 'boolean';

                return is_bool(this.checked);
            },
            c_readonly(){
                return is_bool(this.readonly);
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        methods: {
            getBoolVal(boolVal){
                return typeof boolVal !== 'boolean'? boolVal: this.checkedIsBool? boolVal: boolVal? 1:0;
            },
        }
    }
</script>
<style scoped>
    [type="checkbox"] + label {
        height: inherit !important;
    }
</style>