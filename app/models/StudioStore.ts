import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { HistoryItemModel } from "./HistoryItem"
import { api } from "app/services/api"

/**
 * Model description here for TypeScript hints.
 */
export const StudioStoreModel = types
  .model("StudioStore")
  .props({
    history: types.optional(types.array(HistoryItemModel),[]),
    html: types.optional(types.string,""),
    textInput: types.optional(types.string,""),
    loading: types.optional(types.boolean,false),
    error: types.optional(types.string,""),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    callAgent: async () => {
      console.log("callAgent")
      self.setProp("loading",true)
      self.setProp("error", "")
      try {
        console.log("textInput", self.textInput)
        const response = await api.makeThreeJsGame(self.textInput)
        if (response.kind !== "ok") {
          self.setProp("error", response.kind)
          return
        }
        self.setProp("html", response.html)
      } catch (error: any) {
        console.log("error", error) 
        self.setProp("error", error.message || "Unknown error")
      } finally {
        self.setProp("loading",false)
      }
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface StudioStore extends Instance<typeof StudioStoreModel> {}
export interface StudioStoreSnapshotOut extends SnapshotOut<typeof StudioStoreModel> {}
export interface StudioStoreSnapshotIn extends SnapshotIn<typeof StudioStoreModel> {}
export const createStudioStoreDefaultModel = () => types.optional(StudioStoreModel, {})
