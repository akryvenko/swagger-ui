import { createSelector } from "reselect"
import { Map } from "immutable"
import { isOAS3 as isOAS3Helper } from "./helpers"


// Helpers

function onlyOAS3(selector) {
  return (ori, system) => (...args) => {
    const spec = system.getSystem().specSelectors.specJson()
    if(isOAS3Helper(spec)) {
      return selector(...args)
    } else {
      return ori(...args)
    }
  }
}

const state = state => {
  return state || Map()
}

const specJson = createSelector(
  state,
  spec => spec.get("json", Map())
)

const specResolved = createSelector(
  state,
  spec => spec.get("resolved", Map())
)

const spec = state => {
  let res = specResolved(state)
  if(res.count() < 1)
    res = specJson(state)
  return res
}

// Wrappers

export const definitions = onlyOAS3(createSelector(
  spec,
  spec => spec.getIn(["components", "schemas"]) || Map()
))

// New selectors

export const isOAS3 = (ori, system) => () => {
  const spec = system.getSystem().specSelectors.specJson()
  return isOAS3Helper(spec)
}
