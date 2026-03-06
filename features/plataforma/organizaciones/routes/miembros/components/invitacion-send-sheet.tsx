"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { InvitacionSendForm } from "@/features/plataforma/organizaciones/routes/miembros/components/invitacion-send-form";
import { UserPlus } from "lucide-react";
import { useState } from "react";

type InvitacionSendSheetProps = {
  organizacionId: string;
};

export function InvitacionSendSheet({
  organizacionId,
}: InvitacionSendSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <UserPlus />
          Invitar miembro
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Invitar miembro</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">
          <InvitacionSendForm
            organizacionId={organizacionId}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
