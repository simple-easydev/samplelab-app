/**
 * Shared filter bar dropdown: used for Sort, Genre, Keywords, Access, License, Creator, Released.
 * Composable: FilterBarDropdown + Trigger + Content, with optional Search, List, Footer.
 */
import * as React from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const FILTER_DROPDOWN_LIST_CLASS = 'filter-bar-dropdown-list';

const rootStyles = `
.${FILTER_DROPDOWN_LIST_CLASS}::-webkit-scrollbar { width: 6px; }
.${FILTER_DROPDOWN_LIST_CLASS}::-webkit-scrollbar-track { background: transparent; margin: 4px 0; }
.${FILTER_DROPDOWN_LIST_CLASS}::-webkit-scrollbar-thumb { background: #d5d1ca; border-radius: 2px; }
.${FILTER_DROPDOWN_LIST_CLASS}::-webkit-scrollbar-thumb:hover { background: #c0bcb4; }
`;

export interface FilterBarDropdownProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function FilterBarDropdownRoot({ open, onOpenChange, children }: FilterBarDropdownProps) {
  return (
    <>
      <style>{rootStyles}</style>
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
        {children}
      </DropdownMenu>
    </>
  );
}

export type FilterBarDropdownTriggerPosition = 'standalone' | 'left' | 'middle' | 'right';

export interface FilterBarDropdownTriggerProps {
  /** Position in the filter group: standalone (e.g. Sort icon), left/middle/right for connected pills */
  position?: FilterBarDropdownTriggerPosition;
  /** Optional badge count (e.g. selected filters) */
  badge?: number;
  /** For standalone: custom content (e.g. icon). For pill: label is used with ChevronDown */
  children?: React.ReactNode;
  /** Pill label when not using custom children */
  label?: string;
  ariaLabel?: string;
  className?: string;
}

const triggerPositionClasses: Record<FilterBarDropdownTriggerPosition, string> = {
  standalone:
    'rounded-[2px] size-10 flex items-center justify-center',
  left: 'rounded-l-[2px] -ml-px h-10 px-3 flex items-center justify-center gap-1.5 shrink-0',
  middle: '-ml-px h-10 px-3 flex items-center justify-center gap-1.5 shrink-0',
  right: 'rounded-r-[2px] -ml-px h-10 px-3 flex items-center justify-center gap-1.5 shrink-0',
};

const FilterBarDropdownTrigger = React.forwardRef<HTMLButtonElement, FilterBarDropdownTriggerProps>(
  (
    {
      position = 'standalone',
      badge,
      children,
      label,
      ariaLabel,
      className,
      ...props
    },
    ref
  ) => (
    <DropdownMenuTrigger asChild>
      <button
        ref={ref}
        type="button"
        className={cn(
          'group border border-[#a49a84] bg-transparent text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] hover:bg-[#161410]/5 transition-colors',
          'data-[state=open]:border-[#161410] data-[state=open]:bg-[#E8E2D2]',
          triggerPositionClasses[position],
          className
        )}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        {...props}
      >
        {children ?? (
          <>
            {label != null && <span>{label}</span>}
            {badge != null && badge > 0 && (
              <span className="flex items-center justify-center size-5 rounded-[2px] bg-[#161410] text-white text-[11px] font-medium">
                {badge}
              </span>
            )}
            <ChevronDown className="size-5 shrink-0 text-[#161410] transition-transform duration-200 group-data-[state=open]:rotate-180" aria-hidden />
          </>
        )}
      </button>
    </DropdownMenuTrigger>
  )
);
FilterBarDropdownTrigger.displayName = 'FilterBarDropdownTrigger';

export interface FilterBarDropdownContentProps {
  align?: 'start' | 'center' | 'end';
  width?: number | string;
  className?: string;
  children: React.ReactNode;
}

const defaultContentClass =
  'p-0 rounded-[2px] border border-[#eae8e3] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden';

function FilterBarDropdownContent({
  align = 'start',
  width = 280,
  className,
  children,
}: FilterBarDropdownContentProps) {
  const style = typeof width === 'number' ? { width: `${width}px` } : undefined;
  const widthClass = typeof width === 'string' ? width : undefined;
  return (
    <DropdownMenuContent
      align={align}
      className={cn(defaultContentClass, widthClass, className)}
      style={style}
    >
      {children}
    </DropdownMenuContent>
  );
}

export interface FilterBarDropdownSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

function FilterBarDropdownSearch({
  value,
  onChange,
  placeholder = 'Search',
  ariaLabel,
  onKeyDown,
}: FilterBarDropdownSearchProps) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#edeae5]">
      <Search className="size-4 shrink-0 text-[#b0ab9f]" strokeWidth={1.8} aria-hidden />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown ?? ((e) => e.stopPropagation())}
        className="w-full outline-none border-0 bg-transparent text-[15px] text-[#3d3a34] placeholder:text-[#b0ab9f]"
        aria-label={ariaLabel ?? placeholder}
      />
    </div>
  );
}

export interface FilterBarDropdownListProps {
  maxHeight?: number | string;
  className?: string;
  children: React.ReactNode;
}

function FilterBarDropdownList({
  maxHeight = 300,
  className,
  children,
}: FilterBarDropdownListProps) {
  const maxHeightStyle =
    typeof maxHeight === 'number' ? { maxHeight: `${maxHeight}px` } : { maxHeight };
  return (
    <div
      className={cn('overflow-y-auto py-1', FILTER_DROPDOWN_LIST_CLASS, className)}
      style={maxHeightStyle}
    >
      {children}
    </div>
  );
}

export interface FilterBarDropdownFooterProps {
  onClear?: () => void;
  onApply?: () => void;
  clearLabel?: string;
  applyLabel?: string;
}

function FilterBarDropdownFooter({
  onClear,
  onApply,
  clearLabel = 'Clear',
  applyLabel = 'Apply',
}: FilterBarDropdownFooterProps) {
  return (
    <div className="flex gap-3 px-4 py-3 border-t border-[#edeae5]">
      {onClear != null && (
        <button
          type="button"
          onClick={onClear}
          className="flex-1 flex items-center justify-center py-2.5 rounded-[2px] border-[1.5px] border-[#ddd9d2] bg-white text-sm font-medium text-[#3d3a34] hover:bg-[#faf9f6] transition-colors"
        >
          {clearLabel}
        </button>
      )}
      {onApply != null && (
        <button
          type="button"
          onClick={onApply}
          className="flex-1 flex items-center justify-center py-2.5 rounded-[2px] border-0 bg-[#3d3a34] text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          {applyLabel}
        </button>
      )}
    </div>
  );
}

export interface FilterBarDropdownCheckboxItemProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

function FilterBarDropdownCheckboxItem({
  label,
  checked,
  onToggle,
}: FilterBarDropdownCheckboxItemProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-3 w-full text-left px-4 py-[11px] bg-transparent border-0 cursor-pointer text-[15px] text-[#3d3a34] hover:bg-[#faf9f6] transition-colors duration-120"
      style={{ fontWeight: checked ? 500 : 400 }}
    >
      <span
        className="flex items-center justify-center shrink-0 size-5 rounded-[2px] transition-colors duration-150"
        style={{
          border: checked ? 'none' : '1.5px solid #c8c4bb',
          background: checked ? '#3d3a34' : 'transparent',
        }}
      >
        {checked && <Check className="size-3.5 text-white" strokeWidth={2.5} aria-hidden />}
      </span>
      <span>{label}</span>
    </button>
  );
}

export const FilterBarDropdown = Object.assign(FilterBarDropdownRoot, {
  Trigger: FilterBarDropdownTrigger,
  Content: FilterBarDropdownContent,
  Search: FilterBarDropdownSearch,
  List: FilterBarDropdownList,
  Footer: FilterBarDropdownFooter,
  CheckboxItem: FilterBarDropdownCheckboxItem,
});
