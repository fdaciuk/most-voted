import React from 'react'
import { useSubjects, useEventData } from 'hooks'

function MainPage ({ issue }) {
  const { subjects, fetchData } = useSubjects(issue)
  const { eventName, issueUrl } = useEventData(issue)

  return (
    <>
      <h1>{eventName}</h1>
      <h2>Assuntos mais votados:</h2>

      <a
        className='button'
        href={issueUrl}
        rel='noopener noreferrer'
        target='_blank'
        style={{ marginRight: 10 }}
      >
        Escolha ou vote em um assunto
      </a>

      <button
        onClick={fetchData}
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
    </>
  )
}

export default MainPage
