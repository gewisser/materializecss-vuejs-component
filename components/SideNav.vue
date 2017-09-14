//
Created by Roman on 17.08.2017.
SideNav.vue

<template lang="pug">
    ul#slide-out.side-nav
        li
            .userView
                .background
                    img(src='./../images/office.jpg')
                a(href='#!user')
                    img.circle(src="./../images/avatar_2x.png")
                .row.user_line
                    .col.s10
                        span.white-text {{ userdata.name }}
                a
                    span.white-text {{ userdata.mail }}
        li
            a.subheader Текущая компания:
        li
            m-dd(:items="companyList", :name="curCompany.name", aclass="blue-text text-darken-2", @onSelect="onSelectCompany")
        li
            .divider
        li
            a.subheader УПРАВЛЯЕМ
        // <li><a class="waves-effect" href="#!">Third Link With Waves</a></li>
        li.no-padding
            ul.collapsible.collapsible-accordion
                li
                    a.collapsible-header.waves-effect
                        | Заказы
                        i.material-icons arrow_drop_down
                    .collapsible-body
                        ul
                            router-link(to="/incoming-orders", tag="li")
                                a
                                    i.material-icons.ight-blue-darken-3 chevron_right
                                    | Входящие
                            router-link(to="/outgoing-orders", tag="li")
                                a
                                    i.material-icons.ight-blue-darken-3 chevron_right
                                    | Исходящие
        li.no-padding
            ul.collapsible.collapsible-accordion
                li
                    a.collapsible-header.waves-effect
                        | Мероприятия
                        i.material-icons arrow_drop_down
                    .collapsible-body
                        ul
                            li
                                a
                                    i.material-icons.ight-blue-darken-3 chevron_right
                                    | Шаблоны
        // <li><a class="waves-effect" href="#page/business_proc"><i class="material-icons">party_mode</i>Бизнес процессы</a></li>
        router-link(to="/product", tag="li")
            a.waves-effect
                i.material-icons shopping_cart
                | Продукт
        li
            a.subheader КОНТРОЛЬ / АНАЛИЗ
        li.no-padding
            ul.collapsible.collapsible-accordion
                li
                    a.collapsible-header.waves-effect
                        | Отчет внутренний
                        i.material-icons list
                    .collapsible-body
                        ul
                            li
                                a(href='#!')
                                    i.material-icons.ight-blue-darken-3 chevron_right
                                    | Движение ден. средств
                            li
                                a(href='#!')
                                    i.material-icons.ight-blue-darken-3 chevron_right
                                    | План-факт
        li.no-padding
            ul.collapsible.collapsible-accordion
                li
                    a.collapsible-header.waves-effect
                        | Отчет внешний
                        i.material-icons list
                    .collapsible-body
                        ul
                            li
                                a(href='#!')
                                    i.material-icons.ight-blue-darken-3 chevron_right
                                    | Рынки
        li
            a.subheader СТРУКТУРА БИЗНЕСА
        li.no-padding
            ul.collapsible.collapsible-accordion
                li
                    a.collapsible-header.waves-effect
                        | Моя компания
                        i.material-icons location_city
                    .collapsible-body
                        ul
                            router-link(to="/services", tag="li")
                                a
                                    i.material-icons.ight-blue-darken-3 chevron_right
                                    | Службы
                            router-link(to="/co-worker", tag="li")
                                a
                                    i.material-icons.ight-blue-darken-3 chevron_right
                                    | Сотрудники
                            router-link(to="/positions", tag="li")
                                a
                                    i.material-icons.ight-blue-darken-3 business_center
                                    | Должности
        li
            a.waves-effect(href='#!')
                i.material-icons face
                | Покупатели
        router-link(to="/vendors", tag="li")
            a.waves-effect
                i.material-icons work
                | Поставщики
        li
            a.waves-effect
                i.material-icons person_pin
                | Лиды
</template>

<script>
    //import "@/images/office.jpg";
    //import "@/images/avatar_2x.png";


    export default {
        name: 'SideNav',
        data () {
            return {
                userdata: {
                    balance: '0.00',
                    mail: '',
                    name: ''
                },
                companyList: [],
            }
        },
        computed:{
            curCompany(){
                return this.$store.state.cur_company
            }
        }/*,
        watch:{
            curCompany: {
                handler(val, oldVal){
                    console.log('Item Changed');
                    console.log(val)
                },
                deep: true
            }
        }*/,
        mounted () {
            $(this.$el).find('.collapsible').collapsible();
            $('#menu').sideNav();
        },
        created(){
            const resource = this.$resource('/?cmd=user');

            // get user info
            resource.get().then(response => {
                this.userdata = response.body.db;
            }, response => {
                // error callback
            });

            // get company list
            this.$http.get('/?cmd=getMyCompanyItems').then(response => {
                if (!response.body.ret)
                    return;

                const ended_list = [
                    {id: -1, name: '-'},
                    {id: -1, name: 'Новая', _class: 'teal-text lighten-2'}
                ];

                this.$store.commit('SetCurCompany', response.body.cur);

                this.companyList = response.body.list.concat(ended_list);
            }, response => {
                // error callback
            });
        },
        methods: {
            onSelectCompany(item){

                this.$store.commit('SetCurCompany', item);
                this.$http.get('/', {params: {cmd: 'save_cur_company', company_id: item.id}}).then(response => {
                    // success callback
                }, response => {
                    // error callback
                });

            }
        }

    }
</script>

<style>
</style>