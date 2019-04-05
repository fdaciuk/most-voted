import React from 'react'

function RegisterSubject () {
  return (
    <form method='get' action='/'>
      <label htmlFor='issueUrl'>URL completa da issue:</label>
      <input type='text' name='issueUrl' />
    </form>
  )
}

export default RegisterSubject
