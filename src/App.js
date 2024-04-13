import React, {useEffect, useState} from 'react';
import "./styles/reset.css"
import "./styles/App.css"
import Container from "./components/Container";
import CommentsSection from "./components/CommentsSection";

const App = () => {

	return (
		<div className="app">
			<Container>
				<CommentsSection/>
			</Container>
		</div>
	);
};

export default App;
