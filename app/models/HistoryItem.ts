import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const HistoryItemModel = types
  .model("HistoryItem")
  .props({
    role: types.union(types.literal("system"),types.literal("user"),types.literal("assistant")),
    content: types.string,
    createdAt: types.string,
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface HistoryItem extends Instance<typeof HistoryItemModel> {}
export interface HistoryItemSnapshotOut extends SnapshotOut<typeof HistoryItemModel> {}
export interface HistoryItemSnapshotIn extends SnapshotIn<typeof HistoryItemModel> {}
export const createHistoryItemDefaultModel = (content: string,role: "system"|"user"|"assistant",createdAt:string) => types.optional(HistoryItemModel, {
  role: role,
  content: content,
  createdAt: createdAt,
})
