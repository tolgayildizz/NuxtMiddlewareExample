import Vuex from 'vuex';
import Cookie from 'js-cookie';

const createStore = () => {
    return new Vuex.Store({
        state:{},
        mutations:{},
        actions:{
            nuxtServerInit(vuexContext,context) {

            }
        },
        getters:{}
    });
}