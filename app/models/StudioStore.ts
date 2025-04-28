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
    resetHistory: () => {
      self.setProp("history",[])
      self.setProp("loading",false)
      self.setProp("error", ""),
      self.setProp("textInput", "")
      self.setProp("html","")
    },
    callAgent: async () => {
      self.setProp("loading",true)
      self.setProp("error", "")
      try {
        const response = await api.makeThreeJsGame(self.history.map(i=>({content: i.content, role: i.role})),self.textInput)
        if (response.kind !== "ok") {
          self.setProp("error", response.kind)
          return
        }
        self.setProp("history",[...self.history, {role: "user", content: self.textInput, createdAt: new Date().toISOString()}])
        self.setProp("textInput", "")
        self.setProp("history",[...self.history, {role: "assistant", content: response.content, createdAt: new Date().toISOString()}])

        // This is where we transform the data into the shape we expect for our MST model.
        const htmlMatch = response.content.match(/```html([\s\S]*?)```/);
        if (htmlMatch && htmlMatch[1]) {
          self.setProp("html", htmlMatch[1].trim())
        } else {
            console.log("No HTML code block found.");
        }
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
