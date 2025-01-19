import { useState } from 'react';
import StarIcon from './icons/StarIcon';

const Rating = ({ onRate, initialRating = 0 }) => {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);
    const [isRated, setIsRated] = useState(false); 
    console.log({
        hover,
        rating,
        isRated
    });

    const handleRating = (newRating) => {
        setRating(newRating);
        setIsRated(true); // Lock the rating after clicking
        if (onRate) {
            onRate(newRating);
        }
    };

    return (
        <div className='text-center my-4'>
            <h5 className='text-muted'>Rate this ticket:</h5>
            <div className='d-flex justify-content-center gap-1'>
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        filled={star <= (hover || rating)}
                        onClick={() => {
                            if (!isRated) handleRating(star);
                        }}
                        onMouseEnter={() => {
                            if (!isRated) setHover(star);
                        }}
                        onMouseLeave={() => {
                            if (!isRated) setHover(0);
                        }}
                        size={20}
                        disabled={isRated} // Disable interaction if already rated
                    />
                ))}
            </div>
            <p className='text-info mt-2'>
                {rating > 0
                    ? `You rated this ${rating} star(s)`
                    : isRated
                    ? 'Thank you for your rating!'
                    : 'Click to rate'}
            </p>
        </div>
    );
};

export default Rating;
