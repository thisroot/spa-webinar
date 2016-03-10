import React from 'react';
import cx from 'classnames';

import './ColorPicker.css';

const COLORS = ['#FFFFFF', '#80D8FF', '#FFFF8D', '#FF8A80', '#CCFF90', '#CFD8DC', '#FFD180']

const ColorPicker = React.createClass({
    render() {
        return (
            <div className="color-picker">
                {
                    COLORS.map(color =>
                        <div
                            key={color}
                            className={cx('color-swatch', { selected: this.props.value === color })}
                            style={{ backgroundColor: color }}
                            onClick={this.props.onChange.bind(null, color)}
                        />
                    )
                }
            </div>
        );
    }
});

export default ColorPicker;
