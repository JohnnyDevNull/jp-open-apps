import { FunctionComponent } from 'react';

export const AppFooter: FunctionComponent = () => {
  const now = new Date();
  return (
    <div className="footer-wrapper">
      <div className="copy">
        &copy; {now.getFullYear()}{' '}
        <a href="https://github.com/JohnnyDevNull/jp-open-apps" target="_blank" rel="noopener noreferrer">
          JohnnyDevNull
        </a>{' '}
        - All rights reserved
      </div>
    </div>
  );
};

export default AppFooter;
