import { useCache } from 'hooks'
import { subjectsIssue } from 'utils'
import { http, to } from 'utils'

function useEventData (issue) {
  const [eventName, setEventName] = useCache({
    cacheEntry: `${issue}-eventName`,
    initialState: '...',
    fetchData
  })
  const issueUrl = subjectsIssue.url(issue)

  async function fetchData () {
    const [error, { data }] = await to(http.get(subjectsIssue.issueUrlApi(issue)))
    if (error) {
      console.log('error:', error)
      return
    }

    setEventName(data.title.replace(/Temas de palestras para [ao]/, ''))
  }

  return { eventName, issueUrl }
}

export default useEventData
