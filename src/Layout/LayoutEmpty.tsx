import React, { ReactNode } from "react";

interface LayoutEmptyProps {
  children: ReactNode;
}

const LayoutEmpty: React.FC<LayoutEmptyProps> = ({ children }) => {
  return <>{children}</>;
};

export default LayoutEmpty;
