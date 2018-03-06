//
Created by Roman on 05.09.2017.
matcss_modal.vue

<template lang="pug">
    .modal
        .modal-content
            h5 {{ caption }}
            .div(style="margin-top: 22px")
                slot
        .modal-footer(@click="OnClick")
            slot(name='footer')
                a#btncancel.modal-action.modal-close.waves-effect.waves-green.btn-flat(v-if="buttonCancel == undefined || buttonCancel != ''") {{ buttonCancel == undefined? 'Отмена': buttonCancel }}
                a#btnok.modal-action.modal-close.waves-effect.waves-green.btn-flat {{ buttonOk == undefined? 'ОК': buttonOk }}


</template>

<script>
    import {is_bool} from 'materializecss-vuejs-component';

    export default {
        props: ['caption', 'buttonCancel', 'buttonOk', 'show'],
        name: 'matcss_modal',
        computed: {
            c_show(){
                return is_bool(this.show);
            },
        },
        methods:{
            setShow(val){
                is_bool(val)? this.mod.modal('open'): this.mod.modal('close')
            },

            OnClick(event) {
                this.$emit('onClick', event)
            }
        },
        watch: {
            show(val){
                this.setShow(val);
            }
        },
        mounted(){
            const _this = this;

            this.mod = $(this.$el);

            this.mod.modal({
                complete: function() {
                    _this.$emit('update:show', false);
                } // Callback for Modal close
            });

            this.setShow(this.show);
        }
    }
</script>