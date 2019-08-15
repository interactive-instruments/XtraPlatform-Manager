import React from 'react';

import { Box } from 'grommet';
import { Blank } from 'grommet-icons';

import Spinning from './Spinning'
import StatusIcon from './StatusIcon'

export default props => props.loading ? <Spinning /> :
    props.success ? <Box animation={{ type: "fadeOut", duration: 2000 }}><StatusIcon value="ok" /></Box> : <Blank />
