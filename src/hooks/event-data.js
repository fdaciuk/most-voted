import { useState, useEffect } from 'react'
import { get, set } from 'idb-keyval'
import { subjectsIssue } from 'utils'
import { http, to } from 'utils'

function useEventData (issue) {
  const [eventName, setEventName] = useState('...')
  const issueUrl = subjectsIssue.url(issue)

  async function fetchData () {
    const [error, { data }] = await to(http.get(subjectsIssue.issueUrlApi(issue)))
    if (error) {
      console.log('error:', error)
      return
    }

    setSubjectsOnStateAndIDB(
      data.title.replace('Temas de palestras para a', ''),
      { shouldUpdateCache: true }
    )
  }

  function setSubjectsOnStateAndIDB (eventName, { shouldUpdateCache } = {}) {
    console.log('set eventName on state')
    setEventName(eventName)

    if (shouldUpdateCache) {
      console.log('update subjects on cache')
      set(`${issue}-eventName`, eventName)
    }
  }

  useEffect(() => {
    async function effect () {
      const [errorGettingEventData, subjectsFromCache] = await to(get(`${issue}-eventName`))
      if (errorGettingEventData || !subjectsFromCache) {
        console.log('errorGettingEventData?', errorGettingEventData)
        console.log('Does not have eventData from cache :\\', subjectsFromCache)
        return fetchData()
      }

      if (subjectsFromCache) {
        console.log('Has eventData on cache. Does not need to request them.')
        return setSubjectsOnStateAndIDB(subjectsFromCache)
      }
    }

    effect()
  }, [])

  return { eventName, issueUrl }
}

export default useEventData
