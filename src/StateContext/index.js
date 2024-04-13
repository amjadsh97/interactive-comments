import React, {createContext, useContext, useState} from 'react';
import data from "../data.json"

const StateContext = createContext();

export const useStateContext = () => useContext(StateContext);

export const StateProvider = ({children}) => {
	//const [comments, setComments] = useState(data.comments);

	const [comments, setComments] = useState(() => {
		// Retrieve data from local storage
		const storedComments = localStorage.getItem('comments');
		// Parse the data or use an empty array as fallback
		return storedComments ? JSON.parse(storedComments) : data.comments;
	});

	const [currentUser, setCurrentUser] = useState(data.currentUser)

	return (
		<StateContext.Provider value={{comments, setComments, currentUser}}>
			{children}
		</StateContext.Provider>
	);
};
