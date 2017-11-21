//
Created by Roman on 18.11.2017.
matcss_endeventer.vue

<template lang="pug">
    .scrollspy(style="height: 10px")
</template>

<script>
    export default {
        name: 'matcss_endeventer',
        mounted(){
            this.$nextTick(function () {
                const sspy = $(this.$el);
                const _this = this;
                sspy.scrollSpy({
                    scrollOffset: 0,
                    activeClass: 'active',
                    getActiveElement(id){
                        if (!sspy.hasClass('active'))
                            _this.$emit('onScroll');
                        return sspy;
                    }
                });
            })
        }
    }
</script>