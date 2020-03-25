//
Created by Roman on 01.02.2018.
matcss_datepicker.vue

<template lang="pug">
    .input-field
        i.material-icons.prefix(v-if="iconPrefix !== undefined", :class="{'red-text' : dateClass.redtext, 'grey-text': c_disabled}") {{ iconPrefix }}
        input.datepicker(:style="{'border-bottom': valid ? ' 2px solid #4CAF50' : required ? '2px solid #F44336' : ''}", type='text', :id="GUIDID", :class="c_class", :disabled="c_disabled")
        label(:style="iconPrefix !== undefined? 'width: calc(100% - 3rem)': 'width: 100%'", :for='GUIDID', :class="{active: textExist}") {{ name }}
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
        datepicker: undefined,
        name: 'matcss_datepicker',
        props: ['required', 'valid', 'container', 'val', 'checkValidation', 'forbiddenDaysOfWeek', 'minDate_str', 'maxDate_str', 'placeholder', 'name', 'iconPrefix', 'inputClass', 'disabled'],
        data() {
            return {
                GUIDID:  Materialize.guid(),
                minDate: new Date(this.minDate_str),
                maxDate: new Date(this.maxDate_str),
                dateClass: {
                    redtext: false
                },
                pickerInstance: undefined
            }
        },
        watch: {
            val(newVal){
                if (newVal == null || newVal == '') {
                    this.pickerInstance.set('clear');
                    return;
                }

                this.informValidation(1);

                this.pickerInstance.set('select', newVal, { format: 'yyyy-mm-dd' })
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
            },
            pickerValidation() {
                const min = utils.moment(this.minDate_str)
                const max = utils.moment(this.maxDate_str)
                const currentDate = this.pickerInstance.get('select', 'yyyy-mm-dd')
                const correctMinMax = this.minDate_str && this.maxDate_str
                        ? utils.moment(min).isBefore(max)
                        : true,
                    isMinMaxSame = this.minDate_str && this.maxDate_str
                        ? utils.moment(min).isSame(max)
                        : false,
                    currentIsSet = !!currentDate,
                    dateIsValid = utils.moment(currentDate).isBetween(min, max, null, '[]'),
                    outOfRangeMin = this.minDate_str
                        ? utils.moment(currentDate).isBefore(min)
                        : false,
                    outOfRangeMax = this.maxDate_str
                        ? utils.moment(currentDate).isAfter(max)
                        : false,
                    forbiddenConflicts = new Set(this.forbiddenDaysOfWeek)
                        .has(utils.moment(currentDate).day())

                return {
                    correctMinMax,
                    isMinMaxSame,
                    currentIsSet,
                    dateIsValid,
                    outOfRangeMin,
                    outOfRangeMax,
                    inRange: !outOfRangeMin && !outOfRangeMax,
                    forbiddenConflicts
                }
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
            },
            findNewDate(findDirection) {
                if (this.forbiddenDaysOfWeek && this.forbiddenDaysOfWeek.length > 6)
                    return undefined

                const startFrom = findDirection
                    ? this.minDate_str
                    : this.maxDate_str,
                    mappedForbidden = new Set(this.forbiddenDaysOfWeek)

                let current = utils.moment(startFrom),
                    find = undefined

                if (this.pickerValidation.forbiddenConflicts && this.pickerValidation.inRange) {
                    current = utils.moment(this.pickerInstance.get('select', 'yyyy-mm-dd'))
                }

                do {
                    if (mappedForbidden.has(current.day())) {
                        current.add(findDirection ? 1 : -1, 'd')
                    } else {
                        find = current.format('YYYY-MM-DD')
                    }
                } while (
                    find === undefined &&
                    utils.moment(current).isBetween(this.minDate_str, this.maxDate_str, null, '[]')
                )

                return find
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.$options.datepicker = $(this.$el).find('.datepicker');

                changeLocalization(this.$i18n.locale);

                const _this = this;

                this.$options.datepicker.pickadate({
                    container: document.getElementById(_this.container),
                    selectMonths: true, // Creates a dropdown to control month
                    selectYears: 150, // Creates a dropdown of 15 years to control year,

                    closeOnSelect: true, // Close upon selecting a date,

                    onSet: function(thingSet) {
                        const currentSelected = this.get('select', 'yyyy-mm-dd')

                        if (!currentSelected) {
                            _this.$emit('update:val', undefined);
                            return;
                        }

                        if (_this.pickerValidation.inRange === true && !_this.pickerValidation.forbiddenConflicts) {
                            if (currentSelected != _this.val) {
                                _this.$emit('update:val', currentSelected);
                            }
                        } else if (!_this.pickerValidation.correctMinMax && !_this.pickerValidation.forbiddenConflicts) {
                            _this.$emit('update:val', undefined);
                            this.set('clear');
                            Materialize.toast(`${_this.$t('this_date_is_unavailable_for_selection')}`, 6000, 'rounded red');
                            throw new Error(`Неразрешимый конфликт значений minDate и maxDate : ${utils.moment(_this.minDate_str).format('YYYY-MM-DD')}, ${utils.moment(_this.maxDate_str).format('YYYY-MM-DD')}`)
                        } else {
                            const find = _this.findNewDate(_this.pickerValidation.outOfRangeMin)

                            if (find !== undefined) {
                                Materialize.toast(`${_this.$t('this_date_is_unavailable_for_selection')}`, 6000, 'rounded red');
                                this.set('select', find, {format: 'yyyy-m-d'});
                            } else {
                                _this.$emit('update:val', undefined);
                                this.set('clear');
                                throw new Error(`Невозможно выставить корректную дату с текущими значениями forbiddenDaysOfWeek, minDate и maxDate`)
                            }
                        }
                    }
                });

                this.pickerInstance = this.$options.datepicker.pickadate('picker');

                //picker.set('disable', false);
                //picker.set('enable', false);

                //picker.set('disable', [2,3,4,5,6,7]);

                if (this.val !== undefined && this.val !== null && this.val !== '') {
                    this.pickerInstance.set('select', this.val, {format: 'yyyy-mm-dd'})
                }
            })
        },
    }
</script>
<style scoped>
    .w140 {
        width: 140px
    }
    .invalid {
        border-bottom: red !important;
    }
    .valid {
        border-bottom: green !important;
    }
</style>