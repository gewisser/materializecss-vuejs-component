//
Created by Roman on 05.09.2017.
matcss_modal.vue

<template lang="pug">
    .modal(:id="modalID")
        .modal-content
            h5 {{ caption }}
            .div(style="margin-top: 22px")
                slot
        .modal-footer(@click="OnClick")
            slot(name='footer')
                a#btncancel.modal-action.modal-close.waves-effect.waves-green.btn-flat(v-if="buttonCancel == undefined || buttonCancel != ''") {{ buttonCancel == undefined? 'Cancel': buttonCancel }}
                a#btnok.modal-action.waves-effect.waves-green.btn-flat(@click="close") {{ buttonOk == undefined? 'OK': buttonOk }}

</template>

<script>
    import {is_bool} from 'materializecss-vuejs-component';

    export default {
        props: ['caption', 'buttonCancel', 'buttonOk', 'show', 'dismissible', 'startingTop', 'endingTop', 'preventClose'],
        name: 'matcss_modal',
        computed: {
            c_show(){
                return is_bool(this.show);
            },
            c_dismissible(){
                return is_bool(this.dismissible);
            }
        },
        data() {
            return {
                modalID: Materialize.guid()
            }
        },
        methods:{
            setShow(val){
                is_bool(val)? this.mod.modal('open'): this.mod.modal('close')
            },

            OnClick(event) {
                this.$emit('onClick', event)
            },

            close() {
                if (this.preventClose == undefined || this.preventClose == false)
                    $('#' + this.modalID).modal('close');
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
                startingTop: _this.startingTop !== undefined? _this.startingTop: '4%',
                endingTop: _this.endingTop !== undefined? _this.endingTop: '10%',
                complete: function() {
                    _this.$emit('update:show', false);

                }, // Callback for Modal close
                dismissible: _this.dismissible === undefined? true: _this.c_dismissible
            });

            this.setShow(this.show);
        }
    }
</script>