import { Chessboard } from "react-chessboard";
import PropTypes from 'prop-types';

const Board = ({ currFen, onPieceDrop, isWhite }) => {
  return (
    <Chessboard
      id="BasicBoard"
      arePiecesDraggable={true}
      customDragLayers={[]}
      position={currFen}
      onPieceDrop={onPieceDrop}
      boardOrientation={isWhite ? 'white' : 'black'}
    />
  );
};

Board.propTypes = {
  currFen: PropTypes.string.isRequired,
  onPieceDrop: PropTypes.func.isRequired,
  isWhite: PropTypes.bool.isRequired,
};

export default Board;