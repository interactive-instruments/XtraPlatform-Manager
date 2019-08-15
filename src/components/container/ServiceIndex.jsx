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
import { connect } from 'react-redux'
import { push } from 'redux-little-router'

import { Box, Text, Button, DropButton, Menu, Anchor as Anchor2, ResponsiveContext } from 'grommet';
import { Add as AddIcon, Menu as MenuIcon, More as MoreIcon, Multiple, Blank } from 'grommet-icons';

import ServiceTile from '../presentational/ServiceTile';
import NotificationWithCollapsibleDetails from '../common/NotificationWithCollapsibleDetails';
import Anchor from '../common/AnchorLittleRouter';
import Tiles from '../common/Tiles'
import Header from '../common/Header'
import LoadSaveIndicator from '../common/LoadSaveIndicator'


import { actions as srvcActions } from '../../reducers/service'
import { actions, getNavActive } from '../../reducers/app'
import { app } from '../../module.js'


@connect(
    (state, props) => {
        return {
            navActive: getNavActive(state),
            messages: state.service.messages
        }
    },
    {
        ...actions,
        ...srvcActions,
        push
    }
)

class ServiceIndex extends Component {

    constructor() {
        super();
        this._onSearch = this._onSearch.bind(this);
        this._onMore = this._onMore.bind(this);
        this._onFilterActivate = this._onFilterActivate.bind(this);
        this._onFilterDeactivate = this._onFilterDeactivate.bind(this);
        this.state = {
            searchText: ''
        };
    }

    componentDidMount() {
        /*this.props.dispatch(loadIndex({
            category: 'virtual-machines',
            sort: 'modified:desc'
        }));*/
        console.log('loading services ...');
    }

    componentWillUnmount() {
        //this.props.dispatch(unloadIndex());
        console.log('unloading services ...');
    }

    _onSearch(event) {
        const { index } = this.props;
        const searchText = event.target.value;
        this.setState({
            searchText
        });
        /*const query = new Query(searchText);
        this.props.dispatch(queryIndex(index, query));*/
        console.log(searchText);
    }

    _onMore() {
        const { index } = this.props;
        //this.props.dispatch(moreIndex(index));
        console.log('getting more services ...');
    }

    _onFilterActivate() {
        this.setState({
            filterActive: true
        });
    }

    _onFilterDeactivate() {
        this.setState({
            filterActive: false
        });
    }

    _renderSection(label, items = [], onMore, compact, small, serviceId) {
        const { messages, clearMessage, push } = this.props;
        console.log('-----');
        const tiles = Object.keys(items).sort(function (a, b) {
            return items[a].createdAt < items[b].createdAt ? 1 : -1
        }).map(key => {
            console.log(key); return key;
        }).map((key, index) => (
            <ServiceTile key={key} selected={key === serviceId} compact={compact} small={small} changeLocation={push} {...items[key]} />
        ));

        let header;
        if (label) {
            header = (
                <Box size='small'
                    justify='start'
                    responsive={false}
                    separator='top'
                    pad={{ horizontal: 'small' }}>
                    <Text size='small'>
                        {label}
                    </Text>
                </Box>
            );
        }
        return (
            <Box as="section" key={label || 'section'} pad='none' background="content" flex={false}>
                {header}
                {Object.values(messages).map(msg => <NotificationWithCollapsibleDetails key={msg.id}
                    size="medium"
                    pad="medium"
                    margin={{ bottom: 'small' }}
                    status={msg.status}
                    message={msg.text}
                    details={msg.details}
                    closer={true}
                    onClose={() => clearMessage(msg.id)} />)}
                <Tiles compact={compact || small}>
                    {tiles}
                </Tiles>
            </Box>
        );
    }

    /*_renderSections(sortProperty, sortDirection) {
        const {index} = this.props;
        const result = index.result || {
            items: []
        };
        const items = (result.items || []).slice(0);
        let sections = [];

        SECTIONS[sortProperty].forEach((section) => {

            let sectionValue = section.value;
            if (sectionValue instanceof Date) {
                sectionValue = sectionValue.getTime();
            }
            let sectionItems = [];

            while (items.length > 0) {
                const item = items[0];
                let itemValue = (item.hasOwnProperty(sortProperty) ?
                    item[sortProperty] : item.attributes[sortProperty]);
                if (itemValue instanceof Date) {
                    itemValue = itemValue.getTime();
                }

                if (undefined === sectionValue ||
                        ('asc' === sortDirection && itemValue <= sectionValue) ||
                        ('desc' === sortDirection && itemValue >= sectionValue)) {
                    // item is in section
                    sectionItems.push(items.shift());
                } else {
                    // done
                    break;
                }
            }

            if (sectionItems.length > 0) {
                sections.push(this._renderSection(section.label, sectionItems));
            }
        });

        return sections;
    }*/

    render() {
        const { index, role, services, serviceTypes, serviceId, typeLabels, serviceMenu, navActive, navToggle, compact, reloadPending, queryPending, queryFinished } = this.props;
        const { filterActive, searchText } = this.state;
        const result = /*index.result ||*/ {
            items: services
        };

        let addControl;
        if (!compact && 'read only' !== role) {
            if (serviceTypes && serviceTypes.length === 1)
                addControl = (
                    <Anchor icon={<AddIcon />} pad='none' path={{ pathname: '/services/add', query: { type: serviceTypes[0] } }} title={`Add dataset`} />
                );
            if (serviceTypes && serviceTypes.length > 1)
                addControl = (
                    <Menu inline={false} icon={<AddIcon />} title={`Add service`}>
                        {serviceTypes.map(type => <Anchor key={type}
                            label={typeLabels && typeLabels[type] || type}
                            path={{ pathname: '/services/add', query: { type: type } }}
                            title={`Add ${type} service`} />)}
                    </Menu>
                );
        }

        let menuControl
        if (!compact && serviceMenu && serviceMenu.length) {
            menuControl = (<DropButton title={`More actions`} icon={<MoreIcon />}
                dropAlign={{ top: 'bottom', left: 'left' }}
                dropContent={<Box pad="small" gap="small">{serviceMenu.map(entry => <Anchor key={entry.label}
                    label={entry.label}
                    path={entry.path}
                    title={entry.description}
                />)}</Box>}></DropButton>
                /*<Menu icon={<MoreIcon title={`More actions`} />} >
                    {() => serviceMenu.map(entry => <Anchor key={entry.label}
                        label={entry.label}
                        path={entry.path}
                        title={entry.description} />)}
                </Menu>*/
                /* <Menu icon={<MoreIcon title={`More actions`} items={serviceMenu.map(entry => ({
                    label: entry.label,
                    path: entry.path,
                    title: entry.description }))} /> */
            );
        }

        let sections;
        /*let sortProperty,
            sortDirection;
        if (index.sort) {
            [sortProperty, sortDirection] = index.sort.split(':');
        }
        if (sortProperty && SECTIONS[sortProperty]) {
            sections = this._renderSections(sortProperty, sortDirection);
        } else {*/
        let onMore;
        if (result.count > 0 && result.count < result.total) {
            onMore = this._onMore;
        }
        //sections = this._renderSection(undefined, result.items, onMore, compact, serviceId);
        //}

        let navControl;
        let label = <Text size='large' weight={500}>Services</Text>;
        let icon;
        if (compact) {
            navControl = <Anchor onClick={navToggle.bind(null, true)} icon={<MenuIcon />} />;
            label = <Anchor path={{ pathname: '/services' }} label={label} />
            icon = <LoadSaveIndicator loading={reloadPending || queryPending} success={queryFinished} />
        } else {
            navControl = <Multiple />
        }

        return (
            <ResponsiveContext.Consumer>
                {(size) => (
                    <Box fill='vertical' basis={compact ? '1/3' : 'full'} border={compact && { side: 'right', size: 'small', color: 'light-4' }}>
                        <Header justify='start' border={{ side: 'bottom', size: 'small', color: 'light-4' }}>
                            <Box direction="row" align='center' justify="between" fill="horizontal">
                                <Box direction="row" gap="small" align='center'>
                                    {navControl}
                                    {label}
                                    {addControl}
                                </Box>
                                {icon}
                            </Box>
                            { /*<Search inline={ true }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        fill={ true }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        size='medium'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        placeHolder='Search'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        value={ searchText }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        onDOMChange={ this._onSearch } />*/ }

                            {/*menuControl*/}
                            { /*<FilterControl filteredTotal={ result.total } unfilteredTotal={ result.unfilteredTotal } onClick={ this._onFilterActivate } />*/}
                        </Header>
                        <Box fill='vertical' overflow={{ vertical: 'auto' }}>
                            {this._renderSection(undefined, result.items, onMore, compact, size === 'small', serviceId)}
                        </Box>
                        { /*<ListPlaceholder filteredTotal={ result.total }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    unfilteredTotal={ result.unfilteredTotal }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    emptyMessage='You do not have any virtual machines at the moment.'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    addControl={ <Button icon={ <AddIcon /> }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     label='Add virtual machine'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     path='/virtual-machines/add'
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     primary={ true }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     a11yTitle={ `Add virtual machine` } /> } />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                { filterLayer }*/ }
                    </Box >
                )}
            </ResponsiveContext.Consumer>
        );
    }



}
;

export default ServiceIndex;
