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
import TreeList from './TreeList2'

class TreeListStateful extends Component {

    constructor(props) {
        super(props);

        this._initState();
    }

    componentWillReceiveProps(nextProps) {
        this._initState(nextProps);
    }

    _initState = (nextProps) => {
        if (this.state && nextProps) {
            const {expanded} = this.props;
            var expandedChanged = nextProps.expanded && ((nextProps.expanded.length != expanded.length) || nextProps.expanded.every(function(element, index) {
                    return element !== expanded[index];
                }));
            var selectedChanged = /*nextProps.selected &&*/ nextProps.selected !== this.props.selected

            var newState = {}
            if (expandedChanged)
                newState.expanded = this.state.expanded.concat(nextProps.expanded);
            if (selectedChanged)
                newState.selected = nextProps.selected
            if (expandedChanged || selectedChanged)
                this.setState(newState);
        } else if (!this.state) {
            this.state = {
                selected: this.props.selected || null,
                expanded: this.props.expanded || []
            }
        }
    }

    _expand = (leaf) => {
        const {onExpand} = this.props;
        const {expanded} = this.state;

        const newExpanded = expanded.indexOf(leaf._id) > -1 ? expanded.filter(i => i !== leaf._id) : expanded.concat(leaf._id)

        this.setState({
            expanded: newExpanded
        });

        if (onExpand) {
            onExpand(leaf);
        }
    };

    _select = (leaf) => {
        const {onSelect} = this.props;

        this.setState({
            selected: leaf._id
        });

        if (onSelect) {
            onSelect(leaf._id, leaf);
        } else {
            /*this.setState({
                selected: leaf._id
            });*/
        }
    };



    render() {
        return <TreeList {...this.props}
                   {...this.state}
                   onSelect={ this._select }
                   onExpand={ this._expand } />
    }
}

export default TreeListStateful;
