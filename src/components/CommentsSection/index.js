import React, {useState} from 'react';
import Comment from "../Comment";
import "./style.css"
import data from "../../data.json"
import {useStateContext} from "../../StateContext";

const CommentsSection = () => {
	const {currentUser, comments} =  useStateContext();

	return (
		<div className='comment-wrapper'>
			{comments.map((comment) => (
				<Comment comment={comment} />
			))}
		</div>
	);
};

export default CommentsSection;
