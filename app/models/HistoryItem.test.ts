import { HistoryItemModel } from "./HistoryItem"

test("can be created", () => {
  const instance = HistoryItemModel.create({})

  expect(instance).toBeTruthy()
})
