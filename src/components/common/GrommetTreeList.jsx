/*
 * Copyright 2017 European Union
 * Licensed under the EUPL, Version 1.2 or - as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 *
 * This work was supported by the EU Interoperability Solutions for
 * European Public Administrations Programme (https://ec.europa.eu/isa2)
 * through the ELISE action (European Location Interoperability Solutions 
 * for e-Government).
 */

import React, { Component } from 'react';

import { Box, Text } from 'grommet';
import { Next as NextIcon, Down as DownIcon, Blank as StatusIcon } from 'grommet-icons';

import { List, ListItem } from './List';
import TreeList from './TreeListStateful'

class GrommetTreeList extends Component {

    _select = (onSelect, index) => {
        const { tree } = this.props;

        onSelect(tree[index])
    }

    _expand = (onExpand, index) => {
        const { tree } = this.props;

        onExpand(tree[index])
    }

    _renderTree = (leafList, selected, expanded, onSelect, onExpand) => {
        const { tree } = this.props;

        //this._select(onSelect, 0);

        return <List selectable={true} style={{ boxShadow: 'none' }} selected={tree.findIndex(leaf => leaf._id === selected)} /*onSelect={ this._select.bind(this, onSelect) }*/>
            {leafList}
        </List>
    }

    _renderLeaf = (leaf, isFirst, isLast, isSelected, isExpanded, hasChildren, depth, onSelect, onExpand) => {

        return <ListItem key={leaf._id}
            hover={true}
            selected={isSelected}
            separator={isFirst ? 'horizontal' : 'bottom'}
            onClick={() => onSelect(leaf)}>
            <Box direction="row"
                justify="between"
                align="center"
                margin='none'
                fill="horizontal">
                <Box direction="row"
                    align="center"
                    gap='xsmall'
                    margin='none'
                    fill="horizontal">
                    {depth > 0 && Array(depth).fill(0).map((v, i) => <StatusIcon key={leaf._id + i} size="list" />)}
                    <Box title={leaf.iconTitle ? leaf.iconTitle : ''}>
                        {!leaf.expandable ?
                            (leaf.icon ? leaf.icon : <StatusIcon size="list" />)
                            :
                            isExpanded ?
                                <DownIcon size="list" onClick={() => onExpand(leaf)} />
                                :
                                <NextIcon size="list" onClick={() => onExpand(leaf)} />}
                    </Box>
                    <Box>
                        <Text size="list">{leaf.title}</Text>
                    </Box>
                    {leaf.badge && leaf.badge}
                </Box>
                {leaf.right && leaf.right}
            </Box>
        </ListItem>
    }

    render() {
        return <TreeList renderTree={this._renderTree}
            renderLeaf={this._renderLeaf}
            doRenderRoot={true}
            {...this.props} />
    }
}

GrommetTreeList.propTypes = {
};

GrommetTreeList.defaultProps = {
};

export default GrommetTreeList;
