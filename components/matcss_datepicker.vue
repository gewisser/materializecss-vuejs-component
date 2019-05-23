//
Created by Roman on 01.02.2018.
matcss_datepicker.vue

<template lang="pug">
    .input-field
        i.material-icons.prefix(v-if="iconPrefix !== undefined", :class="{'red-text' : dateClass.redtext, 'grey-text': c_disabled}") {{ iconPrefix }}
        input.datepicker(:style="{'border-bottom': valid ? ' 2px solid #4CAF50' : required ? '2px solid #F44336' : ''}", type='text', :id="GUIDID", :class="c_class", :disabled="c_disabled")
        label(style="width: 100%;", :for='GUIDID', :class="{active: textExist}") {{ name }}
</template>

<script>
    import {get_obj, is_bool} from 'materializecss-vuejs-component';

    function changeLocalization(lang) {
        if (lang === 'ru')
            jQuery.extend(jQuery.fn.pickadate.defaults, {
                monthsFull: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
                monthsShort: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
                weekdaysFull: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
                weekdaysShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
                today: 'сегодня',
                clear: 'удалить',
                close: 'закрыть',
                firstDay: 1,
                format: 'd mmmm yyyy г.',
                formatSubmit: 'yyyy-mm-dd'
            });
        else {

        }
    }

    export default {
        name: 'matcss_datepicker',
        props: ['required', 'valid', 'container', 'val', 'checkValidation', 'forbiddenDaysOfWeek', 'minDate_str', 'maxDate_str', 'placeholder', 'name', 'iconPrefix', 'inputClass', 'disabled'],
        data() {
            return {
                GUIDID:  Materialize.guid(),
                minDate: new Date(this.minDate_str),
                maxDate: new Date(this.maxDate_str),
                dateClass: {
                    redtext: false
                }
            }
        },
        watch: {
            val(newVal){
                const picker = this.datepicker.pickadate('picker');

                if (newVal == null || newVal == '') {
                    picker.set('clear');
                    return;
                }

                this.informValidation(1);

                picker.set('select', newVal, { format: 'yyyy-mm-dd' })
            },
            minDate_str() {
                this.minDate = new Date(this.minDate_str);
            },
            maxDate_str() {
                this.maxDate = new Date(this.maxDate_str);
            },
            checkValidation(val) { // принудительная валидация, инициализируемая родителем
                if ((val == 0) && (this.val == undefined))
                    this.informValidation(val);
                this.$emit('checkValidation:update', 1);
            }
        },
        computed: {
            textExist() {
                return (this.val !== undefined && this.val !== '') || (this.placeholder !== undefined && this.placeholder !== '');
            },
            c_class(){
                return get_obj(this.inputClass);
            },
            c_dateClass() {
                return get_obj(this.dateClass);
            },
            c_disabled(){
                return is_bool(this.disabled)
            }
        },
        methods: {
            informValidation(val){
                switch (val) {
                    case -1:
                        this.dateClass.redtext = true;
                        break;
                    case 0:
                        this.dateClass.redtext = true;
                        break;
                    case 1:
                        this.dateClass.redtext = false;
                        break;
                }
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.datepicker = $(this.$el).find('.datepicker');

                changeLocalization(this.$i18n.locale);

                const _this = this;

                this.datepicker.pickadate({
                    container: document.getElementById(_this.container),
                    selectMonths: true, // Creates a dropdown to control month
                    selectYears: 150, // Creates a dropdown of 15 years to control year,

                    closeOnSelect: true, // Close upon selecting a date,

                    onSet: function(thingSet) {
                        let outOfRangeMinus = false,
                            outOfRangePlus = false;

                        if (_this.minDate !== undefined)
                            outOfRangeMinus =
                                _this.minDate - 1 + 1 > new Date(this.get('select', 'yyyy-mm-dd'));
                        if (_this.maxDate !== undefined)
                            outOfRangePlus =
                                _this.maxDate - 1 + 1 < new Date(this.get('select', 'yyyy-mm-dd'));

                        if (!outOfRangeMinus && !outOfRangePlus) {
                            if (this.get('select', 'yyyy-mm-dd') != _this.val)
                                _this.$emit('update:val', this.get('select', 'yyyy-mm-dd'));
                        } else if (outOfRangeMinus) {
                            Materialize.toast(`${this.$t('this_date_is_unavailable_for_selection')}`, 6000, 'rounded red');
                            if (_this.forbiddenDaysOfWeek != undefined) {
                                let conflict = true;
                                while (conflict) {
                                    conflict = false;
                                    for (let i = 0; i < _this.forbiddenDaysOfWeek.length; i++) {
                                        if ((_this.minDate.getDay() === _this.forbiddenDaysOfWeek[i]) || ((_this.minDate.getDay() === 0) && (_this.forbiddenDaysOfWeek[i] === 7))) {
                                            _this.minDate.setDate(_this.minDate.getDate() + 1);
                                            conflict = true;
                                        }
                                    }
                                }
                            }
                            this.set('select', _this.minDate, {format: 'yyyy-m-d'});
                        } else if (outOfRangePlus) {
                            Materialize.toast(`${this.$t('this_date_is_unavailable_for_selection')}`, 6000, 'rounded red');
                            if (_this.forbiddenDaysOfWeek != undefined) {
                                let conflict = true;
                                while (conflict) {
                                    conflict = false;
                                    for (let i = _this.forbiddenDaysOfWeek.length; i >= 0; i--) {
                                        if ((_this.maxDate.getDay() === _this.forbiddenDaysOfWeek[i]) || ((_this.maxDate.getDay() === 0) && (_this.forbiddenDaysOfWeek[i] === 7))) {
                                            _this.maxDate.setDate(_this.maxDate.getDate() - 1);
                                            conflict = true;
                                        }
                                    }
                                }
                            }
                            this.set('select', _this.maxDate, {format: 'yyyy-m-d'})
                        }
                    }
                });

                const picker = this.datepicker.pickadate('picker');

                //picker.set('disable', false);
                //picker.set('enable', false);

                //picker.set('disable', [2,3,4,5,6,7]);
                if (this.forbiddenDaysOfWeek !== undefined)
                    picker.set('disable', this.forbiddenDaysOfWeek);

                if (this.val !== undefined && this.val !== null && this.val !== '') {
                    picker.set('select', this.val, {format: 'yyyy-mm-dd'})
                }
            })
        },
    }
</script>
<style scoped>
    .invalid {
        border-bottom: red !important;
    }
    .valid {
        border-bottom: green !important;
    }
</style>