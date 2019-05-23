//
Created by Roman on 08.09.2017.
matcss_autocomplete.vue

<template lang="pug">
    .input-field
        i.material-icons.prefix(v-if="iconPrefix !== undefined") {{ iconPrefix }}
        input.autocomplete(
            :id="GUIDID",
            type='text',
            :class="{ valid: textExist }",
            @change="onChange",
            :disabled="c_disabled",
            :readonly="c_readonly"
        )
        label(:for="GUIDID", :class="{ active: textExist}") {{ name }}

</template>

<script>
    import './../images/pixel.gif';
    import {is_bool} from 'materializecss-vuejs-component';

    export default {
        inputElement: undefined,
        props: {
            name:       {type: String, default: 'Type text...'},
            val:        { type: Object, default: undefined },
            url:        { type: Object },
            iconPrefix: { type: String, default: undefined },
            disabled:   { type: Boolean, default: false },
            readonly:   { type: Boolean, default: false },
            itemName:   { type: String, default: 'itemName' }
        },
        name: 'matcss_autocomplete',
        data () {
            return {
                GUIDID: undefined,
                rawData: [],
                curInputVal: ''
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        computed: {
            textExist(){
                return this.val !== undefined && this.val[this.itemName] !== undefined && this.val[this.itemName] !== '';
            },
            c_disabled(){
                return is_bool(this.disabled);
            },
            c_readonly(){
                return is_bool(this.readonly);
            },

        },
        watch: {
            val: {
                handler(val){
                    this.initVal(val);
                },
                deep: true
            }
        },

        methods:{
            initVal(val_obj){
                if (val_obj == undefined) {
                    this.$options.inputElement.val('');
                    this.curInputVal = '';
                } else if (val_obj[this.itemName] !== undefined && val_obj[this.itemName] != this.curInputVal) {
                    this.$options.inputElement.val(val_obj[this.itemName]);
                    this.curInputVal = val_obj[this.itemName];
                }
            },
            onChange() {
                let aval = $(this.$el).children('input').val();
                if (aval == '')
                    this.$emit('update:val', undefined);

            },
        },
        mounted(){
            this.$options.inputElement = $(this.$el).find('#'+this.GUIDID);
            const _this = this;

            var timeout_id = undefined;

            const adata = {
                "a": null
            }; // if data is empty {}, it won't work.


            this.$options.inputElement.autocomplete({
                data: adata,
                limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                onAutocomplete: function(val) {
                    _this.curInputVal = val;

                    for (let i = _this.rawData.length - 1; i >= 0; i--) {
                        if (_this.rawData[i].id != $(this).find('img').attr('data-id'))
                            _this.rawData.splice(i, 1);
                    }

                    _this.$emit('update:val', _this.rawData[0]);
                },
                minLength: 1 // The minimum length of the input for the autocomplete to start. Default: 1.

            }).keyup(function(e) {
                const jQ_this =  $(this);

                if (e.which === 13 ||
                    e.which === 38 ||
                    e.which === 40) {
                    return;
                }

                if (timeout_id !== undefined)
                    window.clearTimeout(timeout_id);

                timeout_id = window.setTimeout(function () {
                    const value = jQ_this.val();

                    _this.curInputVal = value;

                    if (value === '')
                        return;

                    for (let element in adata) {
                        delete adata[element];
                    }

                    _this.url.params.s = value;

                    _this.$http.get('/', _this.url).then(response => {
                        if (response.body === null || !response.body.ret)
                            return;

                        _this.rawData = response.body.list;

                        response.body.list.forEach(function callback(currentValue) {
                            let item = {};

                            item[currentValue[_this.itemName]] = '/pixel.gif" data-id="'+currentValue.id;

                            $.extend(adata, item)
                        });


                        jQ_this.trigger('blur.autocomplete');
                        jQ_this.trigger('focus.autocomplete');
                    });
                }, 600)
            });

            this.initVal(this.val);
        }

    }
</script>