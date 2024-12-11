import { Chessboard } from "react-chessboard";
import PropTypes from 'prop-types';

interface BoardProps {
  currFen: string;
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
  isWhite: boolean;
}

const Board = ({ currFen, onPieceDrop, isWhite }: BoardProps) => {
  return (
    <Chessboard
      id="BasicBoard"
      arePiecesDraggable={true}
      position={currFen}
      onPieceDrop={onPieceDrop}
      boardOrientation={isWhite ? 'white' : 'black'}
      customDarkSquareStyle={{ backgroundColor: '#769656' }}
      customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
      customBoardStyle={{
        borderRadius: '4px',
        // boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
      }}
    />
  );
};

Board.propTypes = {
  currFen: PropTypes.string.isRequired,
  onPieceDrop: PropTypes.func.isRequired,
  isWhite: PropTypes.bool.isRequired,
};

export default Board;