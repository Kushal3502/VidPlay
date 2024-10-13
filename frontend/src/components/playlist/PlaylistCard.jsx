import React from 'react'
import { Link } from 'react-router-dom'

function PlaylistCard({ playlist }) {
  return (
    <div className="border border-zinc-800 hover:bg-zinc-800 rounded-lg p-2 h-full">
      <Link to={`/playlist/${playlist._id}`}>
        <div>
          <p>{ playlist.name}</p>
       </div>
      </Link>
    </div>
  )
}

export default PlaylistCard