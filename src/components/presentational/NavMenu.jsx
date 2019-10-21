import React from 'react';
import PropTypes from 'prop-types';

import { Box } from 'grommet';
import Anchor from '../common/AnchorLittleRouter';


const NavMenu = ({ routes, role, onClose }) => {

    return (
        <Box flex='grow' justify='start'>
            {routes
                .filter(route => !route.roles || route.roles.some(allowedRole => allowedRole === role))
                .map((route) => (
                    route.menu && <Anchor key={route.path} path={route.path} pad={{ left: 'medium', right: 'xlarge', vertical: 'small' }} onClick={onClose} label={route.title} menu />
                ))}
        </Box>
    );
}

NavMenu.displayName = 'NavMenu';

export default NavMenu
