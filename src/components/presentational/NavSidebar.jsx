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

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Box, Button, Text, Layer, Image } from 'grommet';
import { Close as CloseIcon } from 'grommet-icons';

import Header from '../common/Header';
import NavLogin from './NavLogin';
import NavMenu from './NavMenu';
import NavUser from './NavUser';
import NavChangePassword from './NavChangePassword';


const NavSidebar = ({ title, logo, routes, onClose, isLayer, isActive, loginError, loginExpired, user, secured, onLogin, onLogout, onChangePassword }) => {

    const [isChangePassword, setChangePassword] = useState(false);

    const renderMenu = () => {

        if (process.env.NODE_ENV !== 'production') {
            console.log('USER', user)
        }

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
                {(!secured && !user)
                    ? <></>
                    : (user
                        ? user.changePassword || isChangePassword
                            ? <NavChangePassword name={user.sub} onCancel={() => setChangePassword(false)} onChange={onChangePassword} />
                            : <Box justify="around" fill="vertical">
                                <NavMenu routes={routes} role={user.role} onClose={onClose} />
                                <NavUser name={user.sub} onChangePassword={secured && (() => setChangePassword(true))} onLogout={secured && onLogout} />
                            </Box>
                        : <NavLogin loginError={loginError} loginExpired={loginExpired} onLogin={onLogin} />)
                }
            </Box>
        );
    }



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
                {renderMenu()}
            </Layer>
            : null;
    }

    return (
        <Box fill="vertical" basis="1/4">
            {renderMenu()}
        </Box>
    );
}

NavSidebar.displayName = 'NavSidebar';

NavSidebar.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({
        path: PropTypes.string,
        title: PropTypes.string
    })),
    onClose: PropTypes.func,
    title: PropTypes.string
}

export default NavSidebar
