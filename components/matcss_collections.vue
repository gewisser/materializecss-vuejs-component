//
Created by Roman on 05.09.2017.
matcss_collections.vue

<template lang="pug">
    ul.collection
        li.collection-item.avatar(v-for="item in items")
            img.circle(src="item.photo", alt='')
            span.title {{ item.title }}
            p {{ item.line1 }}
            span {{ item.line2 }}
            .secondary-content(:id="item.id", @click="OnClick(item, $event)")
                slot(name="item")

</template>

<script>
    export default {
        props: ['items'],
        name: 'matcss_collections',
        methods:{
            OnClick(item, event) {
                this.$emit('onClick', item, event)
            }
        }
    }
</script>