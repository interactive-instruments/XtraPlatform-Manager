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
import PropTypes from 'prop-types';

class TreeList extends Component {

    _renderLeafs = (leaf, depth = -1, leafList = []) => {
        const {tree, renderLeaf, expanded, selected, onSelect, onExpand, doRenderRoot} = this.props;

        if (depth === -1 && doRenderRoot)
            depth = 0

        if (leaf) {
            let children = tree.filter(child => child.parent === leaf._id)

            if (leaf.parent || doRenderRoot) {
                const isFirst = leafList.length === 0;
                const isLast = leafList.length === tree.length - 2;
                const isSelected = leaf._id === selected;
                const isExpanded = expanded.indexOf(leaf._id) > -1;
                const hasChildren = children && children.length > 0;

                leafList.push(renderLeaf(leaf, isFirst, isLast, isSelected, isExpanded, hasChildren, depth, onSelect, onExpand))
            }

            if (expanded.indexOf(leaf._id) > -1) {
                children.forEach(child => this._renderLeafs(child, depth + 1, leafList))
            }
        }

        return leafList
    }



    render() {
        const {tree, parent, renderTree, expanded, selected, onSelect, onExpand} = this.props;

        const treeRoot = tree && tree.length ? tree.filter(leaf => leaf.parent === parent) : null;
        let leafList = [];

        if (treeRoot) {
            treeRoot.forEach(leaf => {
                leafList = leafList.concat(this._renderLeafs(leaf));
            })
        }

        return renderTree(leafList, selected, expanded, onSelect, onExpand)
    }
}

TreeList.propTypes = {
    tree: PropTypes.array,
    onSelect: PropTypes.func,
    onExpand: PropTypes.func,
    selected: PropTypes.string,
    expanded: PropTypes.array,
    renderTree: PropTypes.func.isRequired,
    renderLeaf: PropTypes.func.isRequired,
    doRenderRoot: PropTypes.bool,
    parent: PropTypes.string
};

TreeList.defaultProps = {
    onSelect: () => {
    },
    onExpand: () => {
    },
    parent: null
};

export default TreeList;
