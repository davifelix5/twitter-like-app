import React from 'react'

export default function Loader({ className }) {
  return (
    <div className={`spinner-border ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  )
}