import { memo, type ReactNode } from "react";
import MainHeader from "@/components/MainHeader";
import BannerButton from "@/components/BannerButton";

interface ManagementLayoutProps {
  children: ReactNode;
  title?: string;
}

interface HeaderProps {
  title: string;
  children?: ReactNode;
}

interface FiltersProps {
  children: ReactNode;
}

interface ActionsProps {
  children: ReactNode;
}

interface ContentProps {
  children: ReactNode;
}

interface TableProps {
  children: ReactNode;
}

const ManagementLayoutComponent = ({ children, title }: ManagementLayoutProps) => {
  return (
    <div className="w-full">
      <MainHeader />
      <BannerButton />
      <div className="w-full flex-1 max-w-360 justify-self-center pr-[50px] pl-[50px] text-nowrap">
        {title && (
          <div className="mr-[20px] ml-[20px] mb-[30px]">
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// Header 컴포넌트
const Header = memo<HeaderProps>(({ title, children }) => {
  return (
    <div className="mr-[20px] ml-[20px] mb-[30px] flex flex-1 justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">{title}</h1>
        {children}
      </div>
    </div>
  );
});

Header.displayName = "ManagementLayout.Header";

// Filters 컴포넌트
const Filters = memo<FiltersProps>(({ children }) => {
  return <div className="flex items-center gap-2 ml-4">{children}</div>;
});

Filters.displayName = "ManagementLayout.Filters";

// Actions 컴포넌트
const Actions = memo<ActionsProps>(({ children }) => {
  return (
    <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-end gap-[10px]">{children}</div>
  );
});

Actions.displayName = "ManagementLayout.Actions";

// Content 컴포넌트
const Content = memo<ContentProps>(({ children }) => {
  return <div className="mr-[20px] ml-[20px]">{children}</div>;
});

Content.displayName = "ManagementLayout.Content";

// Table 컴포넌트
const Table = memo<TableProps>(({ children }) => {
  return <div className="mr-[20px] ml-[20px]">{children}</div>;
});

Table.displayName = "ManagementLayout.Table";

// 컴파운드 컴포넌트 패턴 적용
const ManagementLayout = Object.assign(memo(ManagementLayoutComponent), {
  Header,
  Filters,
  Actions,
  Content,
  Table,
});

export default ManagementLayout;

// 레이아웃과 함께 사용할 수 있는 유틸리티 컴포넌트
export const EmptyState = memo<{ message: string }>(({ message }) => {
  return (
    <div className="w-full flex h-40 text-center">
      <p className="text-gray-300 flex-1 text-center my-auto">{message}</p>
    </div>
  );
});

EmptyState.displayName = "EmptyState";

// 필터 초기화 버튼
export const ResetFilterButton = memo<{ onClick: () => void; show?: boolean }>(
  ({ onClick, show = true }) => {
    if (!show) return null;

    return (
      <button
        onClick={onClick}
        className="ml-[10px] text-sm cursor-pointer text-gray-500 hover:text-gray-700 underline"
      >
        초기화
      </button>
    );
  }
);

ResetFilterButton.displayName = "ResetFilterButton";
