import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { StudioStoreModel } from "./StudioStore"
import { AuthenticationStoreModel } from "./AuthenticationStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  studioStore: types.optional(StudioStoreModel, {}),
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> { }
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> { }
