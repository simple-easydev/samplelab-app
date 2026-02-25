import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FoldersIcon, HandsCoinsIcon, LockIcon, RepeatIcon, StackCoinsIcon } from './icons';

interface BonusCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinueTrial: () => void;
  onStartProWithBonus: () => void;
}

export function BonusCreditsModal({
  open,
  onOpenChange,
  onContinueTrial,
  onStartProWithBonus,
}: BonusCreditsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] p-0 gap-0 bg-[#fffbf0]" showCloseButton={false}>
        {/* Header with close button */}
        <DialogHeader className="flex flex-row items-center justify-end p-4 border-b-0">
          <button
            onClick={() => onOpenChange(false)}
            className="size-6 rounded-full flex items-center justify-center hover:bg-[#e8e2d2] transition-colors"
          >
            <X className="size-4 text-[#161410]" />
          </button>
        </DialogHeader>

        {/* Body */}
        <div className="flex flex-col gap-10 px-8 pb-8">
          {/* Icon and Text */}
          <div className="flex flex-col gap-3 items-center text-center">
            {/* Hand with coins icon */}
            <div className="size-14 flex items-center justify-center">
              <HandsCoinsIcon />
            </div>

            <DialogTitle className="text-[28px] font-bold text-[#161410] leading-9 tracking-[-0.2px]">
              Skip the trial and get 50 bonus credits
            </DialogTitle>

            <p className="text-base text-[#5e584b] leading-6">
              Start your Pro plan today and we'll add 50 extra credits to your first
              month. You'll be charged $19.99 today.
            </p>
          </div>

          {/* Bullets */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-start">
              <StackCoinsIcon />
              <p className="flex-1 text-base text-[#161410] leading-6">
                200 credits your first month
              </p>
            </div>

            <div className="flex gap-2 items-start">
              <FoldersIcon />
              <p className="flex-1 text-base text-[#161410] leading-6">
                Full library access
              </p>
            </div>

            <div className="flex gap-2 items-start">
              <RepeatIcon />
              <p className="flex-1 text-base text-[#161410] leading-6">
                Unused credits roll over
              </p>
            </div>

            <div className="flex gap-2 items-start">
              <LockIcon />
              <p className="flex-1 text-base text-[#161410] leading-6">
                No trial restrictions
              </p>
            </div>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="flex gap-4 p-8 border-t border-[#e8e2d2] bg-[#fffbf0]">
          <Button
            onClick={onContinueTrial}
            variant="outline"
            className="flex-1 h-12 rounded-sm text-base font-medium border-[#a49a84] text-[#161410] hover:bg-[#f5f0e5]"
          >
            Continue free trial
          </Button>
          <Button
            onClick={onStartProWithBonus}
            className="flex-1 h-12 rounded-sm bg-[#161410] hover:bg-[#2a2620] text-white text-base font-medium"
          >
            Start Pro +50 credits
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
