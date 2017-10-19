//
Created by Roman on 13.10.2017.
matcss_progress.vue

<template lang="pug">
    .row
        .col(:class="divrows", style="padding-right: 3px;")
            .progress
                div(:style='st', :class='mode_calc')
        .col.s4(v-if="isLabel") {{ percent }}%
</template>

<script>

    export default {
        props: ['val', 'min', 'max', 'mode', 'label'],
        name: 'matcss_progress',
        data() {
            return {
                percent: '',
                divrows: 's12'
            }
        },
        computed: {
            st(){
                let d = this.max - this.min;
                let percent = (this.val * 100)/d

                this.percent = Math.round((percent)*10)/10;

                return {
                    width: percent+'%'
                }
            },
            mode_calc(){
                let mode = 'determinate';

                if (this.mode != undefined)
                    mode = this.mode;

                return mode;
            },
            isLabel(){
                let isLabel = this.label != undefined && this.label == 1? true: false;

                this.divrows = isLabel? 's8': 's12';

                return isLabel
            }
        }
    }
</script>
<style scoped>
    .row .col {
        padding: 0 0;
    }
    .progress{
        padding-top: 7px;
        margin-top: 0.55rem;
    }
</style>