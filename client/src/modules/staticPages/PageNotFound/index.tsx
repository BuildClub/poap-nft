import React from 'react';

import styles from './PageNotFound.module.scss';

const PageNotFound = () => {
  return (
    <div className={styles.errorPage}>
      <div className="container">
        <h1>404</h1>
      </div>
    </div>
  );
};

export default PageNotFound;
