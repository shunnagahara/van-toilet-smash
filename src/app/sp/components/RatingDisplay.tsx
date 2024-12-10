interface RatingDisplayProps {
  rating: number;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({ rating }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="material-icons text-gray-500">star</span>
      <p className="text-gray-600">
        {rating ? `${rating.toFixed(1)} / 5.0` : 'No rating'}
      </p>
    </div>
  );
};

export default RatingDisplay; 