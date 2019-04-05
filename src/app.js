import React, { useState, useEffect, Suspense } from 'react'

import 'milligram'

const MainPage = React.lazy(() => import('pages/main'))
const RegisterSubject = React.lazy(() => import('pages/register-subject'))

function App () {
  const [issue, setIssue] = useState(null)

  useEffect(() => {
    setIssue(getIssueUrl(window.location.search))
  }, [])

  return (
    <Suspense fallback='Carregando...'>
        {!issue && <RegisterSubject />}
        {issue && <MainPage issue={issue} />}
    </Suspense>
  )
}

function getIssueUrl (search) {
  if (!search) {
    return null
  }

  return decodeURIComponent(search)
    .replace(/\?issueUrl=.+github\.com\/(.+)$/, '$1')
}

export default App
