import PropTypes from 'prop-types';
import { Chessboard } from "react-chessboard";

const BoardPreview = ({ gameTitle, isWhite }) => {
  return (
    <div className="cursor-pointer">
      <p className="pb-2 text-center">{gameTitle}</p>
      <div className="w-[250px] h-[250px] group rounded-md relative">
        <div className="absolute inset-0 z-50 transition-opacity bg-black rounded-md opacity-0 group-hover:opacity-10"></div>
        <Chessboard
          id="BasicBoard"
          arePiecesDraggable={false}
          customDragLayers={[]}
          position={"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}
          boardOrientation={isWhite ? 'white' : 'black'}
          customDarkSquareStyle={{ backgroundColor: '#769656' }}
          customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
          customBoardStyle={{
            borderRadius: '4px',
            // boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}
        />
      </div>
    </div>
  )
}

BoardPreview.propTypes = {
  gameTitle: PropTypes.string.isRequired,
  isWhite: PropTypes.bool.isRequired,
};

export default BoardPreview;