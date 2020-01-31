//
Created by Roman on 05.09.2017.
matcss_modal.vue

<template lang="pug">
    .modal(:id="modalID")
        .modal-content.ios-scroll-fix
            i.material-icons.small.close_icon.teal-text(v-if="!c_footer", @click.stop="close") close
            slot(name='header')
                h5(v-if="caption") {{ caption }}
            div(style="margin-top: 22px")
                slot
        .modal-footer(v-if="c_footer", @click="OnClick")
            slot(name='footer')
                a#btncancel.modal-action.modal-close.waves-effect.waves-green.btn-flat(v-if="buttonCancel == undefined || buttonCancel != ''") {{ buttonCancel == undefined? $t('cancel'): buttonCancel }}
                a#btnok.modal-action.waves-effect.waves-green.btn-flat(@click="close") {{ buttonOk == undefined? 'OK': buttonOk }}

</template>

<script>
    import {is_bool} from 'materializecss-vuejs-component';

    export default {
        J_modal: undefined,
        props: ['caption', 'buttonCancel', 'buttonOk', 'show', 'dismissible', 'startingTop', 'endingTop', 'preventClose', 'footer'],
        name: 'matcss_modal',
        computed: {
            c_show(){
                return is_bool(this.show);
            },
            c_dismissible(){
                return is_bool(this.dismissible);
            },
            c_footer(){
                if (this.footer === undefined)
                    return true;

                return is_bool(this.footer);
            },
            c_preventClose(){
                return is_bool(this.preventClose)
            }
        },
        data() {
            return {
                modalID: '_'+Materialize.guid()
            }
        },
        methods:{
            setShow(val){
                is_bool(val)? this.$options.J_modal.modal('open') : this.$options.J_modal.modal('close');
                if (val)
                    this.$el.querySelector('.modal-content.ios-scroll-fix').scrollTo(0, 0);
            },

            OnClick(event) {
                this.$emit('onClick', event)
            },

            close() {
                if (!this.c_preventClose)
                    this.$options.J_modal.modal('close');
            }
        },
        watch: {
            show(val){
                this.setShow(val);
            }
        },
        mounted(){
            const _this = this;

            this.$options.J_modal = $(this.$el);


            this.$options.J_modal.modal({
                startingTop: _this.startingTop !== undefined? _this.startingTop: '4%',
                endingTop: _this.endingTop !== undefined? _this.endingTop: '10%',
                complete: function() {
                    _this.$emit('update:show', false);

                }, // Callback for Modal close
                ready: function() { // Callback for Modal open.
                    _this.$emit('update:show', true);
                },
                dismissible: _this.dismissible === undefined? true: _this.c_dismissible
            });

            this.setShow(this.show);
        }
    }
</script>

<style scoped lang="sass">
    .close_icon
        position: fixed
        right: 5px
        top: 5px
        cursor: pointer
        -webkit-transform: unset !important
        transform: unset !important
        pointer-events: unset !important
    .footer_auto_height > .modal-footer
        height: auto !important
    .noheader > .modal-content > div
        margin-top: 0 !important
    .modal-footer
        z-index: 1005
</style>