import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chessboard } from "react-chessboard";
import EditPgnDialog from './board-edit-dialog';
import DeletePgnDialog from './board-delete-dialog';
import { PgnType } from '@/lib/types';
import { $showDeletePgn, $showEditPgn, toggleDeletePgnDialog, toggleEditPgnDialog } from '@/lib/store';
import { useStore } from '@nanostores/react';

interface BoardPreviewProps {
  pgn: PgnType;
  gameTitle: string;
  isWhite: boolean;
}

const BoardPreview = ({ pgn, gameTitle, isWhite }: BoardPreviewProps) => {
  // const [editDialogOpen, setEditDialogOpen] = useState(false);
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const showEditPgnDialog = useStore($showEditPgn);
  const showDeletePgnDialog = useStore($showDeletePgn);
  return (
    <div className="cursor-pointer">
      <p className="pb-2 text-center">{gameTitle}</p>
      <div className="relative">
        {/* Edit and Delete buttons */}
        <div className="absolute top-[5px] right-[-20px] z-50 flex flex-col gap-2">
          <button 
            onClick={() => toggleEditPgnDialog()}
            className="text-white bg-gray-900 rounded-[100%] w-[22px] h-[22px] flex items-center justify-center">
              <FontAwesomeIcon className="w-[12px] h-[12px]" icon={faPenToSquare} />
          </button>
          <button 
            onClick={() => toggleDeletePgnDialog()}
            className="text-white bg-gray-900 rounded-[100%] w-[22px] h-[22px] flex items-center justify-center">
              <FontAwesomeIcon className="w-[12px] h-[12px]" icon={faTrash} />
          </button>
        </div>

        {/* Board */}
        <div className="relative rounded-md group">
          <div className="absolute inset-0 z-50 transition-opacity bg-black rounded-md opacity-0 group-hover:opacity-10"></div>
          <Chessboard
            id="BasicBoard"
            arePiecesDraggable={false}
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
      <EditPgnDialog pgn={pgn} open={showEditPgnDialog} />
      <DeletePgnDialog pgn={pgn} open={showDeletePgnDialog} />
    </div>
  )
};

export default BoardPreview;