import React from 'react';

import { Box, Meter, Text } from 'grommet';

export default ({ progress, message }) => <Box>
    <Meter type='bar'
        margin={{ vertical: 'small' }}
        thickness='small'
        values={[{
            value: progress,
            color: 'brand'
        }]} />
    <Text size="small">{message}</Text>
</Box>
