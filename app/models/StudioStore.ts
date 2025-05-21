import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { HistoryItemModel } from "./HistoryItem"
import { htmlGenerator } from "app/services/agent"


/**
 * Model description here for TypeScript hints.
 */
export const StudioStoreModel = types
  .model("StudioStore")
  .props({
    history: types.optional(types.array(HistoryItemModel), []),
    html: types.optional(types.string, ""),
    textInput: types.optional(types.string, ""),
    loading: types.optional(types.boolean, false),
    error: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    resetHistory: () => {
      self.setProp("history", [])
      self.setProp("loading", false)
      self.setProp("error", "")
      self.setProp("textInput", "")
      self.setProp("html", "")
    },
    callAgent: async () => {
      self.setProp("loading", true)
      self.setProp("error", "")
      try {
        const res = await htmlGenerator.Generate(self.textInput)
        self.setProp("history", [...self.history, { role: "user", content: self.textInput, createdAt: new Date().toISOString() }])
        self.setProp("textInput", "")
        self.setProp("history", [...self.history, { role: "assistant", content: res, createdAt: new Date().toISOString() }])
        const htmlMatch = res.match(/```html([\s\S]*?)```/);
        if (htmlMatch && htmlMatch[1]) {
          self.setProp("html", htmlMatch[1].trim())
        } else {
          console.log("No HTML code block found.");
        }
      } catch (error: any) {
        console.log("error", error)
        self.setProp("error", error.message || "Unknown error")
      } finally {
        self.setProp("loading", false)
      }
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface StudioStore extends Instance<typeof StudioStoreModel> { }
export interface StudioStoreSnapshotOut extends SnapshotOut<typeof StudioStoreModel> { }
export interface StudioStoreSnapshotIn extends SnapshotIn<typeof StudioStoreModel> { }
export const createStudioStoreDefaultModel = () => types.optional(StudioStoreModel, {})
