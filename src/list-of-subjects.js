import React from 'react'

const ListOfSubjects = ({
  eventName,
  subjects,
  issueUrl,
  updateList
}) => (
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
  </>

)

export default ListOfSubjects
