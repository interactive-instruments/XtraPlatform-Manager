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

import React, { Component, PropTypes } from 'react';

import Box from 'grommet/components/Box';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import AddIcon from 'grommet/components/icons/base/Add';
import MinusIcon from 'grommet/components/icons/base/Subtract';
import NextIcon from 'grommet/components/icons/base/Next';
import DownIcon from 'grommet/components/icons/base/Down';
import StopIcon from 'grommet/components/icons/base/Stop';
import StatusIcon from 'grommet/components/icons/Status';

import TreeList from './TreeListStateful'

class GrommetTreeList extends Component {

    _select = (onSelect, index) => {
        const {tree} = this.props;

        onSelect(tree[index])
    }

    _expand = (onExpand, index) => {
        const {tree} = this.props;

        onExpand(tree[index])
    }

    _renderTree = (leafList, selected, expanded, onSelect, onExpand) => {
        const {tree} = this.props;

        //this._select(onSelect, 0);

        return <List selectable={ true } style={ { boxShadow: 'none' } } selected={ tree.findIndex(leaf => leaf._id === selected) } /*onSelect={ this._select.bind(this, onSelect) }*/>
               { leafList }
               </List>
    }

    _renderLeaf = (leaf, isFirst, isLast, isSelected, isExpanded, hasChildren, depth, onSelect, onExpand) => {

        return <ListItem key={ leaf._id }
                   focusable={ false }
                   separator={ isFirst ? 'horizontal' : 'bottom' }
                   onClick={ () => onSelect(leaf) }>
                   <Box direction="row"
                       justify="between"
                       margin='none'
                       full={ { horizontal: true } }>
                       <Box direction="row"
                           pad={ { between: 'small' } }
                           margin='none'
                           full={ { horizontal: true } }>
                           { depth > 0 && Array(depth).fill(0).map((v, i) => <StatusIcon key={ i }
                                                                                 type="status"
                                                                                 value="blank"
                                                                                 size="small" />) }
                           <Box style={ { display: 'inline' } } title={ leaf.iconTitle ? leaf.iconTitle : '' }>
                               { !leaf.expandable ?
                                 (leaf.icon ? leaf.icon : <StatusIcon type="status" value="blank" size="small" />)
                                 :
                                 isExpanded ?
                                 <DownIcon size="xsmall" onClick={ () => onExpand(leaf) } />
                                 :
                                 <NextIcon size="xsmall" onClick={ () => onExpand(leaf) } /> }
                           </Box>
                           <span className="message">{ leaf.title }</span>
                       </Box>
                       { leaf.right && leaf.right }
                   </Box>
               </ListItem>
    }

    render() {
        return <TreeList renderTree={ this._renderTree }
                   renderLeaf={ this._renderLeaf }
                   doRenderRoot={ true }
                   {...this.props}/>
    }
}

GrommetTreeList.propTypes = {
};

GrommetTreeList.defaultProps = {
};

export default GrommetTreeList;
