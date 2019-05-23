//
Created by Roman on 01.03.2018.
matcss_chips.vue

<template lang="pug">
    .chips-field
        label {{ name }}
        .chips
</template>

<script>
    export default {
        props: ['val', 'name', 'placeholder', 'secondaryPlaceholder'],
        name: 'matcss_chips',
        created(){
            this.selfChange = false; // Initiate here, since the reactivity of the variable is not needed
        },
        watch: {
            val(val){
                if (!this.selfChange) // detect self change. If not detect and val props use as [ :val.sync="..." ], then the parameters are reset and the focus of the component is lost.
                    this.setData(this.val);

                this.selfChange = false;
            }
        },
        mounted () {
            const _this = this;
            this.$nextTick(function () {
                this.chp = $(this.$el).find('.chips');

                this.setData(this.val);

                this.chp.on('chip.add', function(e, chip){
                    _this.OnUpdate();
                });

                this.chp.on('chip.delete', function(e, chip){
                    if (!confirm("Delete object?"))
                        _this.setData(_this.val);
                    _this.OnUpdate();
                });

                setTimeout(function() {
                    $(_this.$el).find('input').on('blur', function () {
                        _this.chp.addChip({tag: $(_this.$el).find('input').val()}, _this.chp);
                        $(_this.$el).find('input').val('');
                    });
                }, 10);
            })
        },
        methods:{
            setData(val){
                this.chp.material_chip({
                    placeholder: this.placeholder,
                    secondaryPlaceholder: this.secondaryPlaceholder,
                    data: val || this.val
                });
            },
            OnUpdate(){
                this.selfChange = true;
                this.$emit('update:val', this.chp.material_chip('data'));
            }
        }
    }
</script>