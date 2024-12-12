import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PgnType } from "@/lib/types";
import useMutationPgns from "@/hooks/use-mutation-pgns";
import { toggleDeletePgnDialog, triggerPgnsRefresh } from "@/lib/store";

type DeletePgnDialogProps = {
  pgn: PgnType;
  open: boolean;
};

const DeletePgnDialog = ({
  pgn,
  open,
}: DeletePgnDialogProps) => {
  const { deletePgn } = useMutationPgns();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await deletePgn(pgn._id);
    triggerPgnsRefresh();
    toggleDeletePgnDialog();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your PGN
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePgnDialog;