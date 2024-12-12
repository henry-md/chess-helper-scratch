/* eslint-disable */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "react-toastify";
import { PgnType } from "@/lib/types";
import useMutationPgns from "@/hooks/use-mutation-pgns";
import { toggleEditPgnDialog, triggerPgnsRefresh } from "@/lib/store";

type EditPgnDialogProps = {
  pgn: PgnType;
  open: boolean;
};

const EditPgnDialog = ({ pgn, open }: EditPgnDialogProps) => {
  const [title, setTitle] = useState(pgn.title);
  const [pgnString, setPgnString] = useState(pgn.pgn);
  const [notes, setNotes] = useState(pgn.notes);
  const { updatePgnContent } = useMutationPgns();

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (title.length === 0 || pgnString.length === 0) {
      toast.error("Sorry! Title and PGN cannot be empty 😕");
    } else {
      await updatePgnContent(pgn._id, title, pgnString, notes);
      triggerPgnsRefresh();
      toggleEditPgnDialog();
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <form className="grid w-full gap-1.5 p-1 pr-3">
          <DialogTitle>Edit PGN {pgn._id}</DialogTitle>
          <DialogDescription>
            Edit the title, PGN, and notes of your study here.
          </DialogDescription>
          <div className="grid items-center grid-cols-4 gap-8 my-4">
            <Label htmlFor="title" className="text-sm text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              className="col-span-3"
              onChange={(e) => setTitle(e.target.value)}
            />
            <Label htmlFor="back" className="text-sm text-right">
              Back
            </Label>
            <Input
              id="pgn"
              value={pgnString}
              className="col-span-3"
              onChange={(e) => setPgnString(e.target.value)}
            />
            <Label htmlFor="notes" className="text-sm text-right">
              Notes
            </Label>
            <Input
              id="notes"
              value={notes}
              className="col-span-3"
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button
                onClick={() => toggleEditPgnDialog()}
                type="button"
                variant={"secondary"}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleSave} type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPgnDialog;