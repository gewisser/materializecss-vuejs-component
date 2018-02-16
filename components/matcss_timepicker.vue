//
Created by Roman on 31.01.2018.
matcss_timepicker.vue

<template lang="pug">
    input.timepicker(
        type='text',
        @change="onChange",
        :value="val"
    )
</template>

<script>
    export default {
        name: 'matcss_timepicker',
        props: ['default', 'val'],
        data() {
            return {

            }
        },
        mounted () {
            this.$nextTick(function () {
                this.timepicker = $(this.$el);

                const _this = this;
                this.timepicker.change(function () {
                    _this.$emit('update:val', _this.timepicker.val());
                });

                this.timepicker.pickatime({
                    default: this.default, // Set default time: 'now', '1:30AM', '16:30'
                    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
                    twelvehour: false, // Use AM/PM or 24-hour format
                    donetext: 'OK', // text for done-button
                    cleartext: 'Очистить', // text for clear-button
                    canceltext: 'Отмена', // Text for cancel-button
                    autoclose: false, // automatic close timepicker
                    ampmclickable: true, // make AM PM clickable
                    aftershow() {

                    } //Function for after opening timepicker
                });
            })
        },
        methods: {
            onChange(){
                this.$emit('update:val', this.timepicker.val());
            }
        }
    }
</script>