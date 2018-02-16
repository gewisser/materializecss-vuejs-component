//
Created by Roman on 01.02.2018.
matcss_datepicker.vue

<template lang="pug">
    input.datepicker(type='text')
</template>

<script>
    jQuery.extend( jQuery.fn.pickadate.defaults, {
        monthsFull: [ 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря' ],
        monthsShort: [ 'янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек' ],
        weekdaysFull: [ 'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота' ],
        weekdaysShort: [ 'вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб' ],
        today: 'сегодня',
        clear: 'удалить',
        close: 'закрыть',
        firstDay: 1,
        format: 'd mmmm yyyy г.',
        formatSubmit: 'yyyy-mm-dd'
    });


    export default {
        name: 'matcss_datepicker',
        props: ['val'],
        data() {
            return {

            }
        },
        watch: {
            val(newVal){
                const picker = this.datepicker.pickadate('picker');
                picker.set('select', newVal, { format: 'yyyy-mm-dd' })

            }
        },
        mounted () {
            this.$nextTick(function () {
                this.datepicker = $(this.$el);

                const _this = this;

                this.datepicker.pickadate({
                    selectMonths: true, // Creates a dropdown to control month
                    selectYears: 15, // Creates a dropdown of 15 years to control year,
                    today: 'Сегодня',
                    clear: 'Очистить',
                    close: 'Ok',
                    closeOnSelect: false, // Close upon selecting a date,
                    onSet: function(thingSet) {
                        _this.$emit('update:val', this.get('select', 'yyyy-mm-dd'));
                    }
                });
            })
        },
    }
</script>