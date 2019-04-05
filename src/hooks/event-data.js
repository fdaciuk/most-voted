import { useState, useEffect } from 'react'
import { subjectsIssue } from 'utils'
import { http, to } from 'utils'

function useEventData (issue) {
  const [eventName, setEventName] = useState('...')
  const issueUrl = subjectsIssue.url(issue)

  useEffect(() => {
    async function effect () {
      const [error, { data }] = await to(http.get(subjectsIssue.issueUrlApi(issue)))
      if (error) {
        console.log('error:', error)
        return
      }

      setEventName(data.title.replace('Temas de palestras para a', ''))
    }

    effect()
  }, [])

  return { eventName, issueUrl }
}

export default useEventData
