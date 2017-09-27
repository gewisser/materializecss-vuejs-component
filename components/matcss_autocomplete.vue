//
Created by Roman on 08.09.2017.
matcss_autocomplete.vue

<template lang="pug">
    .input-field
        i.material-icons.prefix(v-if="iconPrefix !== undefined") {{ iconPrefix }}
        input.autocomplete(:id="GUIDID", type='text', :class="{ valid: textExist }")
        label(:for="GUIDID", :class="{ active: textExist}") {{ name }}

</template>

<script>
    import pix from './../images/pixel.png';

    export default {
        props: ['name', 'val', 'url', 'iconPrefix'],
        name: 'matcss_autocomplete',
        data () {
            return {
                GUIDID: undefined,
                rawData: [],
                inputElement: undefined,
                curInputVal: ''
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        computed: {
            textExist(){
                return this.val !== undefined && this.val.itemName !== undefined && this.val.itemName !== '';
            }
        },
        watch: {
            val: {
                handler(val, oldVal){
                    if (val == undefined) {
                        this.inputElement.val('');
                        this.curInputVal = '';
                    } else
                    if (val.itemName !== undefined && val.itemName != this.curInputVal) {
                        this.inputElement.val(val.itemName);
                        this.curInputVal = val.itemName;
                    }
                },
                deep: true
            }
        },
        mounted(){
            this.inputElement = $(this.$el).find('input');

            const _this = this;

            var timeout_id = undefined;

            const adata = {
                "a": null
            }; // if data is empty {}, it won't work.


            this.inputElement.autocomplete({
                data: adata,
                limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
                onAutocomplete: function(val) {
                    _this.curInputVal = val;

                    for (let i = _this.rawData.length - 1; i >= 0; i--) {
                        if (_this.rawData[i].id !== $(this).find('img').attr('data-id'))
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

                        response.body.list.forEach(function callback(currentValue, index, array) {
                            let item = {};
                            item[currentValue.itemName] = 'pixel.png" data-id="'+currentValue.id;

                            $.extend(adata, item)
                        });


                        jQ_this.trigger('blur.autocomplete');
                        jQ_this.trigger('focus.autocomplete');
                    }, response => {

                    });
                }, 600)
            });
        }

    }
</script>