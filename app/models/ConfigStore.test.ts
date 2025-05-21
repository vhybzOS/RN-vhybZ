import { ConfigStoreModel } from "./ConfigStore"

test("can be created", () => {
  const instance = ConfigStoreModel.create({})

  expect(instance).toBeTruthy()
})
