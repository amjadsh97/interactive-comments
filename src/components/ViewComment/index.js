import React, {useEffect, useState} from 'react';
import {iconMinus, iconPlus, iconReply, iconDelete, iconEdit} from "../../images";

const ViewComment = ({
	                     handleChangeScore,
	                     currentUser,
	                     comment,
	                     isReply = false,
	                     handleReply,
	                     handleEditReply,
	                     handleRemoveReply
                     }) => {
	const {id, content, createdAt, score, user, replies} = comment;
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(content);
	const [formattedDate, setFormattedDate] = useState("");
	const isCurrentUser = currentUser && currentUser.username === user.username;
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleEdit = () => {
		setIsEditing(true);
		setEditedContent(content);
	};

	const handleSaveEdit = () => {
		handleEditReply(id, editedContent);
		setIsEditing(false);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditedContent(content);
	};

	const handleDelete = () => {
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = () => {
		handleRemoveReply(id);
		setShowDeleteModal(false);
	};

	const handleCancelDelete = () => {
		setShowDeleteModal(false);
	};

	useEffect(() => {
		let formattedDateStr = "";

		if (createdAt) {
			const currentDate = new Date();
			const commentDate = new Date(createdAt);

			if (!isNaN(commentDate.getTime())) {
				const diffInDays = Math.floor((currentDate - commentDate) / (1000 * 60 * 60 * 24));

				if (diffInDays === 0) {
					formattedDateStr = "today";
				} else if (diffInDays === 1) {
					formattedDateStr = "yesterday";
				} else {
					formattedDateStr = `${diffInDays} days ago`;
				}
			} else {
				formattedDateStr = createdAt; // Use the string directly if createdAt is not a valid date
			}
		} else {
			formattedDateStr = createdAt; // Use the string directly if createdAt is not available
		}

		setFormattedDate(formattedDateStr);
	}, [createdAt]);


	function EditHtmlForComment() {
		document.querySelectorAll(".comment").forEach(comment => {
			const newWrapper = document.createElement("div");
			newWrapper.classList.add("inner-comment-wrapper");
			comment.append(newWrapper);
			newWrapper.append(comment.querySelector(".score"));
			if (comment.classList.contains("reply")) {
				newWrapper.append(comment.querySelector(".actions"));
			} else {
				newWrapper.append(comment.querySelector(".reply-button"));
			}
		})
	}

	useEffect(() => {
		if (window.innerWidth < 768) {
			document.querySelectorAll(".comment").forEach(comment => {
				// Check if the inner-comment-wrapper already exists
				if (!comment.querySelector(".inner-comment-wrapper")) {
					const newWrapper = document.createElement("div");
					newWrapper.classList.add("inner-comment-wrapper");

					// Check if the comment has any content to append to the wrapper
					const scoreElement = comment.querySelector(".score");
					const actionsElement = comment.querySelector(".actions");
					const replyButtonElement = comment.querySelector(".reply-button");

					// Append relevant elements to the wrapper
					if (scoreElement) newWrapper.appendChild(scoreElement);
					if (actionsElement) newWrapper.appendChild(actionsElement);
					if (!actionsElement && replyButtonElement) newWrapper.appendChild(replyButtonElement);

					// Append the wrapper if it has any content
					if (scoreElement || actionsElement || (!actionsElement && replyButtonElement)) {
						comment.appendChild(newWrapper);
					}
				}
			});
		}
	}, []);



	return (
		<div className={`comment ${isReply ? "reply" : ""}`}>
			<div className="score">
				<button className="score-button" onClick={() => handleChangeScore("+", comment)}>{iconPlus}</button>
				<span className="score-value">{score}</span>
				<button className="score-button" onClick={() => handleChangeScore("-", comment)}>{iconMinus}</button>
			</div>
			<div className="comment-details">
				<div className="comment-row">
					<div className="user-details">
						<div className="user-avatar">
							<img src={require(`../../${user.image.png}`)} alt="image user"/>
						</div>
						<div className="comment-username">{user?.username}</div>
						<span className="comment-date">{formattedDate}</span>
					</div>
					{isReply ? (
						<div className="actions">
							{isCurrentUser && <>
								<button className='action-button' onClick={handleEdit}>Edit <span className="icon">
									{iconEdit}
								</span></button>
								<button className='action-button delete-button' onClick={handleDelete}>Delete <span
									className="icon">{iconDelete}</span></button>
							</>}
						</div>
					) : (
						<></>
					)}
					{currentUser?.username !== comment?.user?.username && <button className="reply-button" onClick={handleReply}>
						{iconReply}
						Reply
					</button>}
				</div>

				{isEditing ? (
					<div className="edit-form">
						<textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)}/>
						<div className='update-btn'>
							<button onClick={handleSaveEdit}>Update</button>
							{/*<button onClick={handleCancelEdit}>Cancel</button>*/}
						</div>
					</div>
				) : (
					<p className="comment-content">
						{content}
					</p>
				)}
			</div>
			{showDeleteModal && (
				<div className="modal">
					<div className="modal-body">
						<h2>Delete Comment</h2>
						<p>Are you sure you want to remove this comment? This action cannot be undone.</p>
						<div className="modal-actions">
							<button onClick={handleCancelDelete}>No, Cancel</button>
							<button onClick={handleConfirmDelete} className='delete-button'>Yes, Delete</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewComment;
