/*
 * Copyright (c) 2002-2020 "Neo4j,"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { Component } from 'react'
import { Button, Modal, Header } from 'semantic-ui-react'

export class LabelModalComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleClose = () => {
    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render() {
    return (
      <Modal onClose={() => this.handleClose()} open={this.props.open}>
        <Modal.Header>
          Information for label: <b>{this.props.label}</b>
        </Modal.Header>
        <Modal.Content image>
          <p>Description for label {this.props.label}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.handleClose()}>OK</Button>
        </Modal.Actions>
      </Modal>
    )
  }
}
