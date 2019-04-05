import { useState, useEffect } from 'react'
import { get, set, del } from 'idb-keyval'
import { http, to } from 'utils'
import { subjectsIssue } from 'utils'

function useSubjects (issue) {
  const [subjects, setSubjects] = useState(() => [])

  async function fetchData () {
    console.log('fetching data...')
    let tempSubjects = []
    const fetchDataInternal = async (url) => {
      if (!url) {
        console.log(`Now let's organize all data :D`, tempSubjects)
        setSubjectsOnStateAndIDB(sort(tempSubjects), { shouldUpdateCache: true })
        return
      }

      const [error, { data, xhr }] = await to(http.get(url))
      if (error) {
        console.log('error:', error)
        return
      }

      console.log('tempSubjects', tempSubjects)
      console.log('data:', data)
      tempSubjects = tempSubjects.concat(normalizeData(data))

      const linkHeader = xhr.getResponseHeader('link')
      if (!linkHeader) {
        return
      }
      const nextUrl = getNextUrl(linkHeader)
      fetchDataInternal(nextUrl)
    }

    await del(issue)
    setSubjects([])

    const firstUrl = getNextUrl()
    fetchDataInternal(firstUrl)
  }

  function getNextUrl (link) {
    if (!link) {
      return subjectsIssue.commentsUrlApi(issue)
    }

    const nextUrl = link.split(',').find(l => l.includes('rel="next"'))
    return nextUrl
      ? nextUrl.trim().replace(/^<(.+)>.+$/, '$1')
      : null
  }

  function setSubjectsOnStateAndIDB (subjects, { shouldUpdateCache } = {}) {
    console.log('set subjects on state')
    setSubjects(subjects)

    if (shouldUpdateCache) {
      console.log('update subjects on cache')
      set(issue, subjects)
    }
  }

  useEffect(() => {
    async function effect () {
      const [errorGettingSubjects, subjectsFromCache] = await to(get(issue))
      if (errorGettingSubjects || !subjectsFromCache) {
        console.log('errorGettingSubjects?', errorGettingSubjects)
        console.log('Does not have subjects from cache :\\', subjectsFromCache)
        return fetchData()
      }

      if (subjectsFromCache) {
        console.log('Has subjects on cache. Does not need to request them.')
        return setSubjectsOnStateAndIDB(subjectsFromCache)
      }
    }

    effect()
  }, [])

  return { subjects, fetchData }
}

function normalizeData (data) {
  const normalizedData = data.map((item) => ({
    id: item.id,
    title: item.body.replace(/\[(.+)(?:\s+)?\].+/, '$1'),
    votes: item.reactions['+1']
  }))

  return normalizedData
}

function sort (data) {
  return Array.from(data).sort((a, b) => b.votes - a.votes)
}

export default useSubjects
