import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { set } from "date-fns-jalali"
export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    refreshToken: types.maybe(types.string),
    authEmail: "",
    authUser: types.maybe(types.frozen()),
  })
  .views((store) => ({
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
        return "must be a valid email address"
      return ""
    },
    get isAuthenticated() {
      return store.authToken !== undefined
    }
  }))
  .actions((store) => ({
    setAuthToken(accessToken?: string, refreshToken?: string) {
      store.authToken = accessToken
      store.refreshToken = refreshToken
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    setAuthUser(value: any) {
      store.authUser = value
    },
    async login(username: string, password: string) {

    },
    async signUp(email: string, password: string) {

    },
    logout() {
      try {

        this.setAuthToken(undefined)
        this.setAuthEmail("")
        this.setAuthUser(undefined)
        return { error: null }
      } catch (error) {
        return { error }
      }
    }
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> { }
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> { }
