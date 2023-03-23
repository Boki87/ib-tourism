import { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface IStarRating {
  value: number;
  onChange?: (val: number) => void;
  maxValue?: number;
  showRatingNumber?: boolean;
}

export default function StarRating({
  value,
  onChange,
  maxValue = 10,
  showRatingNumber = false,
}: IStarRating) {
  const [hover, setHover] = useState<null | number>(null);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {[...Array(maxValue)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <div
            onClick={() => onChange && onChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
            style={{
              color: "orange",
              cursor: "pointer",
              padding: "0px 2px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            key={i}
          >
            {ratingValue <= (hover || value) ? (
              <AiFillStar size={30} />
            ) : (
              <AiOutlineStar size={30} />
            )}
          </div>
        );
      })}
      {showRatingNumber && (
        <span style={{ marginLeft: "7px" }}>
          {value}/{maxValue}
        </span>
      )}
    </div>
  );
}
