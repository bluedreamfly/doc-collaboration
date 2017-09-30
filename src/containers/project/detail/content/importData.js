import React, { Component } from 'react'
import { Input } from 'antd'

const { TextArea } = Input

export default class ImportData extends Component {
  render() {
    return (
      <div>
        <TextArea style={{height: 300}}/>
      </div>
    )
  }
}