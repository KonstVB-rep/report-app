"use client";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import NewProjectForm from "@/entities/project/ui/Forms/NewProjectForm";

import { Plus } from "lucide-react";
import React, { useState } from "react";

const AddNewProject = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
            <span>Добавить объект</span>
          </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]" showX={true}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <NewProjectForm setOpen={setOpen}/>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewProject;
