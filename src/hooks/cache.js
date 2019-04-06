import { useState, useEffect } from 'react'
import { get, set } from 'idb-keyval'
import { to } from 'utils'

function useCache ({
  cacheEntry,
  initialState,
  fetchData
} = {}) {
  if (
    cacheEntry === undefined ||
    typeof fetchData !== 'function'
  ) {
    console.warn(
      `[useCache]: cacheEntry and fetchData are required

      Usage:

      const [data, setData] = useCache({
        cacheEntry: 'cache-entry-name', // <String> <required>
        fetchData: () => {}, // <Function> <required>
        initialState: '' // <Any> <optional>
      })`
    )
    return
  }

  const [data, setData] = useState(initialState)

  function setDataOnStateAndIDB (data, { shouldUpdateCache } = {}) {
    console.log(`set data on state (${cacheEntry})`)
    setData(data)

    if (shouldUpdateCache) {
      console.log(`update data on cache (${cacheEntry})`)
      set(cacheEntry, data)
    }
  }

  useEffect(() => {
    async function effect () {
      const [errorGettingData, subjectsFromCache] = await to(get(cacheEntry))
      if (errorGettingData || !subjectsFromCache) {
        console.log(`errorGettingData (${cacheEntry})?`, errorGettingData)
        console.log(`Does not have data from cache :\\ (${cacheEntry})`, subjectsFromCache)
        fetchData()
        return
      }

      if (subjectsFromCache) {
        console.log(`Has data on cache (${cacheEntry}). Does not need to request them.`)
        setDataOnStateAndIDB(subjectsFromCache)
        return
      }
    }

    effect()
  }, [])

  function setDataOnStateAndIDBAndUpdate (data) {
    return setDataOnStateAndIDB(data, { shouldUpdateCache: true })
  }

  return [data, setDataOnStateAndIDBAndUpdate]
}

export default useCache
