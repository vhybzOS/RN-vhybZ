import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { set } from "date-fns-jalali"
import { api } from "../services/api-sdk/api"
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
      try {
        const response = await api.auth.authLoginPost({
          credentials:{
            username,
            password
          }
        })

        console.log("status", response.status)
        
        
        if (response.status === 200) {
          if (response.data.access_token && response.data.refresh_token) {
            this.setAuthToken(response.data.access_token, response.data.refresh_token)
            this.setAuthUser("empty")
            api.setAccessToken(response.data.access_token, response.data.refresh_token)
          }
        }
        return { error: null }
      } catch (error) {
        return { error }
      }
    },
    async signUp(email: string, password: string) {
      try {
        const response = await api.auth.authRegisterPost({
          user:{
            email,
            password,
            username:email,
          }
        })
        
        
        if (response.status === 201) {
          this.login(email, password)
        }
        return { error: null }
      } catch (error) {
        return { error }
      }
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

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
