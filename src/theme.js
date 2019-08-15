import { grommet } from "grommet/themes";
import { deepMerge } from "grommet/utils";
import { css } from 'styled-components';

export const customTheme = deepMerge(grommet, {
    global: {
        colors: {
            active: "rgba(0,0,0,0.15)",
            menu: "neutral-3",
            content: "white"
        },
        edgeSize: {
            xxlarge: '192px'
        }
    },
    anchor: {
        color: {
            dark: 'light-1',
            light: 'dark-1'
        },
        hover: {
            textDecoration: 'none',
            extend: css`
            ${props => `color: ${props.theme.global.colors.brand};`}
            & > svg {
                ${props => `stroke: ${props.theme.global.colors.brand};`}
            }
        `
        }
    },
    text: {
        large: {
            size: '24px'
        },
        list: {
            size: '16px'
        }
    },
    icon: {
        size: {
            list: '16px',
        }
    },
    formField: {
        border: {
            position: 'outer',
            side: 'bottom',
            size: 'small',
            color: 'light-4'
        },
        extend: {
            background: 'white'
        }
    },
    tab: {
        color: "text",
        active: {
            color: "control"
        },
        hover: {
            color: "control"
        },
        border: {
            color: "text",
            active: {
                color: "control"
            },
            hover: {
                color: "control"
            }
        }
    }

});
