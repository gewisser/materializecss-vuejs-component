//
Created by Roman on 19.10.2017.
matcss_numeric.vue

<template lang="pug">
    span
        a.btn.btn-floating.waves-effect.waves-light(style="margin-left: 12px;", @click="c_val = c_val - 1")
            i.material-icons remove
        m-input-internal.inline(
        :style="inputStyle",
        :name="name",
        :val.sync="c_val",
        :disabled="disabled",
        :validation="validation",
        :is-valid="isValid",
        :data-error="dataError",
        :data-success="dataSuccess",
        :add-class="addClass",
        :placeholder="placeholder",
        numeric="true"
        )
        a.btn.btn-floating.waves-effect.waves-light(style="margin-left: 5px;", @click="c_val = c_val + 1")
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
            'inputStyle',
            'min',
            'max'
        ],
        name: 'matcss_numeric',
        data() {
            return {
                oldVal: '0'
            }
        },
        computed:{
            c_val: {
                get(){
                    let ret = this.val == undefined || this.val == ''? '0': this.val;

                    return this.inRange(ret)
                },
                set(newValue){
                    this.$emit('update:val', this.inRange(newValue));
                }
            }
        },
        components: {
            'm-input-internal': MInput
        },
        methods:{
            inRange(val) {
                if (this.min != undefined && parseInt(val) < parseInt(this.min))
                    return parseInt(this.min);
                if (this.max != undefined && parseInt(val) > parseInt(this.max))
                    return parseInt(this.max);

                return parseInt(val);
            }
        }
    }
</script>