//
Created by Roman on 31.01.2018.
matcss_timepicker.vue

<template lang="pug">
    .input-field
        i.material-icons.prefix(v-if="iconPrefix", :class="{'grey-text': c_disabled}") {{ iconPrefix }}
        input.timepicker(
            :id="GUIDID",
            type='text',
            @change="onChange",
            :value="value",
            :class="inputClass",
            :disabled="c_disabled",
            :style="{'border-bottom': valid ? ' 2px solid #4CAF50' : required ? '2px solid #F44336' : ''}"
        )
        label(v-if="name", style="width: 100%;", :for='GUIDID', :class="{active: textExist}") {{ name }}
</template>

<script>
    import {is_bool} from 'materializecss-vuejs-component';

    export default {
        timepicker: undefined,
        name: 'matcss_timepicker',
        props: {
            value: {type: String, default: undefined },
            name: {type: String, default: undefined },
            default:{ type: String, default: 'now'},
            twelvehour:{ type: Boolean, default: false},
            donetext:{ type: String, default: 'OK'},
            cleartext:{ type: String, default: 'Clear'},
            canceltext:{ type: String, default: 'Cancel'},
            autoclose:{ type: Boolean, default: false},
            ampmclickable:{ type: Boolean, default: true},
            iconPrefix: {type: String, default: undefined},
            inputClass: {default: false},
            disabled: {default: false},
            valid: {default: false},
            required: {default: false}
        },
        data() {
            return {
                GUIDID:  Materialize.guid(),
            }
        },
        computed: {
            textExist() {
                return (this.value !== undefined && this.value !== '');
            },
            c_disabled(){
                return is_bool(this.disabled)
            }
        },
        mounted () {
            this.$nextTick(function () {
                this.$options.timepicker = $(this.$el).find('input');

                this.$options.timepicker.change(() => {this.onChange()});


                this.$options.timepicker.pickatime({
                    default: this.default, // Set default time: 'now', '1:30AM', '16:30'
                    fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
                    twelvehour: this.twelvehour, // Use AM/PM or 24-hour format
                    donetext: this.donetext, // text for done-button
                    cleartext: this.cleartext, // text for clear-button
                    canceltext: this.canceltext, // Text for cancel-button
                    autoclose: this.autoclose, // automatic close timepicker
                    ampmclickable: this.ampmclickable, // make AM PM clickable
                    aftershow() {

                    } //Function for after opening timepicker
                });
            })
        },
        methods: {
            onChange(){
                this.$emit('input', this.$options.timepicker.val());
            }
        }
    }
</script>