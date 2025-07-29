import { useEffect, useCallback, useState } from "react";
import { useBlocker } from "react-router-dom";

export function usePrompt(when: boolean, message: string) {
  const [showDialog, setShowDialog] = useState(false);

  const blocker = useBlocker(
    useCallback(() => {
      if (when) {
        setShowDialog(true);
        return true;
      }
      return false;
    }, [when])
  );

  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when, message]);

  const handleConfirm = useCallback(() => {
    setShowDialog(false);
    if (blocker.proceed) {
      blocker.proceed();
    }
  }, [blocker]);

  const handleCancel = useCallback(() => {
    setShowDialog(false);
    if (blocker.reset) {
      blocker.reset();
    }
  }, [blocker]);

  return {
    showDialog,
    message,
    handleConfirm,
    handleCancel,
    blocker,
  };
}
