import React, { Fragment } from 'react'
import { get, set, del } from 'idb-keyval'
import { http, to } from './utils'
import 'milligram'

class App extends React.Component {
  state = {
    subjects: []
  }

  updateList () {
    this.fetchData()
  }

  async fetchData () {
    console.log('fetching data...')
    const fetchDataInternal = async (url) => {
      if (!url) {
        return
      }

      const [error, { data, xhr }] = await to(http.get(url))
      if (error) {
        console.log('error:', error)
        return
      }


      const { subjects } = this.state
      console.log('subjects', subjects)
      this.setSubjects(subjects.concat(
        sort(normalizeData(data))
      ), { shouldUpdateCache: true })

      const linkHeader = xhr.getResponseHeader('link')
      if (!linkHeader) {
        return
      }
      const nextUrl = this.getNextUrl(linkHeader)
      fetchDataInternal(nextUrl)
    }

    await del('subjects')
    this.setState({ subjects: [] })
    const firstUrl = this.getNextUrl()
    fetchDataInternal(firstUrl)
  }

  getNextUrl (link) {
    if (!link) {
      return subjectsIssue.apiUrl()
    }

    const nextUrl = link.split(',').find(l => l.includes('rel="next"'))
    return nextUrl
      ? nextUrl.trim().replace(/^<(.+)>.+$/, '$1')
      : null
  }

  setSubjects (subjects, { shouldUpdateCache } = {}) {
    console.log('set subjects on state')
    this.setState(() => ({ subjects }))
    if (shouldUpdateCache) {
      console.log('update subjects on cache')
      set('subjects', subjects)
    }
  }

  async componentDidMount () {
    const [errorGettingSubjects, subjectsFromCache] = await to(get('subjects'))
    if (errorGettingSubjects || !subjectsFromCache) {
      console.log('errorGettingSubjects?', errorGettingSubjects)
      console.log('Does not have subjects from cache :\\', subjectsFromCache)
      return this.fetchData()
    }

    if (subjectsFromCache) {
      console.log('Has subjects on cache. Does not need to request them.')
      return this.setSubjects(subjectsFromCache)
    }
  }

  render () {
    const updateList = () => this.updateList()
    const { subjects } = this.state

    return (
      <Fragment>
        <h1>Assuntos para React Conf 2019:</h1>

        <a
          className='button'
          href={subjectsIssue.url()}
          rel='noopener noreferrer'
          target='_blank'
          style={{ marginRight: 10 }}
        >
          Escolha ou vote em um assunto
        </a>

        <button
          onClick={updateList}
          className='button button-outline'
          style={{
            position: 'relative',
            top: 1
          }}
        >
          Atualizar lista (limpar cache)
        </button>

        <table>
          <thead>
            <tr>
              <th>Votos</th>
              <th>Assunto</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.votes}</td>
                <td>{subject.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    )
  }
}

const subjectsIssue = {
  path: `react-brasil/reactconfbr/issues/24`,
  url () {
    return `https://github.com/${this.path}`
  },
  apiUrl () {
    return `https://api.github.com/repos/${this.path}/comments`
  }
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

export default App
