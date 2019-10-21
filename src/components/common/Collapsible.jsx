import React, { createRef, Component } from 'react';
import { compose } from 'recompose';
import styled, { withTheme } from 'styled-components';

import { Box } from 'grommet';

const animatedBoxProperty = direction =>
    direction === 'horizontal' ? 'width' : 'height';

const AnimatedBox = styled(Box)`
  ${props =>
        !props.animate &&
        (props.open
            ? `
    max-${animatedBoxProperty(props.collapsibleDirection)}: unset;
    visibility: visible;
  `
            : `
    max-${animatedBoxProperty(props.collapsibleDirection)}: 0;
    visibility: hidden;
    overflow: hidden;
  `)}
  ${props => props.theme.collapsible && props.theme.collapsible.extend}
`;

class Collapsible extends Component {
    ref = createRef();

    static getDerivedStateFromProps(nextProps, prevState) {
        const { open } = nextProps;
        if (open !== prevState.open) {
            return {
                animate: true,
                open,
            };
        }
        return null;
    }

    constructor(props, bundleContext) {
        super(props, bundleContext);

        /* eslint-disable-next-line react/prop-types */
        this.state = { open: props.open, animate: false };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('COLLT', this.props.theme, prevProps.theme)
        }
        const {
            /* eslint-disable-next-line react/prop-types */
            direction,
            theme: {
                collapsible: { minSpeed, baseline },
            },
        } = this.props;
        const { animate, open } = this.state;

        const container = this.ref.current;
        if (container) {
            const dimension = animatedBoxProperty(direction);
            const boudingClientRect = container.getBoundingClientRect();
            const dimensionSize = boudingClientRect[dimension];

            let shouldAnimate = animate && prevState.open !== open;

            if (
                open &&
                snapshot[dimension] &&
                dimensionSize !== snapshot[dimension]
            ) {
                shouldAnimate = true;
            }

            if (shouldAnimate) {
                if (this.animationTimeout) {
                    clearTimeout(this.animationTimeout);
                }

                const speed = Math.max((dimensionSize / baseline) * minSpeed, minSpeed);

                container.style[`max-${dimension}`] = `${snapshot[dimension]}px`;
                container.style.overflow = 'hidden';

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        container.style.transition = `max-${dimension} ${speed}ms, visibility 50ms`;
                        container.style[`max-${dimension}`] = open
                            ? `${dimensionSize}px`
                            : '0px';

                        this.animationTimeout = setTimeout(() => {
                            container.removeAttribute('style');
                            this.setState({
                                animate: false,
                            });
                        }, speed);
                    });
                });
            }
        }
    }

    componentWillUnmount() {
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }
    }

    getSnapshotBeforeUpdate = () =>
        this.ref.current && this.ref.current.getBoundingClientRect();

    render() {
        /* eslint-disable-next-line react/prop-types */
        const { children, direction, ...rest } = this.props;
        const { animate, open } = this.state;

        return (
            <AnimatedBox
                {...rest}
                aria-hidden={!open}
                ref={this.ref}
                open={open}
                animate={animate}
                collapsibleDirection={direction}
            >
                {children}
            </AnimatedBox>
        );
    }
}

const CollapsibleWrapper = compose(withTheme)(Collapsible);

export default CollapsibleWrapper;
