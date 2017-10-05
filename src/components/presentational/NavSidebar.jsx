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

import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import Sidebar from 'grommet/components/Sidebar';
import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';
import User from 'grommet/components/icons/base/User';
import MenuIcon from 'grommet/components/icons/base/Menu';
import CloseIcon from 'grommet/components/icons/base/Close';

//import Logo from './Logo2'
import Anchor from '../common/AnchorLittleRouter';


export default class NavSidebar extends Component {
    render() {
        const {title, routes, onClose} = this.props;

        return (
            <Sidebar colorIndex='neutral-1' full={ true }>
                <Header pad='medium' justify='between'>
                    <Title onClick={ onClose } a11yTitle="Close Menu">
                        <MenuIcon />
                        { /*<Logo colorIndex='light-1' size="small" />*/ }
                        <span>{ title }</span>
                    </Title>
                    <Button icon={ <CloseIcon /> }
                        onClick={ onClose }
                        plain={ true }
                        a11yTitle="Close Menu" />
                </Header>
                <Box flex='grow' justify='start'>
                    <Menu fill={ true } primary={ true }>
                        { routes.map((route) => (
                              route.menu && <Anchor key={ route.path } path={ route.path } label={ route.title } />
                          )) }
                    </Menu>
                </Box>
                { /*<Footer pad='medium'>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    <Button icon={ <User /> } />
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                </Footer>*/ }
            </Sidebar>
        );
    }
}

NavSidebar.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string,
        title: PropTypes.string
    })),
    onClose: PropTypes.func,
    title: PropTypes.string
}
