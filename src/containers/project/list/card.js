import React from 'react'

const Card = ({data}) => {
  return <div className="card">
    <h3>{data.name}</h3>
    <h3>{data.memberNum}</h3>
  </div>
}
export default Card;