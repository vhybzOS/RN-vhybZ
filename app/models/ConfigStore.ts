import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const ConfigStoreModel = types
  .model("ConfigStore")
  .props({
    geminiAPIKey: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ConfigStore extends Instance<typeof ConfigStoreModel> { }
export interface ConfigStoreSnapshotOut extends SnapshotOut<typeof ConfigStoreModel> { }
export interface ConfigStoreSnapshotIn extends SnapshotIn<typeof ConfigStoreModel> { }
export const createConfigStoreDefaultModel = () => types.optional(ConfigStoreModel, {})
