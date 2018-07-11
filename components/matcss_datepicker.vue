//
Created by Roman on 01.02.2018.
matcss_datepicker.vue

<template lang="pug">
    .input-field
        i.material-icons.prefix(v-if="iconPrefix !== undefined") {{ iconPrefix }}
        input.datepicker(type='text', :id="GUIDID", :class="c_class")
        label(style="width: 100%;", :for='GUIDID', :class="{ active: textExist}") {{ name }}
</template>

<script>
    import {get_obj} from 'materializecss-vuejs-component';

/*
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
*/


    export default {
        name: 'matcss_datepicker',
        props: ['val', 'placeholder', 'name', 'iconPrefix', 'inputClass'],
        data() {
            return {
                GUIDID: undefined
            }
        },
        watch: {
            val(newVal){
                if (newVal == null || newVal == '')
                    return;

                const picker = this.datepicker.pickadate('picker');
                picker.set('select', newVal, { format: 'yyyy-mm-dd' })
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        computed: {
            textExist() {
                return (this.val !== undefined && this.val !== '') || (this.placeholder !== undefined && this.placeholder !== '');
            },
            c_class(){
                return get_obj(this.inputClass);
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.datepicker = $(this.$el).find('.datepicker');

                const _this = this;

                this.datepicker.pickadate({
                    selectMonths: true, // Creates a dropdown to control month
                    selectYears: 15, // Creates a dropdown of 15 years to control year,
/*                    today: 'Сегодня',
                    clear: 'Очистить',
                    close: 'Ok',*/
                    closeOnSelect: false, // Close upon selecting a date,
                    onSet: function(thingSet) {
                        _this.$emit('update:val', this.get('select', 'yyyy-mm-dd'));
                    }
                });

                if (this.val !== undefined && this.val !== null && this.val !== '') {
                    const picker = this.datepicker.pickadate('picker');
                    picker.set('select', this.val, {format: 'yyyy-mm-dd'})
                }
            })
        },
    }
</script>