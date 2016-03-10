import React from 'react';

import './Note.css';

const Note = React.createClass({
    render() {
        const style = { backgroundColor: this.props.color };

        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}> × </span>
                {
                    this.props.title
                    ?
                        <h4 className='note-title'>{this.props.title}</h4>
                    :
                        null
                }
                <div className='text'>{this.props.children}</div>
            </div>
        );
    }
});

export default Note;
