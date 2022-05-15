import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";

export interface State {
  user: string;
  loading: boolean;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state(): State {
    return {
      user: "",
      loading: false,
    };
  },
  actions: {},
  mutations: {
    SET_LOADING(state, bool) {
      state.loading = bool;
    },
    SET_USER(state, str) {
      state.user = str;
    },
  },
});
export default store;
