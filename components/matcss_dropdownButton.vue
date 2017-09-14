//
Created by Roman on 23.08.2017.
matcss_dropdownButton.vue

<template lang="pug">
    a.dropdown-button.btn.light-blue.darken-2(:data-activates='GUIDID')
        i.material-icons.left(v-if="isIconLeft") {{ iconLeft }}
        | {{ selectedText }}
        m-list-internal(:items="items", :id="GUIDID", @onSelect="onSelect", :selected-id="selectedId", :aclass="aclass == undefined? '': aclass")

</template>

<script>
    import MList from './matcss_list.vue';

    export default {
        props: ['items', 'name', 'selectedId', 'aclass', 'iconLeft'],
        name: 'matcss_dropdownButton',
        data () {
            return {
                GUIDID: undefined,
                buttonName: ''
            }
        },
        created(){
            this.GUIDID = Materialize.guid();
        },
        computed:{
            isIconLeft(){
                return this.iconLeft !== undefined && this.iconLeft != ''
            },
            selectedText(){
                var text = '';

                if (this.name !== undefined && this.name !== '')
                    return this.name;

                if (this.buttonName != '')
                    return this.buttonName


                //const _this = this;

                this.items.forEach(function callback(currentValue, index, array) {
                    if (currentValue.id == this.selectedId) {
                        text = currentValue.text
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
            onSelect(item){
                this.buttonName = item.text;
                this.$emit('update:selectedId', item.id)
                this.$emit('onSelect', item);
            }
        },
        mounted () {
            this.$nextTick(function () { // пришлось использовать, потому что в этот момент плагин vue-portal еще не переместил список m-list-internal в другое место
                $(this.$el).dropdown();
            })
        }
    }
</script>

<style>
</style>