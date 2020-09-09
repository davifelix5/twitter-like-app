import React from 'react'

export default function TweetsList({ className, children }) {

  return (
    <div className="container">
      <>
        <ul style={{ listStyle: 'none', paddingRight: 40, paddingLeft: 40 }}>
          {children.length > 0 ? children.map(child => (
            <li className={className || "col-12 col-md-10 mx-auto border rounded py-3 mb-4"} key={child.key}>
              {child}
            </li>
          )) : children
          }
        </ul>
      </>
    </div>
  )
}