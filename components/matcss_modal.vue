//
Created by Roman on 05.09.2017.
matcss_modal.vue

<template lang="pug">
    .modal
        .modal-content
            h4 {{ caption }}
            .div(style="margin-top: 22px")
                slot
        .modal-footer(@click="OnClick")
            slot(name='footer')
                a#btncancel.modal-action.modal-close.waves-effect.waves-green.btn-flat {{ buttonCancel == undefined? 'Отмена': buttonCancel }}
                a#btnok.modal-action.modal-close.waves-effect.waves-green.btn-flat {{ buttonOk == undefined? 'ОК': buttonOk }}


</template>

<script>
    export default {
        props: ['caption', 'buttonCancel', 'buttonOk', 'show'],
        name: 'matcss_modal',
        methods:{
            OnClick(event) {
                this.$emit('onClick', event)
            }
        },
        watch: {
            show(){
                this.show? $(this.$el).modal('open'): $(this.$el).modal('close')
            }
        },
        mounted(){
            const _this = this;

            $(this.$el).modal({
                complete: function() {
                    _this.$emit('update:show', false);
                } // Callback for Modal close
            });
        }
    }
</script>