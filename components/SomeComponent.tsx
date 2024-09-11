import React from 'react'

const SomeComponent = React.memo(function SomeComponent() {
  return (
    <div>
      {/* Your component JSX here */}
      <p>This is a memoized component</p>
    </div>
  )
})

export default SomeComponent