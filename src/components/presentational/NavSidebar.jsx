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
import ui from 'redux-ui';

import { Box, Button, Text, Layer, Image, Form, FormField, ThemeContext, DropButton } from 'grommet';
import { Menu as MenuIcon, Close as CloseIcon, User } from 'grommet-icons';

import Header from '../common/Header';
import Anchor from '../common/AnchorLittleRouter';
import TextInputUi from '../common/TextInputUi';

@ui({
    state: {
        user: '',
        password: ''
    }
})

export default class NavSidebar extends Component {

    _login = () => {
        const { ui, onLogin } = this.props;
        onLogin(ui);
    }

    _renderMenu = () => {
        const { title, logo, routes, onClose, isLayer, onLogout, loginError, user, ui, updateUI } = this.props;
        console.log('USER', user)
        return (
            <Box fill="vertical" background="menu">
                <Header pad={{ right: 'small' }}>
                    <Box pad={{ left: 'medium' }}>
                        {logo
                            ? <Image fit="contain" alignSelf="start" src={logo} />
                            : <Text size='large' weight={500}>{title}</Text>}
                        {/*<Button icon={<MenuIcon color="light-6" />}
                        onClick={onClose}
                        plain={true}
                        label={<Text size='large' weight='500'>{title}</Text>}
        a11yTitle="Close Menu" />*/}
                    </Box>
                    {isLayer && <Button icon={<CloseIcon size="medium" />}
                        onClick={onClose}
                        plain={true}
                        a11yTitle="Close Menu" />}
                </Header>
                {user
                    ? <Box justify="around" fill="vertical">
                        <Box flex='grow' justify='start'>
                            {routes
                                .filter(route => !route.roles || route.roles.some(role => role === user.role))
                                .map((route) => (
                                    route.menu && <Anchor key={route.path} path={route.path} pad={{ left: 'medium', right: 'xlarge', vertical: 'small' }} onClick={onClose} label={route.title} menu />
                                ))}
                        </Box>
                        <Box pad={{ vertical: 'medium', horizontal: 'small' }}>
                            <DropButton icon={<User color="light-1" />}
                                dropAlign={{ bottom: 'top', left: 'left' }}
                                dropContent={<Box pad="small" gap="small">
                                    <Box border={{ side: 'bottom', size: 'small' }} pad={{ bottom: 'small' }} align="center" flex={false}>
                                        <Text weight="bold">{user.sub}</Text>
                                    </Box>
                                    <Box flex={false}>
                                        <Button onClick={onLogout} plain={true} fill="horizontal" hoverIndicator={true}><Box pad={{ vertical: "xsmall" }} align="center">Logout</Box></Button>
                                    </Box>
                                </Box>}></DropButton>
                        </Box>
                    </Box>
                    : <ThemeContext.Extend
                        value={{
                            formField: {
                                border: {
                                    position: 'outer',
                                    side: 'bottom',
                                    size: 'small',
                                    color: 'dark-1'
                                },
                                extend: {
                                    background: 'light-6'
                                }
                            }
                        }}
                    >
                        <Box flex='grow' justify='start' pad="medium">
                            <Form onSubmit={this._login}>
                                <FormField label="User" background="light-4">
                                    <TextInputUi name="user"
                                        autoFocus={true}
                                        value={ui.user}
                                        onChange={updateUI} />
                                </FormField>
                                <FormField label="Password" error={loginError}>
                                    <TextInputUi name="password"
                                        type="password"
                                        value={ui.password}
                                        onChange={updateUI} />
                                </FormField>
                                <Box pad={{ vertical: 'medium' }}>
                                    <Button primary label="Login" type="submit" />
                                </Box>
                            </Form>
                        </Box>
                    </ThemeContext.Extend>
                }
            </Box>
        );
    }

    render() {
        const { title, routes, onClose, isLayer, isActive } = this.props;

        if (isLayer) {
            return isActive
                ? <Layer
                    full="vertical"
                    position="left"
                    plain={false}
                    animate={true}
                    onClickOutside={onClose}
                    onEsc={onClose}
                >
                    {this._renderMenu()}
                </Layer>
                : null;
        }

        return (
            <Box fill="vertical" basis="1/4">
                {this._renderMenu()}
            </Box>
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
