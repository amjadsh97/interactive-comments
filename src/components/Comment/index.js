import React, {useEffect, useState} from 'react';
import {iconMinus, iconPlus, iconReply} from "../../images";
import "./style.css";
import ViewComment from "../ViewComment";
import {useStateContext} from "../../StateContext";

const Comment = ({comment}) => {
	const [showReply, setShowReply] = useState(false);
	const [newReply, setNewReply] = useState("");
	const {currentUser, comments, setComments} = useStateContext();
	const isCurrentUser = currentUser && currentUser.username === comment.username;
	const [scoredItems, setScoredItems] = useState([]);

	const handleReply = () => {
		setShowReply(prev => !prev);
	};

	const handleAddReply = (id, newReplyContent) => {
		const updatedComments = comments.map(c => {
			if (c.id === id) {
				return {
					...c,
					replies: [
						...c.replies,
						{
							id: Math.floor(Math.random() * 1000), // Increase the range for unique IDs
							content: newReplyContent,
							createdAt: new Date().toLocaleString(),
							score: 0,
							replyingTo: currentUser.username,
							user: currentUser
						}
					]
				};
			}
			return c;
		});

		setComments(updatedComments);
		setNewReply("");
		setShowReply(false); // Close the reply form after adding a new reply
	};

	const handleEditReply = (commentId, replyId, newContent) => {
		const updatedComments = comments.map(c => {
			if (c.id === commentId) {
				return {
					...c,
					replies: c.replies.map(reply => {
						if (reply.id === replyId) {
							return {
								...reply,
								content: newContent
							};
						}
						return reply;
					})
				};
			}
			return c;
		});
		setComments(updatedComments);
	};
	const handleChangeScore = (action, item) => {
		if (!scoredItems.includes(item.id)) {
			setScoredItems([...scoredItems, item.id]);
			const updatedComments = comments.map(c => {
				if (c.id === item.id && item.user?.username !== currentUser.username) {
					return {
						...c,
						score: action === "+" ? c.score + 1 : c.score - 1
					};
				} else if (c.replies) {
					const updatedReplies = c.replies.map(reply => {
						if (reply.id === item.id && item.user?.username !== currentUser.username) {
							return {
								...reply,
								score: action === "+" ? reply.score + 1 : reply.score - 1
							};
						}
						return reply;
					});

					return {
						...c,
						replies: updatedReplies
					};
				}
				return c;
			});

			setComments(updatedComments);
		}
	};

	const handleRemoveReply = (replyIdToRemove) => {
		const updatedComments = comments.map(comment => {
			if (comment.replies && comment.replies.length > 0) {
				const updatedReplies = comment.replies.filter(reply => reply.id !== replyIdToRemove);
				return {
					...comment,
					replies: updatedReplies
				};
			}
			return comment;
		});

// Update the state with the updated comments
		setComments(updatedComments);
	};

	useEffect(() => {
		localStorage.setItem("comments", JSON.stringify(comments))
	}, [comments])


	return (
		<div className={`comment-inner ${comment.replies.length > 0 ? "with-reply" : ""}  ${showReply ? "show-reply-form" : ""}`}>
			<ViewComment comment={comment} handleReply={handleReply} handleChangeScore={handleChangeScore}/>
			{comment.replies.map(reply => (
				<ViewComment
					key={reply.id}
					comment={reply}
					isReply={true}
					handleEditReply={handleEditReply}
					handleRemoveReply={handleRemoveReply}
					handleChangeScore={handleChangeScore}
					currentUser={currentUser}
				/>
			))}
			{showReply && (
				<div className={`reply-form`}>
					<div className="user-avatar">
						<img src={require(`../../${currentUser.image.png}`)} alt="image user"/>
					</div>
					<textarea
						name="reply"
						id="reply"
						value={newReply}
						onChange={e => setNewReply(e.target.value)}
					/>
					<button onClick={() => handleAddReply(comment.id, newReply)} className='send-button'>REPLY</button>
				</div>
			)}
		</div>
	);
};

export default Comment;
