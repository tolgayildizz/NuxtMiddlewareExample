import Vuex from 'vuex';
import Cookie from 'js-cookie';

const createStore = () => {
    return new Vuex.Store({
        state:{
            authKey: null,
        },
        mutations:{
            setAuthKey(state, authKey) {
                Cookie.set("authKey", authKey);
                state.authKey = authKey;
            },
            clearAuthKey(state) {
                Cookie.remove("authKey");
                state.authKey = null;
            },

        },
        actions:{
            nuxtServerInit(vuexContext,context) {
                let cookie = context.req.headers.cookie.split(";").find(c => {
                    return c.trim().startsWith("authKey=")
                });

                cookie = cookie.split("=")[1];

                console.log(cookie);
            }
        },
        getters:{
            isAuthenticated(state) {
                return state.authKey !== null;
            },
            getAuthKey(state) {
                return state.authKey;
            }
        }
    });
}

export default createStore;