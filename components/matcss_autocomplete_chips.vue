//
Created by Roman on 14.02.2020.
matcss_autocomplete_chips.vue

<template lang="pug">
    div
        .chips.chips-autocomplete(
            :class="{focus: focused}",
            @click.stop="onClickComponent",
            :style="{'padding-right': inputPaddingRight, 'padding-left': inputPaddingLeft, 'padding-top': name? '1.5rem': undefined}"
            )
            i.material-icons.prefix(v-if="iconPrefix") {{ iconPrefix }}
            template(v-for="(item, index) in value_", v-if="!(item.del == 1)")
                slot(:item="item", :fn="{closeChip: () => closeChip(index)}")
                    .chip
                        | {{ item[ratioChips_.text] }}
                        i.material-icons.close(v-if="c_canCloseChip", @click.stop="closeChip(index)") close

            // v-model не подходит для мобильных устройств при реализации функционала получения данных в процессе ввода текста
            // необходимо использовать @input="onInput"
            // В связи с этим чтобы задать текст, необходимо использовать :value="input_text"
            input.input(
                :value="input_text"
                :id="input_id",
                :readonly="c_readonly",
                :disabled="c_disabled",
                :placeholder="c_placeholder",
                @input="onInput"
                @focus="onFocus",
                @blur="onBlur",
                @keydown="onKeyDown"
            )

            label(:for='input_id', v-if="name") {{ name }}

            slot(name="inner-icon")
            template(v-if="clearCloseIcon")
                .inner-icon.append-inner-icon(@click="onClickCloseIcon")
                    i.material-icons {{ clearCloseIcon }}

            ul.autocomplete-content.dropdown-content
                li(v-for="(item, index) in items", :key="index", :class="{ active: index === activeIndex,  divider: item[ratioAutocommplete_.text] === '-'}", @click="onSelect(item)")
                    slot(name="autocomplete", :item="item")
                        img.right.circle(v-if="item[ratioAutocommplete_.img]" :src="item[ratioAutocommplete_.img]")
                        i.material-icons.right.circle.teal-text(v-if="item[ratioAutocommplete_.icon]") {{ item[ratioAutocommplete_.icon] }}
                        span {{ item[ratioAutocommplete_.text] }}
</template>

<script>
    import {is_bool} from 'materializecss-vuejs-component';

    export default {
        timer_id: undefined,
        input: undefined,
        name: 'matcss_autocomplete_chips',
        props: {
            name:  { type: String, default: undefined },
            value: { type: Array, default: () => [] }, // Array, Object: default должна возвращать функцию с объектом. ( default: () => {} )
            ratioChips: { type: Object, default: () => { return {text: 'text'} } },
            ratioAutocommplete: { type: Object, default: () => { return { text: 'text', img: 'img', icon: 'icon' } } },
            canCloseChip: {default: true}, // можно закрывать чипс
            canAddNew: {default: false}, // Можно добавить чипс без необходимости выбора чего-нибудь в автокомлитном результате по нажатю Enter
            autocompleteUrl: { type: Object, default: () => { return {params: {cmd: 'openstreetmap'} } } },
            readonly: { default: false },
            disabled: { default: false },
            iconPrefix: { type: String, default: undefined },
            inputPaddingRight:  { type: String, default: '' },
            inputPaddingLeft:   { type: String, default: '' },
            clearCloseIcon: { type: String, default: undefined }, // встроенная иконка справа для 1. закрытия результатов поиска -> 2. очистка поля ввода -> 3. Удаление всез выьранных чипсов.
            markOnDelete: { default: false }, // Не удалять объект чипс из массива чипсов, а сделать пометку на удаление
            placeholder: { type: String, default: undefined }, // placeholder если пустая строка и нет чипсов
            secondaryPlaceholder: { type: String, default: undefined }  // placeholder если есть хотябы один чипс
        },
        data() {
            return {
                ratioChips_: Object.assign({text: 'text'}, this.ratioChips),
                ratioAutocommplete_: Object.assign({ text: 'text', img: 'img', icon: 'icon' }, this.ratioAutocommplete),
                value_: this.value,
                input_text: '',
                input_id: '_'+Materialize.guid(),
                activeIndex: -1,
                focused: false,
                items: [],
            }
        },
        watch: {
            value(val){
                this.value_ = val;
            },
            input_text(val){
                if (val.length < 3) { // снижение нагрузки на базу данных. Ищем от 3 и более символов
                    this.removeAutocomplete();
                    return;
                }

                if (this.$options.timer_id !== undefined)
                    window.clearTimeout(this.$options.timer_id);


                this.$options.timer_id = window.setTimeout(this.onDebounce, 600)
            }
        },
        computed: {
            c_placeholder(){
                if (this.value_.length > 0 && this.secondaryPlaceholder)
                    return this.secondaryPlaceholder;
                else if (this.placeholder)
                    return this.placeholder;
                else return undefined;
            },
            c_canCloseChip(){
                return is_bool(this.canCloseChip)
            },
            c_readonly() {
                return is_bool(this.readonly);
            },
            c_disabled() {
                return is_bool(this.disabled);
            },
            c_markOnDelete(){
                return is_bool(this.markOnDelete);
            }
        },
        methods: {
            onClickCloseIcon(){
                if (this.items.length > 0) {
                    this.removeAutocomplete();
                    return;
                }

                if (this.input_text !== '') {
                    this.input_text = '';
                    return;
                }

                if (this.value_.length > 0){
                    if (confirm('Удалить все элементы?')) {
                        this.value_ = [];
                        this.$emit('input', this.value_);
                    }
                }
            },
            onInput(e){
                let val = e.target.value;

                this.input_text = val;

                if (val !== '*' && val.length < 3) { // снижение нагрузки на базу данных. Ищем от 3 и более символов
                    this.removeAutocomplete();
                    return;
                }

                if (this.$options.timer_id !== undefined)
                    window.clearTimeout(this.$options.timer_id);


                this.$options.timer_id = window.setTimeout(this.onDebounce, 600)
            },
            onClickComponent(){
                this.$options.input.focus();
            },
            closeChip(index){
                if (!this.c_markOnDelete)
                    this.value_.splice(index, 1);
                else
                    this.$set(this.value_[index], 'del', 1);

                this.$emit('input', this.value_);
            },
            onFocus(){
                this.focused = true
            },
            onBlur(){
                this.focused = false;
                //this.removeAutocomplete();
                this.$emit('change', this.value_);
            },

            removeAutocomplete(){
                this.activeIndex = -1;
                this.items = [];
            },

            onSelect(item) {
                let selectedItem = Object.assign({}, item);
                this.value_.push(selectedItem);
                this.input_text = '';
                this.$emit('input', this.value_);
                this.removeAutocomplete();
            },

            onDebounce(){
                if (this.input_text === '')
                    return;

                this.autocompleteUrl.params.s = this.input_text;

                this.autocompleteUrl.before = function(request) {
                    // Прерывание предидущего запроса, если существует
                    if (this.previousRequest) {
                        this.previousRequest.abort();
                    }
                    // установка предидущего запроса в Vue instance
                    this.previousRequest = request;
                };

                this.$http.get('/', this.autocompleteUrl).then(response => {
                    if (response.body === null || !response.body.ret)
                        return;

                    if (response.body.list.length > 0)
                        this.activeIndex = 0;
                    else
                        this.activeIndex = -1;

                    this.items = response.body.list;
                });
            },
            onKeyDown(e){
                if (this.c_readonly)
                    return false;

                let keyCode = e.which;

                if (keyCode === 13) {
                    if (this.activeIndex >= 0) {
                        this.onSelect(this.items[this.activeIndex]);
                    } else if (this.canAddNew) {
                        let chipData = {};
                        chipData[this.ratioChips_.text] = this.input_text;
                        this.value_.push(chipData);
                        this.$emit('input', this.value_);
                        this.input_text = '';
                    }

                    return;
                }

                // Capture up and down key
                if (keyCode === 38 || keyCode === 40) {
                    e.preventDefault();

                    if (keyCode === 38 && this.activeIndex > 0) {
                        this.activeIndex--;

                        while (this.items[this.activeIndex][this.ratioAutocommplete_.text] === '-') {
                            this.activeIndex--;
                        }

                    }

                    if (keyCode === 40 && this.activeIndex < this.items.length - 1) {
                        this.activeIndex++;

                        while (this.items[this.activeIndex][this.ratioAutocommplete_.text] === '-') {
                            this.activeIndex++;
                        }
                    }
                }
            }
        },
        mounted () {
            this.$options.input = this.$el.querySelector('input');
        }
    }
</script>

<style lang="sass">
    .chips.chips-autocomplete
        position: relative

        label
            position: absolute
            left: 0
            top: 0
            color: inherit

        .input, .chip
            color: inherit

</style>

<style scoped lang="sass">

    .inner-icon
        -webkit-transform: unset !important
        transform: unset !important
        top: 10px
        cursor: pointer !important
        pointer-events: unset !important
        position: absolute !important

    .prepend-inner-icon
        left: 10px !important
    .append-inner-icon
        right: 10px !important
        left: auto !important

</style>