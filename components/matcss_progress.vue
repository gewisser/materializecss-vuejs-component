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
    import {is_bool} from 'materializecss-vuejs-component';

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

                let percent = 0;

                if (d > 0) {
                    percent = (this.val * 100) / d;

                    if (percent < 0)
                        percent = 100 + percent;
                }

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
                let isLabel = is_bool(this.label);
                this.divrows = isLabel? 's8': 's12';
                return isLabel;
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