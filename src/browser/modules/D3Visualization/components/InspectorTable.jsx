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
import { deepEquals } from 'services/utils'
import { StyledLabelToken, StyledPropertyPanelHolder } from './styled'
import Relatable from '@relate-by-ui/relatable'
import Toolbar from '@relate-by-ui/relatable/dist/components/toolbar/toolbar'
import Table from '@relate-by-ui/relatable/dist/components/table'
import { Button, Dropdown } from 'semantic-ui-react'
import { CancelIcon } from 'browser-components/icons/Icons'
import styled from 'styled-components'
import { StyledPropertyPanelKeyCell, StyledPropertyPanelTable } from './styled'

const IconButton = styled.button`
  margin-left: 4px;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
`

const mapLabels = (graphStyle, itemLabels) => {
  return itemLabels.map((label, i) => {
    const graphStyleForLabel = graphStyle.forNode({ labels: [label] })
    const style = {
      backgroundColor: graphStyleForLabel.get('color'),
      color: graphStyleForLabel.get('text-color-internal')
    }
    return (
      <StyledLabelToken
        key={'label' + i}
        style={style}
        className={'token' + ' ' + 'token-label'}
      >
        {label}
      </StyledLabelToken>
    )
  })
}

const renderLabel = label => ({
  color: 'blue',
  content: `${label.text}`,
  icon: 'check'
})

export class InspectorTableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contracted: true,
      selectedKeyFilter: []
    }
  }

  handleSelectedKeyFilterChange = value => {
    this.setState({ selectedKeyFilter: value })
  }

  filterItem = (item, keys) => {
    if (
      !this.state.selectedKeyFilter ||
      this.state.selectedKeyFilter.length == 0
    ) {
      return true
    }

    const applyableKeyFilter = this.state.selectedKeyFilter.filter(
      keyFilter => !!keys.find(key => key == keyFilter)
    )

    //console.log("Applyable",applyableKeyFilter);

    return !!applyableKeyFilter.find(keyFilter => item.key == keyFilter)
  }

  render() {
    let item
    let type
    let inspectorContent

    if (this.props.hoveredItem && this.props.hoveredItem.type !== 'canvas') {
      item = this.props.hoveredItem.item
      type = this.props.hoveredItem.type
    } else if (this.props.selectedItem) {
      item = this.props.selectedItem.item
      type = this.props.selectedItem.type
    } else if (this.props.hoveredItem) {
      // Canvas
      item = this.props.hoveredItem.item
      type = this.props.hoveredItem.type
    }

    let DATA = []
    let FILTERED_DATA = []
    let COLUMNS = [{ Header: 'Key' }, { Header: 'Value' }]
    let options = []

    if (item && type) {
      if (type === 'node' || type == 'relationship') {
        console.log('GraphStyle', this.props.graphStyle)
        /*inspectorContent = (
            <StyledInlineTable>
              {mapItemProperties(item.properties)}
            </StyledInlineTable>*/

        DATA = item.properties
          .sort(({ key: keyA }, { key: keyB }) =>
            keyA < keyB ? -1 : keyA === keyB ? 0 : 1
          )
          .map((prop, i) => ({
            key: prop.key,
            value: prop.value
          }))

        DATA.splice(0, 0, { key: '<id>', value: item.id })

        let optionKey = 1
        options = DATA.map(obj => ({
          key: optionKey++,
          text: obj.key,
          value: obj.key
        }))

        const keys = DATA.map(obj => obj.key)

        FILTERED_DATA = DATA.filter(item => this.filterItem(item, keys))

        COLUMNS = [
          {
            Header: 'Keys (' + FILTERED_DATA.length + '/' + DATA.length + ')',
            accessor: 'key',
            Cell: ({ cell }) => {
              return (
                <StyledPropertyPanelKeyCell>
                  {cell.value}
                </StyledPropertyPanelKeyCell>
              )
            }
          },
          {
            Header: 'Value',
            accessor: 'value',
            Cell: ({ cell }) => {
              if (!isNaN(cell.value) && cell.value.length == 13) {
                return <span>{new Date(cell.value * 1).toISOString()}</span>
              }

              return <span>{cell.value}</span>
            }
          }
        ]
      }
    }

    return (
      <StyledPropertyPanelHolder>
        <StyledPropertyPanelTable>
          <Relatable class columns={COLUMNS} data={FILTERED_DATA}>
            <Toolbar>
              <Dropdown
                onChange={(e, d) => this.handleSelectedKeyFilterChange(d.value)}
                multiple
                selection
                fluid
                options={options}
                placeholder="Filter keys..."
                renderLabel={renderLabel}
                value={this.state.selectedKeyFilter}
              ></Dropdown>

              <Button onClick={() => this.setState({ selectedKeyFilter: [] })}>
                <CancelIcon />
              </Button>
            </Toolbar>
            <Table />
          </Relatable>
        </StyledPropertyPanelTable>
      </StyledPropertyPanelHolder>
    )
  }

  componentDidUpdate(prevProps) {
    if (!deepEquals(this.props.selectedItem, prevProps.selectedItem)) {
      this.setState({ contracted: true })
      this.props.onExpandToggled && this.props.onExpandToggled(true, 0)
    }
  }
}
