interface OpenStatusDisplayProps {
  isOpen: boolean;
  currentLanguage: string;
}

const OpenStatusDisplay: React.FC<OpenStatusDisplayProps> = ({ isOpen, currentLanguage }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="material-icons text-gray-500">
        {isOpen ? 'check_circle' : 'cancel'}
      </span>
      <p className="text-gray-600">
        {isOpen ? 
          (currentLanguage === 'ja' ? '営業中' : 'Open') : 
          (currentLanguage === 'ja' ? '営業時間外' : 'Closed')}
      </p>
    </div>
  );
};

export default OpenStatusDisplay; 