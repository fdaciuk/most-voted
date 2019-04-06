import React from 'react'

function RegisterSubject () {
  return (
    <>
      <h1>Assuntos mais votados</h1>
      <form method='get' action='/'>
        <label htmlFor='issueUrl'>URL completa da issue:</label>
        <input type='text' name='issueUrl' />
        <button type='submit'>Enviar</button>
      </form>

      <h3>Instruções de como esse projeto funciona:</h3>
      <p>
        <a href='https://github.com/fdaciuk/most-voted'>https://github.com/fdaciuk/most-voted</a>
      </p>
    </>
  )
}

export default RegisterSubject
