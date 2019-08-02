import { useCache } from 'hooks'
import { del } from 'idb-keyval'
import { http, to } from 'utils'
import { subjectsIssue } from 'utils'

function useSubjects (issue) {
  const [subjects, setSubjects] = useCache({
    cacheEntry: issue,
    initialState: () => [],
    fetchData
  })

  async function fetchData () {
    console.log('fetching data...')
    let tempSubjects = []
    const fetchDataInternal = async (url) => {
      if (!url) {
        console.log(`Now let's organize all data :D`, tempSubjects)
        setSubjects(sort(tempSubjects))
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
      const nextUrl = linkHeader ? getNextUrl(linkHeader) : null
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

  return { subjects, fetchData }
}

function normalizeData (data) {
  const normalizedData = data.map((item) => ({
    id: item.id,
    title: item.body,
    votes: item.reactions['+1'],
    user: item.user.login,
  }))

  return normalizedData
}

function sort (data) {
  return Array.from(data).sort((a, b) => b.votes - a.votes)
}

export default useSubjects
