import React from 'react'

const AuthPage = async () => {
    await new Promise(re=>setTimeout(re,5000))

  return (
    <div>AuthPage</div>
  )
}

export default AuthPage