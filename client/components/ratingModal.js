import { useState } from "react"
import StarIcon from './icons/StarIcon'
import useRequest from "../pages/hooks/use-request"

const RatingModal = ({ ticketId, review, onClose }) => {
    const [rating, setRating] = useState(review?.rating || 0)
    const [hover, setHover] = useState(0)
    const [content, setContent] = useState(review?.content || "")
    const [isEditing, setIsEditing] = useState(!review)
    const { doRequest, errors, loading } = useRequest({
        url: review ? `/api/reviews/${ticketId}` : '/api/reviews',
        method: review ? 'put' : 'post',
        body: { ticketId, rating, content },
        onSuccess: () => {
            onClose()
        }
    })

    const handleSubmitReview = async () => {
        await doRequest()
    }

    return (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEditing ? "Submit Review" : "Edit Review"}</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body text-center">
                        {isEditing ? (
                            <>
                                <div className="mb-3">
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Write your review here..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="d-flex flex-column align-items-center gap-2">
                                    <div className="d-flex justify-content-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIcon
                                                key={star}
                                                filled={star <= (hover || rating)}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-info">{rating > 0 ? `You rated this ${rating} star(s)` : "Click to rate"}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>{content}</p>
                                <div className="d-flex justify-content-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarIcon key={star} filled={star <= rating} />
                                    ))}
                                </div>
                                <button className="btn btn-outline-primary mt-3" onClick={() => setIsEditing(true)}>
                                    Edit Review
                                </button>
                            </>
                        )}
                        {errors}
                    </div>
                    {isEditing && (
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-primary d-flex align-items-center justify-content-center"
                                onClick={handleSubmitReview}
                                disabled={loading} // Disable while loading
                            >
                                {loading ? (
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : (
                                    isEditing ? 'Submit' : 'Update review'
                                )}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RatingModal