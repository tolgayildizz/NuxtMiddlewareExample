import Vuex from 'vuex';
import Cookie from 'js-cookie';
import axios from "axios";

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
                Cookie.remove("expiresIn");
                if (process.client) {
                    localStorage.removeItem("authKey");
                    localStorage.removeItem("expiresIn");
                }
                state.authKey = null;
            },

        },
        actions: {
            nuxtServerInit(vuexContext, context) {



            },

            //Token bilgilerini sayfa yenilenince güncelleme
            initAuth(vuexContext, req) {
                let token;
                let expiresIn;
                if (req) {
                    //Server üzerinde çalışıyoruz
                    if (!req.headers.cookie) {
                        return
                    }

                    //Cookie üzerinden token alma

                    token = req.headers.cookie.split(";").find(c => {
                        return c.trim().startsWith("authKey=")
                    });

                    if (token) {
                        token = token.split("=")[1];
                    }

                    //Cookie üzerinden expiresIn alma

                    expiresIn = req.headers.cookie.split(";").find(e => {
                        return e.trim().startsWith("expiresIn=")
                    });

                    if (expiresIn) {
                        expiresIn = expiresIn.split("=")[1];
                    }
                }
                else {
                    //Client Üzerinde çalışıyoruz
                    token = localStorage.getItem("authKey");
                    expiresIn = localStorage.getItem("expiresIn");
                }

                if (new Date().getTime() > +expiresIn || !token) {
                    console.log(new Date().getTime(), expiresIn);
                    vuexContext.commit("clearAuthKey")
                }
                vuexContext.commit("setAuthKey", token);
            },

            

            //LocalStorage ve Cookie güncellemesi
            authUser(vuexContext, authData) {
                let authLink =
                    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=";

                if (authData.isUser) {
                    authLink =
                        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=";
                }

                return axios
                    .post(authLink + process.env.firebaseAPIKEY, {
                        email: authData.user.email,
                        password: authData.user.password,
                        returnSecureToken: true
                    })
                    .then(response => {
                        console.log(response)

                        let expiresIn = new Date().getTime() + +response.data.expiresIn * 1000; //3600s

                        Cookie.set("authKey", response.data.idToken);
                        Cookie.set("expiresIn", expiresIn);
                        localStorage.setItem("authKey", response.data.idToken);
                        localStorage.setItem("expiresIn", expiresIn);
                        vuexContext.commit("setAuthKey", response.data.idToken);
                    });



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