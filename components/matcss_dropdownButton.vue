//
Created by Roman on 23.08.2017.
matcss_dropdownButton.vue

<template lang="pug">
    a.dropdown-button.truncate(:data-activates='GUIDID')
        slot
            i.material-icons(v-if="isIconLeft", :class="iconClass") {{ icon }}
            | {{ selectedText }}
        m-list-internal(
        :items="items",
        :id="GUIDID",
        @onSelect="onSelect",
        :selected-id="selectedId",
        :aclass="aclass == undefined? '': aclass",
        :ratio-prop="ratio",
        :tooltipped="tooltipped"
        )

</template>

<script>
    import MList from './matcss_list.vue';

    export default {
        props: ['items', 'name', 'selectedId', 'aclass', 'icon', 'iconClass', 'ratioProp', 'tooltipped'],
        name: 'matcss_dropdownButton',
        data () {
            return {
                GUIDID: undefined,
                buttonName: '',
                ratio: this.c_ratioProp()
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        computed:{
            isIconLeft(){
                return this.icon !== undefined && this.icon != ''
            },
            selectedText(){
                var text = '';

                if (this.name !== undefined && this.name !== '')
                    return this.name;

                if (this.buttonName != '')
                    return this.buttonName;


                //const _this = this;

                this.items.forEach((currentValue)=> {
                    if (currentValue.id == this.selectedId) {
                        text =  currentValue[this.ratio.text];
                        return;
                    }
                }, this);

                return text;
            }
        },
        components: {
            'm-list-internal': MList
        },
        methods:{
            c_ratioProp(){
                let ratioObj = {};

                if (this.ratioProp !== undefined)
                    if (typeof this.ratioProp === 'object')
                        ratioObj = this.ratioProp;
                    else
                        ratioObj = new Function('', 'return '+this.ratioProp)();

                return $.extend({ text: 'text', _class: '_class' }, ratioObj);
            },

            onSelect(item){
                this.buttonName = item[this.ratio.text];
                this.$emit('update:selectedId', item.id);
                this.$emit('onSelect', item);
            }
        },
        mounted () {
            this.$nextTick(function () {
                $(this.$el).dropdown();
            })
        }
    }
</script>