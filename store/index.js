import Vuex from 'vuex';
import Cookie from 'js-cookie';

const createStore = () => {
    return new Vuex.Store({
        state: {
            authKey: null, //Giriş Kimliği
        },
        mutations: {
            //State içerisine authkey set eder
            setAuthKey(state, authKey) {
                state.authKey = authKey;
            },

            //Authkeyi kaldırır
            clearAuthKey(state) {
                Cookie.remove("authKey");
                localStorage.removeItem("authKey");
                state.authKey = null;
            },

        },
        actions: {
            nuxtServerInit(vuexContext, context) {

                

            },

            //Token bilgilerini sayfa yenilenince güncelleme
            initAuth(vuexContext, req) {
                let token;
                if(req) {
                    //Server üzerinde çalışıyoruz
                    if(!req.headers.cookie) {
                        return
                    }

                    //Cookie üzerinden token alma
                
                    token = req.headers.cookie.split(";").find(c => {
                        return c.trim().startsWith("authKey=")
                    });
    
                    if (token) {
                        token = token.split("=")[1];
                    }
                }
                else {
                    //Client Üzerinde çalışıyoruz
                    token = localStorage.getItem("authKey");
                    if(!token) {
                        return
                    }
                }
                vuexContext.commit("setAuthKey",token);
            },

            //LocalStorage ve Cookie güncellemesi
            login(vuexContext, authKey) {
                Cookie.set("authKey", authKey);
                localStorage.setItem("authKey", authKey);
                vuexContext.commit("setAuthKey", authKey);
            },
            
            //Auth Keyin kaldırılarak çıkış yapılması
            logout(vuexContext) {
                vuexContext.commit('clearAuthKey');
            }
        },
        getters: {
            //Kullanıcı girişi kontrolü
            isAuthenticated(state) {
                return state.authKey != null;
            },
            //Keyi getirme
            getAuthKey(state) {
                return state.authKey;
            }
        }
    });
}

export default createStore;