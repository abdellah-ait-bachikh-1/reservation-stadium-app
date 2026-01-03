import React from 'react'

const DashboardPage = async () => {
    await new Promise(re=>setTimeout(re,5000))

  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage