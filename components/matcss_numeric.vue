//
Created by Roman on 19.10.2017.
matcss_numeric.vue

<template lang="pug">
    span
        a.btn.btn-floating.waves-effect.waves-light(style="margin-left: 12px;", @click="OnDecrement")
            i.material-icons remove
        m-input-internal.inline(
        :style="inputStyle",
        :name="name",
        :val="c_val",
        :disabled="disabled",
        :validation="validation",
        :is-valid="isValid",
        :data-error="dataError",
        :data-success="dataSuccess",
        :add-class="addClass",
        :placeholder="placeholder",
        numeric="true"
        )
        a.btn.btn-floating.waves-effect.waves-light(style="margin-left: 5px;", @click="OnIncrement")
            i.material-icons add
</template>

<script>
    import MInput from './matcss_input.vue';

    export default {
        props: [
            'name',
            'val',
            'disabled',
            'validation',
            'isValid',
            'dataError',
            'dataSuccess',
            'addClass',
            'placeholder',
            'inputStyle'
        ],
        name: 'matcss_numeric',
        data() {
            return {
            }
        },
        computed:{
            c_val(){
                return this.val == undefined || this.val == ''? '0': this.val
            }
        },
        components: {
            'm-input-internal': MInput
        },
        methods:{
            OnDecrement(){
                let val = parseInt(this.c_val) - 1;
                this.$emit('update:val', val);
            },
            OnIncrement(){
                let val = parseInt(this.c_val) + 1;
                this.$emit('update:val', val);
            }
        }
    }
</script>

<style>
</style>