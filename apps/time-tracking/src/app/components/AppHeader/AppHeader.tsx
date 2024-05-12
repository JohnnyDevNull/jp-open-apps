import { FunctionComponent } from 'react';

export const AppHeader: FunctionComponent<{ appName: string }> = ({ appName }) => {
  return <div className="header-wrapper">JPOpenApps / {appName}</div>;
};

export default AppHeader;
