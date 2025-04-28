import { StudioStoreModel } from "./StudioStore"

test("can be created", () => {
  const instance = StudioStoreModel.create({})

  expect(instance).toBeTruthy()
})
