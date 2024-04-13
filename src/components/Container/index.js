import React from 'react';
import "./style.css"

const Container = ({children}) => {
	return (
		<div className="comments-container">
			{children}
		</div>
	);
};

export default Container;
